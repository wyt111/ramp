<template>
  <div id="pixPay-error">
    <div class="pixPay-error-logo">
      <img src="@/assets/images/pixPay-error.png" alt />
    </div>
    <div class="pixPay-error-info">
      <div class="content">
        {{ $t("kycError_countryCheck.tips") }}
      </div>
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
import errorMixin from "@/views/kycResult/errorMixin.js";

export default {
  mixins: [errorMixin],

  name: "ErrorCountryCheck",
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
    padding: 0.12rem 0.16rem 0.2rem;
    z-index: 999;
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
