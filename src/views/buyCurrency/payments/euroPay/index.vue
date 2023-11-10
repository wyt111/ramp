<template>
  <div id="euroPay-container">
    <div ref="box_ref">
      <div class="euroPayConfim" v-if="euroStatus === 'confirm'">
        <p class="euroPay_title">{{ $t("creditCard.payingWith") }}</p>
        <div class="euroPay_title1">Support SEPA</div>
        <IncludedDetails />
      </div>
      <div class="euroPaycontent" v-else>
        <div class="title">
          <p>Please Pay</p>
          <p>€300.00</p>
        </div>
        <div class="eurTimeStatus">
          The order will be cancelled in <span>24:00 h</span>
        </div>
        <div class="euroPaycontent_top">
          <div class="euroPaycontent_top_left">
            <p>1</p>
            <div></div>
            <p>2</p>
          </div>
          <div class="euroPaycontent_top_right">
            <p class="Leave_title">
              Leave ACH Ramp. Log in your bank APP and transfer the accurate
              amount to the account below.
            </p>
            <div class="content">
              <div
                class="line"
                @click="copy"
                data-clipboard-text="GB70FOUN00992200087001"
              >
                <p>IBAN:</p>
                <div>
                  <p>GB70FOUN00992200087001</p>
                  <img src="@/assets/images/copySell.png" alt="" />
                </div>
              </div>
              <div
                class="line"
                @click="copy"
                data-clipboard-text="Alchemy GPS Europe UAB"
              >
                <p>Name:</p>
                <div>
                  <p>Alchemy GPS Europe UAB</p>
                  <img src="@/assets/images/copySell.png" alt="" />
                </div>
              </div>
              <div class="line" @click="copy" data-clipboard-text="FOUNGB21XXX">
                <p>BIC:</p>
                <div>
                  <p>FOUNGB21XXX</p>
                  <img src="@/assets/images/copySell.png" alt="" />
                </div>
              </div>
              <div
                class="line"
                @click="copy"
                data-clipboard-text="Laisves pr. 60, Vilnius, 555441, LT"
              >
                <p>Address:</p>
                <div>
                  <p>Laisves pr. 60, Vilnius, 555441, LT</p>
                  <img src="@/assets/images/copySell.png" alt="" />
                </div>
              </div>
            </div>
            <div class="content">
              <div class="line" style="margin-bottom: 0.11rem">
                <p>Transfer Post Script:</p>
              </div>
              <div
                class="line"
                @click="copy"
                data-clipboard-text="0099220008700123456"
              >
                <p
                  style="
                    width: 1.7rem;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  "
                >
                  0099220008700123456
                </p>
                <img src="@/assets/images/copySell.png" alt="" />
              </div>
            </div>
            <p class="Leave_title" style="margin-top: 0.12rem">
              After transfer, please return to RAMP and click the button below -
              I have completed the payment.
            </p>
          </div>
        </div>

        <IncludedDetails :type="2" :payWayCode="payMethodInfo.payWayCode" />
        <div class="euro_title">
          Please ensure the amount you transfer to us is accurate. Incorrect
          information or amount will cause fail order or fund loss.
        </div>
      </div>
      <!-- 弹出框 -->
      <QueryOrderStatusTips buyOrderStatus="timeOut" v-show="toastShow" />
      <transition>
        <div class="downTips-icon" v-show="goDown_state" @click="goDown">
          <img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt="" />
        </div>
      </transition>
      <footer ref="footer_ref">
        <p
          style="
            font-size: 0.11rem;
            color: #94acba;
            margin: 0.4rem 0 0.1rem 0;
            font-family: Regular;
            text-align: center;
          "
        >
          {{ $t("nav.buyConfigPaytitle") }}
        </p>
        <CustomButton
          :buttonData="buttonData"
          :timeStatus="
            this.euroStatus !== 'confirm' ? paymentCountDownMinute : ''
          "
          @click.native="submitToken"
          class="button_ref"
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
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import { querySubmitToken } from "@/utils/publicRequest";
import Clipboard from "clipboard";
import { timeDown, isElementNotInViewport } from "@/utils";
import QueryOrderStatusTips from "@/components/Dialog/QueryOrderStatusTips";
import { mapState } from "vuex";

export default {
  name: "euroPay",
  components: {
    IncludedDetails,
    QueryOrderStatusTips,
  },
  //清除页面数据
  beforeRouteEnter(to, from, next) {
    next(() => {
      if (
        to.name === "euroPay" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        sessionStorage.removeItem("euroStatus");
      }
    });
  },
  data() {
    return {
      //按钮状态
      buttonData: {
        loading: false,
        triggerNum: 0,
        customName: false,
      },

      //页面状态判断
      euroStatus: "confirm",
      title: "nav.routerName_buyPaymentEuroPay",
      goDown_state: false,

      paymentCountDownNum: 900,
      paymentCountDownMinute: "15:00",
      //倒计时定时器
      TimeDown: null,
      scrollTimeDown: null,
      timeoutDown: null,
      toastShow: false,
    };
  },
  computed: {
    ...mapState("buyPayments", {
      payMethodInfo: (state) => state.payMethodInfo,
    }),
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

    setTimeout(() => {
      if (isElementNotInViewport("euroPay-container", this.$refs.footer_ref)) {
        this.goDown_state = true;
      } else {
        this.goDown_state = false;
      }
    }, 100);
    window.addEventListener("scroll", this.handleScroll, true);
    //获取页面状态
    this.getEuroData();
    // let data = new Date("2022.9.22 11:20").getTime();
    // let newData = new Date().getTime();
    // let d = newData - data;
    // var hours = parseInt((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // var minutes = parseInt((d % (1000 * 60 * 60)) / (1000 * 60));
  },

  methods: {
    //获取页面保存数据
    getEuroData() {
      if (sessionStorage.getItem("euroStatus")) {
        let data = JSON.parse(sessionStorage.getItem("euroStatus"));
        this.paymentCountDownNum = data.paymentCountDownNum;
        this.euroStatus = data.euroStatus;
        this.paymentCountDownMinute = data.paymentCountDownMinute;
        this.buttonData.loading = false;
        clearTimeout(this.timeoutDown);
        this.timeoutDown = setTimeout(() => {
          this.buttonData = {
            loading: true,
            triggerNum: 1,
            customName: false,
          };
          this.$parent.$refs.viewTab.routerName = "";
        });

        this.paymentCountStatus();
      }
    },
    //下一步
    async submitToken() {
      let submitToken = await querySubmitToken();
      if (submitToken && this.buttonData.triggerNum === 1) {
        //导航隐藏状态控制true为隐藏
        this.$store.commit("changeBuyPayProcessTab", false);
        //页面切换
        this.euroStatus = "";
        //修改按钮状态以及隐藏头部标题
        this.$nextTick(() => {
          this.$parent.$refs.viewTab.routerName = "";
          this.buttonData = {
            loading: true,
            triggerNum: 1,
            customName: false,
          };
        });
        this.handleScroll();
        this.paymentCountStatus();
      }
    },
    copy() {
      let clipboard = new Clipboard(".line");
      clipboard.on("success", () => {
        this.$toast({
          duration: 3000,
          message: this.$t("nav.copyTips"),
        });
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        clipboard.destroy();
      });
    },
    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll() {
      clearTimeout(this.scrollTimeDown);

      //附加滚动
      //  this.$nextTick(()=>{
      let offset = document.querySelector(".button_ref");
      if (
        this.$parent.$refs.routerView_box.scrollTop +
          this.$parent.$refs.routerView_box.offsetHeight >=
        offset.offsetTop - 40
      ) {
        this.goDown_state = false;
      } else {
        this.scrollTimeDown = setTimeout(() => {
          this.goDown_state = true;
        }, 1000);
      }
      // })
    },
    //点击按钮到底部
    goDown() {
      setTimeout(() => {
        let offset = document.querySelector(".button_ref");
        offset.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
        this.goDown_state = false;
      });
    },
    //页面倒计时以及保存页面状态
    paymentCountStatus() {
      clearInterval(this.TimeDown);
      this.TimeDown = setInterval(() => {
        if (this.paymentCountDownNum > 0 && this.euroStatus !== "confirm") {
          this.paymentCountDownNum--;
          this.paymentCountDownMinute = timeDown(this.paymentCountDownNum);
          let data = {
            euroStatus: this.euroStatus,
            paymentCountDownNum: this.paymentCountDownNum,
            paymentCountDownMinute: timeDown(this.paymentCountDownNum),
          };
          sessionStorage.setItem("euroStatus", JSON.stringify(data));
        } else {
          this.paymentCountDownMinute = "00:00";
          this.toastShow = true;
          clearInterval(this.TimeDown);
        }
      }, 1000);
    },
  },
  // updated(){
  //   if(this.euroStatus===''){
  //     //页面数据更新后判断高度是否变化
  //   if((this.$refs.box_ref.offsetHeight + 25 > this.$parent.$refs.routerView_box.offsetHeight)){
  //       this.goDown_state = true;
  //     }else{
  //         this.goDown_state = false;
  //     }
  //   }

  // },
  destroyed() {
    clearInterval(this.TimeDown);
    this.$store.commit("changeBuyPayProcessTab", true);
    clearTimeout(this.timeoutDown);
    window.removeEventListener("scroll", this.handleScroll, true);
  },
};
</script>

<style lang="scss" scoped>
#euroPay-container {
  flex: 1;
  padding: 0.1rem 0 0 0;
  font-family: "Regular";
  & > div:first-child {
    height: 100%;
  }
  // position: relative;
  .euroPay_title {
    font-size: 0.13rem;
    color: #6e7687;
    line-height: 0.16rem;
  }
  .euroPay_title1 {
    width: 100%;
    height: 0.56rem;
    background: #f4f5f7;
    border-radius: 6px;
    color: #6e7687;
    font-size: 0.16rem;
    line-height: 0.56rem;
    text-indent: 0.16rem;
    margin-top: 0.08rem;
  }
  .euroPaycontent {
    .title {
      p:first-child {
        color: #6e7687;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.16rem;
        margin-bottom: 0.08rem;
        font-family: "Regular";
      }
      p:last-child {
        font-weight: 500;
        font-size: 0.28rem;
        line-height: 0.33rem;
        color: #252830;
        margin-bottom: 0.12rem;
        font-family: Semibold;
      }
    }
    .eurTimeStatus {
      height: 0.36rem;
      border-bottom: 1px solid #d9d9d9;
      color: #6e7687;
      font-family: "Regular";
      span {
        color: rgba(255, 47, 47, 1);
      }
    }
    .euroPaycontent_top {
      display: flex;
      justify-content: space-between;
      margin-top: 0.2rem;
      .euroPaycontent_top_left {
        width: 0.18rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 0.06rem;
        div {
          height: 87%;
          border-left: 1px dashed #0059da;
          opacity: 0.4;
        }
        p {
          width: 0.16rem;
          height: 0.16rem;
          background: #0059da;
          color: #fff;
          border-radius: 50%;
          font-size: 0.1rem;
          text-align: center;
          line-height: 0.16rem;
          opacity: 0.8;
        }
      }
      .euroPaycontent_top_right {
        width: calc(100% - 0.25rem);
        .Leave_title {
          font-weight: 400;
          font-size: 0.13rem;
          color: #6e7687;
          line-height: 0.18rem;
        }
      }
    }
    .content {
      padding: 0.2rem 0.16rem 0.2rem;
      background: #f4f5f7;
      border-radius: 0.06rem;
      margin-top: 0.12rem;
      .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.13rem;
        margin-bottom: 0.22rem;
        color: #6e7687;
        cursor: pointer;
        img {
          width: 0.2rem;
          margin-left: 0.05rem;
        }
        > div {
          display: flex;
          align-items: center;
          p {
            width: 1.7rem;
            text-align: right;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #6e7687;
          }
        }
      }
      .line:last-child {
        margin: 0;
      }
    }
    //  .frame{
    //    display: flex;
    //    justify-content: start;
    //    color: #FF2F2F;
    //     img{
    //       width: .13rem;
    //     }
    //    span{
    //      margin-left: .04rem;
    //    }
    //   }
    .euro_title {
      font-size: 0.13rem;
      line-height: 0.18rem;
      margin-top: 0.16rem;
      color: #94acba;
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

  footer {
    width: 100%;
    position: sticky;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0rem 0rem;
    z-index: 999;
  }
}
</style>
