<template>
  <!-- Payment information -->
  <div class="paymentInformation">
    <!-- 单价、定时刷新数据时间 -->
    <div class="feeTitle">
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
            <img src="../../../assets/images/SellTime.svg" alt="" />
          </div>
          <div
            class="feeTitle-value-text"
            v-html="$t('buyFee_components.updateIn', [timeDownNumber])"
          ></div>
        </template>
      </div>
    </div>
    <!-- 详细费用信息 -->
    <div class="fee-content">
      <div class="fee-content-title" @click="expandCollapse">
        <div class="left">
          {{ $t("buyFee_components.youOrder") }}
        </div>
        <div class="right">
          <span>{{ cryptoAmount }} {{ cryptoInfo.crypto }}</span>
          {{ $t("sellFee_components.title2") }}
          <span>{{ fiatCurrencyAmount }} {{ fiatCurrencyInfo.fiat }}</span>
          <div class="img-box">
            <img :class="{ rotate: detailsState }" :src="imageBottom" />
          </div>
        </div>
      </div>
      <!-- 详细费用信息 -->
      <el-collapse-transition>
        <div class="fee-content-details" v-show="detailsState">
          <div class="fee-content-details-line">
            <div class="title">1 {{ cryptoInfo.crypto }}</div>
            <div class="value">
              ≈ {{ feeInfo.cryptoPrice }} {{ fiatCurrencyInfo.fiat }}
            </div>
          </div>

          <div class="fee-content-details-line">
            <div class="title">
              {{ $t("sellFee_components.rampFee") }}
              <el-popover
                :close-delay="1"
                placement="top-start"
                :offset="55"
                :trigger="triggerType"
              >
                <p>{{ $t("sellFee_components.tips") }}</p>
                <div slot="reference">
                  <img
                    class="tipsIcon"
                    src="../../../assets/images/exclamatoryMarkIcon.svg"
                  />
                </div>
              </el-popover>
            </div>
            <div class="value">
              <span class="minText"
                >{{ $t("sellFee_components.RampFeeTips") }} &nbsp;</span
              >
              {{ feeInfo.fiatSymbol }}&nbsp;{{ feeInfo.rampFee }}
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
/**
 * 卖币费用组件
 * isHome 是否是首页使用
 */
import { mapState } from "vuex";
import common from "../../../utils/common";
import { noData } from "@/utils";
import { hashQuery } from "@/utils/publicRequest";

export default {
  name: "includedDetails",
  props: {
    type: {
      type: Number,
      default: null,
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
      detailsState: false,

      timeOut: null,
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
      //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
      this.triggerType = common.equipmentEnd === "pc" ? "hover" : "click";
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
          if (res && res.data && res.data.checkMerchant) {
            _this.storeData(1, res);
            return;
          }
          _this.newQueryFee();
        });
    },
    newQueryFee() {
      let _this = this;
      this.$axios
        .post(this.$api.get_sellInfoFee2, this.defineQueryData(1), "")
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

    //展开费用信息
    expandCollapse() {
      this.detailsState = !this.detailsState;
      if (this.detailsState) {
        setTimeout(() => {
          this.$parent.$refs.includedDetails_ref.$el.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "end",
          });
        });
        return;
      }
    },
  },
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
