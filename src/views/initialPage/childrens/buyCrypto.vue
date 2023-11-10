<template>
  <div id="buyCrypto">
    <!-- 买币功能模块 -->
    <div class="buyCrypto_content" @scroll="scroll">
      <div class="methods_select cursor">
        <div class="form_title pay_title">{{ $t("homePage.youPay") }}</div>
        <template v-if="fiatCurrencyInfo.fiat">
          <div
            class="flex"
            :class="{
              inputFocus: inputFocus,
              warningTextState: warningTextState,
            }"
          >
            <div class="methods_select-left">
              <van-field
                class="pay_input"
                :type="youPaytype"
                @input="inputChange"
                v-model.number="payAmount"
                inputmode="decimal"
                @blur="youPayBlur"
                @focus="inputFocus = true"
                :disabled="payAmountState"
                placeholder="0.00"
                :formatter="payAmountFormatter"
              />
            </div>
            <div class="get_company" @click="openSearch('payCurrency')">
              <div class="getImg fiatImg">
                <img
                  :src="fiatCurrencyInfo.flag"
                  :key="fiatCurrencyInfo.flag"
                />
              </div>
              <div class="getText">{{ fiatCurrencyInfo.fiat }}</div>
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

        <div
          class="warning_text"
          :class="{ show_warning_text: warningTextState }"
        >
          <span v-if="warningTextState" v-html="payAmount_tips"></span>
        </div>
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
              <p>{{ $t("homePage.buyReceiveTips") }}</p>
              <div slot="reference">
                <img
                  class="tipsIcon"
                  src="@/assets/images/exclamatoryMarkIcon.svg"
                />
              </div>
            </el-popover>
          </div>
        </div>
        <template v-if="cryptoInfo.crypto">
          <div class="flex">
            <div class="methods_select-left">
              <div class="get_input">
                <span v-if="cryptoAmount !== ''">{{ cryptoAmount }}</span>
                <span class="no_getAmount" v-else>0.00</span>
              </div>
            </div>
            <div class="get_company" @click="openSearch('currency')">
              <div class="get_company_flex">
                <div class="getImg">
                  <img
                    class="coinImg"
                    :src="cryptoInfo.cryptoIcon"
                    :key="cryptoInfo.cryptoIcon"
                  />
                  <img
                    v-if="networkInfo.networkIcon && networkInfo.networkIcon"
                    :src="networkInfo.networkIcon"
                    :key="networkInfo.networkIcon"
                    alt=""
                    class="networkImg"
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

      <!-- 费用模块 -->
      <div class="calculationProcess" v-if="detailedInfo_state">
        <IncludedDetails ref="includedDetails_ref" :type="1" :isHome="true" />
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
        {{ $t("homePage.bottomTips2") }} {{ cryptoInfo.crypto }}
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
/**
 * 页面小数同意处理
 * 数值>0，小数点后保留2位
 * 数值<0，小数点后最多保留6位
 */
import common from "@/utils/common";
import { hashQuery, merchantInfo } from "@/utils/publicRequest";
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import { mapState } from "vuex";
import { debounce, noData, digitalInputFormatter, ObjectLength } from "@/utils";
import { AES_Decrypt, AES_Encrypt } from "@/utils/encryp";

export default {
  name: "buyCrypto",
  components: {
    IncludedDetails,
  },
  data() {
    return {
      //you pay Prompt information
      warningTextState: false,

      youPaytype: "number", // Number | digit

      //Expense information
      detailedInfo_state: false,

      //you get Currency information
      cryptoSate: false,

      triggerType: "hover",

      inputFocus: false,
      lodingStatus: true,
      //商户携带参数输入框状态
      fiatAmount_inputStatus: false,
      //商户选择法币和国家状态
      fiatSate: false,

      //基本数据接口状
      pageInfoState: false,

      payAmount_tips: "",
    };
  },
  activated() {
    //获取接收方式页网络数据,原因 - 输入金额不满足网络最大值最小值
    let fiatmaxMin = {
      minAmount: this.fiatmaxMin.minAmount,
      maxAmount: this.fiatmaxMin.maxAmount,
    };
    this.$store.commit("cryptoBuyPage/set_fiatmaxMin", fiatmaxMin);
    this.maxMinCheck();
  },
  computed: {
    // 首页基本信息
    ...mapState("cryptoBuyPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      fiat_decimalDigits: (state) => state.fiat_decimalDigits,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      fiatmaxMin: (state) => state.fiatmaxMin,
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
        return this.fiatCurrencyAmount;
      },
      set() {
        return this.fiatCurrencyAmount;
      },
    },

    //you pay Input status - 数据加载后放开状态
    payAmountState() {
      if (
        this.fiatmaxMin.maxAmount > 0 &&
        this.fiatmaxMin.minAmount > 0 &&
        this.fiatAmount_inputStatus
      ) {
        return false;
      } else {
        return true;
      }
    },

    //continue button status - 限制确认按钮状态
    continueState() {
      if (
        this.payAmount !== "" &&
        Number(this.payAmount) >= this.fiatmaxMin.minAmount &&
        Number(this.payAmount) <= this.fiatmaxMin.maxAmount &&
        this.cryptoAmount !== "" &&
        Number(this.payAmount) > 0 &&
        this.lodingStatus &&
        this.pageInfoState === true &&
        this.cryptoAmount > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    //监听you pay值完成页面基本数据加载
    payAmount: {
      handler(val, oldVal) {
        if (oldVal !== undefined && Number(val) !== Number(oldVal)) {
          // && Number(oldVal) !== 0
          this.amountControl();
        }
      },
    },
  },
  methods: {
    scroll() {
      this.$refs.includedDetails_ref.popover_state = false;
    },

    //选择法币或加密货币
    openSearch(view) {
      //存在商户无法切换法币、加密货币
      if (view === "currency" && !this.cryptoSate) {
        return;
      }
      if (view === "payCurrency" && !this.fiatSate) {
        return;
      }
      this.$parent.openSearch(view);
    },
    //法币币种为USD如果少于两位小数，将自动添加0
    youPayBlur() {
      this.inputFocus = false;
    },
    // 格式化输入内容
    payAmountFormatter(str) {
      str += "";
      // 替换所有的非数字和小数点为空字符串
      let replacedStr = str.replace(/[^\d\.]/g, "");
      // 确保最多只有一个小数点
      const dotIndex = replacedStr.indexOf(".");
      if (dotIndex !== -1) {
        replacedStr =
          replacedStr.slice(0, dotIndex + 1) +
          replacedStr.slice(dotIndex + 1).replace(/\./g, "");
      }
      // 不能以数字0为开头
      if (/^0\d/.test(replacedStr)) {
        if (/^00+$/.test(replacedStr)) {
          replacedStr = "0";
        } else {
          replacedStr = replacedStr.replace(/^0+/, ""); // 去除数字0开头
        }
      }
      // 如果以.开头添加0前缀
      if (replacedStr.startsWith(".")) {
        replacedStr = "0" + replacedStr;
      }
      // 小数位限制
      if (this.fiat_decimalDigits > 0) {
        this.youPaytype = "number"; // number | digit
        replacedStr = replacedStr.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        replacedStr = replacedStr.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        replacedStr = replacedStr
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        // replacedStr = replacedStr.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        let n = this.fiat_decimalDigits || 0;
        replacedStr = replacedStr.replace(
          new RegExp(`^(-)?(\\d*\\.?\\d{0,${n}}).*$`),
          "$2"
        ); //动态限制小数位数
        replacedStr = replacedStr.replace(/^\./g, ""); //首位不能输入“.”
        if (replacedStr.indexOf(".") < 0 && replacedStr != "") {
          //如果没有小数点，首位不能为0，如01、02...
          replacedStr = parseFloat(replacedStr);
        }
        return replacedStr;
      }
      this.youPaytype = "digit"; // number | digit
      return replacedStr;
    },
    //法币币种为USD限制只能输入两位小数
    inputChange(val) {
      //法币最大值最小值校验
      this.maxMinCheck();
      //新增优化处理
      this.$store.commit("cryptoBuyPage/set_fiatCurrencyAmount", val);
      // if (val === '') {
      //   this.warningTextState = false;
      //   this.detailedInfo_state = false;
      //   this.$store.commit('cryptoBuyPage/set_cryptoAmount', '');
      // }
    },

    //最大值最小值校验
    maxMinCheck() {
      var maxError = `${this.$t("homePage.maxAmountTips")} ${
        this.fiatmaxMin.maxAmount
      } ${this.fiatCurrencyInfo.fiat}.`;
      var minError = `${this.$t("homePage.minAmountTips")} ${
        this.fiatmaxMin.minAmount
      } ${this.fiatCurrencyInfo.fiat}.`;
      if (
        Number(this.payAmount) > this.fiatmaxMin.maxAmount ||
        Number(this.payAmount) < this.fiatmaxMin.minAmount
      ) {
        this.warningTextState = true;
        this.detailedInfo_state = false;
        this.$store.commit("cryptoBuyPage/set_cryptoAmount", "");
        if (Number(this.payAmount) > this.fiatmaxMin.maxAmount) {
          this.payAmount_tips = maxError;
        } else if (Number(this.payAmount) < this.fiatmaxMin.minAmount) {
          this.payAmount_tips = minError;
        }
      } else {
        this.warningTextState = false;
      }
    },

    formatter(val) {
      // 小数位限制
      if (this.fiat_decimalDigits > 0) {
        this.youPaytype = "number"; // number | digit
        val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        // val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        let n = this.fiat_decimalDigits || 0;
        val = val.replace(new RegExp(`^(-)?(\\d*\\.?\\d{0,${n}}).*$`), "$2"); //动态限制小数位数
        val = val.replace(/^\./g, ""); //首位不能输入“.”
        if (val.indexOf(".") < 0 && val != "") {
          //如果没有小数点，首位不能为0，如01、02...
          val = parseFloat(val);
        }
        return val;
      }
      this.youPaytype = "digit"; // number | digit
      return val;
    },

    //处理收到的法币的数量和显示状态
    amountControl: debounce(function () {
      this.maxMinCheck();
      //限制法币的最小值、最大值
      if (
        Number(this.payAmount) >= this.fiatmaxMin.minAmount &&
        Number(this.payAmount) <= this.fiatmaxMin.maxAmount
      ) {
        //计算加密货币数量
        this.basicsInfo(2);
      }
    }, 800),

    //--------- 优化部分 ------------
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
          "cryptoBuyPage/set_rawFiat",
          this.fiatCurrencyInfo.fiat
        );
        let fiatCurrencyInfo = {
          fiat: noData(val.fiat), //法币
          fiatSymbol: noData(val.symbol), //法币符号
          flag: noData(val.flag), //国旗
          alpha2: noData(val.alpha2), //国家code
        };
        this.$store.commit(
          "cryptoBuyPage/set_fiatCurrencyInfo",
          fiatCurrencyInfo
        );
        // 存储法币可输入小数位
        this.$store.commit(
          "cryptoBuyPage/set_fiat_decimalDigits",
          val.decimalDigits
        );
      } else {
        //存储数字货币信息
        let cryptoInfo = {
          crypto: noData(val.crypto), //数字货币
          cryptoIcon: noData(val.cryptoIcon), //数字货币图标
        };
        this.$store.commit("cryptoBuyPage/set_cryptoInfo", cryptoInfo);
        //存储网络信息
        let networkInfo = {
          network: noData(val.network), //网络
          networkIcon: noData(val.networkIcon), //网络图标
          networkName: noData(val.networkName), //网络全称
        };
        this.$store.commit("cryptoBuyPage/set_networkInfo", networkInfo);
        this.$store.commit("cryptoBuyPage/set_rawFiat", "");
      }
      this.basicsInfo(2, "changeFait");
    },
    /**
     * @param type 1-默认请求 2-携带参数请求
     * @param changeState changeFait-切换法币携带上次选择法币简称
     */
    async basicsInfo(type, changeState) {
      let state =
        sessionStorage.getItem("merchantType") &&
        sessionStorage.getItem("merchantType") === "sell";
      if (state) return;
      let merchantType = sessionStorage.getItem("merchantType");
      if (merchantType !== "buy") return;
      //提示效果判断
      this.triggerType = common.equipmentEnd === "pc" ? "hover" : "click";
      let _this = this;
      type === 1 ? this.$store.commit("cryptoBuyPage/set_rawFiat", "") : "";
      let params = {
        crypto: "",
        fiat: "",
        side: "buy",
        amount: "",
        alpha2: "",
        network: "",
        payWayCode: null,
        rawFiat: "",
      };
      //官网免登陆携带信息
      if (type === 1 && hashQuery().query && !hashQuery().query.appId) {
        params = {
          crypto: noData(hashQuery().query.crypto),
          fiat: noData(hashQuery().query.fiat),
          side: "buy",
          amount: noData(hashQuery().query.amount),
          alpha2: noData(hashQuery().query.alpha2),
          network: noData(hashQuery().query.network),
          payWayCode: null,
          rawFiat: "",
        };
      }
      if (type === 2) {
        params = {
          crypto: this.cryptoInfo.crypto,
          fiat: this.fiatCurrencyInfo.fiat,
          side: "buy",
          amount: this.fiatCurrencyAmount,
          alpha2: this.fiatCurrencyInfo.alpha2,
          network: this.networkInfo.network,
          networkName: noData(this.networkInfo.networkName), //网络全称
          payWayCode: null,
          rawFiat: changeState === "changeFait" ? this.rawFiat : "",
        };
      }
      //带入商户信息 过滤商户加密货币
      let merchantInfo = "";
      if (JSON.stringify(hashQuery().query) !== "{}") {
        merchantInfo = hashQuery().fullPath;
      } else if (
        JSON.stringify(hashQuery().query) === "{}" &&
        this.merchantInfo.merchantType !== "api" &&
        this.merchantInfo.merchantStatus === true
      ) {
        merchantInfo = this.merchantInfo.merchantFullPath;
      }
      let res = await this.$axios
        .post(this.$api.post_buyInfoFee + "?" + merchantInfo, params, "")
        .catch(() => {});
      if (res && res.data) {
        if (!res.data.checkMerchant) {
          await _this.newBasicsInfo(type, changeState);
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
        return;
      }
      if (error.message === "重复请求，自动拦截并取消") {
        this.warningTextState = false;
        return;
      }
      // 失败和没有通过验证处理
      this.merchantCustomStyle();
      //存储商户校验
      this.$store.commit("cryptoBuyPage/set_checkMerchant", false);
      //基本数据状态
      this.pageInfoState = true;
      this.merchantStatusManagement({});
      //信息无效清空首页数据
      this.$store.commit("cryptoBuyPage/restoreDefault");
      //存储用户是否有折扣
      this.$store.commit("userInfo/set_isDiscount", false);
    },
    // 新验签和费用接口兼容
    async newBasicsInfo(type, changeState) {
      let _this = this;
      type === 1 ? this.$store.commit("cryptoBuyPage/set_rawFiat", "") : "";
      let params = {
        crypto: "",
        fiat: "",
        side: "buy",
        amount: "",
        alpha2: "",
        network: "",
        payWayCode: null,
        rawFiat: "",
      };
      //官网免登陆携带信息
      if (type === 1 && hashQuery().query && !hashQuery().query.appId) {
        params = {
          crypto: noData(hashQuery().query.crypto),
          fiat: noData(hashQuery().query.fiat),
          side: "buy",
          amount: noData(hashQuery().query.amount),
          alpha2: noData(hashQuery().query.alpha2),
          network: noData(hashQuery().query.network),
          payWayCode: null,
          rawFiat: "",
        };
      }
      if (type === 2) {
        params = {
          crypto: this.cryptoInfo.crypto,
          fiat: this.fiatCurrencyInfo.fiat,
          side: "buy",
          amount: this.fiatCurrencyAmount,
          alpha2: this.fiatCurrencyInfo.alpha2,
          network: this.networkInfo.network,
          networkName: noData(this.networkInfo.networkName), //网络全称
          payWayCode: null,
          rawFiat: changeState === "changeFait" ? this.rawFiat : "",
        };
      }
      //带入商户信息 过滤商户加密货币
      let merchantInfo = "";
      if (JSON.stringify(hashQuery().query) !== "{}") {
        merchantInfo = hashQuery().fullPath;
      } else if (
        JSON.stringify(hashQuery().query) === "{}" &&
        this.merchantInfo.merchantType !== "api" &&
        this.merchantInfo.merchantStatus === true
      ) {
        merchantInfo = this.merchantInfo.merchantFullPath;
      }
      let res = await this.$axios
        .post(this.$api.post_buyInfoFee2 + "?" + merchantInfo, params, "")
        .catch(() => {});
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
        return;
      }
      // 失败和没有通过验证处理
      this.merchantCustomStyle();
      //存储商户校验
      this.$store.commit("cryptoBuyPage/set_checkMerchant", false);
      //基本数据状态
      this.pageInfoState = true;
      this.merchantStatusManagement({});
      //信息无效清空首页数据
      this.$store.commit("cryptoBuyPage/restoreDefault");
      //存储用户是否有折扣
      this.$store.commit("userInfo/set_isDiscount", false);
    },

    //存储页面信息
    set_basicsInfo(res) {
      this.cryptoSate = true;
      this.fiatSate = true;
      this.fiatAmount_inputStatus = true;
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
      // 存储法币可输入小数位
      this.$store.commit(
        "cryptoBuyPage/set_fiat_decimalDigits",
        res.data.decimalDigits
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
      //存储法币最大值最小值限制
      let fiatmaxMin = {
        maxAmount: noData(res.data.maxAmount),
        minAmount: noData(res.data.minAmount),
      };
      this.$store.commit("cryptoBuyPage/set_fiatmaxMin", fiatmaxMin);
      //存储数字货币金额
      let cryptoAmount = res.data.discount
        ? res.data.discountCryptoAmount
        : res.data.cryptoAmount;
      this.$store.commit(
        "cryptoBuyPage/set_cryptoAmount",
        noData(cryptoAmount)
      );
      //存储法币金额
      this.$store.commit(
        "cryptoBuyPage/set_fiatCurrencyAmount",
        noData(res.data.fiatAmount)
      );
      //存储商户校验
      this.$store.commit(
        "cryptoBuyPage/set_checkMerchant",
        res.data.checkMerchant
      );
      //存储用户是否有折扣
      this.$store.commit("userInfo/set_isDiscount", res.data.discount);
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
        let isMerchantInfo =
          ObjectLength(routeInfo.query) && routeInfo.query.appId !== undefined;
        let allMerchantInfo = {
          //商户类型
          merchantType: "page", //api、page
          //商户状态
          merchantStatus: true,
          //api商户信息｜page商户信息
          merchantQueryInfo: isMerchantInfo
            ? routeInfo.query
            : this.merchantInfo.merchantQueryInfo,
          //商户地址栏信息
          merchantFullPath: isMerchantInfo
            ? routeInfo.fullPath
            : this.merchantInfo.merchantFullPath,
        };
        // 商户没有携带type、showTable
        if (
          !routeInfo.query.type &&
          !routeInfo.query.showTable &&
          routeInfo.query.appId &&
          routeInfo.query.appId !== "ahzxh0klegv1fzol"
        ) {
          allMerchantInfo.merchantQueryInfo.type = "buy";
          allMerchantInfo.merchantQueryInfo.showTabble = "buy";
          this.$store.state.tableState = true;
          this.$store.state.homeTabstate = "buyCrypto";
        }
        // 商户携带type、没有携带showTable
        if (
          routeInfo.query.type &&
          routeInfo.query.type === "buy" &&
          !routeInfo.query.showTable &&
          routeInfo.query.appId &&
          routeInfo.query.appId !== "ahzxh0klegv1fzol"
        ) {
          allMerchantInfo.merchantQueryInfo.type = "buy";
          allMerchantInfo.merchantQueryInfo.showTabble = "buy";
          this.$store.state.tableState = true;
          this.$store.state.homeTabstate = "buyCrypto";
        }
        // 商户没有携带type、携带showTable
        if (
          !routeInfo.query.type &&
          routeInfo.query.showTable &&
          routeInfo.query.showTable === "buy" &&
          routeInfo.query.appId &&
          routeInfo.query.appId !== "ahzxh0klegv1fzol"
        ) {
          allMerchantInfo.merchantQueryInfo.type = "buy";
          allMerchantInfo.merchantQueryInfo.showTabble = "buy";
          this.$store.state.tableState = true;
          this.$store.state.homeTabstate = "buyCrypto";
        }
        this.$store.commit(
          "buyCryptoMerchant/set_merchantInfo",
          allMerchantInfo
        );
        //商户携带加密币、法币信息有效禁止选择，携带法币金额禁止输入
        if (
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).fiatAmount &&
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).fiatAmount !==
            ""
        ) {
          this.fiatAmount_inputStatus = false;
        }
        if (
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).crypto &&
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).crypto !== "" &&
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).network &&
          JSON.parse(sessionStorage.getItem("buyMerchantInfo")).network !== ""
        ) {
          this.cryptoSate = false;
        }
        // if ((JSON.parse(sessionStorage.getItem('buyMerchantInfo')).crypto && JSON.parse(sessionStorage.getItem('buyMerchantInfo')).crypto !== '') || (JSON.parse(sessionStorage.getItem('buyMerchantInfo')).network && JSON.parse(sessionStorage.getItem('buyMerchantInfo')).network !== '')) {
        //   this.cryptoSate = false;
        // }
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
      this.fiatAmount_inputStatus = true;
      this.fiatSate = true;
      this.cryptoSate = true;
      //page商户
      let allMerchantInfo = {
        //商户类型
        merchantType: "page", //api、page
        //商户状态
        merchantStatus: false,
        //api商户信息｜page商户信息
        merchantQueryInfo: {},
        //商户地址栏信息
        merchantFullPath: "",
      };
      this.$store.commit("buyCryptoMerchant/set_merchantInfo", allMerchantInfo);
      window.history.replaceState(null, null, "/#/");
      //商户携带加密币、法币信息有效禁止选择，携带法币金额禁止输入
      merchantParams.merchantParam_state = false;
      sessionStorage.setItem("buyMerchantInfo", JSON.stringify(merchantParams));
    },

    //下一步
    nextStep() {
      this.$store.state.historyTab = "buy";

      this.$store.commit("changeRouterQueryPath", false);
      this.$store.commit("secondaryBuyPayments/set_backHome_status", false);
      //买币流程步骤条
      this.$store.commit("changeBuyPayProcessTab", true);
      //loading加载
      this.lodingStatus = false;
      //校验登陆信息
      if (
        localStorage.getItem("token") &&
        localStorage.getItem("token") !== "" &&
        localStorage.getItem("token") !== null
      ) {
        //查询是否是风险账号
        this.$axios
          .post(this.$api.post_kycDisabled, "", "")
          .then((res) => {
            if (res) {
              if (res.data) {
                this.lodingStatus = true;
                this.isKycLoginToast(this.$parent.$parent);
              } else {
                //清空返回首页弹窗状态
                this.$store.commit("set_tipsStatus", false);
                this.$store.state.homeTabstate = "buyCrypto";
                //配置商户携带地址参数(address)并且有效，跳转到支付方式页
                if (
                  this.merchantInfo.merchantStatus &&
                  this.merchantInfo.merchantQueryInfo.address
                ) {
                  //定义创建订单参数
                  let params = {
                    cryptoCurrency: this.cryptoInfo.crypto,
                    address: this.merchantInfo.merchantQueryInfo.address,
                    network: this.networkInfo.network,
                    fiatCurrency: this.fiatCurrencyInfo.fiat,
                    amount: this.fiatCurrencyAmount,
                    depositType: 2,
                    payWayCode: "",
                    cryptoCurrencyVolume: this.cryptoAmount,
                    alpha2: this.fiatCurrencyInfo.alpha2,
                    memo: this.merchantInfo.merchantQueryInfo.memo,
                    //商户信息有效携带商户参数
                    merchantParam: this.merchantInfo.merchantFullPath,
                  };
                  this.$store.commit("buyPayments/set_placeOrderQuery", params);
                  this.$router.push(`/paymentMethod`).then(() => {
                    this.lodingStatus = true;
                  });
                } else {
                  this.$router.push(`/receivingMode`).then(() => {
                    this.lodingStatus = true;
                  });
                }
              }
            } else {
              this.lodingStatus = true;
            }
          })
          .catch(() => {
            this.lodingStatus = true;
            this.$store.commit("changeEmailFromPath", "buyCrypto");
            this.$store.commit("changeHomeTabstate", "buyCrypto");
          });
      } else {
        this.$store.commit("changeEmailFromPath", "buyCrypto");
        this.$store.commit("changeHomeTabstate", "buyCrypto");
        // 修改地址栏信息(功能: 清除地址栏商户信息)
        if (
          (sessionStorage.getItem("merchantType") &&
            sessionStorage.getItem("merchantType") === "buy") ||
          !sessionStorage.getItem("merchantType")
        ) {
          window.history.replaceState(null, null, "/#/emailCode");
        }
        this.$router.push(`/emailCode`).then(() => {
          this.lodingStatus = true;
        });
      }
    },
  },
};
</script>

<style lang="scss" src="../css/buyCrypto.scss" scoped></style>
