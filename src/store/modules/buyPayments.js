/**
 * buyPayments
 * 二次支付数据、创建订单、选择支付方式
 */

const state = {
  //创建订单参数
  placeOrderQuery: {
    cryptoCurrency: "",
    address: "",
    network: "",
    fiatCurrency: "",
    amount: "",
    depositType: 2,
    payWayCode: "",
    cryptoCurrencyVolume: "",
    alpha2: "",
    memo: "",
    //商户信息有效携带商户参数
    merchantParam: "",
  },
  //选择支付方式
  payMethodInfo: {
    payWayCode: "", //支付方式code
    payWayName: "", //支付方式名称

    //VA银行信息
    bankInfo: {},
  },
  //信用卡信息id
  userCardId: "",
  //信用卡信息
  creditCardInfo: {
    cardExpireMonth: "",
    cardExpireYear: "",
    cardNumber: "",
    firstname: "",
    lastname: "",
    userCardId: "",
  },
  //信用卡全称
  fullName: "",

  //信用卡历史数据
  creditCardList: [],

  //订单id
  orderNo: "",

  // 尼日利亚订单信息
  nigeriaOrderData: {},

  // 上次支付成功需要回填表单信息
  lastTimePaymentFormInfo: {
    status: false,
  },
};

const mutations = {
  // 存储尼日利亚订单参数
  set_nigeriaOrderData(state, val) {
    // console.log('val', val);
    state.nigeriaOrderData = val;
  },
  //创建订单参数
  set_placeOrderQuery(state, val) {
    state.placeOrderQuery = val;
  },
  //存储创建订单address参数 - 二次支付存储数据
  set_placeOrderQuery_addressNetwork(state, val) {
    state.placeOrderQuery.address = val.address;
    state.placeOrderQuery.network = val.network;
  },
  //存储创建订单amount金额 - 二次支付存储数据
  set_placeOrderQuery_amount(state, val) {
    state.placeOrderQuery.amount = val;
  },
  //存储创建订单法币信息 - 二次支付存储数据
  set_placeOrderQuery_fiatInfo(state, val) {
    state.placeOrderQuery.alpha2 = val.alpha2;
    state.placeOrderQuery.fiatCurrency = val.fiatCurrency;
  },
  //支付方式信息
  set_payMethodInfo(state, val) {
    state.payMethodInfo = val;
  },
  //保存信用卡信息id
  set_userCardId(state, val) {
    state.userCardId = val;
  },
  //保存信用卡信息
  set_creditCardInfo(state, val) {
    state.creditCardInfo = val;
  },
  set_fullName(state, val) {
    state.fullName = val;
  },
  set_creditCardList(state, val) {
    state.creditCardList = val;
  },
  //保存订单id
  set_orderNo(state, val) {
    state.orderNo = val;
  },
  set_lastTimePaymentFormInfo(state, val) {
    state.lastTimePaymentFormInfo = val;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
