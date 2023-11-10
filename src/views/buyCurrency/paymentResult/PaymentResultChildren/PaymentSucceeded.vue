<template>
  <div class="payment-succeeded-container">
    <div class="status">
      <div class="row-1" :class="{ 'deposit-success': orderStatus == 5 }">
        <template v-if="orderStatus != 5">
          <img class="img" src="@/assets/images/paymentResult/1.png" alt="" />
          <span class="text" v-if="orderStatus == 1">{{
            $t("paymentResult.paymentSucceeded.crypto_wait")
          }}</span>
          <span class="text" v-else>
            {{
              ["en-US", "zh-HK"].includes($i18n.locale)
                ? $t("paymentResult.paymentSucceeded.crypto_sending")
                : "Sending Crypto"
            }}
          </span>
        </template>
        <template v-else-if="orderStatus == 5">
          <img class="img" src="@/assets/images/paymentResult/4.png" alt="" />
          <span class="text">
            {{
              ["en-US", "zh-HK"].includes($i18n.locale)
                ? $t("paymentResult.paymentSucceeded.deposit_successed")
                : "Deposit Successful"
            }}
          </span>
        </template>
      </div>
      <div class="row-2">
        <img
          v-if="orderStatus == 1"
          src="@/assets/images/paymentResult/3.png"
          alt=""
          class="img img-loading"
        />
        <img
          v-else
          src="@/assets/images/paymentResult/2.svg"
          alt=""
          class="img"
        />
        <span class="text">
          {{
            ["en-US", "zh-HK"].includes($i18n.locale)
              ? $t("paymentResult.paymentSucceeded.payment_successed")
              : "Payment succeeded"
          }}
        </span>
      </div>
      <div class="row-2">
        <img
          v-if="orderStatus != 5"
          src="@/assets/images/paymentResult/3.png"
          alt=""
          class="img img-loading"
        />
        <img
          v-else-if="orderStatus == 5"
          src="@/assets/images/paymentResult/2.svg"
          alt=""
          class="img"
        />
        <span class="text">
          <span v-if="orderStatus === 5">
            {{
              ["en-US", "zh-HK"].includes($i18n.locale)
                ? $t("paymentResult.paymentSucceeded.has_been_sent", [
                    orderStatus == 1 || orderStatus == 2 || orderStatus == 3
                      ? ""
                      : detailsParameters.total,
                    detailsParameters.cryptocurrency,
                  ])
                : (orderStatus == 1 || orderStatus == 2 || orderStatus == 3
                    ? ""
                    : detailsParameters.total) +
                  " " +
                  detailsParameters.cryptocurrency +
                  " " +
                  "has been sent to your address"
            }}
          </span>
          <span v-else>
            {{
              ["en-US", "zh-HK"].includes($i18n.locale)
                ? $t("paymentResult.paymentSucceeded.is_been_sent", [
                    orderStatus == 2 || orderStatus == 3
                      ? ""
                      : detailsParameters.total,
                    detailsParameters.cryptocurrency,
                  ])
                : (orderStatus == 2 || orderStatus == 3
                    ? ""
                    : detailsParameters.total) +
                  " " +
                  detailsParameters.cryptocurrency +
                  " " +
                  "is being sent to your address"
            }}
          </span>
        </span>
      </div>
    </div>
    <div class="order-info">
      <div class="item">
        <div class="label">
          {{ $t("paymentResult.paymentSucceeded.quantity") }}
        </div>
        <div class="val">
          <template
            v-if="orderStatus == 1 || orderStatus == 2 || orderStatus == 3"
          >
            <span class="text"> -- </span>
          </template>
          <template v-else>
            <img :src="detailsParameters.cryptoIcon" alt="" class="coin" />
            <span class="text"
              >{{ detailsParameters.total }}
              {{ detailsParameters.cryptocurrency }}</span
            >
          </template>
        </div>
      </div>
      <div class="item">
        <div class="label">
          {{ $t("paymentResult.paymentSucceeded.network") }}
        </div>
        <div class="val">
          <span class="text">{{ detailsParameters.network }}</span>
        </div>
      </div>
      <div class="item">
        <div class="label">
          {{ $t("paymentResult.paymentSucceeded.order_id") }}
        </div>
        <div class="val">
          <span class="text">
            {{ detailsParameters.orderNo }}
          </span>
          <copy-img
            class="copy"
            v-clipboard:copy="detailsParameters.orderNo"
            v-clipboard:success="copySuccess"
            v-clipboard:error="copyError"
          />
        </div>
      </div>
      <div class="item" v-if="orderStatus == 5">
        <div class="label">
          {{ $t("paymentResult.paymentSucceeded.hx_id") }}
        </div>
        <div class="val">
          <span class="text">
            {{ detailsParameters.txId }}
          </span>
          <copy-img
            class="copy"
            v-clipboard:copy="detailsParameters.txId"
            v-clipboard:success="copySuccess"
            v-clipboard:error="copyError"
          />
        </div>
      </div>
    </div>
    <div class="tips">
      <div class="p1">
        {{
          ["en-US", "zh-HK"].includes($i18n.locale)
            ? $t("paymentResult.paymentSucceeded.notify_you_email")
            : "We will be sending you a notification to:"
        }}
      </div>
      <div class="p2">{{ email }}</div>
    </div>
  </div>
</template>
<script>
import { AES_Decrypt } from "@/utils/encryp";

export default {
  name: "PaymentSucceeded",
  components: {},
  props: ["orderStatus", "detailsParameters"],
  data() {
    return {
      email: "",
    };
  },
  computed: {},
  mounted() {
    localStorage.getItem("email")
      ? (this.email = AES_Decrypt(localStorage.getItem("email")))
      : (this.email = "");
  },
  methods: {
    copySuccess() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
    copyError() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
  },
  filters: {},
};
</script>
<style lang="scss" scoped>
.payment-succeeded-container {
  padding-top: 0.18rem;
  .status {
    margin-bottom: 0.24rem;
    .row-1 {
      display: flex;
      align-items: center;
      margin-bottom: 0.16rem;

      .img {
        width: 0.24rem;
        margin-right: 0.08rem;
      }
      .text {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 700;
        font-size: 0.2rem;
        line-height: 0.24rem;
        color: #0260e7;
      }
      &.deposit-success {
        .text {
          color: #00b42a;
        }
      }
    }
    .row-2 {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 0.12rem;
      }

      .img {
        width: 0.16rem;
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
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.14rem;
        line-height: 0.14rem;
        color: #252830;
      }
    }
  }
  .order-info {
    background: #f4f8fb;
    border: 1px solid #e6e8eb;
    border-radius: 0.06rem;
    overflow: hidden;
    margin-bottom: 0.08rem;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.12rem;
      &:not(:last-child) {
        border-bottom: 1px solid #e6e8eb;
      }
      .label {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.12rem;
        line-height: 0.14rem;
        color: #5d636d;
      }
      .val {
        display: flex;
        align-items: center;
        .coin {
          width: 0.16rem;
          margin-right: 0.04rem;
        }
        .copy {
          width: 0.16rem;
          margin-left: 0.08rem;
          cursor: pointer;
        }
        .text {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.12rem;
          line-height: 0.14rem;
          text-align: right;
          color: #252830;
          max-width: 2.33rem;
          word-break: break-all;
          text-align: left;
        }
      }
    }
  }
  .tips {
    background: rgba(2, 96, 231, 0.1);
    border: 1px solid rgba(2, 96, 231, 0.2);
    border-radius: 0.06rem;
    padding: 0.12rem 0.14rem 0.12rem 0.42rem;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      width: 0.24rem;
      height: 0.24rem;
      top: 0.15rem;
      left: 0.12rem;
      background: url("~@/assets/images/paymentResult/7.svg") center center;
      background-size: 0.24rem 0.24rem;
    }

    .p1 {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.14rem;
      color: #5d636d;
      margin-bottom: 0.02rem;
    }
    .p2 {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.14rem;
      color: #0059da;
    }
  }
}
</style>
