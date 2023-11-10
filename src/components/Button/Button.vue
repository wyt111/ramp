<template>
  <button
    class="button"
    :disabled="disabled || (buttonData.triggerNum >= 1 && loadingDisabled)"
    @click="submit"
    ref="buttonChild_ref"
  >
    <slot v-if="buttonData.customName" />
    <p class="p" v-else>
      {{ $t(buttonName) + "" }}&nbsp;{{ timeStatus ? timeStatus : "" }}
    </p>
    <button-loading v-if="buttonData.loading" class="rightIcon" />
    <img
      v-else
      class="rightIcon"
      src="@/assets/images/button-right-icon.svg"
      alt=""
    />
  </button>
</template>

<script>
/**
 * 确认订单按钮组件 可查询订单状态
 * buttonData.agreement === 1 支付
 * buttonData.agreement >1 查询支付状态
 * buttonData.customName 自定义按钮名称状态
 * buttonData.type 确认支付后是否展示其他文案
 * @returns {Promise<void>}
 */
export default {
  name: "CustomButton",
  props: {
    buttonData: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: null,
    },
    loadingDisabled: {
      type: Boolean,
      default: null,
    },
    timeStatus: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      buttonName: "nav.ConfirmPayment", // Confirm Payment ｜ I have completed the payment
    };
  },
  watch: {
    buttonData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.triggerNum >= 1) {
          this.buttonName = "nav.queryOderState";
        } else {
          this.buttonName = "nav.ConfirmPayment";
        }
      },
    },
  },
  methods: {
    submit() {
      this.buttonData.triggerNum += 1;
      if (this.buttonData.triggerNum === 1) {
        this.buttonData.loading = true;
        if (
          this.buttonData.customName === false &&
          this.buttonData.type !== "baht"
        ) {
          this.buttonName = "nav.queryOderState";
        }
        return;
      }
      //新打开tab跳外链接无弹框功能
      if (
        this.buttonData.type &&
        this.buttonData.type === "baht" &&
        this.$store.state.ovo_va_mex_qrs_Status
      ) {
        // this.$parent.$parent.tipsState = true;
        // this.$parent.$parent.BuyTimeOut = '';
        return;
      }
      if (
        this.buttonData.triggerNum > 1 &&
        this.$store.state.ovo_va_mex_qrs_Status &&
        this.buttonData.customName === false
      ) {
        this.$parent.$parent.BuyTimeOut = "";
        this.$parent.$parent.tipsState = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  width: 100%;
  min-height: 0.48rem;
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
  .p {
    display: flex;
    align-items: center;
    max-width: 3rem;
  }
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
</style>
