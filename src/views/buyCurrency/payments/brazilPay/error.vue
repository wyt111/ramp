<template>
  <div id="pixPay-error">
    <div class="pixPay-error-logo">
      <img src="@/assets/images/pixPay-error.png" alt />
    </div>
    <div class="pixPay-error-info">
      <div class="content">{{ $t("pixPayError.tips") }}</div>
    </div>
    <div class="footer-button">
      <button class="continue" @click="goBack">
        {{ backText }}
        <img
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
        />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "pixPay-error",
  data() {
    return {
      detailsParameters: {},
    };
  },
  computed: {
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),
    backText() {
      if (
        this.detailsParameters.merchantName &&
        this.detailsParameters.merchantName !== "" &&
        this.detailsParameters.merchantName !== undefined
      ) {
        return (
          this.$t("nav.result_returnText_merchant") +
          " " +
          this.detailsParameters.merchantName
        );
      }
      return this.$t("homePage.tab_buy");
    },
  },
  mounted() {
    this.orderInfo();
  },
  methods: {
    orderInfo() {
      if (!this.$route.query.orderNo) return;
      let params = {
        orderNo: this.$route.query.orderNo,
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
      if (
        this.detailsParameters.redirectUrl &&
        this.detailsParameters.redirectUrl !== "" &&
        this.detailsParameters.redirectUrl !== undefined
      ) {
        window.location = this.detailsParameters.redirectUrl;
        return;
      }
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
#pixPay-error {
  .pixPay-error-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.6rem;
    margin-bottom: 0.24rem;
    img {
      height: 1.6rem;
      // object-fit: cover;
    }
  }
  .pixPay-error-info {
    display: flex;
    flex-direction: column;
    font-style: normal;
    .content {
      font-family: Regular;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.22rem;
      text-align: center;
      letter-spacing: 0.005rem;
      color: #6e7687;
      padding: 0 0.2rem;
    }
  }
  .footer-button {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #ffffff;
    padding: 0.12rem 0.3rem 0.2rem 0.3rem;
    z-index: 999;
    // bottom: 0.2rem;
    .continue {
      width: 100%;
      height: 0.58rem;
      background: linear-gradient(88.06deg, #0059da 0%, #1bb2f2 100%);
      border-radius: 0.29rem;
      font-size: 0.17rem;
      font-family: Regular;
      font-weight: normal;
      color: #ffffff;
      margin-top: 0.16rem;
      cursor: pointer;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      .rightIcon {
        width: 0.24rem;
        margin-left: 0.12rem;
      }
    }
  }
}
</style>
