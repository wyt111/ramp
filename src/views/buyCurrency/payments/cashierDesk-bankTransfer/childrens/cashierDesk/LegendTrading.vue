<template>
  <div id="NGN" class="ngn-container">
    <div class="ngn-Payment-amount">
      <div class="title">{{ $t("mexPayment.PleasePay") }}</div>
      <div class="amount">
        <p v-if="['53003', '53004'].includes(payMethodInfo.payWayCode)">
          {{ payAmount }} <span class="symbol_icon">{{ symbol }}</span>
        </p>
        <p v-else>
          <span class="symbol_icon">{{ symbol }}</span> {{ payAmount }}
        </p>
      </div>
    </div>
    <div class="ngn_top_title1">
      {{ $t("phpPayment.Incorrect") }}
    </div>
    <LegendTradingDetails
      :payOrderInfo="payOrderInfo"
      :payWayCode="payMethodInfo.payWayCode"
    />
  </div>
</template>

<script>
import cashierDeskMixin from "./cashierDeskMixin.js";
import LegendTradingDetails from "./LegendTradingDetails.vue";

export default {
  mixins: [cashierDeskMixin],
  name: "LegendTrading",
  components: {
    LegendTradingDetails,
  },
  data() {
    return {
      payResultInfo: {
        // 订单倒计时信息
        paymentCountDown: null,
        paymentCountDownNum: 0,
        paymentCountDownMinute: "00:00",
        paystateTimeOut: null,
      },
    };
  },
  mounted() {
    this.scrollToTop();
  },
  methods: {
    scrollToTop() {
      const contentView = document.querySelector(".contentView");
      const currentScroll = contentView.scrollTop;
      if (currentScroll > 0) {
        contentView.scrollTop = 0;
      }
    },
  },
  destroyed() {
    this.payResultInfo = {
      // 订单倒计时信息
      paymentCountDown: null,
      paymentCountDownNum: 0,
      paymentCountDownMinute: "00:00",
      paystateTimeOut: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.ngn-container {
  .ngn-Payment-amount {
    padding-bottom: 0.24rem;
    margin-bottom: 0.16rem;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: 0 0 0 0.25px #dbdee3;
    }

    .title {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.17rem;
      color: #5d636d;
      margin-bottom: 0.06rem;
    }
    .amount {
      font-family: "HarmonyOS Sans";
      font-style: normal;
      font-weight: 700;
      font-size: 0.32rem;
      line-height: 0.38rem;
      color: #252830;
      span {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.2rem;
        line-height: 0.24rem;
        color: #252830;
      }
    }
  }
  .ngn_top_title1 {
    border: 1px solid rgba(255, 125, 0, 0.15);
    background: rgba(255, 125, 0, 0.05);
    border-radius: 0.06rem;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 0.11rem;
    line-height: 0.15rem;
    color: #252830;
    padding: 0.08rem;
    margin-bottom: 0.16rem;
  }
  .ngn-content {
    width: 100%;
    overflow: hidden;
    position: relative;
    //padding-left: .08rem;
    .bottom_left {
      height: 100%;
      opacity: 0.4;
      border-left: 1px dashed #0059da;
      position: absolute;
      left: 0.08rem;
    }
    .line {
      display: flex;
      .number {
        min-width: 0.16rem;
        height: 0.16rem;
        border-radius: 50%;
        background: #0059da;
        font-family: "HarmonyOS Sans";
        font-style: normal;
        font-weight: 500;
        font-size: 0.1rem;
        line-height: 0.12rem;
        color: #ffffff;
        margin-right: 0.12rem;
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .con {
        max-width: 3rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.18rem;
        color: #252830;

        span {
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 700;
          color: #0059da;
        }
      }
      &.line1 {
        margin-bottom: 0.21rem;
      }

      &.line2 {
        margin-top: 0.2rem;
        .number {
          // border: 1.5px solid #ff7d00;
          // background: #fff;
          // color: #ff7d00;
        }
        .con {
          position: relative;
          padding-bottom: 0.12rem;

          &:before {
            content: "";
            position: absolute;
            left: -0.28rem;
            top: 0;
            bottom: 0;
            width: 0.28rem;
            background-color: #fff;
          }
        }
      }
    }
    .content {
      width: 3.15rem;
      background: #f4f8fb;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      margin-left: 0.28rem;
      padding: 0.2rem 0.12rem;
      margin-bottom: 0.08rem;
      .subtitle {
        color: #252830;
        font-family: SF Pro Display;
        font-size: 0.13rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.14rem;
        margin-bottom: 0.16rem;
      }
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
    }
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0.16rem 0rem;
    z-index: 999;
  }
}
</style>
