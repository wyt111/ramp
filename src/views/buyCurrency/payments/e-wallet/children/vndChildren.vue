<template>
  <div class="vndChildren-container">
    <div class="title">
      <p>1: {{ $t("vndChildren.oneTitle") }}</p>
      <p>2:{{ $t("vndChildren.twoTitle") }}</p>
      <p>3: {{ $t("vndChildren.threeTitle") }}</p>
      <div class="top_img">
        <img src="@/assets/images/banktransfer/momo.png" alt="" />
        <img src="@/assets/images/banktransfer/zalo pay.png" alt="" />
        <img src="@/assets/images/banktransfer/viettel pay.png" alt="" />
      </div>
    </div>

    <div class="content">
      <div class="line-box">
        <div class="line">
          <div class="label">{{ $t("ArgentinaPay.BankCode") }}</div>
          <div class="val">{{ vndData.backTypeText }}</div>
        </div>
        <div class="line">
          <div class="label">{{ $t("vndChildren.Accountname") }}</div>
          <div class="val">{{ vndData.phoneName }}</div>
        </div>
        <div class="line">
          <div class="label">{{ $t("vndChildren.amount") }}</div>
          <div class="val">
            {{ "₫ " + vndData.amount }}
            <copy-img
              v-clipboard="'₫ ' + vndData.amount"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </div>
        </div>
        <div class="line">
          <div class="label">{{ $t("vndChildren.AccountID") }}</div>
          <!--        拷贝不能为number类型 所以转字符串-->
          <div class="val">
            {{ vndData.id }}
            <copy-img
              v-clipboard="vndData.id + ''"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </div>
        </div>
        <div class="line">
          <div class="label">{{ $t("vndChildren.Transfercontent") }}</div>
          <div class="val">
            {{ vndData.code }}
            <copy-img
              v-clipboard="vndData.code"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </div>
        </div>
      </div>
      <div class="qr-box">
        <div class="qrCode" ref="qrCodeUrl"></div>
        <div class="title_bottom">
          {{ $t("phpPayment.Incorrect") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "vndChildren",
  mounted() {
    this.generateQRcode();
  },
  props: ["vndData"],
  methods: {
    generateQRcode() {
      this.$nextTick(() => {
        new QRCode(this.$refs.qrCodeUrl, {
          text: this.vndData.barcode,
          width: 120,
          height: 120,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: 3, //QRCode.CorrectLevel.H
        });
      });
    },
    firstCopySuccess() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
    firstCopyError() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.vndChildren-container {
  .title {
    position: relative;
    padding-top: 0.44rem;
    margin-bottom: 0.2rem;
    p {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.13rem;
      line-height: 0.18rem;
      color: #252830;
      &:not(:last-child) {
        margin-bottom: 0.08rem;
      }
    }
    .top_img {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      img {
        width: 0.32rem;
        margin-right: 0.12rem;
      }
    }
  }
  .content {
    .line-box {
      background: #f4f8fb;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      padding: 0.2rem 0.12rem;
      margin-bottom: 0.08rem;
      .line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:not(:last-child) {
          margin-bottom: 0.16rem;
        }
        .label {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.13rem;
          line-height: 0.14rem;
          color: #5d636d;
          white-space: nowrap;
        }
        .val {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.14rem;
          line-height: 0.14rem;
          text-align: right;
          color: #252830;
          display: flex;
          align-items: center;
          word-break: break-all;
          max-width: 1.84rem;
          img {
            margin-left: 0.12rem;
          }
        }
      }
    }
    .qr-box {
      background: #f4f8fb;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      padding: 0.2rem 0.12rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .qrCode {
        margin-bottom: 0.2rem;
      }
      .title_bottom {
        background: #fff9f2;
        border: 1px solid #ffe6ce;
        border-radius: 0.06rem;
        padding: 0.08rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.11rem;
        line-height: 0.15rem;
        color: #252830;
      }
    }
  }
  .title_bottom {
  }
}
</style>
