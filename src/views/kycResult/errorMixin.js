import { mapState } from "vuex";
import paymentMethods from "@/assets/json/paymentMethods.json";

export default {
  data() {
    return {
      detailsParameters: {},
    };
  },
  computed: {
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),
    ...mapState("buyPayments", {
      normal_process_orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
    }),
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
    }),
    backText() {
      if (
        this.detailsParameters.merchantName &&
        this.detailsParameters.redirectUrl
      ) {
        return (
          this.$t("nav.result_returnText_merchant") +
          " " +
          this.detailsParameters.merchantName
        );
      }
      return this.$t("homePage.tab_buy");
    },
    orderNo() {
      if (this.$route.query.pathHistry === "tradeHistory") {
        return this.buyPayment_secondPay.orderNo;
      }
      return this.normal_process_orderNo;
    },
    countryName() {
      const foundObj = paymentMethods.find(
        (obj) => obj.payWayCode == this.payMethodInfo.payWayCode
      );
      if (foundObj && foundObj.supportedCountries?.length) {
        const countryCode = foundObj.supportedCountries[0];
        return this.$t(`kycError_countryCheck.${countryCode}`);
      }
      return "";
    },
  },
  mounted() {
    this.orderInfo();
  },
  methods: {
    orderInfo() {
      if (!this.orderNo) return;
      let params = {
        orderNo: this.orderNo,
      };
      this.$axios.get(this.$api.get_payResult, params).then((res) => {
        if (res && res.data) {
          this.detailsParameters = res.data;
        }
      });
    },
    goBack() {
      // SDK接入方式 - 向SDK传递信息
      if (
        this.detailsParameters.merchantInfo &&
        this.detailsParameters.merchantQueryInfo &&
        this.detailsParameters.merchantQueryInfo.accessMethod &&
        this.detailsParameters.merchantQueryInfo.accessMethod === "SDK"
      ) {
        window.parent.postMessage("closeOrder", "*");
        return;
      }
      if (this.detailsParameters.redirectUrl) {
        window.location = this.detailsParameters.redirectUrl;
        return;
      }
      // page商户携带merchantOrderNo
      if (
        this.detailsParameters.merchantOrderNo &&
        this.detailsParameters.merchantOrderNo !== "" &&
        this.detailsParameters.merchantOrderNo !== null
      ) {
        this.$router.push(`/tradeHistory-BuyDetails?orderId=${this.orderNo}`);
        return;
      }
      this.$router.push("/");
    },
  },
};
