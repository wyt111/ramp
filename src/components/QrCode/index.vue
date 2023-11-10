<template>
  <div id="qrCode">
    <p class="pay-tips1">
      {{ $t("QrCode_components.amount_pay")
      }}<span
        >{{ fiatCurrencyInfo.fiatSymbol }} {{ placeOrderQuery.amount }}</span
      >
      <!--  {{ $t('QrCode_components.title1') }} <span>{{ fiatCurrencyInfo.fiatSymbol }} {{ placeOrderQuery.amount }}</span> {{ $t('QrCode_components.title2') }} -->
    </p>
    <p class="pay-tips2">{{ $t("QrCode_components.title3") }}</p>
    <div class="code-view">
      <div class="code" ref="qrCodeUrl"></div>
      <p class="payWayLogo" v-if="payMethodWayInfo.qrIcon">
        <img
          :src="
            require('@/assets/images/paymentIcon/' + payMethodWayInfo.qrIcon)
          "
          alt=""
        />
      </p>
    </div>
    <!-- 复制 -->
    <div class="copy-view" v-if="copy">
      <button
        class="copyBtn"
        v-clipboard:copy="QRCodeUrl"
        v-clipboard:success="copySuccess"
        v-clipboard:error="copyError"
      >
        {{ $t("QrCode_components.copy") }}
      </button>
    </div>
  </div>
</template>

<script>
/**
 * QR Code二维码模块
 */
import { mapState } from "vuex";
import QRCode from "qrcodejs2";
import paymentMethods from "@/assets/json/paymentMethods.json";

export default {
  name: "QrCode",
  props: ["copy"],
  data() {
    return {
      QRCodeUrl: "",
    };
  },
  computed: {
    ...mapState("buyPayments", {
      placeOrderQuery: (state) => state.placeOrderQuery,
      payMethodInfo: (state) => state.payMethodInfo,
    }),
    ...mapState("cryptoBuyPage", {
      process_fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
    }),
    ...mapState("secondaryBuyPayments", {
      secondary_fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
    }),
    fiatCurrencyInfo() {
      if (this.$route.query.pathHistry === "tradeHistory") {
        return this.secondary_fiatCurrencyInfo;
      }
      return this.process_fiatCurrencyInfo;
    },

    payMethodWayInfo() {
      //引入支付方式列表
      let paymentMethodsList = JSON.parse(JSON.stringify(paymentMethods));
      return paymentMethodsList.filter((item) => {
        //针对印尼选择银行 bank Transfer
        if (this.payMethodInfo.payWayCode === "10003") {
          return item.bankCode === this.payMethodInfo.bankCode;
        }
        return item.payWayCode === this.payMethodInfo.payWayCode;
      })[0];
    },
  },
  methods: {
    /**
     * 生成二维码
     * @param url 生成二维码参数
     */
    generateQRcode(url) {
      this.QRCodeUrl = url;
      this.$nextTick(() => {
        new QRCode(this.$refs.qrCodeUrl, {
          text: url,
          width: 140,
          height: 140,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: 3, //QRCode.CorrectLevel.H
        });
      });
    },
    //复制二维码提示
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
};
</script>

<style lang="scss" scoped>
#qrCode {
  background: #f4f8fb;
  border: 1px solid #e6e8eb;
  border-radius: 0.06rem;
  padding-bottom: 0.28rem;
  overflow: hidden;

  .pay-tips1 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0.52rem;
    background: #008bfb;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 500;
    font-size: 0.16rem;
    line-height: 0.2rem;
    color: #ffffff;
    white-space: nowrap;
    span {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 700;
      font-size: 0.22rem;
      line-height: 0.29rem;
      color: #ffffff;
      margin-left: 0.08rem;
    }
  }
  .pay-tips2 {
    padding: 0.2rem 0.32rem;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 0.13rem;
    line-height: 0.18rem;
    text-align: center;
    color: #252830;
  }
  .code-view {
    width: 160px;
    height: 160px;
    padding: 10px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 0.02rem solid #008bfb;
    border-radius: 0.06rem;
    .payWayLogo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        // width: 0.26rem;
        // height: 0.26rem;
        width: 0.44rem;
        height: 0.44rem;
      }
    }
  }

  .copy-view {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.12rem;
    .copyBtn {
      height: 0.32rem;
      padding: 0.06rem 0.12rem;
      background: #008bfb;
      border-radius: 0.04rem;
      border: 0;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.14rem;
      line-height: 0.2rem;
      color: #ffffff;
    }
  }
}

//二维码
.code:hover {
  pointer-events: none;
}
</style>
