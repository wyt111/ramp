<template>
  <div class="line_content" v-if="payOrderInfo[labelKey]">
    <div class="label">{{ $t("legendTrading_cashierDesk." + labelKey) }}</div>
    <div class="val">
      <span class="text">{{ payOrderInfo[labelKey] }} </span>
      <copy-img
        class="copy-img"
        v-clipboard="payOrderInfo[labelKey]"
        v-clipboard:success="firstCopySuccess"
        v-clipboard:error="firstCopyError"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "LegendTradingDetailsLineContent",
  data() {
    return {};
  },
  props: {
    payOrderInfo: {
      default: () => {
        return {};
      },
      required: true,
      type: Object,
    },
    labelKey: {
      default: "",
      required: true,
      type: String,
    },
  },
  mounted() {},
  methods: {
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
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.line_content {
  display: flex;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 0.16rem;
  }

  .label {
    color: #5d636d;
    font-family: SF Pro Display;
    font-size: 0.13rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.14rem;
    margin-right: 0.16rem;
  }
  .val {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    .text {
      color: #252830;
      text-align: right;
      font-family: SF Pro Display;
      font-size: 0.14rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.14rem; /* 100% */
      word-break: break-all;
    }
    .copy-img {
      height: 0.16rem;
      margin-left: 0.12rem;
      cursor: pointer;
    }
  }
  &.line_content2 {
    display: block;
    .label {
      margin: 0 0 0.08rem 0;
      display: flex;
      align-items: center;
      img {
        width: 0.12rem;
        margin-right: 0.04rem;
      }
    }
    .val {
      justify-content: space-between;
      .text {
        font-family: HarmonyOS Sans;
        text-align: left;
      }
    }
  }
}
</style>
