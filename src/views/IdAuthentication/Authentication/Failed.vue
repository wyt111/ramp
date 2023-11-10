<template>
  <div class="id-authentication-failed">
    <div class="status">
      <img class="img" src="@/assets/images/paymentResult/6.svg" alt="" />
    </div>
    <div class="p1">
      {{ $t("legendTrading_IdAuthentication.failed.status") }}
    </div>
    <div class="p2">{{ $t("legendTrading_IdAuthentication.failed.tips") }}</div>

    <footer class="footer">
      <button class="continue" @click="goBack">
        {{ backText }}
        <img
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
        />
      </button>
    </footer>
  </div>
</template>
<script>
import errorMixin from "@/views/kycResult/errorMixin.js";

export default {
  mixins: [errorMixin],
  name: "IdAuthenticationFailed",
};
</script>

<style lang="scss" scoped>
.id-authentication-failed {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  padding-top: 0.18rem;
  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.27rem;
    .img {
      width: 1.6rem;
    }
  }

  .p1 {
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 700;
    font-size: 0.2rem;
    line-height: 0.24rem;
    text-align: center;
    color: #252830;
    margin-bottom: 0.08rem;
  }
  .p2 {
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 0.14rem;
    line-height: 0.18rem;
    text-align: center;
    color: #5d636d;
    width: 3.15rem;
  }
  .footer {
    background: #ffffff;
    padding: 0.08rem 0 0;
    width: 100%;
    margin-top: auto;

    .continue {
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
    }
  }
}
</style>
