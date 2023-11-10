/**
 * cryptoSellPage
 * 卖币首页
 */

export default {
  namespaced: true,
  state: {
    //法币国家信息
    fiatCurrencyInfo: {
      fiat: "", //法币
      fiatSymbol: "", //法币符号
      flag: "", //国旗
      alpha2: "", //国家code
    },
    //切换加密币之后存储上一次的加密币简称
    rawFiat: "",
    // 可输入加密币小数位
    crypto_decimalDigits: "",
    //数字货币信息
    cryptoInfo: {
      crypto: "", //数字货币
      cryptoIcon: "", //数字货币图标
      cryptoToFiatPrice: "", //数字货币兑法币单价 - 1crypto 约等于 多少 fiat
    },
    //网络信息
    networkInfo: {
      network: "", //网络
      networkName: "", //网络全称
      networkIcon: "", //网络图标
      addressRegex: "", //地址正则
      memoRegex: "", //memo正则
    },
    //法币最大值最小值
    cryptoMaxMin: {
      minAmount: "",
      maxAmount: "",
    },
    //法币金额
    fiatCurrencyAmount: 0,
    //数字货币金额
    cryptoAmount: 0,
    //费用信息
    feeInfo: {
      rampFee: "", //通道费
      cryptoPrice: "", //法定货币价格
    },
    //商户校验
    checkMerchant: false, //true为商户模式
  },
  mutations: {
    set_fiatCurrencyInfo(state, newData) {
      state.fiatCurrencyInfo = newData;
    },
    set_rawFiat(state, newData) {
      state.rawFiat = newData;
    },
    set_crypto_decimalDigits(state, newData) {
      state.crypto_decimalDigits = newData;
    },
    set_cryptoInfo(state, newData) {
      state.cryptoInfo = newData;
    },
    set_networkInfo(state, newData) {
      state.networkInfo = newData;
    },
    set_cryptoMaxMin(state, newData) {
      state.cryptoMaxMin = newData;
    },
    set_fiatCurrencyAmount(state, newData) {
      state.fiatCurrencyAmount = newData;
    },
    set_cryptoAmount(state, newData) {
      state.cryptoAmount = newData;
    },
    set_feeInfo(state, newData) {
      state.feeInfo = newData;
    },
    set_checkMerchant(state, newData) {
      state.checkMerchant = newData;
    },

    //清空费用数据
    clearFeeInfo(state) {
      state.feeInfo = {
        rampFee: "", //通道费
        cryptoPrice: "", //加密货币价格
      };
    },
    //首页数据恢复默认
    restoreDefault(state) {
      state.fiatCurrencyInfo = {
        fiat: "", //法币
        fiatSymbol: "", //法币符号
        flag: "", //国旗
        alpha2: "", //国家code
      };
      state.cryptoInfo = {
        crypto: "", //数字货币
        cryptoIcon: "", //数字货币图标
        cryptoToFiatPrice: "", //数字货币兑法币单价 - 1crypto 约等于 多少 fiat
      };
      state.networkInfo = {
        network: "", //网络
        networkName: "", //网络全称
        networkIcon: "", //网络图标
        addressRegex: "", //地址正则
        memoRegex: "", //memo正则
      };
      state.cryptoMaxMin = {
        minAmount: "",
        maxAmount: "",
      };
      //法币金额
      state.fiatCurrencyAmount = 0;
      //数字货币金额
      state.cryptoAmount = 0;
      //费用信息
      state.feeInfo = {
        rampFee: "", //通道费
        cryptoPrice: "", //加密货币价格
      };
    },
  },
};
