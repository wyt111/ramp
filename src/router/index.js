import Vue from "vue";
import Router from "vue-router";
import { routes } from "./routes";
import { getLegendQueryData } from "@/utils/publicRequest";
import { parseQueryParams } from "@/utils";
import $store from "@/store/index";

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = routes;

const createRouter = () =>
  new Router({
    mode: "hash",
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

router.beforeEach(async (to, from, next) => {
  //切换路由后滚动到顶部,防止页面继承滚动高度(keep-alive继承上一页路由滑动高度问题)
  setTimeout(() => {
    if (document.body.getElementsByClassName("routerView_box")) {
      document.body
        .getElementsByClassName("routerView_box")[0]
        .scrollIntoView(false);
    }
  });
  //kyc需要fullName才能执行,fullName为空跳转到'未经授权访问'路由
  // let kycFullName = store._modules.root._children.buyPayments.state.fullName;
  // if(to.path === '/kycVerification' && !kycFullName) {
  //     next('/unauthorizedAccess');
  // }

  if (to.path === "/sell-formUserInfo") {
    // 第一次进入 把参数 存起来;
    // 换个链接后,

    /*let source = $store?.state?.sellCryptoMerchantAELF?.merchantInfo?.source;
    if (!source) {
      const store = JSON.parse(sessionStorage.getItem('store'));
      if (store) {
        source = store?.sellCryptoMerchantAELF?.merchantInfo?.source;
      }
    }*/
    // if (source !== '3') {
    // if (true) {
    let queryObj = parseQueryParams(location.search);
    if (queryObj?.source === "3") {
      const fiatCurrencyInfo = {
        fiat: queryObj.fiat, //法币
        fiatSymbol: "", //法币符号
        flag: "", //国旗
        alpha2: queryObj.country, //国家code
      };
      const cryptoInfo = {
        crypto: queryObj.crypto, //数字货币
        cryptoIcon: "", //数字货币图标
        cryptoToFiatPrice: "", //数字货币兑法币单价 - 1crypto 约等于 多少 fiat
      };
      const networkInfo = {
        network: queryObj.network, //网络
        networkName: "", //网络全称
        networkIcon: "", //网络图标
        addressRegex: "", //地址正则
        memoRegex: "", //memo正则
      };
      const cryptoAmount = queryObj.cryptoAmount - 0;

      $store.commit("buyCryptoMerchant/set_merchantInfo", {
        merchantStatus: true,
        merchantType: "sell",
        merchantFullPath: location.search,
        merchantQueryInfo: {
          appId: queryObj.appId,
        },
      });
      $store.commit("sellCryptoMerchantAELF/set_merchantInfo", queryObj);
      $store.commit(
        "sellCryptoMerchantAELF/set_merchantFullPath",
        location.search
      );

      $store.commit("cryptoSellPage/set_fiatCurrencyInfo", fiatCurrencyInfo);
      $store.commit("cryptoSellPage/set_cryptoInfo", cryptoInfo);
      $store.commit("cryptoSellPage/set_networkInfo", networkInfo);
      $store.commit("cryptoSellPage/set_cryptoAmount", cryptoAmount);
      $store.commit("changeEmailFromPath", "sellCrypto");

      $store.state.homeTabstate = "sellCrypto";

      const store = JSON.parse(sessionStorage.getItem("store") || "{}");
      sessionStorage.setItem(
        "store",
        JSON.stringify({
          ...store,
          buyCryptoMerchant: {
            merchantInfo: {
              merchantStatus: true,
              merchantType: "sell",
              merchantFullPath: location.search,
              merchantQueryInfo: {
                appId: queryObj.appId,
              },
            },
          },
          sellCryptoMerchantAELF: {
            merchantFullPath: location.search,
            merchantInfo: queryObj,
          },
          cryptoSellPage: {
            fiatCurrencyInfo,
            cryptoInfo,
            networkInfo,
            cryptoAmount,
          },
          emailFromPath: "sellCrypto",
        })
      );
    }
    // }
  }
  if (to.path === "/cashierDesk-bankTransfer") {
    const payWayCode =
      $store?.state?.buyPayments?.payMethodInfo?.payWayCode || "";
    if (["53001", "53002", "53003", "53004"].includes(payWayCode)) {
      const status = await getLegendQueryData();
      const pathMap = {
        null: "/fillInformation",
        0: "/id_authentication?status=0",
        1: "/id_authentication?status=1",
        2: "/id_authentication?status=2",
        // 3: '/cashierDesk-bankTransfer',
        4: "/id_authentication?status=4",
      };
      if (pathMap[status]) {
        next({
          path: pathMap[status],
          replace: from.path != "/paymentMethod",
        });
      }
    }
  }

  next();
});

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
