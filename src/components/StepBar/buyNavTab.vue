<template>
  <div id="buyNavTab-container" v-if="tabShow">
    <div class="buyNavTab_content">
      <div class="text">{{ $t("buyNavTab.step", [currentStep]) }}</div>
      <div class="line-box">
        <div class="line" :class="{ ac: currentStep >= 1 }"></div>
        <div class="line" :class="{ ac: currentStep >= 2 }"></div>
        <div class="line" :class="{ ac: currentStep >= 3 }"></div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 买币步骤条
 */
import { mapState } from "vuex";

export default {
  name: "BuyNavTab",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      buyTabState: (state) => state.buyPayProcessTab.tabState,
    }),
    tabShow() {
      // let tabState = this.$parent.$refs.viewTab && this.$parent.$refs.viewTab.tabState?this.$parent.$refs.viewTab.tabState:false
      // && tabState
      //receivingMode 填写地址 \  paymentMethod 选择卡信息   \ creditCardConfig  确认订单 \ paymentResult 支付结果页
      if (
        (this.$route.name === "receivingMode" ||
          this.$route.name === "paymentMethod" ||
          this.$route.name === "creditCardConfig" ||
          this.$route.name === "otherWays-VA" ||
          this.$route.name === "otherWayPay" ||
          this.$route.name === "binancePay" ||
          this.$route.name === "euroPay" ||
          this.$route.name === "BrazilPay" ||
          this.$route.name === "phpPayment" ||
          this.$route.name === "PSEWayPay" ||
          this.$route.name === "pagsmilePay" ||
          this.$route.name === "nigeriaPay" ||
          this.$route.name === "ArgentinaPay" ||
          this.$route.name === "cashierDesk-bankTransfer") &&
        this.buyTabState
      ) {
        return true;
      }
      return false;
    },
    currentStep() {
      if (this.$route.name === "receivingMode") {
        return 1;
      } else if (this.$route.name === "paymentMethod") {
        return 2;
      } else if (
        this.$route.name === "creditCardConfig" ||
        this.$route.name === "paymentResult" ||
        this.$route.name === "otherWays-VA" ||
        this.$route.name === "otherWayPay" ||
        this.$route.name === "binancePay" ||
        this.$route.name === "phpPayment" ||
        this.$route.name === "BrazilPay" ||
        this.$route.name === "PSEWayPay" ||
        this.$route.name === "pagsmilePay" ||
        this.$route.name === "nigeriaPay" ||
        this.$route.name === "ArgentinaPay" ||
        this.$route.name === "cashierDesk-bankTransfer"
      ) {
        return 3;
      }
      return 1;
    },
  },
  mounted() {
    // this.$store.commit('changeBuyPayProcessTab', true);
  },
};
</script>
<style lang="scss" scoped>
#buyNavTab-container {
  margin-bottom: 0.24rem;
  .buyNavTab_content {
    height: 0.17rem;
    display: flex;
    align-items: center;
    .text {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.14rem;
      line-height: 0.17rem;
      color: #5d636d;
      margin-right: 0.27rem;
      white-space: nowrap;
    }
    .line-box {
      flex: 1;
      display: flex;
      align-items: center;
      .line {
        flex: 1;
        height: 0.04rem;
        background: #0059da;
        opacity: 0.1;
        border-radius: 1rem;
        &:nth-child(2) {
          margin: 0 0.06rem;
        }
        &.ac {
          opacity: 1;
        }
      }
    }
  }
}
</style>
