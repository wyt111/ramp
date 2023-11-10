<template>
  <div class="payment-failed-container">
    <div class="status">
      <img class="img" src="@/assets/images/paymentResult/6.svg" alt="" />
    </div>
    <div class="order-info">
      <div class="item">
        <div class="label">
          {{ $t("paymentResult.paymentFailed.status") }}
        </div>
        <div class="val">
          <span class="text">{{
            orderStatus === 11
              ? $t("paymentResult.paymentFailed.payment_failed_11")
              : $t("paymentResult.paymentFailed.payment_failed")
          }}</span>
        </div>
      </div>
      <div class="item">
        <div class="label">
          {{ $t("paymentResult.paymentFailed.order_id") }}
        </div>
        <div class="val">
          <span class="text">
            {{ detailsParameters.orderNo }}
          </span>
          <copy-img
            class="copy"
            v-clipboard:copy="detailsParameters.orderNo"
            v-clipboard:success="copySuccess"
            v-clipboard:error="copyError"
          />
        </div>
      </div>
      <div class="item">
        <div class="label">
          {{ $t("paymentResult.paymentFailed.failure_reason") }}
        </div>
        <div class="val">
          <span class="text">{{ failReason }}</span>
          <!-- todo reason  orderStatus==6 -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PaymentFailed",
  components: {},
  props: ["orderStatus", "detailsParameters", "failMessage"],
  data() {
    return {
      i18nLocale: sessionStorage.getItem("language") || "en-US",
    };
  },
  computed: {
    failReason() {
      if (this.orderStatus === 11) {
        return this.$t("paymentResult.orderFailed_11");
      }
      if (this.failMessage && this.failMessage[this.i18nLocale]) {
        return this.failMessage[this.i18nLocale];
      } else if (this.detailsParameters.failReason) {
        return this.detailsParameters.failReason;
      } else {
        return this.$t("paymentResult.paymentFailed.check_card");
      }
    },
  },
  filters: {},
  methods: {
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
};
</script>
<style lang="scss" scoped>
.payment-failed-container {
  padding-top: 0.18rem;
  .status {
    margin-bottom: 0.12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      width: 1.6rem;
    }
  }
  .order-info {
    background: #f4f8fb;
    border: 1px solid #e6e8eb;
    border-radius: 0.06rem;
    overflow: hidden;
    margin-bottom: 0.16rem;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.12rem;
      &:not(:last-child) {
        border-bottom: 1px solid #e6e8eb;
      }
      .label {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.12rem;
        line-height: 0.14rem;
        color: #5d636d;
      }
      .val {
        display: flex;
        align-items: center;
        .coin {
          width: 0.16rem;
          margin-right: 0.04rem;
        }
        .copy {
          width: 0.16rem;
          margin-left: 0.08rem;
          cursor: pointer;
        }
        .text {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.12rem;
          line-height: 0.14rem;
          text-align: right;
          color: #252830;
          max-width: 2.33rem;
          word-break: break-all;
          text-align: left;
        }
      }
    }
  }
}
</style>
