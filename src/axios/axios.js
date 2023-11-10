import axios from "axios";
import { Toast } from "vant";
import router from "../router";
import store from "../store/index";
import { AES_Decrypt } from "@/utils/encryp.js";
import moment from "moment-timezone";
//fingerprint - 设备指纹 ｜ 设备唯一id
import {
  fingerprintId,
  generateSign,
  recordInfoCaseIdentity,
} from "@/utils/publicRequest";
fingerprintId();

let cancelUrl = [
  "/index/v2/page/sell/trade/quote",
  "/index/v2/sell/trade/quote",
  "/index/v2/page/buy/trade/quote",
  "/index/v2/trade/quote",
];

function isCancelUrl(url) {
  return cancelUrl.some((item) => {
    return url.includes(item);
  });
}

function generateReqKey(config) {
  const { method, url } = config;
  return [method, url].join("&");
}
const pendingRequest = new Map();
function addPendingRequest(config) {
  const requestKey = generateReqKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel);
      }
    });
}
function removePendingRequest(config) {
  const requestKey = generateReqKey(config);
  if (pendingRequest.has(requestKey)) {
    const cancelToken = pendingRequest.get(requestKey);
    cancelToken(requestKey);
    pendingRequest.delete(requestKey);
  }
}

//Request service address
// axios.defaults.baseURL = "https://api-test.alchemytech.cc";
axios.defaults.baseURL = process.env.VUE_APP_BASE_API;

//request interceptor
axios.interceptors.request.use(
  async function (config) {
    if (isCancelUrl(config.url)) {
      removePendingRequest(config); // 检查是否存在重复请求，若存在则取消已发的请求
      addPendingRequest(config); // 把当前请求信息添加到pendingRequest对象中
    }

    //请求头信息
    let signTimestamp = generateSign();
    config.headers["timestamp"] = signTimestamp.timestamp;
    config.headers["token"] = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    config.headers["sign"] = signTimestamp.sign;
    config.headers["Accept-Language"] = sessionStorage.getItem("language")
      ? sessionStorage.getItem("language")
      : "en-US";
    config.headers["timezone"] = moment.tz.guess();
    config.headers["fingerprint-id"] = await fingerprintId();
    //处理请求头商户参数appId
    if (
      store.state.buyCryptoMerchant.merchantInfo.merchantStatus &&
      store.state.buyCryptoMerchant.merchantInfo.merchantQueryInfo.appId
    ) {
      config.headers["appid"] =
        store.state.buyCryptoMerchant.merchantInfo.merchantQueryInfo.appId;
    }
    //form表单提交方式
    if (
      config.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      var formData = new FormData(); // 构造函数 解决传递头部参数格式不正确
      Object.values(config.data).forEach((val, index) => {
        formData.append(Object.keys(config.data)[index], val);
      });
      config.data = formData;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//Response interceptor
axios.interceptors.response.use(
  function (response) {
    // Abnormal printing error message of status code;
    if (response.data.returnCode !== "0000") {
      console.error(JSON.stringify(response.data, null, 4));
    }
    if (isCancelUrl(response.config.url)) {
      removePendingRequest(response.config); // 从pendingRequest对象中移除请求
    }

    //token effect: Login information verification
    if (response.config.url === "/user/login" && response.data.data !== null) {
      localStorage.setItem("userId", AES_Decrypt(response.headers.sign));
      localStorage.setItem("token", response.headers.token);
      localStorage.setItem("fin_token", response.headers.token);
      localStorage.setItem("email", response.data.data.email);
      localStorage.setItem("userNo", response.data.data.userNo);
      localStorage.setItem("kycStatus", response.data.data.kycStatus);
      store.commit("userInfo/set_token", response.headers.token);
      recordInfoCaseIdentity();
    }

    //token effect: Multiple trigger interface verification
    if (response.config.url !== "/user/login" && response.headers.token) {
      localStorage.setItem("submit-token", response.headers.token);
    }
    //7天内token过期
    if (["70011", "60001", "10001"].includes(response.data.returnCode)) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.setItem("loginOut", "");
      store.commit("userInfo/set_token", "");
      Toast({
        duration: 3000,
        message: response.data.returnMsg,
      });
      //状态码为60001时情况登录状态 60001为此账户被冻结
      // 修改地址栏信息(功能: 清除地址栏商户信息)
      if (
        (sessionStorage.getItem("merchantType") &&
          sessionStorage.getItem("merchantType") === "buy") ||
        !sessionStorage.getItem("merchantType")
      ) {
        window.history.replaceState(null, null, "/#/emailCode");
      }
      router.push(`/emailCode`);
      return;
    }
    //no login info
    if (
      ["70006", "70008"].includes(response.data.returnCode) &&
      router.currentRoute.path !== "/emailCode" &&
      response.data.returnCode !== "70011"
    ) {
      // 首页/kyc/kycRule接口不做登录信息处理
      if (
        ["/", "/index"].includes(router.currentRoute.path) &&
        response.config.url.indexOf("/kyc/kycRule") !== -1
      )
        return;
      localStorage.removeItem("sign");
      // localStorage.removeItem("login_email");
      // localStorage.removeItem("fin_token");
      //是否执行一键登陆所需条件
      localStorage.setItem("loginOut", "1");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userNo");
      localStorage.removeItem("userId");
      localStorage.removeItem("kycStatus");
      store.commit("userInfo/set_token", "");
      store.commit("request/clearToken"); //取消请求
      store.commit("request/emptyToken"); // 清空token数组
      if (
        fromRouter === "/receivingMode" &&
        (toRouter === "/index" || toRouter === "/")
      ) {
        // 修改地址栏信息(功能: 清除地址栏商户信息)
        if (
          (sessionStorage.getItem("merchantType") &&
            sessionStorage.getItem("merchantType") === "buy") ||
          !sessionStorage.getItem("merchantType")
        ) {
          window.history.replaceState(null, null, "/#/emailCode");
        }
        router.replace(`/emailCode`);
        return;
      }
      if (fromRouter === "/tradeHistory") {
        // 修改地址栏信息(功能: 清除地址栏商户信息)
        if (
          (sessionStorage.getItem("merchantType") &&
            sessionStorage.getItem("merchantType") === "buy") ||
          !sessionStorage.getItem("merchantType")
        ) {
          window.history.replaceState(null, null, "/#/emailCode");
        }
        router.replace("/emailCode?fromName=tradeList");
        return;
      }
      // 修改地址栏信息(功能: 清除地址栏商户信息)
      if (
        (sessionStorage.getItem("merchantType") &&
          sessionStorage.getItem("merchantType") === "buy") ||
        !sessionStorage.getItem("merchantType")
      ) {
        window.history.replaceState(null, null, "/#/emailCode");
      }
      router.replace("/emailCode");
    }
    //Request callback prompt
    requestPrompt(response.data);
    return response.data;
  },
  function (error) {
    // 在请求失败后，从在途请求数组中移除请求配置
    removePendingRequest(error.config || {});
    // 请求失败，使用isCancel来区分是被CancelToken取消，还是常规的请求失败
    if (axios.isCancel(error)) {
      // 通过CancelToken取消的请求不做任何处理
      return Promise.reject({
        message: "重复请求，自动拦截并取消",
      });
    } else {
      // 正常请求发生错误,抛出异常等统一提示
      console.log(error.response, "errMsg");
    }

    return Promise.reject(error);
  }
);

//Request status - The request is executed and the server responds with a status code
function requestPrompt(response) {
  if (response) {
    switch (true) {
      case [
        "99999",
        "70003",
        "10003",
        "10005",
        "80007",
        "10004",
        "1025",
        "80102",
        "91002",
      ].includes(response.returnCode):
        Toast({
          duration: 3000,
          message: response.returnMsg,
        });
        break;
      case response.returnCode.substring(0, 1) === "4":
        Toast({
          duration: 3000,
          message: response.returnMsg,
        });
        break;
      case response.returnCode.substring(0, 1) === "6" &&
        !["60007"].includes(response.returnCode):
        Toast({
          duration: 3000,
          message: response.returnMsg,
        });
        break;
    }
  }
}

axios.defaults.timeout = 130000; // Set the request timeout (MS) to no more than half a minute

//Store which route to jump over
var fromRouter = "";
var toRouter = "";
if (router !== undefined) {
  router.beforeEach((from, to, next) => {
    fromRouter = from.path;
    toRouter = to.path;
    next();
  });
}

export default {
  /**
   *
   * @param requestUrl  Interface address
   * @param submitToken Submit Token
   * @param params Interface parameters (object)
   * @returns {Q.Promise<any>}
   */
  post(requestUrl, params, submitToken) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: requestUrl,
        data: params,
        headers: {
          "submit-token":
            submitToken === "submitToken"
              ? localStorage.getItem("submit-token")
              : "",
          "Content-Type": "application/json",
        },
        // timeout: requestUrl === '/pay/card/submit' ? 60000 : 30000
      })
        .then((response) => {
          //请求成功
          if (response && response.returnCode === "0000") {
            resolve(response);
            return;
          }
          //请求错误信息
          reject(response);
          // console.log('failed', response);
        })
        .catch((error) => {
          reject(error);
          console.log("failed", error);
        });
    });
  },

  /**
   *
   * @param requestUrl  Interface address
   * @param params Interface parameters (object)
   * @returns {Q.Promise<any>}
   */
  get(requestUrl, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: requestUrl,
        params: params,
        headers: {
          "Content-Type": "application/json",
        },
        // timeout: requestUrl === '/pay/card/submit' ? 5000 : 30000
      })
        .then((response) => {
          //请求成功
          if (response && response.returnCode === "0000") {
            resolve(response);
            return;
          }
          //请求错误信息
          reject(response);
          // console.log('failed', response);
        })
        .catch(function (error) {
          reject(error);
          console.log("failed", error);
        });
    });
  },

  /**
   *
   * @param url  Interface address
   * @param params Interface parameters (object)
   * @returns {Q.Promise<any>}
   */
  postForm(url, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: url,
        data: params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          //请求成功
          if (response && response.returnCode === "0000") {
            resolve(response);
            return;
          }
          //请求错误信息
          reject(response);
          // console.log('failed', response);
        })
        .catch(function (error) {
          reject(error);
          console.log("failed", error);
        });
    });
  },
};
