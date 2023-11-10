/**
 * secondaryBuyPayments
 * 二次支付
 */
export default {
  namespaced: true,
  state: {
    buyPayment_secondPay: {}, //二次支付所需参数
    buyForm: {}, //二次支付信用卡表单信息
    fiatCurrencyAmount_secondPay: 0, //二次支付所需要金额

    //二次支付费用、金额、法币、加密、网络信息
    //存储法币国家信息
    fiatCurrencyInfo: {
      fiat: "", //法币
      fiatSymbol: "", //法币符号
      flag: "", //国旗
      alpha2: "", //国家code
    },
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
    //法币金额
    fiatCurrencyAmount: 0,
    //数字货币金额
    cryptoAmount: 0,
    //费用信息
    feeInfo: {
      rampFee: "", //通道费
      networkFee: "", //网络费
      discountRampFee: "", //折扣后的通道费
      cryptoPrice: "", //加密货币价格
    },
    payMethodInfo: {
      payWayCode: "", //支付方式code
      payWayName: "", //支付方式名称
    },
    //所有路由点击返回到首页状态
    backHome_status: false,
  },
  mutations: {
    //修改二次支付数据
    set_buyPayment_secondPay(state, val) {
      state.buyPayment_secondPay = val;
    },
    //二次支付修改卡数据
    setBuyFromData(state, val) {
      state.buyForm = val;
    },
    //存储法币金额
    set_fiatCurrencyAmount_secondPay(state, val) {
      state.fiatCurrencyAmount_secondPay = val;
    },

    //存储二次支付费用、金额、法币、加密、网络信息
    set_fiatCurrencyInfo(state, newData) {
      state.fiatCurrencyInfo = newData;
    },
    set_cryptoInfo(state, newData) {
      state.cryptoInfo = newData;
    },
    set_networkInfo(state, newData) {
      state.networkInfo = newData;
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
    set_payMethodInfo(state, newData) {
      state.payMethodInfo = newData;
    },
    set_backHome_status(state, newData) {
      state.backHome_status = newData;
    },
  },
};
