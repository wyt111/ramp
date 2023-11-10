/**
 * cryptoBuyPage
 * 买币首页
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
    // 法币可输入小数位
    fiat_decimalDigits: 0,
    //切换法币之后存储上一次的法币简称
    rawFiat: "",
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
    fiatmaxMin: {
      minAmount: "",
      maxAmount: "",
    },
    //法币金额
    fiatCurrencyAmount: undefined,
    //数字货币金额
    cryptoAmount: 0,
    //费用信息
    feeInfo: {
      rampFee: "", //通道费
      networkFee: "", //网络费
      discountRampFee: "", //折扣后的通道费
      cryptoPrice: "", //加密货币价格
    },
    //商户校验
    checkMerchant: false, //true为商户模式
    worldFiatInfo: {
      updateTime: 0, // 列表更新时间
      fiatList: [], // 国家法币列表
    },
  },
  mutations: {
    set_fiatCurrencyInfo(state, newData) {
      state.fiatCurrencyInfo = newData;
    },
    set_fiat_decimalDigits(state, newData) {
      state.fiat_decimalDigits = newData;
    },
    set_rawFiat(state, newData) {
      state.rawFiat = newData;
    },
    set_cryptoInfo(state, newData) {
      state.cryptoInfo = newData;
    },
    set_networkInfo(state, newData) {
      state.networkInfo = newData;
    },
    set_fiatmaxMin(state, newData) {
      state.fiatmaxMin = newData;
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
    set_worldFiatInfo(state, fiatList) {
      state.worldFiatInfo = {
        updateTime: Date.now(), // 列表更新时间
        fiatList: fiatList, // 国家法币列表
      };
    },
    //清空费用数据
    clearFeeInfo(state) {
      state.feeInfo = {
        rampFee: "", //通道费
        networkFee: "", //网络费
        discountRampFee: "", //折扣后的通道费
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
      state.fiatmaxMin = {
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
        networkFee: "", //网络费
        discountRampFee: "", //折扣后的通道费
        cryptoPrice: "", //加密货币价格
      };
      // 国家法币列表
      state.worldFiatInfo = {
        updateTime: 0, // 列表更新时间
        fiatList: [], // 国家法币列表
      };
    },
  },
};
