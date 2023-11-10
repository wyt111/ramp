import Qs from "qs";
import store from "../store";
const $axios = require("../axios/axios");
import $api from "@/axios/api";
import { AES_Encrypt, AES_Decrypt } from "@/utils/encryp.js";
import $store from "@/store/index";
import $route from "@/router/index";
import i18n from "@/utils/i18n/index";
import { languageKey, defaultLang } from "@/utils/i18n/lang.config.js";
//指纹id
import Fingerprint2 from "fingerprintjs2";
import paymentMethods from "@/assets/json/paymentMethods.json";

export { forterCookie } from "./forterCookie.js";
export { getOnRampFiatAmount } from "./get-on-ramp-fiat-amount/index.js";
/**
 * 生成sign
 * sign - Encryption and decryption rules
 * Sign encryption/decryption key：@ALCHEMY$VPG!J8vq
 * Sign encryption/Decryption algorithm：通过AES/ECB/PKCS5Padding
 * The content of the generated sign is：userId - Last 5 digits of userno - timestamp，eg：12345678-12345-1645427147261
 * After successful decryption and login，You can get userId from sign,Remove the ACh from the decrypted content of the sign is userId，
 * @returns {Object}
 */
export function generateSign() {
  let obj = {
    sign: "",
    timestamp: new Date().getTime(),
  };
  if (
    window.localStorage.getItem("token") &&
    window.localStorage.getItem("userId") &&
    window.localStorage.getItem("userNo")
  ) {
    let text = window.localStorage.getItem("userId");
    let userId = text.substring(text.lastIndexOf("H") + 1, text.length);
    let userNo = window.localStorage
      .getItem("userNo")
      .substring(localStorage.getItem("userNo").length - 5);
    obj.timestamp = new Date().getTime();
    obj.sign = AES_Encrypt(userId + "-" + userNo + "-" + obj.timestamp);
    window.localStorage.setItem("sign", obj.sign);
    return obj;
  }
  return obj;
}

/**
 * 提交订单、确认订单前获取submit-token公共接口
 * @returns 获取成功返回true，失败则是fasle
 */
export async function querySubmitToken() {
  let params = {
    coin: store.state.cryptoBuyPage.cryptoInfo.crypto,
    email: localStorage.getItem("email"),
  };
  //二次支付修改币种
  if ($route.history.current.query.pathHistry === "tradeHistory") {
    params.coin =
      store.state.secondaryBuyPayments.buyPayment_secondPay.cryptoCurrency;
  }
  return await $axios.default
    .post($api.post_submitToken, params, "")
    .then((res) => {
      return res && res.data !== null && res.data ? true : false;
    })
    .catch(() => {
      return false;
    });
}

/**
 * 获取设备指纹id
 * fingerprint - 设备指纹 ｜ 设备唯一id
 * @url https://dashboard.fingerprint.com
 */
export async function fingerprintId() {
  return await new Promise((resolve) => {
    return Fingerprint2.get(function (components) {
      const values = components.map(function (component, index) {
        if (index === 0) {
          //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
          return component.value.replace(/\bNetType\/\w+\b/, "");
        }
        return component.value;
      });
      // 生成最终id murmur
      let id = Fingerprint2.x64hash128(values.join(""), 31);
      window.localStorage.setItem("fingerprint_id", AES_Encrypt(id));
      resolve(AES_Encrypt(id));
    });
  });
}
/**
 * 生成日本通道token
 * @param cardno - 卡号
 * @param expire - 年月 eg: 2209
 * @returns {Promise<token>}
 */
export function japaneseToken(cardno, expire) {
  let newToken = new Promise((resolve) => {
    window.Multipayment.init("9200004239555"); //トークンを利用するための a    pi キー
    window.Multipayment.getToken(
      {
        cardno: cardno, //加盟店様の購入フォームから取得したカード番号
        expire: expire, //加盟店様の購入フォームから取得したカード有効期限
        tokennumber: "5", //加盟店様の購入フォームから取得したトークン発行数
      },
      function (response) {
        if (response.resultCode !== "000") {
          resolve(false);
        } else {
          resolve(response);
        }
      }
    );
  });
  return newToken;
}

/**
 * hash路由模式获取不到参数问题
 * @returns {Object} - router query、router fullPath
 */
export function hashQuery() {
  let routerObject = {
    query: {},
    fullPath: "",
  };
  let fullPath = $route.currentRoute.fullPath;
  if (fullPath !== "/index") {
    routerObject.fullPath = fullPath.substring(fullPath.indexOf("?") + 1);
    routerObject.query = $route.currentRoute.query;
  }
  if (location.search !== "") {
    routerObject.fullPath = location.search.substring(
      1,
      location.search.length
    );
    const index = location.search.indexOf("?");
    if (index === -1) return {};
    const params = location.search.slice(index + 1);
    routerObject.query = Qs.parse(params);
  }
  return routerObject;
}

/**
 * 获取商户信息
 */
export function merchantInfo() {
  //获取地址栏信息
  let routeInfo = JSON.parse(JSON.stringify(hashQuery()));
  let routeQuery = routeInfo.query;
  let buyMerchantInfo = JSON.parse(sessionStorage.getItem("buyMerchantInfo"));
  let store_buyMerchantInfo;
  if (routeInfo.fullPath) {
    store_buyMerchantInfo = routeQuery;
    store_buyMerchantInfo.merchantParam = routeInfo.fullPath;
    // 商户没有携带type、showTable
    if (
      !routeQuery.type &&
      !routeQuery.showTable &&
      routeQuery.appId &&
      routeInfo.query.appId !== "ahzxh0klegv1fzol"
    ) {
      store_buyMerchantInfo.type = "buy";
      store_buyMerchantInfo.showTabble = "buy";
      $store.state.tableState = true;
      $store.state.homeTabstate = "buyCrypto";
    }
    // 商户携带type、没有携带showTable
    if (
      routeQuery.type &&
      routeQuery.type === "buy" &&
      !routeQuery.showTable &&
      routeQuery.appId &&
      routeInfo.query.appId !== "ahzxh0klegv1fzol"
    ) {
      store_buyMerchantInfo.type = "buy";
      store_buyMerchantInfo.showTabble = "buy";
      $store.state.tableState = true;
      $store.state.homeTabstate = "buyCrypto";
    }
    // 商户没有携带type、携带showTable
    if (
      !routeQuery.type &&
      routeQuery.showTable &&
      routeQuery.showTable === "buy" &&
      routeQuery.appId &&
      routeInfo.query.appId !== "ahzxh0klegv1fzol"
    ) {
      store_buyMerchantInfo.type = "buy";
      store_buyMerchantInfo.showTabble = "buy";
      $store.state.tableState = true;
      $store.state.homeTabstate = "buyCrypto";
    }
  } else if (!routeInfo.fullPath && buyMerchantInfo) {
    store_buyMerchantInfo = buyMerchantInfo;
  } else {
    store_buyMerchantInfo = {};
  }
  // routeQuery.appId = routeQuery.appId !== undefined && routeQuery.appId ? routeQuery.appId : buyMerchantInfo !== null ? buyMerchantInfo.appId : '';
  sessionStorage.setItem(
    "buyMerchantInfo",
    JSON.stringify(store_buyMerchantInfo)
  );

  //兼容商户多语言功能
  if (routeQuery.language) {
    let language = defaultLang;
    if (routeQuery.language === "en") {
      language = defaultLang;
    } else {
      if (routeQuery.language && languageKey.includes(routeQuery.language)) {
        language = routeQuery.language;
      }
    }
    routeQuery.language ? sessionStorage.setItem("language", language) : "";
    i18n.locale = language;
  }

  // 免登录信息
  if (routeQuery.token) {
    let accessToken = decodeURIComponent(routeQuery.token);
    // 老token
    if (accessToken.indexOf("@ACH") === -1) {
      let accessToken = decodeURIComponent(routeQuery.token);
      let startIndex = accessToken.indexOf("ACH");
      let endIndex = accessToken.indexOf("ACH", startIndex + 1);
      let userNo = accessToken.substring(0, endIndex);
      let token = accessToken.substring(
        accessToken.indexOf("ACH", endIndex) + 3,
        accessToken.length
      );
      localStorage.setItem("token", token);
      localStorage.setItem("userNo", userNo);
      recordInfoCaseIdentity();
      if (routeQuery.id)
        localStorage.setItem(
          "userId",
          "ACH" + decodeURIComponent(AES_Decrypt(routeQuery.id))
        );
      if (routeQuery.email) {
        let email = decodeURIComponent(AES_Decrypt(routeQuery.email));
        localStorage.setItem("email", AES_Encrypt(email));
        localStorage.setItem("login_email", AES_Encrypt(email));
      }
    } else {
      // 新token
      let accessToken = routeQuery.token;
      let userNo = accessToken.substring(0, accessToken.indexOf("@ACH"));
      let userId = accessToken.substring(
        accessToken.indexOf("@ACH@") + 5,
        accessToken.indexOf("@PAY@")
      );
      let email = accessToken.substring(
        accessToken.indexOf("@PAY@") + 5,
        accessToken.indexOf("@IO@")
      );
      let token = accessToken.substring(
        accessToken.indexOf("@IO@") + 4,
        accessToken.length
      );
      localStorage.setItem("userNo", userNo);
      localStorage.setItem("userId", "ACH" + AES_Decrypt(userId));
      localStorage.setItem("email", email);
      localStorage.setItem("login_email", email);
      localStorage.setItem("token", token);
      recordInfoCaseIdentity();
    }

    // 登录后重新调用detadog监控
    detadogMonitor();
  }

  if (!routeQuery.token && routeQuery.email) {
    localStorage.setItem("email", AES_Encrypt(routeQuery.email));
    localStorage.setItem("login_email", AES_Encrypt(routeQuery.email));
  }

  //type不传默认买币
  let merchantType;
  if (routeQuery.type && routeQuery.type === "sell" && routeQuery.appId) {
    merchantType = "sell";
  } else if (routeQuery.type && routeQuery.type === "buy" && routeQuery.appId) {
    merchantType = "buy";
  } else if (
    !routeQuery.type &&
    sessionStorage.getItem("merchantType") !== undefined &&
    sessionStorage.getItem("merchantType") !== null
  ) {
    merchantType = sessionStorage.getItem("merchantType");
  } else {
    merchantType = "buy";
  }
  sessionStorage.setItem("merchantType", merchantType);
  //api商户
  let orderNo = routeQuery.orderNo ? routeQuery.orderNo : "";
  if (orderNo !== "") {
    let newMerchantInfo = {
      //商户类型
      merchantType: "api", //api、page
      //商户状态
      merchantStatus: true,
      //api商户信息｜page商户信息
      merchantQueryInfo: routeInfo.query,
      //商户地址栏信息
      merchantFullPath: routeInfo.fullPath,
    };
    $store.commit("buyCryptoMerchant/set_merchantInfo", newMerchantInfo);
  }
  if (orderNo !== "" && merchantType === "buy") {
    let merchantParams = {
      merchantParam_state: true,
      redirectUrl: routeQuery.redirectUrl ? routeQuery.redirectUrl : "",
      type: "api",
    };
    sessionStorage.setItem("buyMerchantInfo", JSON.stringify(merchantParams));
  }
}

/**
 * 配置商户只能创建一次订单,创建订单后清空商户数据
 */
export function removeMerchantOrder() {
  let merchantData = JSON.parse(
    window.sessionStorage.getItem("buyMerchantInfo")
  );
  if (
    merchantData !== undefined &&
    merchantData &&
    merchantData.merchantOrderNo
  ) {
    window.sessionStorage.removeItem("buyMerchantInfo");
  }
}

/**
 * detadog监控
 */
export function detadogMonitor() {
  if (["dev", "test"].includes(process.env.VUE_APP_TITLE)) return;
  (function (h, o, u, n, d) {
    h = h[d] = h[d] || {
      q: [],
      onReady: function (c) {
        h.q.push(c);
      },
    };
    d = o.createElement(u);
    d.async = 1;
    d.src = n;
    n = o.getElementsByTagName(u)[0];
    n.parentNode.insertBefore(d, n);
  })(
    window,
    document,
    "script",
    "https://www.datadoghq-browser-agent.com/us5/v4/datadog-rum.js",
    "DD_RUM"
  );
  window.DD_RUM.onReady(function () {
    window.DD_RUM.init({
      clientToken: "pubeac81be5f0d836ee70898824930a1110",
      applicationId: "cee33280-e7e0-420f-b88e-a69d5901936d",
      site: "us5.datadoghq.com",
      service: "synthetic-on&off-ramp",
      env: "PRO",
      // Specify a version number to identify the deployed version of your application in Datadog
      // version: '1.0.0',
      sessionSampleRate: 100,
      premiumSampleRate: 100,
      trackUserInteractions: true,
      defaultPrivacyLevel: "mask-user-input",
    });
    window.DD_RUM.startSessionReplayRecording();
    // 登录之后上报
    if (window.localStorage.getItem("userNo")) {
      window.DD_RUM.setUser({
        id: window.localStorage.getItem("userNo"), // 用户userNo
        // email: window.localStorage.getItem("email") // 用户邮箱
      });
    }
  });
}

/**
 * 验证是否需要kyc _sumsub
 * @returns {Promise<void>} 1需要、2不需要、3调用失败
 */
export async function checkKyc(orderNnm) {
  let params = { orderNo: $store.state.buyPayments.orderNo };
  let payWayCode = $store.state.buyPayments.payMethodInfo.payWayCode;
  return await $axios.default
    .post($api.post_getKycThrough, params, "")
    .then((res) => {
      // console.log('res==>5656', JSON.stringify(res));
      if (res && res.data.isKyc === true && res.data.kycLevel !== "3") {
        if (payWayCode === "10001") {
          $store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment`;
        } else {
          paymentMethods.some((item) => {
            if (item.payWayCode == payWayCode) {
              if (orderNnm) {
                $store.state.WhichPage = `${item.routerPath}?orderNo=${orderNnm}`;
              } else {
                $store.state.WhichPage = `${item.routerPath}`;
              }
              return true;
            }
          });
        }

        //用户kyc信息存储
        $store.commit("userInfo/set_kycInfo_levelIndex", res.data.kycLevel);
        if (
          res.data.kycLevel === "1" ||
          res.data.kycLevel === "1,2" ||
          res.data.kycLevel === "1,2,3"
        ) {
          $store.commit("userInfo/set_kycInfo_kycTips", 1);
        } else {
          $store.commit("userInfo/set_kycInfo_kycTips", 2);
        }
        //type为applePay ｜ eWallet新加坡支付
        if (payWayCode === "10001") {
          $route.push("/kycVerification");
        } else if (["501", "502"].includes(payWayCode)) {
          $route.push("/kycVerification?type=applePay");
        } else if (["40001", "40002"].includes(payWayCode)) {
          $route.push("/kycVerification?type=eWallet");
        } else if (["30001"].includes(payWayCode)) {
          $route.push("/kycVerification?type=brazilPay");
        } else {
          $route.push("/kycVerification");
        }
        return 1;
      }
      return 2;
    })
    .catch(() => {
      return 3;
    });
}

/**
 * 验证是否需要kyc _onfido
 * @returns {Promise<void>} 1需要、2不需要、3调用失败
 */
export async function checkKyc_onfido(orderNnm) {
  let payWayCode = $store.state.buyPayments.payMethodInfo.payWayCode;
  let params = {
    orderAmount: $store.state.buyPayments.placeOrderQuery.amount,
    fiat: $store.state.buyPayments.placeOrderQuery.fiatCurrency,
    payType: payWayCode,
    businessType: 1,
  };
  return await $axios.default
    .post($api.post_check, params, "")
    .then((res) => {
      if ((res && res.data.kycFlag == 1) || res.data.kycFlag == 2) {
        if (res.data.userLevel == 2) {
          localStorage.setItem("getKycTokenByOnfidoWay", "true");
          localStorage.setItem("kyc_info_onfido", JSON.stringify(res.data));
          if (payWayCode === "10001") {
            $store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment`;
          } else {
            paymentMethods.some((item) => {
              if (item.payWayCode == payWayCode) {
                if (orderNnm) {
                  $store.state.WhichPage = `${item.routerPath}?orderNo=${orderNnm}`;
                } else {
                  $store.state.WhichPage = `${item.routerPath}`;
                }
                return true;
              }
            });
          }
          //type为applePay ｜ eWallet新加坡支付
          if (payWayCode === "10001") {
            $route.push("/kycVerification");
          } else if (["501", "502"].includes(payWayCode)) {
            $route.push("/kycVerification?type=applePay");
          } else if (["40001", "40002"].includes(payWayCode)) {
            $route.push("/kycVerification?type=eWallet");
          } else if (["30001"].includes(payWayCode)) {
            $route.push("/kycVerification?type=brazilPay");
          } else {
            $route.push("/kycVerification");
          }
          return 1;
        } else {
          localStorage.removeItem("getKycTokenByOnfidoWay");
        }

        if (payWayCode === "10001") {
          $store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment`;
        } else {
          paymentMethods.some((item) => {
            if (item.payWayCode == payWayCode) {
              if (orderNnm) {
                $store.state.WhichPage = `${item.routerPath}?orderNo=${orderNnm}`;
              } else {
                $store.state.WhichPage = `${item.routerPath}`;
              }
              return true;
            }
          });
        }

        if (res.data.kycFlag == 1) {
          if (payWayCode === "10001") {
            $route.push("/kycVerify");
          } else if (["501", "502"].includes(payWayCode)) {
            $route.push("/kycVerify?type=applePay");
          } else if (["40001", "40002"].includes(payWayCode)) {
            $route.push("/kycVerify?type=eWallet");
          } else if (["30001"].includes(payWayCode)) {
            $route.push("/kycVerify?type=brazilPay");
          } else {
            // 所有都走
            $route.push("/kycVerify");
          }
        } else if (res.data.kycFlag == 2) {
          $route.push("/kycStatus");
          return 1;
        }
        return 1;
      } else if (res.data.kycFlag == 0) {
        return 2;
      }
    })
    .catch(() => {
      return 3;
    });
}

export default class noData {
  constructor() {}
  isNoData(newData) {
    if (newData !== null && newData !== "" && newData !== undefined) {
      return newData;
    }
    return "";
  }
}

// 获取kyc 分流策略;
export function getKycRule(orderNo) {
  return new Promise((resolve, reject) => {
    let appId = "";
    try {
      appId = JSON.parse(
        window.sessionStorage.getItem("buyMerchantInfo") || "{}"
      ).appId;
      if (!appId) {
        appId =
          $store.state?.buyCryptoMerchant?.merchantInfo?.merchantQueryInfo
            ?.appId;
      }
    } catch (error) {
      console.log("error==>", error);
    }
    // console.log('appId==>', appId);
    let params = `orderNo=${orderNo}&appId=${appId}`;
    $axios.default
      .get($api.get_kycRule + "?" + params, "")
      .then((res) => {
        if (res && res.returnCode === "0000" && res.data) {
          localStorage.setItem("kycRule", String(res.data.rule)); // "1": onfido; "2": sumsub;
          resolve(String(res.data.rule));
        } else {
          reject("get_kycRule error");
        }
      })
      .catch(() => {
        reject("get_kycRule error");
      });
  });
}

// 获取巴西 cpf
/**
 * [getBrazilCpf description]
 * @return {[String]} ["2":跳转到失败页面,"1":不做操作,继续流程,"其他失败":打印错误信息]
 *
 */
export function getBrazilCpfResult() {
  return new Promise((resolve, reject) => {
    let side = "";
    if ($store.state.homeTabstate === "sellCrypto") {
      side = "sell";
    } else if ($store.state.homeTabstate === "buyCrypto") {
      side = "buy";
    }
    let params = {
      orderNo: $store.state.buyPayments.orderNo,
      side,
    };

    $axios.default
      .get($api.get_brazilCpf, params)
      .then((res) => {
        if (res && res.returnCode === "0000" && res.data) {
          if (String(res.data.isBrazil) === "true") {
            if (res.data.cpf) {
              sessionStorage.setItem(
                "brazilPayParams",
                JSON.stringify(res.data)
              );
              resolve("1"); // 巴西kyc 并且 获取到了 cpf;
            } else {
              sessionStorage.removeItem("brazilPayParams");
              resolve("2"); // 巴西kyc 没有获取到 cpf; 跳转新增的失败页面;
            }
          } else {
            sessionStorage.removeItem("brazilPayParams");
            // 不是巴西;
            resolve("2");
          }
        } else {
          sessionStorage.removeItem("brazilPayParams");
          reject("getBrazilCpf Error");
        }
      })
      .catch((error) => {
        console.error(error);
        sessionStorage.removeItem("brazilPayParams");
        reject("getBrazilCpf Error");
      });
  });
}
// 获取巴西二次支付是否需要kyc以及需要跳转的path;
export async function checkPixKycIsRequired(params) {
  const kycRule = await getKycRule(params.orderNo);

  return new Promise((resolve) => {
    if (kycRule === "1") {
      let new_params = {
        orderAmount: params.amount,
        fiat: params.fiatCurrency,
        payType: "30001",
        businessType: 1,
      };
      $axios.default
        .post($api.post_check, new_params, "")
        .then((res) => {
          try {
            if (
              (res.data.kycFlag == 1 || res.data.kycFlag == 2) &&
              res.data.userLevel == 2
            ) {
              // 需要做kyc 并且需要做的kyc等级是 2;
              localStorage.setItem("getKycTokenByOnfidoWay", "true");
              localStorage.setItem("kyc_info_onfido", JSON.stringify(res.data));
              $store.state.WhichPage = "/brazilPay";
              resolve({
                kycIsRequired: true,
                path: "/kycVerification",
              });
            } else {
              localStorage.removeItem("getKycTokenByOnfidoWay");
            }
          } catch (e) {
            console.log(e);
          }

          $store.state.WhichPage = "/brazilPay";
          if (res && res.data.kycFlag == 1) {
            // this.$router.push('/kycVerify?type=brazilPay');
            resolve({
              kycIsRequired: true,
              path: "/kycVerify",
            });
          } else if (res.data.kycFlag == 2) {
            resolve({
              kycIsRequired: false,
              path: "/kycStatus",
            });
          } else if (res.data.kycFlag == 0) {
            resolve({
              kycIsRequired: false,
              path: "/brazilPay",
            });
          }
        })
        .catch(() => {});
    } else if (kycRule === "2") {
      let new_params = { orderNo: params.orderNo };

      $axios.default
        .post($api.post_getKycThrough, new_params, "")
        .then((res) => {
          if (res && res.data.isKyc === true && res.data.kycLevel !== "3") {
            $store.state.WhichPage = "/brazilPay";
            //用户kyc信息存储
            $store.commit("userInfo/set_kycInfo_levelIndex", res.data.kycLevel);
            if (
              res.data.kycLevel === "1" ||
              res.data.kycLevel === "1,2" ||
              res.data.kycLevel === "1,2,3"
            ) {
              $store.commit("userInfo/set_kycInfo_kycTips", 1);
            } else {
              $store.commit("userInfo/set_kycInfo_kycTips", 2);
            }
            resolve({
              kycIsRequired: true,
              path: "/kycVerification",
            });
          } else {
            resolve({
              kycIsRequired: false,
              path: "/brazilPay",
            });
          }
        })
        .catch(() => {});
    }
  });
}

// 获取用户IP;
export async function getUserIp() {
  try {
    const response = await $axios.default.get($api.get_userIP);
    if (response && response.data) {
      return response.data.ip;
    }
  } catch (error) {
    console.error("getUserIp error:", error);
  }
  throw new Error("Failed to retrieve user IP");
}

/**
 * kyc成功后,查询国籍和kyc验证信息是否一致
 * 判断给定的国家是否在特定支付方式的支持国家列表中。
 * @param {string} country - 要检查的国家
 * @param {string} payWayCode - 支付方式代码
 * @returns {boolean} - 如果国家不在支持国家列表中则返回 true，否则返回 false
 */

export function isCountryNotSupportedForPaymentMethod(country, payWayCode) {
  const foundObj = paymentMethods.find((obj) => obj.payWayCode == payWayCode);
  if (!foundObj) {
    console.error(`Object with payWayCode ${payWayCode} not found.`);
    return false;
  }
  const supportedCountries = foundObj.supportedCountries || [];

  return (
    supportedCountries.length > 0 &&
    country &&
    !supportedCountries.includes(country)
  );
  // return supportedCountries.length > 0 && (!country || !supportedCountries.includes(country));
}

/**
 * 解析邮箱地址并返回解密和加密后的结果对象。
 * @param {string} email - 要解析的邮箱地址
 * @returns {object} - 包含解密和加密后的邮箱地址的结果对象
 */
export function getEmail(email) {
  let emailInfo = {
    email: "", // 解密之后的邮箱地址
    enc_email: "", // 加密的邮箱地址
  };

  /**
   * 检查字符串是否为有效的邮箱地址。
   * @param {string} email - 要检查的邮箱地址
   * @returns {boolean} - 如果是有效的邮箱地址则返回 true，否则返回 false
   */
  function isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  let count = 0;
  try {
    if (email) {
      while (!isEmail(email) && count < 10) {
        count++;
        email = AES_Decrypt(email);
      }
      emailInfo = {
        email: email,
        enc_email: AES_Encrypt(email),
      };
      localStorage.setItem("email", emailInfo.enc_email);
    }
  } catch (e) {
    console.error(e);
  }

  return emailInfo;
}
/**
 * [getLegendQueryData 获取legendTrading信息状态]
 * @return {[type]} [description]
 * 'null' 表示 未填写信息;
 * 0 表示已填写信息,未上传证件;
 * 2 表示 已上传证件
 * 3 表示 成功;
 * 4 表示 失败;
 */
export function getLegendQueryData() {
  return new Promise((resolve, reject) => {
    $axios.default
      .get($api.get_legend_queryData, "")
      .then((res) => {
        if (res.returnCode == "0000") {
          $store.commit("kycInfo/set_legendTradingKycInfo", res.data || {});
          if (!res.data) {
            resolve("null");
          } else {
            resolve(res.data?.status);
          }
        } else {
          $store.commit("kycInfo/set_legendTradingKycInfo", {});

          reject("get_legend_queryData error");
        }
      })
      .catch(() => {
        $store.commit("kycInfo/set_legendTradingKycInfo", {});

        reject("get_legend_queryData error");
      });
  });
}

/**
 * 查询用户支付表单数据
 * payWayCode 支付方式code
 */
export async function requestPayFormInfo(payWayCode) {
  let params = {
    payWayCode: payWayCode
      ? payWayCode
      : $store.state?.buyPayments?.payMethodInfo?.payWayCode,
  };
  try {
    const response = await $axios.default
      .get($api.get_userPayFormData, params)
      .catch(() => {});
    // 存储用户支付表单数据
    let status =
      response.data !== undefined &&
      JSON.stringify(response.data) !== "{}" &&
      response.data !== null;
    let newData = { status: status, ...response.data };
    $store.commit("buyPayments/set_lastTimePaymentFormInfo", newData);
    return;
  } catch (error) {
    console.error("get_userPayFormData error:", error);
  }
  throw new Error("Failed to retrieve get userPayFormData");
}
/**
 *  userView 用户身份识别:
 */
export function recordInfoCaseIdentity() {
  let email = localStorage.getItem("email");
  if (!email) return;
  email = AES_Decrypt(email);
  const userNo = localStorage.getItem("userNo") || "";

  typeof window.recordInfoCase !== "undefined" &&
    window.recordInfoCase.identify({
      email: email,
      uid: userNo,
      // phone: res.data.phone,
      // username: res.data.name,
    });
}
