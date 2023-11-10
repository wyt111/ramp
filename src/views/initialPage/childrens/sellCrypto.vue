<template>
  <div id="buyCrypto">
    <!-- 卖币功能模块 -->
    <div class="buyCrypto_content" @scroll="scroll">
      <div class="methods_select cursor">
        <div class="form_title pay_title">{{ $t("homePage.youSell") }}</div>
        <template v-if="cryptoInfo.crypto">
          <div class="flex" :class="{ inputFocus: inputFocus }">
            <div class="methods_select-left">
              <van-field
                class="pay_input"
                type="number"
                v-model.number="payAmount"
                @focus="inputFocus = true"
                @blur="inputFocus = false"
                @input="inputChange"
                :disabled="payAmountState"
                inputmode="decimal"
                placeholder="0.00"
                :formatter="payAmountFormatter"
              />
            </div>
            <div class="get_company" @click="openSearch('currency-sell')">
              <div class="getImg sellImg">
                <img
                  class="coinImg"
                  :src="cryptoInfo.cryptoIcon"
                  :key="cryptoInfo.cryptoIcon"
                />
                <img
                  v-if="networkInfo.networkIcon"
                  class="networkImg"
                  :src="networkInfo.networkIcon"
                  :key="networkInfo.networkIcon"
                />
              </div>
              <div class="getText">
                <p>{{ cryptoInfo.crypto }}</p>
                <p class="network-name">
                  {{
                    networkInfo?.network?.toUpperCase() === "MATIC"
                      ? networkInfo.networkName
                      : networkInfo.network
                  }}
                </p>
              </div>
              <div class="rightIcon">
                <img src="@/assets/images/homeRight-icon2.svg" />
              </div>
            </div>
          </div>
        </template>
        <content-loader
          primaryColor="#f5f5f5"
          secondaryColor="#ffffff"
          :secondaryOpacity="0.5"
          v-else
          :width="343"
          :height="48"
        >
          <rect x="0" y="0" width="100%" height="100%" rx="6" ry="6" />
        </content-loader>
      </div>
      <div class="methods_select cursor get_methods_select">
        <div class="form_title">
          <div>{{ $t("homePage.receiveTitle") }}</div>
          <div>
            <el-popover
              :close-delay="1"
              placement="top-start"
              :offset="55"
              :trigger="triggerType"
            >
              <p>{{ $t("homePage.sellReceiveTips") }}</p>
              <div slot="reference">
                <img
                  class="tipsIcon"
                  src="@/assets/images/exclamatoryMarkIcon.svg"
                />
              </div>
            </el-popover>
          </div>
        </div>
        <template v-if="fiatCurrencyInfo.fiat">
          <div class="flex" :class="{ warningTextState: warningTextState }">
            <div class="methods_select-left">
              <div class="get_input">
                <span v-if="fiatCurrencyAmount !== ''">{{
                  fiatCurrencyAmount
                }}</span>
                <span class="no_getAmount" v-else>0.00</span>
              </div>
            </div>
            <div class="get_company" @click="openSearch('payCurrency-sell')">
              <div class="get_company_flex">
                <div class="getImg">
                  <img
                    :src="fiatCurrencyInfo.flag"
                    :key="fiatCurrencyInfo.flag"
                  />
                </div>
                <div class="getText">{{ fiatCurrencyInfo.fiat }}</div>
                <img
                  class="rightIcon"
                  src="@/assets/images/homeRight-icon2.svg"
                />
              </div>
            </div>
          </div>
        </template>
        <content-loader
          primaryColor="#f5f5f5"
          secondaryColor="#ffffff"
          :secondaryOpacity="0.5"
          v-else
          :width="343"
          :height="48"
        >
          <rect x="0" y="0" width="100%" height="100%" rx="6" ry="6" />
        </content-loader>
        <div
          class="warning_text"
          :class="{ show_warning_text: warningTextState }"
        >
          <span v-if="warningTextState" v-html="payAmount_tips"></span>
        </div>
      </div>
      <!-- 费用模块 -->
      <div class="calculationProcess" v-if="detailedInfo_state">
        <IncludedDetailsSell
          :type="1"
          ref="includedDetails_ref"
          :isHome="true"
        />
      </div>
      <content-loader
        primaryColor="#f5f5f5"
        secondaryColor="#ffffff"
        :secondaryOpacity="0.5"
        v-else-if="!detailedInfo_state && !warningTextState"
        :width="343"
        :height="43"
      >
        <rect x="243" y="0" width="100" height="14" rx="6" ry="6" />
        <rect x="0" y="21" width="100" height="22" rx="6" ry="6" />
        <rect x="143" y="21" width="200" height="22" rx="6" ry="6" />
      </content-loader>

      <button
        class="continue"
        @click="nextStep"
        :disabled="!continueState"
        :class="{ continue_true: continueState }"
      >
        {{ $t("homePage.bottomTips1") }} {{ cryptoInfo.crypto }}
        <img
          v-if="lodingStatus"
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
        />
        <button-loading v-else class="rightIcon" />
      </button>
    </div>

    <div class="footer">
      <powered-by :show-pay-way="true" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import common from "@/utils/common";
import { hashQuery, merchantInfo } from "@/utils/publicRequest";
import { debounce, noData } from "@/utils";
import { AES_Decrypt, AES_Encrypt } from "@/utils/encryp";
import { digitalInputFormatter } from "@/utils";
import IncludedDetailsSell from "@/components/IncludedDetails/sell/IncludedDetails-sell.vue";
import Big from "big.js";

export default {
  name: "sellCrypto",
  components: {
    IncludedDetailsSell,
  },
  data() {
    return {
      //you pay Prompt information
      warningTextState: false,

      //Expense information
      detailedInfo_state: false,

      //you get Currency information
      cryptoSate: false,

      triggerType: "hover",

      inputFocus: false,
      lodingStatus: true,
      //商户携带参数输入框状态
      detailedInfo_cryptoAmount: false,
      //商户选择法币和国家状态
      fiatSate: false,

      //基本数据接口状
      pageInfoState: false,

      payAmount_tips: "",

      startRequest: false,
    };
  },
  activated() {
    //获取接收方式页网络数据,原因 - 输入金额不满足网络最大值最小值
    let cryptoMaxMin = {
      minAmount: this.cryptoMaxMin.minAmount,
      maxAmount: this.cryptoMaxMin.maxAmount,
    };
    this.$store.commit("cryptoSellPage/set_cryptoMaxMin", cryptoMaxMin);
    this.maxMinCheck();
  },
  computed: {
    // 首页基本信息
    ...mapState("cryptoSellPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      cryptoMaxMin: (state) => state.cryptoMaxMin,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoAmount: (state) => state.cryptoAmount,
      feeInfo: (state) => state.feeInfo,
      rawFiat: (state) => state.rawFiat,
      checkMerchant: (state) => state.checkMerchant,
    }),
    // 商户信息
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),
    //法币金额
    payAmount: {
      get() {
        return this.cryptoAmount;
      },
      set() {
        return this.cryptoAmount;
      },
    },

    //you pay Input status - 数据加载后放开状态
    payAmountState() {
      return Boolean(this.detailedInfo_cryptoAmount);
    },

    //continue button status - 限制确认按钮状态
    continueState() {
      if (
        this.payAmount !== "" &&
        !this.warningTextState &&
        this.cryptoAmount !== "" &&
        Number(this.payAmount) > 0 &&
        this.lodingStatus &&
        this.pageInfoState === true &&
        this.fiatCurrencyAmount > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    payAmount: {
      deep: true,
      immediate: false,
      handler(val, oldVal) {
        if (
          oldVal !== undefined &&
          Number(val) !== Number(oldVal) &&
          !this.startRequest &&
          this.payAmount !== ""
        ) {
          this.amountControl();
        }
      },
    },
  },
  methods: {
    scroll() {
      this.$refs.includedDetails_ref.popover_state = false;
    },

    // 选择法币或加密货币
    openSearch(view) {
      //存在商户无法切换法币、加密货币
      if (view === "currency-sell" && !this.cryptoSate) {
        return;
      }
      if (view === "payCurrency-sell" && !this.fiatSate) {
        return;
      }
      this.$parent.openSearch(view);
    },

    payAmountFormatter(str) {
      //限制输入六位小数
      if (str.indexOf(".") > 0) {
        str = str.substr(0, str.indexOf(".") + 7);
      }
      return digitalInputFormatter(str);
    },

    // 输入校验
    inputChange(val) {
      if (val !== "" && val > 0) {
        this.$store.commit("cryptoSellPage/set_cryptoAmount", Number(val));
      } else {
        if (val === "") {
          this.warningTextState = true;
        }
        this.detailedInfo_state = false;
        this.$store.commit("cryptoSellPage/set_cryptoAmount", "");
        this.$store.commit("cryptoSellPage/set_fiatCurrencyAmount", 0);
      }
      //法币最大值最小值校验
      this.maxMinCheck();
    },

    //最大值最小值校验
    maxMinCheck() {
      var maxError = `${this.$t("homePage.sellmaxAmount")} ${
        this.cryptoMaxMin.maxAmount
      } ${this.fiatCurrencyInfo.fiat}.`;
      var minError = `${this.$t("homePage.sellminAmount")} ${
        this.cryptoMaxMin.minAmount
      } ${this.fiatCurrencyInfo.fiat}.`;

      try {
        const rampFee = new Big(this.feeInfo.rampFee);
        const fiatCurrencyAmount = new Big(this.fiatCurrencyAmount);
        const CurrentValue = fiatCurrencyAmount.add(rampFee);
        const BelowMinimumValueFlag =
          CurrentValue.cmp(this.cryptoMaxMin.minAmount) < 0 ||
          this.payAmount === "";
        const AboveMaximumValueFlag =
          CurrentValue.cmp(rampFee.add(this.cryptoMaxMin.maxAmount)) > 0;

        // if (Number(this.fiatCurrencyAmount) > this.cryptoMaxMin.maxAmount || Number(this.fiatCurrencyAmount) < this.cryptoMaxMin.minAmount ) {
        if (BelowMinimumValueFlag || AboveMaximumValueFlag) {
          this.warningTextState = true;
          this.detailedInfo_state = false;

          if (AboveMaximumValueFlag) {
            this.payAmount_tips = maxError;
          } else if (BelowMinimumValueFlag) {
            this.payAmount_tips = minError;
          }
        } else {
          this.warningTextState = false;
        }
      } catch (e) {}
    },
    //处理收到的法币的数量和显示状态
    amountControl: debounce(function () {
      this.maxMinCheck();
      //限制法币的最小值、最大值
      if (this.payAmount > 0 && this.payAmount !== "") {
        //计算加密货币数量
        this.basicsInfo(2);
      }
    }, 800),

    // 新卖币数据处理
    /**
     * 修改法币、国家、加密币、网络
     * @param type 1-法币国家 2-加密币网络
     * @param val 需要存储的信息
     */
    modifyInfo(type, val) {
      //当前选择法币国家和选择的法币国家相同不请求、当前选择加密币网络和选择的加密币网络相同不请求
      if (
        type === 1 &&
        val.fiat === this.fiatCurrencyInfo.fiat &&
        val.alpha2 === this.fiatCurrencyInfo.alpha2
      )
        return;
      if (
        type === 2 &&
        val.name === this.cryptoInfo.crypto &&
        val.buyNetwork.network === this.networkInfo.network
      )
        return;
      //基本数据状态
      this.pageInfoState = false;
      //存储法币国家信息
      if (type === 1) {
        //过滤法币信息
        this.$store.commit(
          "cryptoSellPage/set_rawFiat",
          this.fiatCurrencyInfo.fiat
        );
        let fiatCurrencyInfo = {
          fiat: noData(val.fiat), //法币
          fiatSymbol: noData(val.symbol), //法币符号
          flag: noData(val.flag), //国旗
          alpha2: noData(val.alpha2), //国家code
        };
        this.$store.commit(
          "cryptoSellPage/set_fiatCurrencyInfo",
          fiatCurrencyInfo
        );
      } else {
        //存储数字货币信息
        let cryptoInfo = {
          crypto: noData(val.crypto), //数字货币
          cryptoIcon: noData(val.cryptoIcon), //数字货币图标
        };
        this.$store.commit("cryptoSellPage/set_cryptoInfo", cryptoInfo);
        //存储网络信息
        let networkInfo = {
          network: noData(val.network), //网络
          networkIcon: noData(val.networkIcon), //网络图标
          networkName: noData(val.networkName), //网络全称
        };
        this.$store.commit("cryptoSellPage/set_networkInfo", networkInfo);
        this.$store.commit("cryptoSellPage/set_rawFiat", "");
      }
      this.basicsInfo(2, "changeFait");
    },
    /**
     * @param type 1-默认请求 2-携带参数请求
     * @param changeState changeFait-切换法币携带上次选择法币简称
     */
    basicsInfo(type, changeState) {
      // let state = sessionStorage.getItem('merchantType') && sessionStorage.getItem('merchantType') === 'buy';
      let state =
        this.merchantInfo.merchantStatus &&
        this.merchantInfo.merchantType !== "sell";
      if (state) return;
      this.triggerType = common.equipmentEnd === "pc" ? "hover" : "click";
      let _this = this;
      type === 1 ? this.$store.commit("cryptoSellPage/set_rawFiat", "") : "";
      type === 1 ? (this.startRequest = true) : "";
      let params = {
        crypto: "",
        fiat: "",
        cryptoAmount: "",
        network: "",
        alpha2: "",
        payWayCode: null,
        rawCrypto: "",
        merchantParams: {},
      };
      //官网免登陆携带信息
      if (type === 1 && hashQuery().query && !hashQuery().query.appId) {
        params = {
          crypto: noData(hashQuery().query.crypto),
          fiat: noData(hashQuery().query.fiat),
          cryptoAmount: noData(hashQuery().query.amount),
          network: noData(hashQuery().query.network),
          alpha2: noData(hashQuery().query.alpha2),
          payWayCode: null,
          rawCrypto: changeState === "changeFait" ? this.rawFiat : "",
          merchantParams: {},
        };
      }
      if (type === 2) {
        params = {
          crypto: this.cryptoInfo.crypto,
          fiat: this.fiatCurrencyInfo.fiat,
          cryptoAmount: this.cryptoAmount,
          network: this.networkInfo.network,
          alpha2: this.fiatCurrencyInfo.alpha2,
          payWayCode: null,
          rawCrypto: changeState === "changeFait" ? this.rawFiat : "",
          merchantParams: {},
        };
      }
      //带入商户信息 过滤商户加密货币
      if (JSON.stringify(hashQuery().query) !== "{}") {
        params.merchantParams = hashQuery().query;
      } else if (
        JSON.stringify(hashQuery().query) === "{}" &&
        this.merchantInfo.merchantStatus &&
        this.merchantInfo.merchantType === "sell"
      ) {
        params.merchantParams = this.merchantInfo.merchantQueryInfo;
      }
      this.$axios
        .post(this.$api.get_sellInfoFee, params, "")
        .then((res) => {
          if (res && res.data) {
            if (!res.data.checkMerchant) {
              _this.newBasicsInfo(type, changeState);
              return;
            }
            // 存储商户logo
            if (res.data?.merchantConfig?.merchantLogo) {
              this.$store.commit(
                "buyCryptoMerchant/set_merchantLogo",
                res.data.merchantConfig.merchantLogo
              );
            } else {
              this.$store.commit("buyCryptoMerchant/set_merchantLogo", "");
            }
            // 商户验签通过后商户进行了配置之后
            if (res.data?.checkMerchant && res.data?.merchantConfig) {
              this.merchantCustomStyle(res.data?.merchantConfig);
            } else {
              this.merchantCustomStyle();
            }

            this.detailedInfo_state = true;
            _this.set_basicsInfo(res);
            //法币最大最小值校验
            _this.maxMinCheck();
            //基本数据状态
            this.pageInfoState = true;
            this.merchantStatusManagement(res);
          }
          // 防止多次次请求
          type === 1 ? (this.startRequest = false) : "";
        })
        .catch(() => {
          // 防止多次次请求
          type === 1 ? (this.startRequest = false) : "";
          this.merchantCustomStyle();
          //存储商户校验
          this.$store.commit("cryptoSellPage/set_checkMerchant", false);
          //基本数据状态
          this.pageInfoState = true;
          this.merchantStatusManagement({});
          //信息无效清空首页数据
          this.$store.commit("cryptoSellPage/restoreDefault");
        });
    },
    newBasicsInfo(type, changeState) {
      let _this = this;
      type === 1 ? this.$store.commit("cryptoSellPage/set_rawFiat", "") : "";
      type === 1 ? (this.startRequest = true) : "";
      let params = {
        crypto: "",
        fiat: "",
        cryptoAmount: "",
        network: "",
        alpha2: "",
        payWayCode: null,
        rawCrypto: "",
        merchantParams: {},
      };
      //官网免登陆携带信息
      if (type === 1 && hashQuery().query && !hashQuery().query.appId) {
        params = {
          crypto: noData(hashQuery().query.crypto),
          fiat: noData(hashQuery().query.fiat),
          cryptoAmount: noData(hashQuery().query.amount),
          network: noData(hashQuery().query.network),
          alpha2: noData(hashQuery().query.alpha2),
          payWayCode: null,
          rawCrypto: changeState === "changeFait" ? this.rawFiat : "",
          merchantParams: {},
        };
      }
      if (type === 2) {
        params = {
          crypto: this.cryptoInfo.crypto,
          fiat: this.fiatCurrencyInfo.fiat,
          cryptoAmount: this.cryptoAmount,
          network: this.networkInfo.network,
          alpha2: this.fiatCurrencyInfo.alpha2,
          payWayCode: null,
          rawCrypto: changeState === "changeFait" ? this.rawFiat : "",
          merchantParams: {},
        };
      }
      //带入商户信息 过滤商户加密货币
      if (JSON.stringify(hashQuery().query) !== "{}") {
        params.merchantParams = hashQuery().query;
      } else if (
        JSON.stringify(hashQuery().query) === "{}" &&
        this.merchantInfo.merchantStatus &&
        this.merchantInfo.merchantType === "sell"
      ) {
        params.merchantParams = this.merchantInfo.merchantQueryInfo;
      }
      this.$axios
        .post(this.$api.get_sellInfoFee2, params, "")
        .then((res) => {
          if (res && res.data) {
            // 存储商户logo
            if (res.data?.merchantConfig?.merchantLogo) {
              this.$store.commit(
                "buyCryptoMerchant/set_merchantLogo",
                res.data.merchantConfig.merchantLogo
              );
            } else {
              this.$store.commit("buyCryptoMerchant/set_merchantLogo", "");
            }
            // 商户验签通过后商户进行了配置之后
            if (res.data?.checkMerchant && res.data?.merchantConfig) {
              this.merchantCustomStyle(res.data?.merchantConfig);
            } else {
              this.merchantCustomStyle();
            }

            this.detailedInfo_state = true;
            _this.set_basicsInfo(res);
            //法币最大最小值校验
            _this.maxMinCheck();
            //基本数据状态
            this.pageInfoState = true;
            this.merchantStatusManagement(res);
          }
          // 防止多次次请求
          type === 1 ? (this.startRequest = false) : "";
        })
        .catch(() => {
          // 防止多次次请求
          type === 1 ? (this.startRequest = false) : "";
          this.merchantCustomStyle();
          //存储商户校验
          this.$store.commit("cryptoSellPage/set_checkMerchant", false);
          //基本数据状态
          this.pageInfoState = true;
          this.merchantStatusManagement({});
          //信息无效清空首页数据
          this.$store.commit("cryptoSellPage/restoreDefault");
        });
    },

    //存储页面信息
    set_basicsInfo(res) {
      this.cryptoSate = true;
      this.fiatSate = true;
      this.detailedInfo_cryptoAmount = false;
      //存储法币国家信息
      let fiatCurrencyInfo = {
        fiat: noData(res.data.fiat), //法币
        fiatSymbol: noData(res.data.fiatSymbol), //法币符号
        flag: noData(res.data.flag), //国旗
        alpha2: noData(res.data.alpha2), //国家code
      };
      this.$store.commit(
        "cryptoSellPage/set_fiatCurrencyInfo",
        fiatCurrencyInfo
      );
      //存储数字货币信息
      let cryptoInfo = {
        crypto: noData(res.data.crypto), //数字货币
        cryptoIcon: noData(res.data.cryptoIcon), //数字货币图标
        cryptoToFiatPrice: noData(res.data.cryptoToFiatPrice), //数字货币兑法币单价 - 1crypto 约等于 多少 fiat
      };
      this.$store.commit("cryptoSellPage/set_cryptoInfo", cryptoInfo);
      //存储网络信息
      let networkInfo = {
        network: noData(res.data.network), //网络
        networkIcon: noData(res.data.networkIcon), //网络图标
        addressRegex: noData(res.data.addressRegex), //地址正则
        memoRegex: noData(res.data.memoRegex), //memo正则
        networkName: noData(res.data.networkName), //网络全称
      };
      this.$store.commit("cryptoSellPage/set_networkInfo", networkInfo);
      //存储费用信息
      let feeInfo = {
        rampFee: noData(res.data.rampFee), //通道费
        cryptoPrice: noData(res.data.cryptoPrice), //加密货币价格
        fiatSymbol: noData(res.data.fiatSymbol),
      };
      this.$store.commit("cryptoSellPage/set_feeInfo", feeInfo);
      //存储法币最大值最小值限制
      let cryptoMaxMin = {
        maxAmount: noData(res.data.maxLimit),
        minAmount: noData(res.data.minLimit),
      };
      this.$store.commit("cryptoSellPage/set_cryptoMaxMin", cryptoMaxMin);
      //存储数字货币金额
      this.$store.commit(
        "cryptoSellPage/set_cryptoAmount",
        noData(Number(res.data.cryptoAmount))
      );
      //存储法币金额
      let fiatAmount = res.data.fiatAmount < 0 ? 0 : res.data.fiatAmount;
      this.$store.commit(
        "cryptoSellPage/set_fiatCurrencyAmount",
        noData(fiatAmount)
      );
      //存储商户校验
      this.$store.commit(
        "cryptoSellPage/set_checkMerchant",
        res.data.checkMerchant
      );
    },

    // 控制商户自定义样式
    merchantCustomStyle(merchantConfig) {
      let merchantConfigData = {
        menuBarVisible: true,
        customerServiceVisible: true,
        onOrderCompletionBtnVisible: true,
      };
      try {
        if (merchantConfig) {
          if (merchantConfig?.menuBarVisible === 0) {
            merchantConfigData.menuBarVisible = false;
          }
          if (merchantConfig?.customerServiceVisible === 0) {
            merchantConfigData.customerServiceVisible = false;
            // 隐藏聊天机器人
            window?.Intercom("shutdown");
          }
          if (merchantConfig?.onOrderCompletionBtnVisible === 0) {
            merchantConfigData.onOrderCompletionBtnVisible = false;
          }
        }
      } catch (err) {
        console.log("err==>", err);
        merchantConfigData = {
          menuBarVisible: true,
          customerServiceVisible: true,
          onOrderCompletionBtnVisible: true,
        };
      }

      this.$store.commit("set_merchantConfig", merchantConfigData);
    },

    //商户状态管理
    /**
     * @param res - 商户校验参数回调
     */
    merchantStatusManagement(res) {
      let merchantParams =
        JSON.parse(sessionStorage.getItem("buyMerchantInfo")) || {};
      //商户信息有效、network和address参数无效
      if (
        res &&
        res.returnCode === "0000" &&
        res.success === true &&
        res.data !== null &&
        res.data.checkMerchant === true
      ) {
        //page商户
        let routeInfo = JSON.parse(JSON.stringify(hashQuery()));
        let allMerchantInfo = {
          //商户类型
          merchantType: "sell", //api、page
          //商户状态
          merchantStatus: true,
          //api商户信息｜page商户信息
          merchantQueryInfo: routeInfo.fullPath
            ? routeInfo.query
            : this.merchantInfo.merchantQueryInfo,
          //商户地址栏信息
          merchantFullPath:
            routeInfo.fullPath || this.merchantInfo.merchantFullPath,
        };

        this.$store.commit(
          "buyCryptoMerchant/set_merchantInfo",
          allMerchantInfo
        );
        //商户携带加密币、法币信息有效禁止选择，携带法币金额禁止输入
        if (
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).crypto &&
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).cryptoAmount !==
            ""
        ) {
          this.detailedInfo_cryptoAmount = true;
        }
        if (
          (JSON.parse(sessionStorage.getItem("buyMerchantInfo")).crypto &&
            JSON.parse(sessionStorage.getItem("buyMerchantInfo")).crypto !==
              "") ||
          (JSON.parse(sessionStorage.getItem("buyMerchantInfo")).network &&
            JSON.parse(sessionStorage.getItem("buyMerchantInfo")).network !==
              "")
        ) {
          this.cryptoSate = false;
        }
        if (
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).fiat &&
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).fiat !== ""
        ) {
          this.fiatSate = false;
        }
        merchantParams.merchantParam_state = true;
        sessionStorage.setItem(
          "buyMerchantInfo",
          JSON.stringify(merchantParams)
        );
        merchantInfo();
        // 如果商户携带email没有携带token，则清空本地登录信息
        if (
          routeInfo.query.email &&
          routeInfo.query.email !== "" &&
          !routeInfo.query.token &&
          routeInfo.query.email !== AES_Decrypt(localStorage.getItem("email"))
        ) {
          localStorage.removeItem("sign");
          //是否执行一键登陆所需条件
          localStorage.setItem("loginOut", "1");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("userNo");
          localStorage.removeItem("userId");
          localStorage.removeItem("kycStatus");
          this.$store.commit("userInfo/set_token", "");
          this.$store.commit("request/clearToken"); //取消请求
          this.$store.commit("request/emptyToken"); // 清空token数组
          // 存储page商户邮箱
          localStorage.setItem("email", AES_Encrypt(routeInfo.query.email));
          localStorage.setItem(
            "login_email",
            AES_Encrypt(routeInfo.query.email)
          );
        }
        return;
      }
      //商户信息无效
      this.detailedInfo_cryptoAmount = false;
      this.fiatSate = true;
      this.cryptoSate = true;
      //page商户
      let routeInfo = JSON.parse(JSON.stringify(hashQuery()));
      let allMerchantInfo = {
        //商户类型
        merchantType: "sell", //api、page
        //商户状态
        merchantStatus: false,
        //api商户信息｜page商户信息
        merchantQueryInfo: routeInfo.query,
        //商户地址栏信息
        merchantFullPath: routeInfo.fullPath,
      };
      this.$store.commit("buyCryptoMerchant/set_merchantInfo", allMerchantInfo);
      //商户携带加密币、法币信息有效禁止选择，携带法币金额禁止输入
      merchantParams.merchantParam_state = false;
      sessionStorage.setItem("buyMerchantInfo", JSON.stringify(merchantParams));
    },

    // 下一步
    nextStep() {
      this.$store.state.historyTab = "sell";

      //是否是从菜单进入
      this.$store.commit("changeRouterQueryPath", false);
      this.lodingStatus = false;

      //清空邮件单页面跳转状态
      this.$store.state.emailFromPath = "";

      //跳转填写卡信息
      this.$store.state.homeTabstate = "sellCrypto";
      this.$store.state.cardInfoFromPath = "configSell";

      delete this.$store.state.sellForm;
      delete this.$store.state.sellRouterParams.cardInfoList;
      //是否为风险
      if (localStorage.getItem("token")) {
        this.$router.push("/sell-formUserInfo");
        setTimeout(() => {
          this.lodingStatus = true;
        }, 1000);
      } else {
        this.$store.state.emailFromPath = "sellCrypto";
        // 修改地址栏信息(功能: 清除地址栏商户信息)
        if (
          (sessionStorage.getItem("merchantType") &&
            sessionStorage.getItem("merchantType") === "buy") ||
          !sessionStorage.getItem("merchantType")
        ) {
          window.history.replaceState(null, null, "/#/emailCode");
        }
        this.$router.push("/emailCode");
        setTimeout(() => {
          this.lodingStatus = true;
        }, 1000);
      }
    },

    /**
     * @param res - 商户校验参数回调
     * @param merchantParams - 需要存储商户信息
     */
    // merchantStatusManagement(res, merchantParams) {
    //   // 商户信息有效获取商户logo
    //   // if (res && res.returnCode === '0000') {
    //   //   this.getMerchantLogo()
    //   // }

    //   //商户信息有效、network和address参数无效
    //   if (res && res.returnCode === '0000' && res.success === true && res.data === null) {
    //     merchantParams.addressDefault = false;
    //     merchantParams.networkDefault = false;
    //     sessionStorage.setItem('buyMerchantInfo', JSON.stringify(merchantParams));
    //     let routeInfo = JSON.parse(JSON.stringify(hashQuery()));
    //     let allMerchantInfo = {
    //       //商户类型
    //       merchantType: 'sell', //api、page
    //       //商户状态
    //       merchantStatus: true,
    //       //api商户信息｜page商户信息 | sell商户信息
    //       merchantQueryInfo: routeInfo.fullPath ? routeInfo.query : this.merchantInfo.merchantQueryInfo,
    //       //商户地址栏信息
    //       merchantFullPath: routeInfo.fullPath ? routeInfo.fullPath : this.merchantInfo.merchantFullPath
    //     };
    //     this.$store.commit('buyCryptoMerchant/set_merchantInfo', allMerchantInfo);
    //     return;
    //   }

    //   //商户信息有效、network｜address参数有效
    //   if (res && res.returnCode === '0000' && res.success === true && res.data !== null) {
    //     //address: false - Address is not brought out by default
    //     if (res.data.address === false || res.data.address === undefined) {
    //       //No parameter defaults
    //       merchantParams.addressDefault = false;
    //     } else {
    //       merchantParams.addressDefault = true;
    //     }

    //     //network: false - The network is not brought out by default
    //     if (res.data.network === false || res.data.network === undefined) {
    //       //No parameter defaults
    //       merchantParams.networkDefault = false;
    //     } else {
    //       merchantParams.networkDefault = true;
    //     }

    //     sessionStorage.setItem('buyMerchantInfo', JSON.stringify(merchantParams));

    //     let routeInfo = JSON.parse(JSON.stringify(hashQuery()));
    //     let allMerchantInfo = {
    //       //商户类型
    //       merchantType: 'sell', //api、page
    //       //商户状态
    //       merchantStatus: true,
    //       //api商户信息｜page商户信息 | sell商户信息
    //       merchantQueryInfo: routeInfo.fullPath ? routeInfo.query : this.merchantInfo.merchantQueryInfo,
    //       //商户地址栏信息
    //       merchantFullPath: routeInfo.fullPath ? routeInfo.fullPath : this.merchantInfo.merchantFullPath
    //     };
    //     this.$store.commit('buyCryptoMerchant/set_merchantInfo', allMerchantInfo);
    //     return;
    //   }

    //   //商户信息无效
    //   this.fiatSate = true;
    //   this.cryptoSate = true;
    //   this.payAmount = '';
    //   this.detailedInfo_cryptoAmount = false;
    //   merchantParams.addressDefault = false;
    //   merchantParams.networkDefault = false;
    //   merchantParams.merchantParam_state = false;
    //   sessionStorage.setItem('buyMerchantInfo', JSON.stringify(merchantParams));
    //   let routeInfo = JSON.parse(JSON.stringify(hashQuery()));
    //   let allMerchantInfo = {
    //     //商户类型
    //     merchantType: 'sell', //api、page
    //     //商户状态
    //     merchantStatus: false,
    //     //api商户信息｜page商户信息 | sell商户信息
    //     merchantQueryInfo: routeInfo.fullPath ? routeInfo.query : this.merchantInfo.merchantQueryInfo,
    //     //商户地址栏信息
    //     merchantFullPath: routeInfo.fullPath ? routeInfo.fullPath : this.merchantInfo.merchantFullPath
    //   };
    //   this.$store.commit('buyCryptoMerchant/set_merchantInfo', allMerchantInfo);
    //   this.$store.commit('buyCryptoMerchant/set_merchantLogo', '');
    // },
  },
};
</script>

<style lang="scss" src="../css/sellCrypto.scss" scoped></style>
