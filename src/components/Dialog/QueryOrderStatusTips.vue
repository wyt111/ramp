<template>
  <div id="QueryOrderStatusTips" @click="closeView">
    <div class="QueryOrderStatusTips-content">
      <div
        class="QueryOrderStatusTips-top"
        v-if="buyOrderStatus !== 'forbidden'"
      >
        <!-- //二次确认弹出框 -->
        <p class="tipsText" v-if="buyOrderStatus == ''">
          {{ $t("payConfig_components.completed") }}
        </p>
        <!-- 超时文案 -->
        <p class="tipsText" v-if="buyOrderStatus == 'timeOut'">
          {{ $t("payConfig_components.timeorder") }}
        </p>
        <!-- 返回弹出框 -->
        <p class="tipsText" v-if="buyOrderStatus == 'backHome'">
          {{ $t("payConfig_components.checkout") }}
        </p>
        <!-- 泰铢支付 -->
        <p class="tipsText" v-if="buyOrderStatus === 'baht'">
          {{ $t("payConfig_components.title_THB") }}
        </p>
        <!-- 登陆限制文案 -->
        <p class="tipsText" v-if="buyOrderStatus === 'login'">
          <span>{{ $t("nav.accountTraded") }}</span>
        </p>
        <!-- 卖币退款 -->
        <p class="tipsText" v-if="buyOrderStatus === 'refund'">
          <span>{{ $t("payConfig_components.refundError") }}</span>
        </p>

        <footer
          class="footer_confirmOrder single"
          v-if="buyOrderStatus === 'login'"
          @click="closeView"
        >
          <button>{{ $t("nav.Confirm") }}</button>
        </footer>
        <footer class="footer_confirmOrder" v-if="buyOrderStatus === 'baht'">
          <button @click="backGoHome">
            {{ $t("payConfig_components.button_timeOut1") }}
          </button>
          <button @click="goHistory">
            {{ $t("payConfig_components.button_THB") }}
          </button>
        </footer>
        <!-- 返回首页
          按钮 -->
        <footer v-if="buyOrderStatus == 'backHome'" class="footer_confirmOrder">
          <button @click="closeView">
            {{ $t("nav.Continue") }}
          </button>
          <button @click="backGoHome">
            {{ $t("payConfig_components.buttonLeave") }}
          </button>
        </footer>
        <!-- 二次确认按钮 -->
        <footer v-if="buyOrderStatus == ''" class="footer_confirmOrder">
          <button @click="closeView">
            {{ $t("sellOrderFonts.Sellorder_ButtonNot") }}
          </button>
          <button @click="goHistory">
            {{ $t("nav.Confirm") }}
          </button>
        </footer>
        <!-- 超时按钮 -->
        <footer
          class="footer_confirmOrder single"
          @click="backGoHome"
          v-if="buyOrderStatus == 'timeOut'"
        >
          <button>
            {{ $t("payConfig_components.button_timeOut") }}
            <img
              class="rightIcon"
              src="../../assets/images/button-right-icon.svg"
              alt=""
            />
          </button>
        </footer>
        <!-- 卖币退款 -->
        <footer
          class="footer_confirmOrder single"
          v-if="buyOrderStatus === 'refund'"
        >
          <button @click="goSellHistory">
            {{ $t("nav.Confirm") }}
          </button>
        </footer>
      </div>
      <div v-else class="QueryOrderStatusTips-top tip-prohibit">
        <!-- <p>Dear valued customer,</p> -->
        <p class="tip-content">
          As Easter has arrived and banks are on holiday, we would like to
          inform you that our OFF RAMP service will be temporarily suspended on
          April 8th and will resume on April 10th.
        </p>
        <p class="tip-content">Thank you for your continued support.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  /**
   * 确认支付后 查询支付状态提示框
   */
  name: "QueryOrderStatusTips",
  props: {
    buyOrderStatus: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tiemOut: null,
      isShowFooterButton: false,
    };
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
    }),
    ...mapState("sellPayments", {
      sellOrderNo: (state) => state.orderNo,
    }),
  },
  methods: {
    closeView() {
      this.$parent.tipsState = false;
    },
    backGoHome() {
      this.$parent.tipsState = false;
      this.$parent.routerViewState = true;
      this.$router.replace("/");
      clearTimeout(this.tiemOut);
      this.tiemOut = setTimeout(() => {
        this.$parent.$refs.routerView.menuState = false;
      });
    },
    goHistory() {
      this.$parent.tipsState = false;
      this.$router.replace(`/tradeHistory-BuyDetails?orderId=${this.orderNo}`);
    },
    goSellHistory() {
      this.$parent.tipsState = false;
      this.$router.replace(`/tradeHistory-details?orderId=${this.sellOrderNo}`);
    },
  },
};
</script>

<style lang="scss" scoped>
#QueryOrderStatusTips {
  z-index: 9999;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.16rem;

  .QueryOrderStatusTips-content {
    background: #ffffff;
    border-radius: 0.08rem;
    overflow: hidden;
    width: 100%;
    .QueryOrderStatusTips-top {
      padding: 0.24rem 0 0;
      .tipsText {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.16rem;
        line-height: 0.24rem;
        text-align: center;
        color: #252830;
        padding: 0 0.12rem;
      }
    }

    .footer_confirmOrder {
      display: flex;
      align-items: center;
      margin-top: 0.24rem;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        box-shadow: 0 0 0 0.25px #e6e8eb;
      }
      &:after {
        content: "";
        position: absolute;
        height: 100%;
        left: 50%;
        top: 0;
        box-shadow: 0 0 0 0.25px #e6e8eb;
      }

      button {
        height: 0.48rem;
        width: 50%;
        border: 0;
        border-radius: 0;
        background: #fff;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        color: #5d636d;

        cursor: pointer;
        &:hover {
          background: #f5f5f5;
        }
        &:active {
          background: #ededed;
        }

        & + button {
          color: #0059da;
          font-weight: 500;
        }
      }

      &.single {
        &:after {
          display: none;
        }
        button {
          width: 100%;
          color: #0059da;
          font-weight: 500;
        }
      }
    }
  }
  .tip-prohibit {
    padding: 0.24rem 0.12rem !important;
    .tip-content {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.16rem;
      line-height: 0.24rem;
      color: #252830;
      margin-bottom: 0.12rem;
    }
  }
}

@media (max-width: 791px) {
  #QueryOrderStatusTips {
    border-radius: 0;
  }
}
</style>
