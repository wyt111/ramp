<template>
  <div
    id="cashierDesk-bankTransfer"
    :class="[{ 'custom-scrollbar': this.IncludedDetails }]"
  >
    <div id="cashierDesk-bankTransfer-box" ref="box_ref">
      <div class="view-content">
        <!-- 支付方式信息模块 -->
        <PayMethodInfo v-if="IncludedDetails" />
        <!-- 支付方式表单 -->
        <component :is="payFormComponent" ref="payForm_ref"></component>
        <!-- 支付费用模块 -->
        <IncludedDetails
          class="includedDetails"
          v-if="IncludedDetails"
          :type="2"
          :payWayCode="payMethodInfo.payWayCode"
        />
        <!-- 支付收银台模块 -->
        <component
          :is="cashierDeskComponent"
          :payOrderInfoProps="payOrderInfo"
          ref="cashierDesk_ref"
        ></component>
      </div>
      <!-- I confirm that the payment has been completed.-->
      <footer class="footer" ref="footer_ref">
        <div class="errorTips" v-if="form_errorTips">
          Please fill in all fields with valid information.
        </div>
        <ConfirmPayMy
          class="button_ref"
          ref="button_ref"
          :buttonData="buttonData"
          :countDown="startPayment ? paymentCountDownMinute : ''"
          @click.native="submit"
          :payWayCode="payMethodInfo.payWayCode"
        >
        </ConfirmPayMy>
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
import { mapState } from "vuex";
import ConfirmPayMy from "@/components/Button/confirm-pay-my";
import PayMethodInfo from "@/components/PayMethodInfo/index";
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import LegendTrading from "./childrens/cashierDesk/LegendTrading";
// TRY
import TRY_bankTransfer_form from "./childrens/payForm/TRY-bankTransfer-form";
import TRY_bankTransfer from "./childrens/cashierDesk/TRY-bankTransfer";
// MXN
import MXN_bankTransfer from "./childrens/cashierDesk/MXN-bankTransfer";
import { getUserIp } from "@/utils/publicRequest";
import { AES_Decrypt } from "@/utils/encryp.js";

export default {
  name: "cashierDesk-bankTransfer",
  components: {
    ConfirmPayMy,
    IncludedDetails,
    PayMethodInfo,
    TRY_bankTransfer_form,
    TRY_bankTransfer,
    LegendTrading,
    MXN_bankTransfer,
  },
  data() {
    return {
      //展示费率状态
      IncludedDetails: true,
      //支付倒计时
      paymentCountDownMinute: "00:00", // 120:00
      //支付倒计时状态
      startPayment: false,
      // 按钮可点击状态
      payBtnEnabled: false,
      // 支付订单信息
      payOrderInfo: {},
      //按钮状态
      buttonData: {
        loading: false,
        confirmSuccess: false,
        countNum: 0,
      },
      // 表单错误信息
      form_errorTips: false,
    };
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      placeOrderQuery: (state) => state.placeOrderQuery,
    }),
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
    }),
    // 支付表单组件
    payFormComponent() {
      if (!this.IncludedDetails) return;
      let payFormComponent = "";
      if (["51001", "51002"].includes(this.payMethodInfo.payWayCode)) {
        payFormComponent = "TRY_bankTransfer_form";
        return payFormComponent;
      }
      return payFormComponent;
    },
    // 支付收银台组件
    cashierDeskComponent() {
      if (this.IncludedDetails) return;
      let cashierDeskComponent = "";
      if (["51001", "51002"].includes(this.payMethodInfo.payWayCode)) {
        cashierDeskComponent = "TRY_bankTransfer";
        return cashierDeskComponent;
      }
      if (
        ["53001", "53002", "53003", "53004"].includes(
          this.payMethodInfo.payWayCode
        )
      ) {
        cashierDeskComponent = "LegendTrading";
        return cashierDeskComponent;
      }
      if (["601"].includes(this.payMethodInfo.payWayCode)) {
        cashierDeskComponent = "MXN_bankTransfer";
        return cashierDeskComponent;
      }
      return cashierDeskComponent;
    },
    //确认按钮状态
    payState() {
      if (["601"].includes(this.payMethodInfo.payWayCode)) {
        return false;
      }
      // 土耳其TRY-'51001','51002'
      if (
        ["51001", "51002"].includes(this.payMethodInfo.payWayCode) &&
        this.payBtnEnabled
      ) {
        return false;
      }
      // legendtrading;
      if (
        ["53001", "53002", "53003", "53004"].includes(
          this.payMethodInfo.payWayCode
        ) &&
        this.$route.query.from !== "buyDetails"
      ) {
        return false;
      }
      return true;
    },
  },
  //清除页面数据
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //清空二次支付状态
      if (to.query.isTwice === "1") {
        let newQuery = { pathHistry: "tradeHistory" };
        // sessionStorage.removeItem('cashierDesk_bankTransfer_payResult');
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.$router.replace({ query: newQuery });
      }
      // 二次支付隐藏支付步骤条
      if (to.query.pathHistry && to.query.pathHistry === "tradeHistory") {
        vm.$store.commit("changeBuyPayProcessTab", false);
      }
      if (
        to.name === "cashierDesk-bankTransfer" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        // sessionStorage.removeItem('cashierDesk_bankTransfer_payResult');
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.buttonLoading = true;
      }
      if (from.name !== null) {
        // 清空支付信息
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        // sessionStorage.removeItem('cashierDesk_bankTransfer_payResult');
        vm.IncludedDetails = true;
        vm.startPayment = false;
        vm.buttonData = {
          loading: false,
          confirmSuccess: false,
          countNum: 0,
        };
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (["FillInformation"].includes(to.name)) {
      next({
        path: "/paymentMethod",
        replace: true,
      });
    } else if (["paymentResult"].includes(to.name)) {
      next();
    } else {
      if (!["/tradeHistory", "/tradeHistory-BuyDetails"].includes(to.path)) {
        // 清空支付信息
        this.$store.commit("set_ovo_va_mex_qrs_Status", false);
        sessionStorage.removeItem("cashierDesk_bankTransfer_payResult");
        this.IncludedDetails = true;
        this.startPayment = false;
        this.buttonData = {
          loading: false,
          confirmSuccess: false,
          countNum: 0,
        };
      }
      if (
        ["/tradeHistory-BuyDetails"].includes(to.path) &&
        this.$route.query.from == "buyDetails"
      ) {
        this.$store.commit("set_ovo_va_mex_qrs_Status", true);
      }
      next();
    }
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
    this.finUserDetails();
    this.receiveInfo();
  },
  destroyed() {
    this.$store.dispatch("request/clearAllQuery");
  },
  methods: {
    receiveInfo() {
      if (!sessionStorage.getItem("cashierDesk_bankTransfer_payResult")) {
        this.$nextTick(() => {
          this.$store.commit("changeBuyPayProcessTab", true);
        });
      }
      //还原刷新前数据状态
      if (sessionStorage.getItem("cashierDesk_bankTransfer_payResult")) {
        this.payBtnEnabled = true;
        this.buttonData = {
          loading: false,
          confirmSuccess: true,
          countNum: 2,
        };
        this.IncludedDetails = false;
      }
    },
    // 确认支付
    submit() {
      if (this.payState) {
        this.form_errorTips = true;
        this.buttonData = {
          loading: false,
          confirmSuccess: false,
          countNum: 0,
        };
        return;
      }
      this.form_errorTips = false;
      const payWayCode = this.payMethodInfo.payWayCode;
      if (["51001", "51002"].includes(payWayCode)) {
        if (this.buttonData.countNum !== 1 || !this.payBtnEnabled) return;
        this.toPay();
      } else if (["53001", "53002", "53003", "53004"].includes(payWayCode)) {
        if (this.buttonData.countNum !== 1) return;
        this.legentTradingToPay();
      } else if (["601"].includes(payWayCode)) {
        this.noQueryPay();
      }
    },
    toPay() {
      this.$refs.payForm_ref.onPay();
    },
    async legentTradingToPay() {
      this.buttonData = {
        loading: true,
        confirmSuccess: false,
        countNum: 1,
      };
      let ipAddress;
      try {
        ipAddress = await getUserIp();
      } catch (e) {
        console.log(e);
        this.buttonData = {
          loading: false,
          confirmSuccess: false,
          countNum: 0,
        };
      }
      let email = AES_Decrypt(localStorage.getItem("login_email"));
      let assetFiat =
        this.payMethodInfo?.fiat || this.placeOrderQuery?.fiatCurrency;
      //二次支付请求支付方式参数
      if (this.$route.query.pathHistry === "tradeHistory") {
        assetFiat = this.buyPayment_secondPay?.currency;
      }
      const params = {
        payWayCode: this.payMethodInfo.payWayCode,
        orderNo: this.orderNo,
        customParam: {
          assetFiat,
          email,
          ipAddress,
        },
        businessParams: {},
      };
      this.$axios
        .post(this.$api.post_alchemyPayPay, params, "")
        .then((res) => {
          if (res?.returnCode == "0000") {
            this.payOrderInfo = res.data;
            this.IncludedDetails = false;
            this.buttonData = {
              loading: false,
              confirmSuccess: true,
              countNum: 2,
            };
            this.startPayment = true;
            //请求成功设置返回状态
            this.$store.commit("set_ovo_va_mex_qrs_Status", true);
            setTimeout(() => {
              this.$store.commit("changeBuyPayProcessTab", false);
              //改变导航文案
              this.$parent.$refs.viewTab.routerName =
                "navTabTitle.Completepayment";
            });
          } else {
            this.buttonData = {
              loading: false,
              confirmSuccess: false,
              countNum: 0,
            };
          }
        })
        .catch((error) => {
          console.log(error);
          this.buttonData = {
            loading: false,
            confirmSuccess: false,
            countNum: 0,
          };
        });
    },
    // MXN支付(不需要填写表单信息)
    noQueryPay() {
      this.$parent.buttonData = {
        loading: true,
        confirmSuccess: false,
        countNum: 1,
      };
      let params = {
        orderNo: this.orderNo,
        payWayCode: this.payMethodInfo.payWayCode,
      };
      //二次支付amount
      if (this.$route.query.pathHistry === "tradeHistory") {
        params.payWayCode = this.payMethodInfo.payWayCode;
      }
      this.$axios
        .post(this.$api.post_alchemyPayPay, params, "")
        .then((res) => {
          if (!res) return;
          // 支付结果信息
          this.payOrderInfo = res.data;
          // 父组件支付成功后状态
          this.IncludedDetails = false;
          this.buttonData = {
            loading: false,
            confirmSuccess: true,
            countNum: 2,
          };
          this.startPayment = true;
          //请求成功设置返回状态
          this.$store.commit("set_ovo_va_mex_qrs_Status", true);
          setTimeout(() => {
            this.$store.commit("changeBuyPayProcessTab", false);
            //改变导航文案
            this.$parent.$refs.viewTab.routerName =
              "navTabTitle.Completepayment";
          });
        })
        .catch(() => {
          this.buttonData = {
            loading: false,
            confirmSuccess: false,
            countNum: 0,
          };
          this.$store.commit("set_ovo_va_mex_qrs_Status", false);
        });
    },
    // 查询用户kyc成功后信息
    finUserDetails() {
      let params = {
        payWayCode: this.payMethodInfo.payWayCode,
      };
      this.$axios.get(this.$api.get_findUserDetail, params).then((res) => {
        if ((!res && res.returnCode !== "0000") || !res.data) return;
        // 成功状态
        if (res.data.isPassByPwcWorld) {
          // 存储kyc信息
          let kycCheck = res.data.country === this.placeOrderQuery.alpha2;
          this.$store.commit("kycInfo/set_kycCheck", kycCheck);
          this.$store.commit("kycInfo/set_kycResultInfo", res.data);
          // 赋值表单信息
          this.$refs.payForm_ref?.insertFormInfo();
        }
      });
    },
  },
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
