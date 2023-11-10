<template>
  <!-- Payment information to price -->
  <div class="paymentInformation-price">
    <div class="line">
      <div class="price">
        1 {{ cryptoInfo.crypto }}
        <span>≈</span>
        {{ feeInfo.cryptoPrice }} {{ fiatCurrencyInfo.fiat }}
      </div>
      <div class="timeDown">
        <template v-if="showLoading">
          <div class="loading-svg">
            <button-loading class="rightIcon" />
          </div>
          <div class="feeTitle-value-text">
            {{ $t("buyFee_components.updatingRates") }}
          </div>
        </template>
        <template v-else>
          <div class="loading-svg">
            <img src="@/assets/images/SellTime.svg" alt="" />
          </div>
          <div
            class="feeTitle-value-text"
            v-html="$t('buyFee_components.updateIn', [timeDownNumber])"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 卖币单价组件
 */
import { mapState } from "vuex";
import { noData } from "@/utils";
import { hashQuery } from "@/utils/publicRequest";

export default {
  name: "includedDetails-price",
  props: {
    type: {
      type: Number,
      default: null,
    },
    //确认订单页支付方式code
    payWayCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      timeOut: null,
      timeDownNumber: 15,
      showLoading: false,
    };
  },
  mounted() {
    this.scenarioVerification();
  },
  activated() {
    this.scenarioVerification();
  },
  destroyed() {
    this.timeDownNumber = 15;
    window.clearInterval(this.timeOut);
    this.timeOut = null;
  },
  deactivated() {
    this.timeDownNumber = 15;
    window.clearInterval(this.timeOut);
    this.timeOut = null;
  },
  computed: {
    ...mapState("cryptoSellPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoAmount: (state) => state.cryptoAmount,
      feeInfo: (state) => state.feeInfo,
    }),
    //商户信息
    ...mapState("buyCryptoMerchant", {
      MerchantInfo: (state) => state.merchantInfo,
    }),
    /**
     * 页面所展示费用信息
     * @returns {{fiatCurrencyInfo, networkInfo, feeInfo, cryptoAmount, cryptoInfo, fiatCurrencyAmount}}
     */
    pageData() {
      let params = {};
      //首页场景数据、商户确认订单数据
      params = {
        fiatCurrencyInfo: this.fiatCurrencyInfo,
        cryptoInfo: this.cryptoInfo,
        networkInfo: this.networkInfo,
        fiatCurrencyAmount: this.fiatCurrencyAmount,
        cryptoAmount: this.cryptoAmount,
        feeInfo: this.feeInfo,
      };
      return params;
    },
  },
  methods: {
    //分场景调用不同费用方法
    scenarioVerification() {
      //首页默认展开费用信息
      if (this.type === 1) {
        this.timingSetting(1);
        return;
      }
      if (this.type === 2) {
        this.queryFee();
        this.timingSetting(2);
      }
    },

    /**
     * 15秒定时刷新费用数据
     * @param type
     * type===1 ramp流程
     */
    timingSetting(type) {
      this.timeDownNumber = 15;
      window.clearInterval(this.timeOut);
      this.timeOut = null;
      this.timeOut = setInterval(() => {
        if (this.timeDownNumber === 1) {
          this.timeDownNumber = "";
          this.showLoading = true;
          setTimeout(() => {
            this.showLoading = false;
            this.timeDownNumber = 15;
            type === 1 ? this.queryFee() : "";
          }, 500);
        } else {
          this.timeDownNumber -= 1;
        }
      }, 1000);
    },

    /**
     * 获取费用数据
     * 场景: 1 - ramp流程
     * defineQueryData(1) - ramp流程场景
     */
    queryFee() {
      let _this = this;
      this.$axios
        .post(this.$api.get_sellInfoFee, this.defineQueryData(1), "")
        .then((res) => {
          if (res && res.data) {
            _this.storeData(1, res);
          }
        });
    },
    /**
     * 费用信息接口入参
     * @param type
     * @returns {{crypto: String,cryptoAmount: String,network: String,alpha2: String,payWayCode: String,merchantParams: Object}}
     * @merchantParams 商户信息有效携带商户信息
     */
    defineQueryData(type) {
      let params = {};
      //type - 1首页数据参数
      if (type === 1) {
        params = {
          crypto: this.cryptoInfo.crypto,
          fiat: this.fiatCurrencyInfo.fiat,
          cryptoAmount: this.cryptoAmount,
          network: this.networkInfo.network,
          alpha2: this.fiatCurrencyInfo.alpha2,
          payWayCode: this.payWayCode,
          merchantParams: {},
        };
        //带入商户信息 过滤商户加密货币
        if (JSON.stringify(hashQuery().query) !== "{}") {
          params.merchantParams = hashQuery().query;
        } else if (
          JSON.stringify(hashQuery().query) === "{}" &&
          this.MerchantInfo.merchantStatus &&
          this.MerchantInfo.merchantType === "sell"
        ) {
          params.merchantParams = this.MerchantInfo.merchantQueryInfo;
        }
        return params;
      }
    },

    /**
     * 分场景存储费用信息
     * @param type 场景类型
     * type===1 - ramp流程
     * @param res 需要存储费用信息
     */
    storeData(type, res) {
      //type - 1存储首页信息
      if (type === 1) {
        //存储费用信息
        let feeInfo = {
          rampFee: noData(res.data.rampFee), //通道费
          cryptoPrice: noData(res.data.cryptoPrice), //加密货币价格
          fiatSymbol: noData(res.data.fiatSymbol),
        };
        this.$store.commit("cryptoSellPage/set_feeInfo", feeInfo);
        //存储数字货币金额
        let fiatAmount = res.data.fiatAmount < 0 ? 0 : res.data.fiatAmount;
        this.$store.commit(
          "cryptoSellPage/set_fiatCurrencyAmount",
          noData(fiatAmount)
        );
        // 加密币可输入金额小数位
        // this.$store.commit('cryptoSellPage/set_crypto_decimalDigits', res.data.decimalDigits);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.paymentInformation-price {
  margin-top: 0.1rem;
  .line {
    display: flex;
    align-items: center;
    .price {
      color: #031633;
      font-family: HarmonyOS Sans;
      font-size: 0.14rem;
      font-style: normal;
      font-weight: 700;
      line-height: 0.22rem;
      > span {
        font-weight: 400;
      }
    }
    .timeDown {
      margin-left: auto;
      ::v-deep .loading-svg {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 0.12rem;
          height: 0.12rem;
          margin-right: 0.04rem;
        }
        .rightIcon {
          margin-right: 0.04rem;
          width: 0.12rem;
          height: 0.12rem;
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 0.12rem;
            height: 0.12rem;
            .path {
              stroke: #848b96;
            }
          }
        }
      }
      ::v-deep .feeTitle-value-text {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.11rem;
        line-height: 0.13rem;
        color: #848b96;
        display: flex;
        text-align: center;
        justify-content: center;

        span {
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: center;
          width: 0.12rem;
        }
      }
    }
  }
}
</style>
