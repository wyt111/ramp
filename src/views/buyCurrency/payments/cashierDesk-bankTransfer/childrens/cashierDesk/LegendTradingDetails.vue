<template>
  <div class="ngn-content">
    <div class="bottom_left"></div>
    <div class="line line1">
      <div class="number">1</div>
      <div class="con">{{ $t("ngnPayment.title2") }}</div>
    </div>
    <div class="content">
      <div class="subtitle">
        {{ $t("legendTrading_cashierDesk.account_details") }}
      </div>
      <LegendTradingDetailsLineContent
        v-for="item in accountDetails"
        :pay-order-info="payOrderInfo"
        :label-key="item"
        :key="item"
      />
      <div class="subtitle">Bank details</div>
      <LegendTradingDetailsLineContent
        v-for="item in bankDetails"
        :pay-order-info="payOrderInfo"
        :label-key="item"
        :key="item"
      />
    </div>
    <div
      class="content"
      v-if="referenceCode.length && payOrderInfo['reference_code']"
    >
      <LegendTradingDetailsLineContent
        class="line_content2"
        v-for="item in referenceCode"
        :pay-order-info="payOrderInfo"
        :label-key="item"
        :key="item"
      />
    </div>
    <div class="line line2">
      <div class="number">2</div>
      <div class="con" v-if="payWayCode === '53004'">
        {{ $t("legendTrading_cashierDesk.after_the_confirmation_GBP") }}
      </div>
      <div class="con" v-else-if="payWayCode === '53003'">
        {{ $t("legendTrading_cashierDesk.after_the_confirmation", ["1-2"]) }}
      </div>
      <div class="con" v-else>
        {{ $t("legendTrading_cashierDesk.after_the_confirmation", ["3-5"]) }}
      </div>
    </div>
  </div>
</template>

<script>
import LegendTradingDetailsLineContent from "./LegendTradingDetailsLineContent.vue";

export default {
  name: "LegendTradingDetails",
  components: {
    LegendTradingDetailsLineContent,
  },
  props: {
    payOrderInfo: {
      default: () => {
        return {};
      },
      required: true,
      type: Object,
    },
    payWayCode: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      accountDetails: [],
      bankDetails: [],
      referenceCode: false,
    };
  },
  mounted() {
    if (this.payWayCode === "53001") {
      this.accountDetails = ["Account Holder Name", "Account Number"];
      this.bankDetails = ["Routing Number / ABA Number"];
      this.referenceCode = [];
    } else if (this.payWayCode === "53002") {
      this.accountDetails = [
        "Account Holder Name",
        "Account Holder Address",
        "Account Number",
      ];
      this.bankDetails = [
        "Bank Name",
        "Bank Country",
        "Bank address",
        "Bank SWIFT",
        "SWIFT BIC",
        "Routing Number / ABA Number",
      ];
      this.referenceCode = ["reference_code"];
    } else if (this.payWayCode === "53003") {
      this.accountDetails = [
        "IBAN",
        "Account Holder Name",
        "Account Holder Address",
        "Account Number",
        "SWIFT BIC",
      ];
      this.bankDetails = ["Bank Name", "Bank Country", "Bank address"];
      this.referenceCode = ["reference_code"];
    } else if (this.payWayCode === "53004") {
      this.accountDetails = [
        "Sort Code",
        "Account Number",
        "IBAN",
        "Account Holder Name",
        "Account Holder Address",
        "BIC",
      ];
      this.bankDetails = ["Bank Name", "Bank Country", "Bank address"];
      this.referenceCode = ["reference_code"];
    } else if (this.payWayCode === "60001") {
      // todo
    } else if (this.payWayCode === "60002") {
      // todo
    }
  },
  methods: {},
  destroyed() {},
};
</script>

<style lang="scss" scoped>
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
</style>
