<template>
  <div id="kycMessageBox">
    <div class="kycMessageBox-content">
      <div class="kycMessageBox-top">
        <!-- 二次确认文案 -->
        <p class="tipsText">
          Due to your payment amount exceeding the current limit now, you need
          to pass the Lv.2 Verification.
        </p>
        <!-- {{ $t('payConfig_components.completed') }} -->
        <!-- 二次确认按钮 -->
        <footer @click="closeView" class="footer_confirmOrder">
          <button @click="goLv2">
            {{ $t("nav.Confirm") }}
          </button>
          <button>
            {{ $t("sellOrderFonts.Sellorder_ButtonNot") }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * kyc二次确认弹框
 */

export default {
  name: "kycMessageBox",
  props: {
    showName: {
      type: String,
      default: null,
    },
  },
  methods: {
    closeView() {
      this.$parent.kyc_tipsState = false;
    },
    goLv2() {
      this.$parent.kyc_tipsState = false;
      this.$store.commit("userInfo/set_kycInfo_kycTips", 2);
      this.$parent.kycVerState = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
#kycMessageBox {
  z-index: 9;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.16rem;

  .kycMessageBox-content {
    background: #ffffff;
    border-radius: 0.18rem;
    backdrop-filter: blur(3px);
    .kycMessageBox-top {
      padding: 0.32rem 0.16rem;
      min-width: 3.5rem;
      max-width: 350px;

      .title {
        font-size: 0.21rem;
        font-family: Semibold;
        font-weight: 600;
        color: #6e7687;
        text-align: center;
      }
      .tipsText {
        font-size: 0.16rem;
        font-family: Regular;
        font-weight: 400;
        color: #6e7687;
        line-height: 0.2rem;
        word-spacing: 0.02rem;
        text-align: center;
        margin-top: 0.08rem;
      }
    }
    footer {
      margin-top: 0.16rem;
      button {
        width: 100%;
        height: 0.58rem;
        background: linear-gradient(88.06deg, #0059da 0%, #1bb2f2 100%);
        border-radius: 0.29rem;
        font-size: 0.17rem;
        font-family: Semibold;
        font-weight: 600;
        color: #ffffff;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border: none;
        position: relative;
        .rightIcon {
          width: 0.24rem;
          margin-left: 0.12rem;
        }
      }
      .goHomeStyle {
        margin-right: 0.13rem;
        color: #252830;
        background: #ffffff;
        border: 1px solid #d9d9d9;
      }
    }
    .footer_confirmOrder {
      display: flex;
      justify-content: space-between;
      button {
        width: 1.5rem;
        font-size: 0.16rem;
        height: 0.5rem;
      }
      button:last-child {
        background: #ffffff;
        border: 1px solid #d9d9d9;
        border-radius: 0.25rem;
        color: #252830;
        font-size: 0.16rem;
      }
    }
    .bahtTitle {
      font-family: Regular;
      font-weight: 400;
      font-size: 0.16rem;
      line-height: 0.24rem;
      text-align: center;
      color: #6e7687;
    }
    .bahtFooter {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.32rem;
    }
  }
}

@media (max-width: 791px) {
  #kycMessageBox {
    border-radius: 0;
  }
}
</style>
