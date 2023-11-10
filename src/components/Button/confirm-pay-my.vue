<template>
  <button
    class="button"
    :disabled="disabled || buttonData.loading"
    @click="submit"
    ref="buttonChild_ref"
  >
    <slot v-if="buttonData.customName" />
    <p class="p" v-else>{{ $t(buttonName) + "" }} &nbsp; {{ showCountDown }}</p>
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
 * 我方收银台确认支付按钮（包括线下转账）
 * @param disabled {Boolean} 按钮禁选状态
 * @param buttonData {Object} loading 按钮主动触发loading状态 confirmSuccess 确认成功状态 countNum 点击数量
 * @param countDown {String} 倒计时时间
 * @param payWayCode {String} 支付方式Code, LegendTrading 根据此值 展示文案;
 */

export default {
  name: "confirm-pay-my",
  props: {
    disabled: {
      type: Boolean,
      default: null,
    },
    buttonData: {
      type: Object,
      default: null,
    },
    countDown: {
      type: String,
      default: null,
    },
    payWayCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      //按钮文案
      buttonName: "nav.ConfirmPayment",
      newButtonData: {},
    };
  },
  computed: {
    showCountDown() {
      if (this.countDown) {
        if (["53001", "53002", "53003", "53004"].includes(this.payWayCode)) {
          return this.minutesToHHMMSS(this.countDown);
        } else {
          return this.countDown;
        }
      } else {
        return "";
      }
    },
  },
  watch: {
    buttonData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.confirmSuccess === true) {
          if (["53001", "53002", "53003", "53004"].includes(this.payWayCode)) {
            this.buttonName = "nav.routerName_creditCardConfig";
          } else {
            this.buttonName = "nav.queryOderState";
          }

          this.buttonData.loading = false;
        } else {
          this.buttonName = "nav.ConfirmPayment";
        }
      },
    },
  },
  methods: {
    minutesToHHMMSS(countDown) {
      let [original_minute, original_second] = countDown.split(":");
      const hours = Math.floor(original_minute / 60);
      const mins = original_minute % 60;
      const formattedHours = String(hours).padStart(2, "0");
      const formattedMins = String(mins).padStart(2, "0");
      return `${formattedHours}:${formattedMins}:${original_second}`;
    },
    submit() {
      this.buttonData.countNum += 1;

      if (this.buttonData.countNum === 1 && !this.buttonData.confirmSuccess) {
        this.buttonData.loading = true;
      }

      //确认过再次点击 - 弹框确认
      if (this.buttonData.confirmSuccess === true && !this.buttonData.loading) {
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
