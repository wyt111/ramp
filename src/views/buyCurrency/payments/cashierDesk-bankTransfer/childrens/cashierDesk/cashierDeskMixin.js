import { mapState } from "vuex";
import moment from "moment-timezone";
import { ObjectLength, timeDown } from "@/utils";

export default {
  props: ["payOrderInfoProps"],
  data() {
    return {
      // 支付订单信息
      payOrderInfo: {},
      // 订单支付状态信息
      payResultInfo: {
        // 订单倒计时信息
        paymentCountDown: null,
        paymentCountDownNum: 7200,
        paymentCountDownMinute: "00:00",
        paystateTimeOut: null,
      },
      symbol: "",
      payAmount: "",
    };
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      placeOrderQuery: (state) => state.placeOrderQuery,
      payMethodInfo: (state) => state.payMethodInfo,
    }),
  },
  watch: {
    payOrderInfoProps: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && ObjectLength(val) && JSON.stringify(val) !== "{}") {
          this.payOrderInfo = val;
          this.refreshPayStatus();
        }
      },
    },
  },
  created() {
    this.$store.commit("changeBuyPayProcessTab", false);
  },
  mounted() {
    this.receiveinfo();
  },
  methods: {
    // 恢复数据
    receiveinfo() {
      //Selected Receive local data
      if (sessionStorage.getItem("cashierDesk_bankTransfer_payResult")) {
        this.payOrderInfo = JSON.parse(
          sessionStorage.getItem("cashierDesk_bankTransfer_payResult")
        );
        //刷新倒计时
        this.payResultInfo.paymentCountDownNum =
          this.payOrderInfo.paymentCountDownNum;
        this.$parent.paymentCountDownMinute = this.payOrderInfo
          .paymentCountDownMinute
          ? this.payOrderInfo.paymentCountDownMinute
          : "120:00";
        setTimeout(() => {
          this.$parent.$parent.$refs.viewTab.routerName =
            "navTabTitle.Completepayment";
          //隐藏费率展示
          this.$parent.IncludedDetails = false;
        });
        //倒计时状态
        this.$parent.startPayment = true;
        //刷新订单状态
        this.refreshPayStatus();
      }
    },

    // 存储进行中订单信息
    storeData() {
      let newData = {
        ...this.payResultInfo,
        ...this.payOrderInfo,
        paymentCountDownNum: this.payResultInfo.paymentCountDownNum,
        paymentCountDownMinute: this.$parent.paymentCountDownMinute
          ? this.$parent.paymentCountDownMinute
          : "120:00",
        AuthorizationInfo_state: this.$parent.AuthorizationInfo_state,
      };
      sessionStorage.setItem(
        "cashierDesk_bankTransfer_payResult",
        JSON.stringify(newData)
      );
    },
    // 刷新订单状态啊
    refreshPayStatus() {
      //15 minutes order countdown
      clearInterval(this.payResultInfo.paymentCountDown);
      this.payResultInfo.paymentCountDown = setInterval(() => {
        //order overtime
        this.$parent.paymentCountDownMinute = timeDown(
          this.payResultInfo.paymentCountDownNum
        );
        //Real time storage countdown
        this.storeData();
      }, 1000);
      if (this.payResultInfo.paymentCountDownNum < 0) {
        clearInterval(this.payResultInfo.paymentCountDown);
        clearInterval(this.payResultInfo.paystateTimeOut);
        this.$router
          .replace(`/paymentResult?customParam=${this.orderNo}`)
          .catch(() => {
            clearInterval(this.payResultInfo.paymentCountDown);
            clearInterval(this.payResultInfo.paystateTimeOut);
          });
        return;
      }
      //Refresh payment status
      this.requestPayStatus();
      clearInterval(this.payResultInfo.paystateTimeOut);
      this.payResultInfo.paystateTimeOut = setInterval(() => {
        this.requestPayStatus();
      }, 1000);
    },
    requestPayStatus() {
      let params = {
        orderNo: this.orderNo,
      };
      this.$axios.get(this.$api.get_payResult, params).then((res) => {
        if (res && res.data) {
          this.symbol = res.data.fiatCurrencySymbol;
          this.payAmount = res.data.amount;
          //订单创建时间 单位转换时间为毫秒
          const createdTime = moment(res.data.payOrderCreateTime).valueOf();
          //订单超时时间
          let timeOut = Number(res.data.expire * (60 * 1000));
          //现在时间
          let newDate = new Date().getTime();
          this.payResultInfo.paymentCountDownNum = Math.floor(
            (createdTime + timeOut - newDate) / 1000
          );
        }
        if (
          res &&
          res.data &&
          (res.data.orderStatus === 0 ||
            (res.data.orderStatus >= 2 && res.data.orderStatus <= 6))
        ) {
          this.$parent.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },
    // copy反馈结果
    firstCopySuccess() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
    firstCopyError() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
  },
  destroyed() {
    // 清除定时器、订单进行中信息
    clearInterval(this.payResultInfo.paymentCountDown);
    clearInterval(this.payResultInfo.paystateTimeOut);
    this.payResultInfo = {
      // 订单倒计时信息
      paymentCountDown: null,
      paymentCountDownNum: 7200,
      paymentCountDownMinute: "00:00",
      paystateTimeOut: null,
    };
    sessionStorage.removeItem("cashierDesk_bankTransfer_payResult");
    this.$store.state.MEXPayStatus = false;
  },
};
