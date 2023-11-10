<template>
  <!-- Payment information -->
  <div class="paymentInformation">
    <!-- 单价、定时刷新数据时间 -->
    <div class="feeTitle" :class="{ titleMargin: !isHome }">
      <div class="feeTitle-value">
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
    <div class="fee-content">
      <div class="fee-content-title" @click="expandCollapse">
        <div class="left">
          {{ $t("buyFee_components.youOrder") }}
        </div>
        <!-- 商户接入模式禁止点击 -->
        <div class="right">
          <span
            >{{ pageData.cryptoAmount }} {{ pageData.cryptoInfo.crypto }}</span
          >
          &nbsp;{{ $t("buyFee_components.title2") }}&nbsp;
          <span
            >{{ pageData.fiatCurrencyAmount }}
            {{ pageData.fiatCurrencyInfo.fiat }}</span
          >
          <div class="img-box">
            <img :class="{ rotate: detailsState }" :src="imageBottom" />
          </div>
        </div>
      </div>

      <!-- 详细费用信息 -->
      <el-collapse-transition>
        <div class="fee-content-details" v-show="detailsState">
          <div class="fee-content-details-line" v-if="isHome">
            <div class="title">1 {{ pageData.cryptoInfo.crypto }}</div>
            <div class="value">
              ≈ {{ pageData.feeInfo.cryptoPrice }}
              {{ pageData.fiatCurrencyInfo.fiat }}
            </div>
          </div>
          <!-- ramp fee -->
          <div class="fee-content-details-line">
            <div class="title">
              {{ $t("buyFee_components.rampFee") }}
              <el-popover
                :close-delay="1"
                class="tips-popover"
                placement="top-start"
                :offset="55"
                :trigger="triggerType"
                v-model="popover_state"
              >
                <p>{{ $t("buyFee_components.tips") }}</p>
                <div slot="reference">
                  <img
                    class="tipsIcon"
                    src="@/assets/images/exclamatoryMarkIcon.svg"
                  />
                </div>
              </el-popover>
            </div>
            <!-- 确认支付页隐藏rampFee的as low as提示文案(payWayCode有值为确认订单页) -->
            <!-- 无折扣rampFee -->
            <div
              class="value"
              v-if="
                pageData.feeInfo.discountRampFee === pageData.feeInfo.rampFee
              "
            >
              <span class="minText" v-if="!payWayCode"
                >{{ $t("buyFee_components.rampFeeTips") }} &nbsp;</span
              >
              {{ pageData.fiatCurrencyInfo.fiatSymbol }}&nbsp;{{
                pageData.feeInfo.rampFee
              }}
            </div>
            <!-- 有折扣rampFee -->
            <div class="value wordValue" v-else>
              <span class="minText" v-if="!payWayCode"
                >{{ $t("buyFee_components.rampFeeTips") }} &nbsp;</span
              >
              <p>
                {{ pageData.fiatCurrencyInfo.fiatSymbol
                }}{{ pageData.feeInfo.rampFee ? pageData.feeInfo.rampFee : "" }}
              </p>
            </div>
          </div>
          <!-- network fee -->
          <div class="fee-content-details-line">
            <div class="title">
              {{ $t("buyFee_components.networkFee") }}
              <el-popover
                :close-delay="1"
                class="tips-popover"
                placement="top-start"
                :offset="55"
                :trigger="triggerType"
                v-model="popover_state1"
              >
                <p>{{ $t("buyFee_components.networkFeeTips") }}</p>
                <div slot="reference">
                  <img
                    class="tipsIcon"
                    src="@/assets/images/exclamatoryMarkIcon.svg"
                  />
                </div>
              </el-popover>
            </div>
            <div class="value">
              {{ pageData.fiatCurrencyInfo.fiatSymbol }}&nbsp;{{
                pageData.feeInfo.networkFee
              }}
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
/**
 * 买币费用展示组件
 * type 1 - 首次调用不触发、2 - 首次调用触发、3 - 商户确认订单需要
 * isHome - 是否首页调用
 * payWayCode - 选择支付方式后带入支付方式code
 */
import common from "../../utils/common";
import { noData } from "@/utils";
import { mapState } from "vuex";
import { hashQuery } from "@/utils/publicRequest";

export default {
  name: "includedDetails",
  props: {
    type: {
      type: Number,
      default: 2,
    },
    //是否在首页
    isHome: {
      type: Boolean,
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
      triggerType: "hover",
      popover_state: false,
      popover_state1: false,

      timeOut: null,
      detailsState: false,
      timeDownNumber: 15,
      imageBottom: require("@/assets/images/blackDownIcon1.svg"),
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
    ...mapState("userInfo", {
      isDiscount: (state) => state.isDiscount,
      token: (state) => state.token,
      activityStatus: (state) => state.activityStatus,
    }),
    ...mapState("cryptoBuyPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoAmount: (state) => state.cryptoAmount,
      feeInfo: (state) => state.feeInfo,
    }),
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
    }),
    ...mapState("secondaryBuyPayments", {
      fiatCurrencyInfo_secondaryBuy: (state) => state.fiatCurrencyInfo,
      cryptoInfo_secondaryBuy: (state) => state.cryptoInfo,
      networkInfo_secondaryBuy: (state) => state.networkInfo,
      fiatCurrencyAmount_secondaryBuy: (state) => state.fiatCurrencyAmount,
      cryptoAmount_secondaryBuy: (state) => state.cryptoAmount,
      feeInfo_secondaryBuy: (state) => state.feeInfo,
    }),

    //商户信息
    ...mapState("buyCryptoMerchant", {
      buyMerchantInfo: (state) => state.merchantInfo,
    }),

    /**
     * 页面所展示费用信息,区分ramp二次支付展示信息和ramp流程展示信息
     * 二次支付条件 - 存在$route.query.pathHistry
     * @returns {{fiatCurrencyInfo, networkInfo, feeInfo, cryptoAmount, cryptoInfo, fiatCurrencyAmount}}
     */
    pageData() {
      let params = {};
      //二次支付费用数据
      if (this.$route.query.pathHistry === "tradeHistory") {
        params = {
          fiatCurrencyInfo: this.fiatCurrencyInfo_secondaryBuy,
          cryptoInfo: this.cryptoInfo_secondaryBuy,
          networkInfo: this.networkInfo_secondaryBuy,
          fiatCurrencyAmount: this.fiatCurrencyAmount_secondaryBuy,
          cryptoAmount: this.cryptoAmount_secondaryBuy,
          feeInfo: this.feeInfo_secondaryBuy,
        };
        return params;
      }
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
      //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
      this.triggerType = common.equipmentEnd === "pc" ? "hover" : "click";
      if (this.type === 1) {
        this.timingSetting(1);
        return;
      }
      if (this.type === 2) {
        this.merchantQueryFee();
        this.timingSetting(2);
      }
    },

    /**
     * 15秒定时刷新费用数据
     * @param type
     * type===1 ramp流程
     * type===2 api商户
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
            type === 1 ? this.queryFee() : this.merchantQueryFee();
          }, 500);
        } else {
          this.timeDownNumber -= 1;
        }
      }, 1000);
    },

    /**
     * 获取费用数据
     * 场景: ramp流程
     * 商户信息有效携带商户信息
     */
    queryFee() {
      let _this = this;
      //带入商户信息 过滤商户加密货币
      let merchantInfo = "";
      if (JSON.stringify(hashQuery().query) !== "{}") {
        merchantInfo = hashQuery().fullPath;
      } else if (
        JSON.stringify(hashQuery().query) === "{}" &&
        this.buyMerchantInfo.merchantType !== "api" &&
        this.buyMerchantInfo.merchantStatus
      ) {
        merchantInfo = this.buyMerchantInfo.merchantFullPath;
      }
      this.$axios
        .post(
          this.$api.post_buyInfoFee + "?" + merchantInfo,
          this.defineQueryData(1),
          ""
        )
        .then((res) => {
          if (res && res.data && res.data.checkMerchant) {
            _this.storeData(1, res);
            return;
          }
          _this.newQueryFee();
        });
    },
    newQueryFee() {
      let _this = this;
      //带入商户信息 过滤商户加密货币
      let merchantInfo = "";
      if (JSON.stringify(hashQuery().query) !== "{}") {
        merchantInfo = hashQuery().fullPath;
      } else if (
        JSON.stringify(hashQuery().query) === "{}" &&
        this.buyMerchantInfo.merchantType !== "api" &&
        this.buyMerchantInfo.merchantStatus
      ) {
        merchantInfo = this.buyMerchantInfo.merchantFullPath;
      }
      this.$axios
        .post(
          this.$api.post_buyInfoFee2 + "?" + merchantInfo,
          this.defineQueryData(1),
          ""
        )
        .then((res) => {
          if (res && res.data) {
            _this.storeData(1, res);
          }
        });
    },
    /**
     * 费用信息接口入参
     * @param type
     * @returns {{side: string, amount, alpha2, fiat, crypto, network, payWayCode: string}}
     */
    defineQueryData(type) {
      let params = {};
      //type - 1首页数据参数
      if (type === 1) {
        params = {
          crypto: this.cryptoInfo.crypto,
          fiat: this.fiatCurrencyInfo.fiat,
          side: "buy",
          amount: this.fiatCurrencyAmount,
          alpha2: this.fiatCurrencyInfo.alpha2,
          network: this.networkInfo.network,
          payWayCode: this.payWayCode,
        };
        return params;
      }
    },

    /**
     * api商户确费用信息
     *
     */
    merchantQueryFee() {
      let _this = this;
      let params = {
        orderNo: this.orderNo,
      };
      this.$axios.get(this.$api.get_orderFee, params).then((res) => {
        if (res && res.data) {
          let type = this.$route.query.pathHistry === "tradeHistory" ? 2 : 3;
          _this.storeData(type, res);
        }
      });
    },

    /**
     * 分场景存储费用信息
     * @param type 场景类型
     * type===1 - ramp流程
     * type===2 - 二次支付
     * type===3 - api商户
     * @param res 需要存储费用信息
     */
    storeData(type, res) {
      //type - 1存储首页信息
      if (type === 1) {
        //存储费用信息
        let feeInfo = {
          rampFee: noData(res.data.rampFee), //通道费
          networkFee: res.data.discount
            ? res.data.discountNetworkFee
            : res.data.networkFee, //网络费
          cryptoPrice: noData(res.data.cryptoPrice), //加密货币价格
          discountRampFee: noData(res.data.discountRampFee), //折扣后的通道费
        };
        this.$store.commit("cryptoBuyPage/set_feeInfo", feeInfo);
        //存储数字货币金额
        let cryptoAmount = res.data.discount
          ? res.data.discountCryptoAmount
          : res.data.cryptoAmount;
        this.$store.commit(
          "cryptoBuyPage/set_cryptoAmount",
          noData(cryptoAmount)
        );
        //存储用户是否有折扣
        this.$store.commit("userInfo/set_isDiscount", res.data.discount);
        // 法币可输入金额小数位
        this.$store.commit(
          "cryptoBuyPage/set_fiat_decimalDigits",
          res.data.decimalDigits
        );
        //存储法币国家信息
        let fiatCurrencyInfo = {
          fiat: noData(res.data.fiat), //法币
          fiatSymbol: noData(res.data.fiatSymbol), //法币符号
          flag: noData(res.data.flag), //国旗
          alpha2: noData(res.data.alpha2), //国家code
        };
        this.$store.commit(
          "cryptoBuyPage/set_fiatCurrencyInfo",
          fiatCurrencyInfo
        );
        //存储数字货币信息
        let cryptoInfo = {
          crypto: noData(res.data.crypto), //数字货币
          cryptoIcon: noData(res.data.cryptoIcon), //数字货币图标
          cryptoToFiatPrice: noData(res.data.cryptoToFiatPrice), //数字货币兑法币单价 - 1crypto 约等于 多少 fiat
        };
        this.$store.commit("cryptoBuyPage/set_cryptoInfo", cryptoInfo);
        //存储网络信息
        let networkInfo = {
          network: noData(res.data.network), //网络
          networkIcon: noData(res.data.networkIcon), //网络图标
          addressRegex: noData(res.data.addressRegex), //地址正则
          memoRegex: noData(res.data.memoRegex), //memo正则
          networkName: noData(res.data.networkName), //网络全称
        };
        this.$store.commit("cryptoBuyPage/set_networkInfo", networkInfo);
        //存储法币最大值最小值限制
        let fiatmaxMin = {
          maxAmount: noData(res.data.maxAmount),
          minAmount: noData(res.data.minAmount),
        };
        this.$store.commit("cryptoBuyPage/set_fiatmaxMin", fiatmaxMin);
        //存储法币金额
        this.$store.commit(
          "cryptoBuyPage/set_fiatCurrencyAmount",
          noData(res.data.fiatAmount)
        );
        return;
      }
      //type - 2存储二次支付确认订单费用信息
      if (type === 2) {
        let feeInfo = {
          rampFee: noData(res.data.serviceFee), //通道费
          networkFee: noData(res.data.networkFee), //网络费
          cryptoPrice: noData(res.data.price), //加密货币价格
          discountRampFee: noData(res.data.serviceFee), //折扣后的通道费
        };
        this.$store.commit("secondaryBuyPayments/set_feeInfo", feeInfo);
        //存储数字货币金额
        this.$store.commit(
          "secondaryBuyPayments/set_cryptoAmount",
          noData(res.data.cryptoAmount)
        );
        //存储用户是否有折扣
        this.$store.commit("userInfo/set_isDiscount", res.data.discount);
        return;
      }
      //type - 3商户确认订单费用信息
      let feeInfo = {
        rampFee: noData(res.data.serviceFee), //通道费
        networkFee: noData(res.data.networkFee), //网络费
        cryptoPrice: noData(res.data.price), //加密货币价格
        discountRampFee: noData(res.data.serviceFee), //折扣后的通道费
      };
      this.$store.commit("cryptoBuyPage/set_feeInfo", feeInfo);
      //存储数字货币金额
      this.$store.commit(
        "cryptoBuyPage/set_cryptoAmount",
        noData(res.data.cryptoAmount)
      );
      //存储用户是否有折扣
      this.$store.commit("userInfo/set_isDiscount", false);
    },

    //展开或收起费用
    expandCollapse() {
      this.detailsState = !this.detailsState;
      if (this.detailsState) {
        setTimeout(() => {
          this.$parent?.$refs?.includedDetails_ref?.$el.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "end",
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.paymentInformation {
  .titleMargin {
    margin-top: 0.24rem !important;
  }

  .feeTitle {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .feeTitle-value {
      display: flex;
      align-items: center;
      height: 0.14rem;

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

  .fee-content {
    margin-top: 0.07rem;
    transition: all 0.3s;
    .fee-content-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.14rem;
        line-height: 0.22rem;
        color: #252830;
      }
      .right {
        display: flex;
        align-items: center;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.14rem;
        line-height: 0.22rem;
        color: #252830;
        span {
          color: #252830;
          font-size: 0.14rem;
          font-family: "HarmonyOS Sans";
          font-weight: 700;
          padding: 0 0.02rem;
        }
        .img-box {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0.08rem;
          img {
            display: block;
            transition: all 0.3s;
            transform: rotate(0deg);
            &.rotate {
              transform: rotate(180deg);
            }
          }
        }
      }
    }

    .fee-content-details {
      overflow: hidden;
      transition-duration: 0.3s !important;
      transition-timing-function: ease !important;

      .fee-content-details-line {
        display: flex;
        align-items: center;
        margin-top: 0.1rem;
        &:first-child {
          margin-top: 0.14rem;
        }
        .title {
          display: flex;
          align-items: center;
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 400;
          font-size: 0.12rem;
          line-height: 0.14rem;
          color: #252830;
          .tipsIcon {
            width: 0.14rem;
            height: 0.14rem;
            margin-left: 0.04rem;
            display: flex;
            cursor: pointer;
          }
        }

        .value {
          margin-left: auto;
          display: flex;
          align-items: center;
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 400;
          font-size: 0.12rem;
          line-height: 0.14rem;
          color: #252830;
          .minText {
            // font-family: Regular;
            // font-weight: 400;
            // color: #c2c2c2;
            // margin-right: 0.04rem;
            // margin-top: -0.02rem;
          }
        }
      }
    }
    &.opacity6 {
      opacity: 0.5;
    }
  }
}

.wordValue {
  display: flex;
  .minText {
    // display: block;
    // margin-top: 0.03rem !important;
  }
  p:nth-of-type(1) {
    margin: 0 0.04rem 0;
  }
}
</style>
