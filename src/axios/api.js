export default {
  //------------------------- 公共接口 -------------------------
  post_sendEmail: "/mail/sending",
  post_login: "/user/login",
  post_outLogin: "/login/to-logout",
  get_transactionHistory: "/trade/list",
  get_buyCryptoInfo: "/crypto/buy/v2",
  //国家法币列表
  get_worldFiatList: "/index/v2/world/fiat/list",
  //菜单获取kyc状态
  post_menuKYC: "/kyc/getKycStatus",
  //ENS查询
  get_ENS: "/crypto/ens",
  //商户确认订单页费用接口
  get_orderFee: "/trade/query/order/fee/info",
  //加密币列表
  get_cryptoList: "/index/v2/crypto/network/list",
  // 获取用户支付表单数据
  get_userPayFormData: "/crypto/get/user/pay/formData",

  //------------------------- 买币接口 -------------------------
  //优化所新增接口
  post_buyInfoFee: "/index/v2/page/buy/trade/quote",
  post_buyInfoFee2: "/index/v2/trade/quote",
  //优化整合本土支付接口
  post_alchemyPayPay: "/pay/alchemyPay",
  get_userIP: "/index/client/ip",
  get_network: "/crypto/network/list",
  get_inquiryFee: "/crypto/fee",
  post_buy: "/trade/create",
  post_indonesiaBuy: "/pay/idr/submit",
  post_internationalCard: "/pay/card/submit",
  //新加坡支付
  post_sinPay: "/pay/saasSubmit",
  //菲律宾支付
  post_phpPay: "/pay/php/submit",
  post_saveCardInfo: "/user/card/submit",
  get_payResult: "/pay/result/check",
  post_basisIdAuth: "/kyc/auth/check",
  post_storageBasisIdAuth: "/kyc/auth/create",
  get_isbasisIdAuth: "/kyc/auth/status",
  // "get_orderVerification": '/merchant/order/check',
  get_orderVerification: "/merchant/params/check",
  post_mxnSubmit: "/pay/mxn/submit",
  //查询货币支持的支付方式
  get_payMethods: "/crypto/payment/in/list",
  //查询订单状态
  get_orderState: "/trade/",
  //信用卡信息删除
  post_deleteForm: "/user/card/delete/",
  //Binance Pay
  post_binancePay: "/pay/binance/submit",
  //买币订单详情接口
  get_buyDetailsData: "/trade/query/buy/order/details",
  //获取submit token
  post_submitToken: "/crypto/wallet/check",
  //支付fail结果message查询
  get_codeMessage: "/pay/message/query",
  //巴西支付
  post_pixPay: "/pay/pix/submit",
  //applepay validatemerchant
  post_domainNameVerify: "/pay/apple/domainName/verify",
  //applepay alchemypay
  post_alchemyPay: "pay/alchemyPay",
  //二次支付修改支付方式方式
  post_updateOrderInfo: "/trade/order/update",

  //------------------------- 卖币接口 -------------------------
  // 查询卖币加密币、法币、费用、商户、配置信息
  get_sellInfoFee: "/index/v2/page/sell/trade/quote",
  get_sellInfoFee2: "/index/v2/sell/trade/quote",

  //查询卖币订单订单状态
  get_PlayCurrencyStatus: "/trade/query/sell/order",

  //获取卖币支持网络
  get_networkList: "/crypto/sell/network",
  //卖币确认订单
  post_sellForm: "/trade/create/sell/coin/order",
  //卖币切换网络
  post_sellSelectNet: "/trade/sell/order/switching/network",
  //卖币查询费率接口
  get_sellRampfee: "/crypto/sell/fee/v4",
  //卖币退款信息
  get_sellRefundInfo: "/trade/sell/refund/page/data",
  // 卖币申请退款
  get_sellRefund: "/trade/sell/order/refund",
  //卖币历史订单列表
  get_sellHistory: "/trade/query/sell/order/history",
  //卖币查询订单详细信息
  get_sellOrderDetails: "/trade/query/sell/order/details",
  // 卖币支付方式列表
  get_sellPayList: "/crypto/payment/payout/list",
  // 历史卡信息列表
  get_sellCardList: "/user/card/account/list",
  // 保存支付信息
  post_sellPayInfo: "/user/card/account/saveOrUpdate",
  // 创建订单
  post_sellCreatePayOrder: "/trade/confirm/sellOrder",
  // 更新订单卡信息
  post_sellUpdateOrderFormInfo: "/trade/update/sellOrder/account",

  //------------------------- kyc验证获取token接口 -------------------------
  //获取kyc验证token
  post_getKycToken: "/kyc/getKycToken",
  //买币是否要kyc验证
  post_getKycThrough: "/kyc/buyKycThrough",
  //卖币是否要kyc验证
  post_getKycStatus: "/kyc/getSellKycStatus",
  //用户一键登陆接口
  getUserLogin: "/login/free/certification",
  //用户是否是风险账号
  post_kycDisabled: "/kyc/kycDisabled",
  //查询kyc累计金额
  post_getQuota: "/kyc/getQuota",
  //查询kyc审核结果
  post_kycResult: "/kyc/getKycResult",
  //世界杯活动世界
  get_activitytime: "/index/v2/activity/time",
  //------------------------- kyc onfido接口 -------------------------
  //查询分流策略
  get_kycRule: "/kyc/kycRule",
  //检查kyc状态
  post_check: "/kyc/check",
  //获取kycToken
  post_getToken: "/kyc/getToken/v2",
  //kyc onfido 提交
  post_onfidoCheckSubmit: "/kyc/onfidoCheckSubmit",
  //获取当前用户KYC信息
  get_findUserDetail: "/kyc/findUserDetail",
  //获取kyc用户cpf
  get_brazilCpf: "/kyc/user/brazil/cpf",
  // 查询公告接口;
  get_notice_list: "/index/v2/notice/list",
  //------------------------- legendTrading 接口 -------------------------
  // 查询legendTrading用户信息
  get_legend_queryData: "/kyc/legend/queryData",
  // legendTrading 提交用户信息
  post_legend_submitData: "/kyc/legend/submitData",
  // legendTrading提交 用户身份证照片
  post_legend_idFileUpload: "/kyc/legend/idFileUpload",
  // legendTrading提交 用户人脸照片
  post_legend_selfieFileUpload: "/kyc/legend/selfieFileUpload",
  // legendTrading提交 审核
  post_legend_kycSubmit: "/kyc/legend/kycSubmit",
};
