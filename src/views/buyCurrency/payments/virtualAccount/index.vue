<template>
  <div id="indonesianPayment">
    <div id="indonesianPayment-box" ref="box_ref" @scroll="handleScroll">
      <div class="view-content" ref="form_ref">
        <!-- 新增支付方式信息模块 -->
        <PayMethodInfo
          :class="{
            'payMethodInfo-va':
              payMethodInfo.payWayCode === '10003' && !IncludedDetails,
          }"
          v-if="payMethodInfo.payWayCode === '10003'"
        />
        <!-- 支付费用模块 -->
        <IncludedDetails
          v-if="IncludedDetails"
          class="includedDetails"
          ref="includedDetails_ref"
          :type="2"
          :payWayCode="payMethodInfo.payWayCode"
        />
        <!-- 支付方式 VA-Virtual Account-->
        <VA
          ref="va_ref"
          v-show="payMethodInfo.payWayCode === '10003' && !IncludedDetails"
        />
        <!-- tips icon -->
        <transition>
          <div class="downTips-icon" v-show="goDown_state" @click="goDown">
            <img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt="" />
          </div>
        </transition>
      </div>
      <!-- I confirm that the payment has been completed.-->
      <footer class="footer" ref="footer_ref">
        <CustomButton
          :buttonData="buttonData"
          :disabled="payState"
          :timeStatus="startPayment ? paymentCountDownMinute : ''"
          @click.native="submit"
          class="button_ref"
          ref="button_ref"
        ></CustomButton>
        <bottom-bar
          @setPaddingBottom="
            $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`
          "
        />
      </footer>
    </div>
  </div>
</template>

<script>
import { querySubmitToken } from "@/utils/publicRequest";
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import VA from "./VA";
import { isElementNotInViewport } from "@/utils";
import { mapState } from "vuex";
import PayMethodInfo from "@/components/PayMethodInfo/index";

export default {
  name: "otherWays-VA",
  components: { VA, IncludedDetails, PayMethodInfo },
  data() {
    return {
      routerParams: {},

      //VA支付卡信息
      payExplain: [],
      //展示费率状态
      IncludedDetails: true,
      //卡验证码 - 功能:复制验证码
      payCode: "",
      //支付倒计时
      paymentCountDownMinute: "120:00",
      //支付倒计时状态
      startPayment: false,

      //勾选协议
      childData: {
        agreement: true,
      },

      //按钮状态
      buttonData: {
        loading: false,
        triggerNum: 0,
        customName: false,
      },

      goDown_state: false,
      oldOffsetTop: 0,
      scrollTimeDown: null,

      fixedRampFee: true,
      isLoading: false,

      //公司地址展示状态
      companyAddress: true,
    };
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
    }),

    //确认按钮状态
    payState() {
      // pay methods 10003-Virtual Account
      if (this.payMethodInfo.payWayCode === "10003") {
        if (this.childData.agreement === true) {
          return false;
        }
        return true;
      }
      return false;
    },
  },
  //清除页面数据
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //清空二次支付状态
      if (to.query.isTwice === "1") {
        let newQuery = { pathHistry: "tradeHistory" };
        sessionStorage.removeItem("indonesiaPayment");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.$router.replace({ query: newQuery });
      }
      //  console.log(to.name === 'euroPay' && from.name !== 'tradeHistory')
      if (
        to.name === "otherWays-VA" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        window.sessionStorage.removeItem("indonesiaPayment");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
      }
    });
  },
  mounted() {
    //参数为空跳转到首页
    if (
      this.orderNo === "" ||
      this.orderNo === undefined ||
      this.orderNo === null
    ) {
      this.$router.replace("/");
      return;
    }

    //初始化根据可视高度控制向下提示按钮状态
    setTimeout(() => {
      if (isElementNotInViewport("indonesianPayment", this.$refs.footer_ref)) {
        this.goDown_state = true;
      } else {
        this.goDown_state = false;
      }
    }, 100);
    window.addEventListener("scroll", this.handleScroll, true);
    this.receiveInfo();
    // if(this.payMethodInfo.payWayCode === '10003'){
    //   this.$refs.va_ref.receiveinfo();
    // }
    //菜单页返回时判断的状态
    this.$store.state.toastStatus = false;
  },
  methods: {
    receiveInfo() {
      //订单商户
      if (
        this.$route.query.orderNo &&
        this.$route.query.orderNo !== "undefined"
      ) {
        this.fixedRampFee = false;
        this.isLoading = true;
      }
      // this.routerParams = this.$store.state.buyRouterParams;
      //还原刷新前数据状态
      if (sessionStorage.getItem("indonesiaPayment")) {
        // && this.payMethodInfo.payWayCode === '10003'
        this.payExplain = JSON.parse(
          sessionStorage.getItem("indonesiaPayment")
        );
        this.childData = {
          agreement: true,
        };
        this.buttonData = {
          loading: false,
          triggerNum: 1,
          customName: false,
        };
        this.IncludedDetails = false;
      }
    },
    async submit() {
      if (this.childData.agreement === false) {
        return;
      }
      if (this.buttonData.triggerNum === 1) {
        await this.pay();
      }
    },
    async pay() {
      // pay methods 10003-Virtual Account
      let submitToken = await querySubmitToken();
      if (
        submitToken === true &&
        this.payMethodInfo.payWayCode === "10003" &&
        !this.$store.state.ovo_va_mex_qrs_Status
      ) {
        this.$refs.va_ref.VAPay();
      }
    },

    //order status
    requestStatus() {
      let params = {
        orderNo: this.orderNo,
      };
      this.$axios.get(this.$api.get_payResult, params).then((res) => {
        if (
          res &&
          (res.data.orderStatus === 0 ||
            (res.data.orderStatus >= 2 && res.data.orderStatus <= 6))
        ) {
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },

    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll() {
      setTimeout(() => {
        window.clearTimeout(this.scrollTimeDown);
        this.scrollTimeDown = null;
        let offset = document.querySelector(".button_ref");
        //附加滚动
        if (
          this.$parent.$refs.routerView_box.scrollTop +
            this.$parent.$refs.routerView_box.offsetHeight >=
          offset.offsetTop - 20
        ) {
          this.goDown_state = false;
        } else {
          this.scrollTimeDown = setTimeout(() => {
            this.goDown_state = true;
          }, 1000);
        }
      }, 200);
    },
    goDown() {
      setTimeout(() => {
        let offset = document.querySelector(".button_ref");
        offset.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
        // }
        this.goDown_state = false;
      });
    },
  },
  destroyed() {
    this.$store.dispatch("request/clearAllQuery");
    window.removeEventListener("scroll", this.handleScroll, true);
  },
};
</script>

<style lang="scss" scoped>
#indonesianPayment {
  flex: 1;
  #indonesianPayment-box {
    height: 100%;
    overflow-y: auto;
    padding: 0 0 0;
    .view-content {
      ::v-deep .payMethodInfo-va {
        margin-bottom: 0;
        .content {
          border-radius: 0.06rem 0.06rem 0 0;
        }
      }
    }
    .footer {
      width: 100%;
      position: sticky;
      left: 0;
      background: #ffffff;
      padding: 0.08rem 0 0;
      z-index: 999;
    }
  }
}

@keyframes loadingIcon {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: no-preference) {
  .loadingIcon {
    animation: loadingIcon infinite 2s linear;
  }
}

.downTips-icon {
  position: absolute;
  bottom: 0.8rem;
  left: 45%;
  width: 0.5rem;
  height: 0.36rem;
  background: rgba(0, 128, 247, 0.24);
  box-shadow: 0 0 0.15rem rgba(65, 184, 253, 0.25);
  border-radius: 0.18rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 0.2rem;
  }
}
.downTips-icon img {
  animation: jumpBoxHandler 1.8s infinite; /* 1.8s 事件完成时间周期 infinite无限循环 */
}
.v-enter-active,
.v-leave-active {
  transition: all 1s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave {
  opacity: 1;
}
@keyframes jumpBoxHandler {
  /* css事件 */
  0% {
    transform: translate(0px, 0);
  }
  50% {
    transform: translate(0px, 0.06rem); /* 可配置跳动方向 */
  }
  100% {
    transform: translate(0px, 0px);
  }
}
</style>
