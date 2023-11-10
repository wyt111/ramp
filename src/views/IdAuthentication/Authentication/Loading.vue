<template>
  <div class="id-authentication-loading">
    <div class="content">
      <div class="rocket">
        <img src="@/assets/images/buyPayWaitPage/1.png" alt="" />
      </div>
      <div class="rotate">
        <img src="@/assets/images/buyPayWaitPage/2.png" alt="" />
      </div>
      <div class="tipsView">
        <div class="tipsView-border"></div>
        <div class="tipsView-text">
          {{ $t("buypayWait.Processing") }}<span class="dotting"></span>
        </div>
        <div class="text-box">
          <div class="p1">
            <img src="@/assets/images/paymentResult/8.png" alt="" class="img" />
            <span class="text">{{
              $t("legendTrading_IdAuthentication.loading.reviewing")
            }}</span>
          </div>
          <div class="p2">
            <img class="img" src="@/assets/images/paymentResult/2.svg" alt="" />
            <span class="text">{{
              $t("legendTrading_IdAuthentication.loading.submitted")
            }}</span>
          </div>
          <div class="p3">
            <img
              class="img img-loading"
              src="@/assets/images/paymentResult/3.png"
              alt=""
            />
            <span class="text">{{
              $t("legendTrading_IdAuthentication.loading.preparing")
            }}</span>
          </div>
          <div class="p4">
            {{ $t("legendTrading_IdAuthentication.loading.tips") }}
          </div>
        </div>
      </div>
    </div>
    <footer class="footer" @click="goBack">
      <p>{{ backText }}</p>
      <powered-by />
    </footer>
  </div>
</template>
<script>
import errorMixin from "@/views/kycResult/errorMixin.js";

export default {
  mixins: [errorMixin],
  name: "IdAuthenticationLoading",
};
</script>

<style lang="scss" scoped>
.id-authentication-loading {
  display: flex;
  flex-direction: column;
  margin-top: -0.24rem;
  padding-bottom: 0.89rem;

  footer {
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0.16rem 0;
    z-index: 999;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    p {
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
      color: #252830;
      border: 1px solid #e6e8eb;

      background: #fff;
      opacity: 1;
      cursor: pointer;
      &:hover {
        border-color: #cbcfd6;
        background: #f5f5f5;
      }
      &:active {
        border-color: #babfc8;
        background: #ededed;
      }
    }
  }
}

.rocket {
  display: flex;
  justify-content: center;
  width: 0.44rem;
  margin: 0.42rem auto 0.2635rem;
  -webkit-animation: bounce-down 3s linear infinite;
  animation: bounce-down 3s linear infinite;
  img {
    width: 100%;
    height: 1.037rem;
  }
}
.rotate {
  width: 1.887rem;
  margin: 0 auto;
  animation: spinningPlanet 6s infinite; //spinningPlanet
  transform-origin: center 50%;
  img {
    width: 100%;
    height: 1.8275rem;
  }
}
.tipsView {
  width: 100%;
  min-height: 2rem;
  margin-top: -1.52rem;
  background: #ffffff;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  z-index: 9;
  position: relative;
  .tipsView-border {
    width: 2.82rem;
    height: 2px;
    margin: 0 auto;
    background-image: linear-gradient(
      135deg,
      rgba(27, 175, 242, 0),
      rgba(60, 11, 255, 1),
      rgba(27, 175, 242, 0)
    );
  }
  .tipsView-text {
    font-family: Regular;
    font-style: normal;
    font-weight: 400;
    font-size: 0.13rem;
    line-height: 0.16rem;
    color: #6e7687;
    text-align: center;
    padding-top: 0.1rem;
    .dotting {
      display: inline-block;
      min-width: 2px;
      min-height: 2px;
      animation: dot 4s infinite step-start both;
    }
  }
  .text-box {
    width: 2.75rem;
    margin: 0.24rem auto 0;
    .p1 {
      display: flex;
      align-items: center;
      margin-bottom: 0.26rem;
      .img {
        width: 0.24rem;
        height: 0.24rem;
        margin-right: 0.03rem;
      }
      .text {
        color: #252830;
        text-align: right;
        font-family: SF Pro Display;
        font-size: 0.2rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
    .p2,
    .p3 {
      display: flex;
      align-items: center;
      margin-bottom: 0.14rem;
      .img {
        width: 0.16rem;
        height: 0.16rem;
        margin-right: 0.06rem;
        &.img-loading {
          animation: spin 1s linear infinite;
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        }
      }
      .text {
        color: #252830;
        font-family: SF Pro Display;
        font-size: 0.14rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.14rem;
      }
    }

    .p4 {
      color: #5d636d;
      font-family: SF Pro Display;
      font-size: 0.14rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.22rem;
      margin-top: 0.26rem;
    }
  }
}

//月球动画
@keyframes spinningPlanet {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

//火箭动画
@-webkit-keyframes bounce-down {
  25% {
    -webkit-transform: translateY(-0.2rem);
  }
  50%,
  100% {
    -webkit-transform: translateY(0);
  }
  75% {
    -webkit-transform: translateY(0.2rem);
  }
}
@keyframes bounce-down {
  25% {
    transform: translateY(-0.2rem);
  }
  50%,
  100% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(0.2rem);
  }
}

//文字...动画
.dotting:before {
  content: "...";
} /* for IE8. 若无需兼容IE8, 此行以及下一行删除*/
.dotting::before {
  content: "";
} /* for IE9+ 覆盖 IE8 */
:root .dotting {
  margin-right: 8px;
} /* for IE9+,FF,CH,OP,SF 占据空间*/
@keyframes dot {
  0% {
    box-shadow: none;
  } /* 0个点 */
  25% {
    box-shadow: 2px 0 currentColor;
  } /* 1个点 */
  50% {
    box-shadow: 2px 0 currentColor, 6px 0 currentColor;
  } /* 2个点 */
  75% {
    box-shadow: 2px 0 currentColor, 6px 0 currentColor, 2px 0 currentColor,
      10px 0 currentColor;
  } /* 3个点 */
}
</style>
