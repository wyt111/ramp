import Home from "@/views/initialPage";

export const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    redirectTo: "/index",
    redirect: "index",
    meta: {
      title: "Home",
      keepAlive: true,
    },
  },
  {
    path: "/index",
    name: "home",
    component: Home,
    meta: {
      title: "Home",
      keepAlive: true,
    },
  },
  //------------------------------ 买币相关 ------------------------------
  {
    path: "/receivingMode",
    name: "receivingMode",
    component: () => import("../views/buyCurrency/receivingMode/index.vue"),
    meta: {
      title: "nav.routerName_receivingMode",
      keepAlive: true,
    },
  },
  {
    path: "/paymentMethod",
    name: "paymentMethod",
    component: () => import("../views/buyCurrency/paymentMethod/index.vue"),
    meta: {
      title: "nav.routerName_paymentMethod",
      keepAlive: true,
    },
  },
  {
    path: "/creditCardConfig",
    name: "creditCardConfig",
    component: () =>
      import("../views/buyCurrency/payments/creditCard/configPayment.vue"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_creditCardConfig",
      keepAlive: true,
      type: "payPage",
    },
  },
  {
    path: "/otherWays-VA",
    name: "otherWays-VA",
    component: () =>
      import("../views/buyCurrency/payments/virtualAccount/index"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  {
    path: "/otherWayPay",
    name: "otherWayPay",
    component: () => import("../views/buyCurrency/payments/e-wallet"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  {
    path: "/PSEWayPay", // pse 哥伦比亚
    name: "PSEWayPay",
    component: () => import("../views/buyCurrency/payments/pseWayPay"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  {
    path: "/pagsmilePay", // pagsmile 厄瓜多尔,马来西亚
    name: "pagsmilePay",
    component: () => import("../views/buyCurrency/payments/pagsmilePay"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  {
    path: "/nigeriaPay", // nigeriaPay 尼日利亚
    name: "nigeriaPay",
    component: () => import("../views/buyCurrency/payments/nigeriaPay"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  {
    path: "/phpPayment",
    name: "phpPayment",
    component: () => import("../views/buyCurrency/payments/phpPayment/index"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  {
    path: "/binancePay",
    name: "binancePay",
    component: () =>
      import("../views/buyCurrency/payments/binancePay/index.vue"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  {
    path: "/googlePay",
    name: "binancePay",
    component: () =>
      import("../views/buyCurrency/payments/binancePay/index.vue"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  {
    path: "/applePay",
    name: "binancePay",
    component: () =>
      import("../views/buyCurrency/payments/binancePay/index.vue"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  {
    path: "/ArgentinaPay",
    name: "ArgentinaPay",
    component: () =>
      import("../views/buyCurrency/payments/ArgentinaPay/index.vue"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  //欧元支付
  {
    path: "/euroPay",
    name: "euroPay",
    component: () => import("../views/buyCurrency/payments/euroPay/index"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  //巴西支付
  {
    path: "/brazilPay",
    name: "BrazilPay",
    component: () => import("../views/buyCurrency/payments/brazilPay/index"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  // 土耳其支付
  {
    path: "/cashierDesk-bankTransfer",
    name: "cashierDesk-bankTransfer",
    component: () =>
      import("../views/buyCurrency/payments/cashierDesk-bankTransfer/index"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_buyOtherWayPay",
      keepAlive: false,
      type: "payPage",
    },
  },
  //买币结果页
  {
    path: "/paymentResult",
    name: "paymentResult",
    component: () => import("../views/buyCurrency/paymentResult/index.vue"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_paymentResult",
      keepAlive: false,
    },
  },
  //二次支付卡信息页
  {
    path: "/errorFormInfo",
    name: "errorFormInfo",
    component: () => import("../views/payAgain/index"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_errorFormInfo",
      keepAlive: true,
    },
  },
  //------------------------------ 卖币路由 ------------------------------
  {
    path: "/sell-formUserInfo",
    name: "sellCardInfo",
    component: () => import("../views/sellCurrency"),
    meta: {
      requireAuth: true,
      title: " ",
      keepAlive: true,
    },
  },
  {
    path: "/sellOrder",
    name: "sellOrder",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/orderState/index.vue"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_sellOrder",
      title1: "",
      keepAlive: true,
    },
  },
  //------------------------------ kyc相关 ------------------------------
  //kyc验证
  {
    path: "/kycVerification",
    name: "KycVerification",
    component: () => import("../views/KycVerification/index"),
    meta: {
      title: "nav.routerName_kycSumsub",
      keepAlive: false,
    },
  },
  //kyc_onfido入口
  {
    path: "/kycVerify",
    name: "kycVerify",
    component: () => import("../views/KycOnfido/KycVerify.vue"),
    meta: {
      title: "nav.routerName_kycOnfido",
      keepAlive: false,
    },
  },
  //kyc_onfido 审核状态
  {
    path: "/kycStatus",
    name: "kycStatus",
    component: () => import("../views/KycOnfido/KycVerifyStatus.vue"),
    meta: {
      title: "nav.routerName_kycOnfido",
      keepAlive: false,
    },
  },
  // kyc通过后,国籍和通道不一致
  {
    path: "/kyc-error-countryCheck",
    name: "ErrorCountryCheck",
    component: () => import("../views/kycResult/error-countryCheck"),
    meta: {
      title: " ",
      keepAlive: false,
    },
  },
  //------------------------------ 交易历史相关 ------------------------------
  //交易历史列表
  {
    path: "/tradeHistory",
    name: "tradeHistory",
    component: () => import("../views/tradeHistory/index.vue"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_Transactions",
      keepAlive: true,
    },
  },
  //交易历史详情
  {
    path: "/tradeHistory-details",
    name: "tradeHistory-details",
    component: () => import("../views/tradeHistory/SellDetails"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_Transactions",
      keepAlive: true,
    },
  },
  {
    path: "/tradeHistory-BuyDetails",
    name: "buyDetails",
    component: () => import("../views/tradeHistory/buyDetails"),
    meta: {
      requireAuth: true,
      title: "nav.routerName_Transactions",
      keepAlive: true,
    },
  },
  {
    path: "/Refund",
    name: "Refund",
    component: () => import("../views/tradeHistory/refund.vue"),
    // component: Home,
    meta: {
      requireAuth: true,
      title: "nav.routerName_Refund",
      keepAlive: true,
    },
  },
  //------------------------------ 登录&账户信息&异常页面 ------------------------------
  //邮箱填写路由
  {
    path: "/emailCode",
    name: "emailCode",
    component: () => import("../views/emailCode/index.vue"),
    meta: {
      title: " ",
      keepAlive: true,
    },
  },
  //验证验证码的路由
  {
    path: "/verifyCode",
    name: "verifyCode",
    component: () => import("../views/emailCode/children/verifyCode.vue"),
    meta: {
      title: "nav.routerName_emailCode",
      keepAlive: true,
    },
  },
  //账号禁用路由
  {
    path: "/accountsDisabled",
    name: "accountsDisabled",
    component: () => import("../views/accountsDisabled/accountsDisabled.vue"),
    meta: {
      title: " ",
      keepAlive: true,
    },
  },
  //页面信息异常(未经授权访问)
  {
    path: "/unauthorizedAccess",
    name: "unauthorizedAccess",
    component: () => import("../views/unauthorizedAccess/index.vue"),
    meta: {
      title: " ",
      keepAlive: true,
    },
  },
  // 收集信息页面
  {
    path: "/fillInformation",
    name: "FillInformation",
    component: () => import("../views/Information/Index.vue"),
    meta: {
      title: "nav.routerName_fillInformation",
      keepAlive: false,
    },
  },
  // 上传身份证信息
  {
    path: "/idProof",
    name: "IdProof",
    component: () => import("../views/Information/IdProof.vue"),
    meta: {
      title: "nav.routerName_idProof",
      keepAlive: false,
    },
  },
  // legendTrading 审核页面;
  {
    path: "/id_authentication",
    name: "IdAuthentication",
    component: () => import("../views/IdAuthentication/Index.vue"),
    meta: {
      title: " ",
      keepAlive: false,
    },
  },

  {
    path: "*",
    redirect: "/index",
  },
];
