/**
 * sellPayments
 * 卖币支付信息
 * 二次支付数据、创建订单、选择支付方式
 */

const state = {
  orderNo: "",
  // 订单支付方式信息
  sellPayType: {
    accountType: "", // 1-Bank Account、2-Credit Card
    payWayCode: "19000", // 19000-Bank Account、10010-Credit Card
  },
  // 订单支付信息
  sellPayInfo: {
    bankAccountInfo: {}, // Bank Account表单
    userAccountId: "", // 历史表单id
    // 信用卡表单
    firstName: "",
    lastName: "",
    accountNumber: "",
    phone: "",
    birthDate: "",
  },

  // 交易历史进入所需数据
  //法币国家信息
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
};

const mutations = {
  //保存订单id
  set_orderNo(state, val) {
    state.orderNo = val;
  },
  set_sellPayType(state, val) {
    state.sellPayType = val;
  },
  set_sellPayInfo(state, val) {
    state.sellPayInfo = val;
  },
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
};

export default {
  namespaced: true,
  state,
  mutations,
};
