<template>
  <div class="verify-succeeded-container">
    <div class="status-content">
      <verify-img-status status="succeeded"></verify-img-status>
      <div class="user-info">
        <div class="p1">{{ $t("kycStatus.account") }}{{ emailSlice }}</div>
        <div class="p2">
          {{ $t("kycStatus.login_time") }}
          {{ kycInfo.lastLoginTime | lastLoginTimeFilter }}
        </div>
      </div>
      <div class="verify-status-reason">
        <div class="label">
          <img src="@/assets/images/kycOnfido/4.svg" alt="" />
          <span>
            {{ $t("kycStatus.verify_succeeded.tips") }}
          </span>
        </div>
        <div
          class="content"
          v-html="$t(`kycStatus.verify_succeeded.content`)"
        ></div>
      </div>
    </div>
    <div class="process" @click="onProcess">
      <p class="p">{{ $t("kycStatus.verify_succeeded.process") }}</p>
      <img
        class="rightIcon"
        src="@/assets/images/button-right-icon.svg"
        alt=""
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import VerifyImgStatus from "./VerifyImgStatus";

export default {
  name: "VerifySucceeded",
  components: {
    VerifyImgStatus,
  },
  props: ["kycInfo", "emailSlice"],
  data() {
    return {
      // dayLimitAmount: 0
    };
  },
  computed: {
    // 卖币支付信息
    ...mapState("sellPayments", {
      sellPayInfo: (state) => state.sellPayInfo,
    }),
    // 卖币支付方式信息
    ...mapState("sellPayments", {
      sellPayType: (state) => state.sellPayType,
    }),
    ...mapState("cryptoSellPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoAmount: (state) => state.cryptoAmount,
    }),
    ...mapState("sellCryptoMerchantAELF", {
      source: (state) => state.merchantInfo.source,
      merchantFullPathAELF: (state) => state.merchantFullPath,
      appId: (state) => state.merchantInfo.appId,
      merchantInfo_AELF: (state) => state.merchantInfo,
    }),
  },
  methods: {
    async onProcess() {
      //单独针对新加坡支付、如果是苹果支付走上一层、巴西支付
      if (
        this.$route.query.type &&
        ["eWallet", "applePay", "brazilPay", "googlePay"].includes(
          this.$route.query.type
        )
      ) {
        this.$router.replace(this.$store.state.WhichPage);
        return;
      }

      if (
        this.$store.state.homeTabstate === "sellCrypto" ||
        this.source === "3"
      ) {
        // 保存卡信息
        let params = {
          alpha2: this.fiatCurrencyInfo.alpha2,
          fiat: this.fiatCurrencyInfo.fiat,
          accountType: this.sellPayType.accountType,
          bankAccountInfo: this.sellPayInfo.bankAccountInfo, // 银行转账信息
          userAccountId: this.sellPayInfo.userAccountId,
          firstName: this.sellPayInfo.firstName,
          lastName: this.sellPayInfo.lastName,
          accountNumber: this.sellPayInfo.accountNumber,
          phone: this.sellPayInfo.phone,
          birthDate: this.sellPayInfo.birthDate,
        };
        this.$axios.post(this.$api.post_sellPayInfo, params, "").then((res) => {
          if (res) {
            // 创建订单
            let params = {
              cryptoCurrency: this.cryptoInfo.crypto,
              sellVolume: this.cryptoAmount,
              network: this.networkInfo.network,
              alpha2: this.fiatCurrencyInfo.alpha2,
              fiat: this.fiatCurrencyInfo.fiat,
              userAccountId: res.data.userAccountId,
              payWayCode: this.sellPayType.payWayCode,
            };
            //存在商户信息将信息带入请求地址
            let urlQuery = "";
            let accessMerchantInfo = sessionStorage.getItem("buyMerchantInfo");
            if (
              accessMerchantInfo !== undefined &&
              accessMerchantInfo &&
              JSON.parse(accessMerchantInfo).merchantParam
            ) {
              urlQuery = `?${JSON.parse(accessMerchantInfo).merchantParam}`;
            }

            if (this.source === "3") {
              urlQuery = this.merchantFullPathAELF;
            }

            this.$axios
              .post(this.$api.post_sellCreatePayOrder + urlQuery, params, "")
              .then((res) => {
                if (res && res.data) {
                  // 存储数据、清空状态
                  this.$store.state.sellOrderId = res.data.orderId;
                  this.$store.state.nextOrderState = 1;
                  sessionStorage.removeItem("getToken");
                  sessionStorage.removeItem("sellState");
                  //跳转状态;
                  if (
                    this.source === "3" &&
                    this.appId.toLowerCase() !=
                      process.env.VUE_APP_AELF_APPID.toLowerCase()
                  ) {
                    window.location = this.merchantInfo_AELF.withdrawUrl;
                  } else {
                    this.$router.push(
                      `/sellOrder?sellOrderId=${res.data.orderId}`
                    );
                  }
                }
              });
          }
        });
      } else if (this.$store.state.WhichPage) {
        this.$router.replace(this.$store.state.WhichPage);
      } else {
        this.$router.replace("/");
      }
    },
  },
  filters: {
    lastLoginTimeFilter(val) {
      let date = new Date(val);
      let Y = date.getFullYear();
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;

      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();

      let m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      let strDate = `${M}/${D}/${Y} ${h}:${m}`;
      return strDate;
    },
  },
  created() {
    /* this.$axios.post(this.$api.post_getQuota, { userLevel: 1 }, '').then(val => {
      if (val) {
        this.dayLimitAmount = val.data.model.dayLimitAmount / 100;
      }
    });*/
  },
};
</script>
<style lang="scss" scoped>
.verify-succeeded-container {
  height: 100%;

  .status-content {
    height: calc(100% - 0.78rem);
    margin-bottom: 0.2rem;
    overflow: auto;
  }
  .user-info {
    font-family: "Regular";
    font-style: normal;
    font-weight: 400;
    font-size: 0.14rem;
    line-height: 0.22rem;
    /* identical to box height, or 157% */
    text-align: center;
    color: #6e7687;
    margin-bottom: 0.24rem;
    .p1 {
      margin-bottom: 0.02rem;
    }
    .p2 {
    }
  }
  ::v-deep .verify-status-reason {
    background: rgba(10, 178, 77, 0.05);
    border-radius: 0.12rem;
    padding: 0.16rem;
    .label {
      margin-bottom: 0.1rem;
      display: flex;
      img {
        width: 0.2rem;
        height: 0.2rem;
        margin: 0.02rem 0.1rem 0 0.02rem;
      }
      span {
        font-family: "Medium";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.22rem;
        color: #0ab24d;
      }
    }
    .content {
      font-family: "Regular";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.22rem;
      color: #6e7687;
      .fw700 {
        font-family: "Semibold";
        font-weight: 700;
      }
    }
  }
  .process {
    width: 100%;
    min-height: 0.48rem;
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
    .p {
      display: flex;
      align-items: center;
      max-width: 2.4rem;
    }
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
</style>
