<template>
  <div class="accounts-disabled-container">
    <div class="accounts-disabled-logo">
      <img src="@/assets/images/accountsDisabled.png" alt />
    </div>
    <div class="accounts-disabled-info">
      <div class="title">{{ $t("accountDisabled.title") }}</div>
      <div class="content">{{ $t("accountDisabled.content") }}</div>
    </div>
    <div class="footer-button">
      <button class="continue" @click="goLearnMore">
        {{ $t("accountDisabled.buttonText") }}
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
/**
 * 账号禁用页面
 */

export default {
  name: "accountsDisabled",
  data() {
    return {};
  },
  methods: {
    goLearnMore() {
      window.location = "https://alchemypay.org/privacy-policy/";
    },
  },
};
</script>
<style lang="scss" scoped>
.accounts-disabled-container {
  .accounts-disabled-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.6rem;
    margin-bottom: 0.24rem;
    img {
      width: 1.6rem;
      height: 1.6rem;
      // object-fit: cover;
    }
  }
  .accounts-disabled-info {
    display: flex;
    flex-direction: column;
    font-style: normal;
    .title {
      font-family: Semibold;
      font-weight: 700;
      font-size: 0.2rem;
      line-height: 0.24rem;
      text-align: center;
      color: #252830;
      margin-bottom: 0.08rem;
    }
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
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    z-index: 999;
    padding: 0.08rem 0.16rem 0rem;
    // bottom: 0.2rem;
    .continue {
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
