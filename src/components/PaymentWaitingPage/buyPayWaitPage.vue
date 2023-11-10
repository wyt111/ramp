<template>
  <div id="buyPayWaitPage">
    <div class="content">
      <div class="view1">
        <div class="line1">
          <img src="@/assets/images/buyPayWaitPage/3.png" alt="" />
        </div>
        <div class="line2"></div>
        <div class="line3">
          <img src="@/assets/images/buyPayWaitPage/4.png" alt="" />
        </div>
      </div>
      <div class="title">
        {{ $t("buypayWait.title") }}
      </div>
      <div class="tips">
        <p>{{ $t("buypayWait.note") }}</p>
        <p>
          {{ $t("buypayWait.tips") }}
        </p>
      </div>
      <div class="pay-btn-view">
        <a :href="url" target="_blank">
          <button>{{ $t("buypayWait.btn_text") }}</button>
          <div class="transparentLayer"></div>
        </a>
        <div class="tips-icon">
          <img src="@/assets/images/buyPayWaitPage/5.gif" alt="" />
        </div>
      </div>
    </div>
    <footer>
      <powered-by />
    </footer>
  </div>
</template>

<script>
/**
 * 支付后跳转第三方收银台本平台等待页
 */

export default {
  name: "buyPayWaitPage",
  props: ["url"],
};
</script>

<style lang="scss" scoped>
#buyPayWaitPage {
  display: flex;
  flex-direction: column;
  //padding: 0.23rem 0.16rem 0.89rem 0.16rem;
  padding: 0.23rem 0 0 0;

  footer {
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .view1 {
    display: flex;
    align-items: center;
    justify-content: center;
    & > :first-child,
    :last-child {
      width: 0.5rem;
      height: 0.5rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    & > :nth-of-type(2) {
      width: 0.53rem;
      //height: 1px;
      border: 1px dashed rgba(0, 0, 0, 0.3);
    }
  }
  .title {
    margin-top: 0.24rem;
    color: #5d636d;
    text-align: center;
    font-family: SF Pro Display;
    font-size: 0.14rem;
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
  }
  .tips {
    margin-top: 0.4rem;
    width: 100%;
    min-height: 0.85rem;
    padding: 0.15rem 0.2rem;
    background: rgba(255, 125, 0, 0.05);
    border: 1px solid rgba(255, 125, 0, 0.15);
    border-radius: 0.06rem;
    color: #252830;
    font-family: SF Pro Display;
    font-size: 0.14rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.15rem;
    & > p:last-child {
      margin-top: 0.06rem;
      color: #252830;
      font-family: SF Pro Display;
      font-size: 0.12rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.17rem;
    }
  }
  .pay-btn-view {
    margin-top: 0.57rem;
    position: relative;
    button {
      width: 100%;
      height: 0.48rem;
      border-radius: 0.06rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.16rem;
      line-height: 0.19rem;
      text-align: center;
      color: #fff;
      background: #0059da;
      border: 0;

      opacity: 1;
      cursor: pointer;
      &:hover {
        background: #0052c9;
      }
      &:active {
        background: #004bb7;
      }
    }

    .tips-icon {
      width: 1.5rem;
      position: absolute;
      top: 0;
      left: 45%;
      z-index: 9;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .transparentLayer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0);
      z-index: 10;
      cursor: pointer;
    }
  }
}
</style>
