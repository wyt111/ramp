<template>
  <div id="refund">
    <div class="refund-content">
      <p class="title">{{ $t("RefundFonts.RefundTitle") }}</p>
      <div class="walletAddress">
        <input
          type="text"
          v-model="walletAddress"
          :placeholder="$t('RefundFonts.Refundplaceholder')"
          @input="addressChange"
        />
        <img
          src="@/assets/images/scanCode_icon.svg"
          alt=""
          @click="openScanCode"
        />
        <p class="errorMessage" v-if="errorState">
          {{ $t("RefundFonts.RefundInvalidAddress") }}
        </p>
      </div>
      <p class="exchangeRate">
        1 {{ queryData.cryptocurrency }} ≈ {{ refundInfo.price }}
        {{ queryData.fiatCode }}
      </p>
      <div class="tips">
        {{ $t("RefundFonts.tips") }}
      </div>
    </div>
    <footer class="footer">
      <button :disabled="disabled" @click="confirmRefund">
        {{ $t("RefundFonts.RefundButtonConfirm") }}
        <img
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
        />
      </button>
      <powered-by />
    </footer>

    <!-- 卖币 - 扫码识别网络 -->
    <ScanCode :queryName="scanCode_queryName" v-if="scanCode_state" />
  </div>
</template>

<script>
/**
 * 邮件进入地址栏结构 - /Refund?orderId=订单id&cryptocurrency=BTC&fiatCode=EUR&emailFromPath=Refund
 */

export default {
  name: "Refund",
  components: {
    ScanCode: () => import("@/components/ScanCode/ScanCode"),
  },
  data() {
    return {
      walletAddress: "",
      errorState: false,

      queryData: {
        orderId: "",
        cryptocurrency: "",
        fiatCode: "",
      },

      refundInfo: {
        price: "",
        addressRegex: "",
      },

      //扫码后需要赋值的参数名
      scanCode_queryName: "",
      scanCode_state: false,
    };
  },
  computed: {
    disabled() {
      if (this.walletAddress === "" || this.errorState) {
        return true;
      } else {
        return false;
      }
    },
  },
  activated() {
    if (this.$route.query.orderId)
      this.$store.commit("sellPayments/set_orderNo", this.$route.query.orderId);

    this.walletAddress = "";
    this.errorState = false;
    this.queryData = {
      orderId: this.$route.query.orderId,
      fiatCode: this.$route.query.fiatCode,
      cryptocurrency: this.$route.query.cryptocurrency,
    };

    //存储邮件单页面跳传递的数据
    if (
      this.$route.query.emailFromPath !== undefined &&
      this.$route.query.emailFromPath
    ) {
      this.$store.state.emailFromPath = this.$route.query.emailFromPath;
      this.$store.state.emailFromquery_refund_view.orderId =
        this.$route.query.orderId;
      this.$store.state.emailFromquery_refund_view.cryptocurrency =
        this.$route.query.cryptocurrency;
      this.$store.state.emailFromquery_refund_view.fiatCode =
        this.$route.query.fiatCode;
    }
    //使用邮件单页面跳传递的数据
    if (this.$store.state.emailFromPath === "Refund") {
      this.queryData.orderId =
        this.$store.state.emailFromquery_refund_view.orderId;
      this.queryData.cryptocurrency =
        this.$store.state.emailFromquery_refund_view.cryptocurrency;
      this.queryData.fiatCode =
        this.$store.state.emailFromquery_refund_view.fiatCode;
    }

    this.queryRefundInfo();
  },
  methods: {
    addressChange() {
      if (
        this.walletAddress === "" ||
        new RegExp(this.refundInfo.addressRegex).test(this.walletAddress)
      ) {
        this.errorState = false;
      } else {
        this.errorState = true;
      }
    },

    //打开扫码
    openScanCode() {
      this.scanCode_queryName = "walletAddress";
      this.scanCode_state = true;
    },

    queryRefundInfo() {
      let params = {
        cryptocurrency: this.queryData.cryptocurrency,
        fiatCode: this.queryData.fiatCode,
      };
      this.$axios.get(this.$api.get_sellRefundInfo, params).then((res) => {
        if (res && res.data) {
          this.refundInfo.price = res.data.price;
          this.refundInfo.addressRegex = res.data.addressRegex;
        }
      });
    },

    confirmRefund() {
      let params = {
        orderId: this.queryData.orderId,
        address: this.walletAddress,
      };
      this.$axios
        .get(this.$api.get_sellRefund, params)
        .then((res) => {
          if (res) {
            this.$toast({
              duration: 3000,
              message: this.$t("RefundFonts.RefundSuccess"),
            });
            //邮件单页面进入
            if (this.$store.state.emailFromPath === "Refund") {
              this.$store.state.emailFromPath = "";
              this.$router.replace("/");
              return;
            } else {
              // 跳转到订单列表页
              // console.log('跳转到订单列表页set_isSourceRefund');
              this.$store.commit("set_isSourceRefund", true);
              this.$router.go(-1);
            }
          }
        })
        .catch((error) => {
          if (error.returnCode === "100002") {
            this.$parent.BuyTimeOut = "refund";
            this.$parent.tipsState = true;
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#refund {
  height: 100%;
  padding-bottom: 0.56rem;
  overflow: auto;
  .refund-content {
    .title {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.19rem;
      color: #252830;
      margin-bottom: 0.08rem;
    }
    .walletAddress {
      margin-bottom: 0.12rem;
      background: #ffffff;
      position: relative;
      input {
        height: 0.48rem;
        width: 100%;
        outline: none;
        border-radius: 0.06rem;
        border: 1px solid #e6e8eb;
        padding: 0 0.48rem 0 0.16rem;
        font-family: "HarmonyOS Sans";
        font-style: normal;
        font-weight: 500;
        font-size: 0.14rem;
        line-height: 0.16rem;
        color: #252830;
        &:hover {
          border-color: #cbcfd6;
        }
        &:focus {
          border: 1px solid #0059da;
          // box-shadow: 0 0 0px 0.02rem rgba(0, 89, 218, 0.3);
        }
        &:disabled {
          cursor: no-drop;
        }
      }
      input::placeholder {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.14rem;
        line-height: 0.16rem;
        color: #b7bcc5;
      }
      img {
        position: absolute;
        top: 0.14rem;
        right: 0.16rem;
        cursor: pointer;
        width: 0.2rem;
        height: 0.2rem;
      }
      .errorMessage {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.12rem;
        line-height: 0.18rem;
        color: #f53f3f;
      }
    }
    .exchangeRate {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.14rem;
      color: #848b96;
    }
    .tips {
      border: 1px solid rgba(255, 125, 0, 0.15);
      background: rgba(255, 125, 0, 0.05);
      border-radius: 0.06rem;
      padding: 0.08rem;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.11rem;
      line-height: 0.15rem;
      color: #252830;
      margin-top: 0.12rem;
    }
  }

  .footer {
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0.16rem 0;
    z-index: 8;

    button {
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
      &[disabled] {
        background: #0059da;
        opacity: 0.2;
        cursor: no-drop;
      }
    }
  }
}
</style>
