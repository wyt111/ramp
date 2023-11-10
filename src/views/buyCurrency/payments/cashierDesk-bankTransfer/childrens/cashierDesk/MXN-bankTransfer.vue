<template>
  <div id="OPM" class="opm-container">
    <div class="opm-Payment-amount">
      <div class="title">{{ $t("mexPayment.PleasePay") }}</div>
      <div class="amount"><span>Mex$ </span> {{ payAmount }}</div>
    </div>
    <div class="opm_top_title1">
      {{ $t("phpPayment.Incorrect") }}
    </div>
    <div class="opm-content">
      <div class="bottom_left"></div>
      <div class="line line2">
        <div class="number">1</div>
        <div class="con">{{ $t("mexPayment.mxn_title") }}</div>
      </div>
      <div class="content">
        <div class="line_content">
          <div class="title">{{ $t("mexPayment.CLABEinterbancaria") }}</div>
          <p class="code">
            {{ payOrderInfo.clabe }}

            <copy-img
              v-clipboard="payOrderInfo.clabe"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
        <div class="line_content">
          <div class="title">{{ $t("mexPayment.Destinationbank") }}</div>
          <p>
            <span class="text">{{ payOrderInfo.bank_name }} </span>
            <copy-img
              v-clipboard="payOrderInfo.bank_name"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
        <div class="line_content">
          <div class="title">{{ $t("mexPayment.Beneficiary") }}</div>
          <p>
            <span class="text">{{ payOrderInfo.beneficiary_name }} </span>
            <copy-img
              v-clipboard="payOrderInfo.beneficiary_name"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
        <div class="line_content">
          <div class="title">{{ $t("mexPayment.Payamount") }}</div>
          <p>
            <span class="text">Mex$ {{ payAmount }}</span>
            <copy-img
              v-clipboard="' Mex$ ' + placeOrderQuery.amount"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
      </div>
      <div class="content_reference_number">
        <div class="title">
          <p><img src="@/assets/images/banktransfer/vector.png" alt="" /></p>
          <p>{{ $t("mexPayment.reference_number") }}</p>
        </div>
        <div class="number-info">
          <span class="text">{{ payOrderInfo.reference }}</span>
          <copy-img
            v-clipboard="payOrderInfo.reference"
            v-clipboard:success="firstCopySuccess"
            v-clipboard:error="firstCopyError"
          />
        </div>
      </div>
      <div class="line line1">
        <div class="number tips">!</div>
        <div class="con">
          {{ $t("mexPayment.mxn_tips") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cashierDeskMixin from "./cashierDeskMixin.js";

export default {
  mixins: [cashierDeskMixin],
  name: "MXN-bankTransfer",
};
</script>

<style lang="scss" scoped>
.opm-container {
  ::v-deep .opm-title {
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 0.16rem;
    line-height: 0.19rem;
    color: #252830;
    margin-bottom: 0.16rem;

    span {
      color: #f53f3f;
    }
  }

  .opm-Payment-amount {
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

  .opm_top_title1 {
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

  .opm-content {
    width: 100%;
    overflow: hidden;
    position: relative;
    //padding-left: .08rem;
    .bottom_left {
      height: 3.5rem;
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

      .tips {
        border: 1.8px solid #ff7d00;
        background: #ffffff;
        color: #ff7d00;
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
        margin-bottom: 0.12rem;
      }

      &.line3 {
        .number {
          border: 1.5px solid #ff7d00;
          background: #fff;
          color: #ff7d00;
        }

        .con {
          position: relative;

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
      margin-bottom: 0.1rem;

      .line_content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        margin-bottom: 0.16rem;

        .title {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.13rem;
          line-height: 0.14rem;
          color: #5d636d;
          display: flex;
          align-items: center;
        }

        p {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.14rem;
          line-height: 0.14rem;
          color: #252830;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 1.5rem;
          }

          img {
            height: 0.16rem;
            margin-left: 0.12rem;
            cursor: pointer;
          }
        }

        .code {
          width: 100% !important;
          margin-top: 0.08rem;
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 14px;
          color: #252830;
        }
      }

      .line_content:last-child {
        margin-bottom: 0;
      }
    }

    .content_reference_number {
      width: 3.15rem;
      background: #f4f8fb;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      margin-left: 0.28rem;
      padding: 0.2rem 0.12rem;
      margin-bottom: 0.2rem;

      .title {
        display: flex;
        align-items: center;
        color: #5d636d;
        font-family: SF Pro Display;
        font-size: 0.13rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.14rem;

        & > p:first-child {
          width: 14px;
          height: 14px;

          img {
            width: 14px;
            height: 14px;
          }
        }

        & > p:last-child {
          margin-left: 0.04rem;
        }
      }

      .number-info {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.14rem;
        line-height: 0.14rem;
        color: #252830;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.08rem;

        .text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 1.5rem;
        }

        img {
          height: 0.16rem;
          margin-left: 0.12rem;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
