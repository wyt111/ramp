<template>
  <div id="payMethodInfo" v-if="payMethodWayName">
    <!-- 确认订单支付方式信息 -->
    <div class="payMethodInfo-title">
      {{ $t("PayMethodInfo_components.title") }}
    </div>
    <div class="content">
      <div class="content-left">
        <p class="title">{{ $t("PayMethodInfo_components.title2") }}</p>
        <p class="paymentWay">
          {{ payMethodWayName.name }}
          <span class="card-number" v-if="payMethodInfo.payWayCode === '10001'"
            >****{{ cardNumber }}</span
          >
        </p>
      </div>
      <div class="content-right">
        <p class="paymentType">
          <template
            v-if="payMethodWayName.type && payMethodWayName.type !== ''"
            >{{ $t(`buyPayWay.${payMethodWayName.type}`) }}</template
          >
        </p>
        <p
          class="payMethod-icon"
          v-if="payMethodWayName.icon && payMethodWayName.icon !== ''"
        >
          <img
            :src="
              require('@/assets/images/paymentIcon/' + payMethodWayName.icon)
            "
            alt=""
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 确认支付页 - 支付方式信息
 */
import { mapState } from "vuex";
import paymentMethods from "@/assets/json/paymentMethods.json";
import valid from "card-validator";
import { AES_Decrypt } from "@/utils/encryp";

export default {
  name: "PayMethodInfo",
  computed: {
    ...mapState("buyPayments", {
      //支付方式信息
      process_payMethodInfo: (state) => state.payMethodInfo,
    }),
    payMethodInfo() {
      return this.process_payMethodInfo;
    },
    //脱敏信用卡号
    cardNumber() {
      if (
        this.payMethodInfo.cardNumber &&
        this.payMethodInfo.cardNumber !== ""
      ) {
        let card = this.payMethodInfo.cardNumber;
        try {
          card = AES_Decrypt(card);
        } catch (e) {
          card = this.payMethodInfo.cardNumber;
        }
        if (card === "") {
          card = this.payMethodInfo.cardNumber;
        }

        return card && card !== "" ? card.substring(card.length - 4) : "";
      }
      return "";
    },
    payMethodWayName() {
      //引入支付方式列表
      let paymentMethodsList = JSON.parse(JSON.stringify(paymentMethods));
      let paymentMethodsInfo = paymentMethodsList.filter((item) => {
        //针对印尼选择银行 bank Transfer
        if (
          this.payMethodInfo.payWayCode === "10003" &&
          item.payWayCode === "10003"
        ) {
          return item.bankCode === this.payMethodInfo.bankCode;
        }
        //针对卡支付做出调整
        if (
          this.payMethodInfo.payWayCode === "10001" &&
          item.payWayCode === "10001"
        ) {
          let validObject = valid.number(this.payMethodInfo.cardNumber);
          if (
            validObject.isValid &&
            ["mastercard", "visa", "mir", "diners-club", "discover"].includes(
              validObject.card.type
            )
          ) {
            return item.cardType === validObject.card.type ? item.name : "";
          }
        }
        return item.payWayCode === this.payMethodInfo.payWayCode;
      })[0];
      return paymentMethodsInfo;
    },
  },
};
</script>

<style lang="scss" scoped>
#payMethodInfo {
  margin-bottom: 0.24rem;
  .payMethodInfo-title {
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 700;
    font-size: 0.18rem;
    line-height: 0.22rem;
    color: #252830;
    margin-bottom: 0.08rem;
  }
  .content {
    background: #f4f8fb;
    border: 1px solid #e6e8eb;
    border-radius: 0.06rem;
    padding: 0.12rem;
    display: flex;
    justify-content: space-between;
    position: relative;

    .content-left {
      .title {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.14rem;
        line-height: 0.18rem;
        color: #5d636d;
        margin-bottom: 0.24rem;
      }

      .paymentWay {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.2rem;
        color: #252830;
        display: flex;
        align-items: center;

        .card-number {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.13rem;
          line-height: 0.16rem;
          color: #848b96;
          padding-left: 0.07rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .content-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .paymentType {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.14rem;
        line-height: 0.18rem;
        color: #0059da;
        min-height: 0.18rem;
        margin-bottom: 0.22rem;
        text-align: right;
      }
      .payMethod-icon {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 0.24rem;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 0 0 0.5px #dbdee3;
        img {
          height: 100%;
        }
      }
    }

    &:after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.48rem;
      height: 0.01rem;
      background: #e6e8eb;
    }
  }
}
</style>
