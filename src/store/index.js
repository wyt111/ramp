import Vue from "vue";
import Vuex from "vuex";
import { defaultLang } from "@/utils/i18n/lang.config.js";

Vue.use(Vuex);
import getters from "@/store/getters";

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context("./modules", true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
const store = new Vuex.Store({
  modules,
  getters,
  state: {
    isShowImportantUpdates: false,
    showImportantUpdatesTimeStamp: 0,
    //页面滚动状态
    scrollState: false,
    tipsStatus: false,

    //登陆后前往页面地址
    emailFromPath: "",
    //退款页
    emailFromquery_refund_view: {
      orderId: "",
      cryptocurrency: "",
      fiatCode: "",
    },
    //交易历史详情
    emailFromquery_tradeHistoryDetails_view: {
      orderId: "",
    },
    //修改卡信息
    emailFromquery_sellCardInfo_view: {
      orderId: "",
      position_alpha2: "",
      position_code: "",
      getAmount: "",
    },
    //新增墨西哥支付状态
    MEXPayStatus: false,
    cardInfoFromPath: "", //填写卡信息后返回页面地址
    //返回首页状态
    homeTabstate: "buyCrypto", //sellCrypto buyCrypto
    tableState: false, //有参数 隐藏买币或者卖币

    //订单tab状态 sell | buy
    historyTab: "buy",

    //语言
    language: "",

    //买币支付状态tab
    buyPayProcessTab: {
      tabState: true,
    },

    //买币页面参数
    buyRouterParams: {
      payMethod: {
        bankInfo: {},
      },
    },
    //卖币页面参数
    sellRouterParams: {
      cardInfoList: [],
      confirmParams: {},
      //交易历史跳转订单订单状态返回
      historyBack: "",
    },
    //菜单展示
    routerViewState: true,
    sellForm: {},

    //卖币费用请求参数
    feeParams: {
      symbol: "",
      fiatCode: "",
      alpha2: "",
    },
    sellOrderId: "",

    //ajax请求队列
    cancelTokenArr: [],

    //多语言
    languageValue: defaultLang, // EN-US ZH-TW
    LanguageIsShow: false,
    menuState: false,
    isLogin: false,

    routerQueryPath: false, // 修改是否从带单进入登录
    nextOrderState: 1, // 买币默认步骤状态

    merchantConfig: {
      // 商户自定义样式
      menuBarVisible: false,
      onOrderCompletionBtnVisible: true,
      customerServiceVisible: true,
    },

    codeState: false,
    isShowSelectCountry: true,
    isSourceRefund: false,

    ovo_va_mex_qrs_Status: false,
  },
  mutations: {
    changeisShowImportantUpdates(state, val) {
      state.isShowImportantUpdates = val.flag;
      state.showImportantUpdatesTimeStamp = val.timeStamp || 0;
    },
    changeIsShowSelectCountry(state, vla) {
      state.isShowSelectCountry = vla;
    },
    set_isSourceRefund(state, vla) {
      state.isSourceRefund = vla;
    },
    set_merchantConfig(state, vla) {
      state.merchantConfig = vla;
    },

    //结束所有请求进程
    pushToken(state, payload) {
      state.cancelTokenArr.push(payload.cancelToken);
    },
    DEL_ITEM(state, id) {
      state.sellForm = id;
    },
    clearToken({ cancelTokenArr }) {
      cancelTokenArr.forEach((item) => {
        if (item) {
          item("路由跳转取消请求");
        }
      });
      cancelTokenArr = [];
    },
    emptyToken(state) {
      state.cancelTokenArr = [];
    },
    //修改恢复买币进度条状态
    changeBuyPayProcessTab(state, val) {
      state.buyPayProcessTab.tabState = val;
    },
    // 修改是否从带单进入登录
    changeRouterQueryPath(state, flag) {
      state.routerQueryPath = flag;
    },
    // 修改登陆后前往页面地址
    changeEmailFromPath(state, path) {
      state.emailFromPath = path;
    },
    // 修改返回首页状态
    changeHomeTabstate(state, tab) {
      state.homeTabstate = tab;
    },
    //修改二次支付数据
    setbuyPaymentData(state, val) {
      state.buyPaymentParams = val;
    },

    set_ovo_va_mex_qrs_Status(state, val) {
      state.ovo_va_mex_qrs_Status = val;
    },
    set_tipsStatus(state, val) {
      state.tipsStatus = val;
    },
  },
  actions: {
    //结束所有请求进程
    clearAllQuery({ commit }) {
      commit("clearToken");
      commit("emptyToken");
    },
  },
});
export default store;
