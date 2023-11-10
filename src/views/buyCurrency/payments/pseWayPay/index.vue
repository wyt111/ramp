<template>
  <div
    class="ArgentinaPay-container"
    :class="[{ 'custom-scrollbar': !waitState }]"
    id="confirmPayment"
    ref="box_ref"
    @scroll="handleScroll"
  >
    <!--    等待组件-->
    <div class="buyPayWaitPage" v-if="waitState">
      <BuyPayWaitPage :url="payUrl" />
    </div>

    <!-- 表单-->
    <div class="ArgentinaPay-content" v-else @click="harderSelectclone">
      <!-- 新增支付方式信息模块 -->
      <PayMethodInfo class="PayMethodInfo" />
      <trader-information
        name="name"
        idNumber="identify.number"
        phone="phone"
        v-if="!formShowStatus.basicItem"
      />
      <div class="ArgentinaPay-from" v-if="formShowStatus.basicItem">
        <!-- 选择id类型 -->
        <div class="select-inputBox form-item">
          <SelectInput
            v-model="formData.pseType"
            :selectList="speTypeList"
            :disable="inputDisable"
            @selectItem="selectPixType"
            ref="SelectInput_ref1"
            :placeholder="$t('formInfo.select_id_placeholder')"
          />
        </div>
        <!-- ID Number -->
        <div class="text-inputBox form-item">
          <TextInput
            :class="{ 'error-input': formError.id }"
            type="number"
            v-model="formData.pseNumber"
            type1="pse"
            @input="FormValidClone('id')"
            @blur="FormValidation('id')"
            :disabled="inputDisable"
            :maxlength="pseTypeDetails"
            :placeholder="idPlaceholder"
            :title="$t('formInfo.id_title')"
          />
          <el-collapse-transition>
            <p class="error-p" v-if="formError.id">
              {{ $t("configPay_brl.id_tips") }}
            </p>
          </el-collapse-transition>
        </div>
      </div>
      <IncludedDetails
        style="margin-bottom: 0.08rem"
        :type="2"
        :payWayCode="payMethodInfo.payWayCode"
      />

      <div style="display: flex; justify-content: center">
        <transition>
          <div class="downTips-icon" v-show="goDown_state" @click="goDown">
            <img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt="" />
          </div>
        </transition>
      </div>

      <footer class="footer" ref="footer_ref">
        <div class="errorTips" v-if="form_errorTips">
          Please fill in all fields with valid information.
        </div>
        <ConfirmPayMy
          class="button_ref"
          :buttonData="buttonData"
          @click.native="goPay"
        ></ConfirmPayMy>
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
import ConfirmPayMy from "../../../../components/Button/confirm-pay-my";
import BuyPayWaitPage from "@/components/PaymentWaitingPage/buyPayWaitPage";
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
// import SearchSelect from './children/searchSelect';
import PayMethodInfo from "../../../../components/PayMethodInfo/index";
import { mapState } from "vuex";
import { isElementNotInViewport } from "@/utils";
import { AES_Decrypt } from "@/utils/encryp.js";
import TextInput from "@/components/Input/text";
import SelectInput from "@/components/Input/select";

export default {
  name: "PSEWayPay",
  components: {
    ConfirmPayMy,
    BuyPayWaitPage,
    IncludedDetails,
    // SearchSelect,
    PayMethodInfo,
    TextInput,
    SelectInput,
  },
  data() {
    return {
      formShowStatus: {
        // 基本项表单信息
        basicItem: true,
        // 其他项表单信息
        otherItem: true,
      },
      //银行卡类型动画以及类型展示
      backTypeText: "",
      //搜索组件的显示隐藏
      search_isShow: false,
      //下滑动显示
      goDown_state: false,
      //动画显示
      waitState: false,
      //输入框禁用
      inputDisable: false,
      //公司地址展示状态
      companyAddress: true,
      //按钮数据
      buttonData: {
        loading: false,
        confirmSuccess: false,
        countNum: 0,
      },
      //表单数据
      formData: {
        orderNo: "", // 订单id
        pseType: "", // 身份证类型
        pseNumber: "", // 身份证 number
      },
      //身份证选择类型数据
      speTypeList: [
        { id: 1, name: "Tax Identification Number", idLength: "10" },
        { id: 2, name: "Citizenship Card", idLength: "10" },
      ],
      //数据类型长度
      pseTypeDetails: "10",
      TimeDown: null,
      //失败展示
      formError: {
        id: false,
      },

      //倒计时
      scrollTimeDown: null,

      // 支付链接
      payUrl: "",

      // 表单错误信息
      form_errorTips: false,

      disableStatus: true,
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //清空二次支付状态
      if (to.query.isTwice === "1") {
        let newQuery = { pathHistry: "tradeHistory" };
        sessionStorage.removeItem("psePayState");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.$router.replace({ query: newQuery });
      }
      if (
        to.name === "PSEWayPay" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        sessionStorage.removeItem("psePayState");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
      }
    });
  },

  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler() {
        if (!/^\d{8,10}$/.test(this.formData.pseNumber)) {
          this.disableStatus = true;
          return;
        }
        let formData = this.formData;
        if (formData.pseNumber && formData.pseType && !this.formError.id) {
          this.disableStatus = false;
          return;
        }
        this.disableStatus = true;
      },
    },
    formError: {
      deep: true,
      immediate: true,
      handler() {
        if (!/^\d{8,10}$/.test(this.formData.pseNumber)) {
          this.disableStatus = true;
          return;
        }
        let formData = this.formData;
        if (formData.pseNumber && formData.pseType && !this.formError.id) {
          this.disableStatus = false;
          return;
        }
        this.disableStatus = true;
      },
    },
  },

  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      lastTimePaymentFormInfo: (state) => state.lastTimePaymentFormInfo,
    }),

    //id输入框placeholder
    idPlaceholder() {
      return `${this.$t("formInfo.id_placeholder1")} ${
        this.pseTypeDetails
      } ${this.$t("formInfo.id_placeholder2")}`;
    },
  },

  mounted() {
    // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
    this.backFillTraderInformation();

    //初始化根据可视高度控制向下提示按钮状态
    if (this.waitState === false) {
      setTimeout(() => {
        if (this.$refs.box_ref) {
          setTimeout(() => {
            if (
              isElementNotInViewport("confirmPayment", this.$refs.footer_ref)
            ) {
              this.goDown_state = true;
            } else {
              this.goDown_state = false;
            }
          }, 100);
        }
        window.addEventListener("scroll", this.handleScroll, true);
      });
    }

    if (sessionStorage.getItem("psePayState")) {
      let psePay = JSON.parse(sessionStorage.getItem("psePayState"));
      this.payUrl = psePay.payUrl;
      this.waitState = psePay.waitState;
      this.$parent.confirmOrderStatus = true;
      this.paymentCountStatus();
    }
  },

  destroyed() {
    clearInterval(this.TimeDown);
    window.removeEventListener("scroll", this.handleScroll, true);
    this.$parent.confirmOrderStatus = false;
    this.$store.commit("changeBuyPayProcessTab", true);
    this.inputDisable = false;
    this.$store.dispatch("request/clearAllQuery");
  },

  methods: {
    //搜索组件的显示隐藏
    // setSearch_isShow() {
    //   this.search_isShow = true;
    //   this.$store.commit('changeBuyPayProcessTab', false);
    // },

    //修改银行卡类型
    // selectBankType(val) {
    //   this.formData.khipuAccountType = val.type;
    //   this.backTypeText = val.name;
    // },

    //只能输入英文
    // formatter(value) {
    //   return value.replace(/[^a-zA-Z ]/g, '');
    // },

    // 点击表单 隐藏 展开的选择框 清除显示
    harderSelectclone() {
      setTimeout(() => {
        if (this.$refs.SelectInput_ref1) {
          this.$refs.SelectInput_ref1.listStatus = false;
        }
      });
    },

    // 输入框输入时清空错误显示
    FormValidClone(type) {
      if (type === "id") {
        this.formError.id = false;
      }
      //   if (type === 'name') {
      //     this.formError.fullname = false;
      //   } else if (type === 'phone') {
      //     this.formError.phone = false;
      //   } else if (type === 'id') {
      //     this.formError.id = false;
      //   } else if (type === 'bank') {
      //     this.formError.khipuAccountNumber = false;
      //     this.formData.khipuBank = this.formData.khipuAccountNumber.length === 22 ? Number(this.formData.khipuAccountNumber.substring(0, 3)) : '';
      //   } else if (type === 'bankcode') {
      //     this.formError.khipuBank = false;
      //   }
    },

    //表单验证
    FormValidation(type) {
      if (type === "id") {
        let reg = /^\d{8,10}$/;
        // reg.test(this.formData.pseNumber) && this.formData.pseNumber.length >= 6 && this.formData.pseNumber.length <= 14 ? (this.formError.id = false) : (this.formError.id = true);
        // reg.test(this.formData.pseNumber) && this.formData.pseNumber.length === Number(this.pseTypeDetails) ? (this.formError.id = false) : (this.formError.id = true);
        if (
          !this.formData.pseNumber.length ||
          !reg.test(this.formData.pseNumber)
        ) {
          this.formError.id = true;
        }
      }
      //   if (type === 'name') {
      //     //三个连续相同字符
      //     let patrn = /(.)\1\1/;
      //     //两个连续空格
      //     let blankStrPatrn = /(\s)\1/;
      //     let reg = new RegExp(`^[A-Za-z ]{4,255}$`);
      //     if (this.formData.khipuName.length < 2 || patrn.exec(this.formData.khipuName) || blankStrPatrn.exec(this.formData.khipuName) || (this.formData.khipuName.length === 2 && this.formData.khipuName.match(new RegExp(/(\w)\1+/g))) || !reg.test(this.formData.khipuName)) {
      //       this.formError.fullname = true;
      //     } else {
      //       this.formError.fullname = false;
      //     }
      //   } else if (type === 'phone') {
      //     let reg = /^[0-9]*$/;
      //     !reg.test(this.formData.khipuPhone) || this.formData.khipuPhone.length !== Number(12) ? (this.formError.phone = true) : (this.formError.phone = false);
      //   } else if (type === 'id') {
      //     let reg = /^[0-9]*$/;
      //     reg.test(this.formData.pseNumber) && this.formData.pseNumber.length === Number(this.pseTypeDetails) ? (this.formError.id = false) : (this.formError.id = true);
      //   } else if (type === 'bank') {
      //     let reg = /^[0-9]*$/;
      //     reg.test(this.formData.khipuAccountNumber) && this.formData.khipuAccountNumber.length === 22 ? (this.formError.khipuAccountNumber = false) : (this.formError.khipuAccountNumber = true);
      //   } else if (type === 'bankcode') {
      //     let reg = /^[0-9]*$/;
      //     reg.test(this.formData.khipuBank) && this.formData.khipuBank.length === 3 ? (this.formError.khipuBank = false) : (this.formError.khipuBank = true);
      //   }
    },

    // 身份证选择类型
    selectPixType(item) {
      this.formData.pseType = item.name;
      this.pseTypeDetails = item.idLength;
      // this.FormValidation('id');
    },

    // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
    backFillTraderInformation() {
      // 表单项状态、表单项信息
      const info = this.lastTimePaymentFormInfo;
      if (!info.status || sessionStorage.getItem("psePayState")) return;
      this.formShowStatus.basicItem = false;
      this.formData.pseNumber = info.identify.number;
      let type = "";
      if (info.identify.type === "NIT") {
        type = "Tax Identification Number";
      } else if (info.identify.type === "CC") {
        type = "Citizenship Card";
      }
      this.formData.pseType = type;
    },

    //下单接口
    goPay() {
      if (this.disableStatus && !this.waitState) {
        this.form_errorTips = true;
        this.buttonData = {
          loading: false,
          confirmSuccess: false,
          countNum: 0,
        };
        return;
      }
      this.form_errorTips = false;

      if (this.buttonData.countNum === 1 && this.waitState === false) {
        //隐藏公司地址
        this.companyAddress = false;
        //输入框禁用
        this.inputDisable = true;
        let windowOpen = window.open();
        //因为后期修改了请求参数  所以以此写法写
        // let params = JSON.parse(JSON.stringify(this.formData));
        // params.khipuPhone = '54' + this.formData.khipuPhone;
        // params.orderNo = this.orderNo;
        // params.payWayCode = this.payMethodInfo.payWayCode;
        let type = "";
        if (this.formData.pseType === "Tax Identification Number") {
          type = "NIT";
        } else if (this.formData.pseType === "Citizenship Card") {
          type = "CC";
        }

        let email = AES_Decrypt(localStorage.getItem("login_email"));
        let params = {
          payWayCode: this.payMethodInfo.payWayCode,
          orderNo: this.orderNo,
          customParam: {
            email: email,
            phone: "15888888888",
            name: "ZhangSan",
            identify: {
              number: this.formData.pseNumber, // 身份号码
              type: type, // 身份类型 NIT 或 CC (大写)
            },
          },
        };
        //因为只有一个支付所以不封装接口
        this.$axios
          .post(this.$api.post_alchemyPayPay, params)
          .then((res) => {
            if (res && res.data) {
              windowOpen.location = res.data.webUrl;
              this.payUrl = res.data.webUrl;
              //展示等待页面
              this.waitState = true;
              this.$store.commit("set_ovo_va_mex_qrs_Status", true);
              let data = {
                waitState: this.waitState,
                payUrl: this.payUrl,
              };
              sessionStorage.setItem("psePayState", JSON.stringify(data));
              this.paymentCountStatus();
            }
          })
          .catch((err) => {
            console.log("err", err);
            //失败跳转页面
            if (err && ["91003", "60007"].includes(err.returnCode)) {
              this.$parent.$parent.tipsState = false;
              this.$router.replace(
                `/paymentResult?customParam=${this.orderNo}&errTip=true`
              );
            }
            this.inputDisable = false;
            this.buttonData = {
              loading: false,
              confirmSuccess: false,
              countNum: 0,
            };
            windowOpen.close();
          });
      }
    },

    //页面15分钟倒计时
    paymentCountStatus() {
      //因为正常写不触发 所以放到最后执行
      setTimeout(() => {
        this.$parent.confirmOrderStatus = true;
        this.$store.commit("changeBuyPayProcessTab", false);
      });
      clearInterval(this.TimeDown);
      this.TimeDown = setInterval(() => {
        this.requestStatus();
      }, 1000);
    },

    //刷新订单状态
    requestStatus() {
      let params = {
        orderNo: this.orderNo,
      };
      this.$axios.get(this.$api.get_payResult, params).then((res) => {
        if (
          res &&
          res.data &&
          (res.data.orderStatus === 0 ||
            (res.data.orderStatus >= 2 && res.data.orderStatus <= 6))
        ) {
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },

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

    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll() {
      if (!this.waitState && this.search_isShow === false) {
        window.clearTimeout(this.scrollTimeDown);
        this.scrollTimeDown = null;
        // let offset = this.$refs.button_ref.$refs.buttonChild_ref.getBoundingClientRect();
        //附加滚动
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.buyPayWaitPage,
.heightAuto {
  height: 100%;
}

.buyPayWaitPage {
  padding: 0 0.16rem;
}

.downTips-icon {
  //display: flex;
  //justify-content: center;
  position: absolute;
  bottom: 0.5rem;
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
  z-index: 2000;
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
::v-deep .number_input:nth-of-type(5) .van-field__control {
  letter-spacing: 1px;
}
::v-deep .number_input .van-field__control {
  color: #6e7687 !important;
}

.ArgentinaPay-container {
  flex: 1;
  .ArgentinaPay-content {
    height: 100%;
    .ArgentinaPay-from {
      .form-item {
        padding: 0.09rem 0 0;
        &:not(:last-child) {
          margin: 0 0 0.16rem 0;
        }
        .error-p {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.13rem;
          line-height: 0.18rem;
          color: #f53f3f;
          margin-top: 0.02rem;
        }
      }
      .select-inputBox {
        padding-top: 0;
      }
    }

    .footer {
      width: 100%;
      position: sticky;
      left: 0;
      background: #ffffff;
      padding: 0.08rem 0 0rem;
      z-index: 999;
      .errorTips {
        margin-bottom: 0.05rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.18rem;
        color: #f53f3f;
      }
    }
  }
}
</style>
