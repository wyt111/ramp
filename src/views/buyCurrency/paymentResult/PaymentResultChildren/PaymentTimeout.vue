<template>
  <div class="payment-timeout-container">
    <div class="sendCrypto_content1">
      <img src="@/assets/images/SellOrderTime.svg" alt="" />
      <div class="p1">
        {{ $t("paymentResult.paymentTimeout.order_timeout") }}
      </div>
      <p class="p2">{{ $t("paymentResult.paymentTimeout.order_expired") }}</p>
    </div>
    <div class="sendCrypto_title">
      <p>{{ $t("paymentResult.paymentTimeout.order_id") }}</p>
      <p class="order-con">
        <span>{{ detailsParameters.orderNo }}</span>
        <copy-img
          v-clipboard:copy="detailsParameters.orderNo"
          v-clipboard:success="copySuccess"
          v-clipboard:error="copyError"
        />
      </p>
    </div>
    <div class="sendCrypto_button" @click="onBack">
      <button>
        {{ back_text }}
        <img
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
        />
      </button>
      <powered-by />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "PaymentTimeout",
  components: {},
  props: ["detailsParameters"],
  data() {
    return {};
  },
  computed: {
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),
    back_text() {
      if (
        this.merchantInfo.merchantStatus &&
        this.detailsParameters.redirectUrl !== undefined &&
        this.detailsParameters.redirectUrl &&
        this.detailsParameters.redirectUrl.trim() !== ""
      ) {
        const returnText =
          this.detailsParameters.merchantName &&
          this.detailsParameters.merchantName.trim() !== ""
            ? `${this.$t("nav.result_returnText_merchant")} ${
                this.detailsParameters.merchantName
              }`
            : this.$t("nav.result_returnText_merchant1");
        return returnText;
      }
      // page商户携带merchantOrderNo展示check order
      if (
        this.detailsParameters.merchantOrderNo &&
        this.detailsParameters.merchantOrderNo !== "" &&
        this.detailsParameters.merchantOrderNo !== null
      ) {
        return this.$t("payConfig_components.button_THB");
      }
      return this.$t("sellOrderFonts.Sellorder_ButtongoHome");
    },
  },
  mounted() {},
  methods: {
    onBack() {
      // SDK接入方式 - 向SDK传递信息
      if (
        this.detailsParameters.orderType &&
        this.detailsParameters.orderType === 3
      ) {
        window.parent.postMessage("closeOrder", "*");
        return;
      }
      // 商户配置redirectUrl参数
      if (
        this.detailsParameters.redirectUrl &&
        this.detailsParameters.redirectUrl !== "" &&
        this.detailsParameters.redirectUrl !== undefined
      ) {
        window.location = this.detailsParameters.redirectUrl;
        return;
      }
      // page商户携带merchantOrderNo
      if (
        this.detailsParameters.merchantOrderNo &&
        this.detailsParameters.merchantOrderNo !== "" &&
        this.detailsParameters.merchantOrderNo !== null
      ) {
        this.$router.push(
          `/tradeHistory-BuyDetails?orderId=${this.detailsParameters.orderNo}`
        );
        return;
      }
      this.$router.replace("/");
    },
    copySuccess() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
    copyError() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
  },
  filters: {},
};
</script>
<style lang="scss" scoped>
.payment-timeout-container {
  padding-top: 0.18rem;
  .sendCrypto_content1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.2rem;

    img {
      width: 1.6rem;
      margin-bottom: 0.12rem;
    }
    .p1 {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 700;
      font-size: 0.2rem;
      line-height: 0.24rem;
      text-align: center;
      color: #252830;
      margin-bottom: 0.08rem;
    }
    .p2 {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.18rem;
      text-align: center;
      color: #252830;
    }
  }
  .sendCrypto_title {
    height: 0.4rem;
    background: #f4f8fb;
    border: 1px solid #e6e8eb;
    border-radius: 0.06rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.12rem;
    p {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.14rem;
      color: #5d636d;
      display: flex;
      align-items: center;
      span {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.12rem;
        line-height: 0.14rem;
        text-align: right;
        color: #252830;
      }
      img {
        width: 0.16rem;
        margin-left: 0.08rem;
      }
      &.order-con {
        cursor: pointer;
      }
    }
  }
  .sendCrypto_button {
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0.16rem 0;
    z-index: 999;
    button {
      width: 100%;
      height: 0.48rem;
      border-radius: 0.06rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.19rem;
      text-align: center;
      color: #ffffff;
      .rightIcon {
        width: 0.2rem;
        margin-left: 0.08rem;
        span {
          height: 0.17rem;
        }
      }

      background: #0059da;
      opacity: 1;
      cursor: pointer;
      &:hover {
        background: #0052c9;
      }
      &:active {
        background: #004bb7;
      }
      &[disabled] {
        background: #0059da;
        opacity: 0.2;
        cursor: no-drop;
      }
    }
  }
}
</style>
