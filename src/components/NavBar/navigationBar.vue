<!-- all page navigation bar -->
<template>
  <div id="navigationBar" v-if="navigationBarIsShow">
    <div class="navigationBar_view" v-if="tabStatus">
      <!-- tab展示状态 -->
      <div class="navigationBar_view_left">
        <!-- 地址栏存在商户订单隐藏返回按钮 -->
        <div
          class="icon"
          @click="goBack"
          v-if="
            backIconStatus &&
            AELF_Back &&
            buyPage_Back &&
            LegendTrading_IDAuthentication
          "
        >
          <img
            v-if="!['/accountsDisabled'].includes($route.path)"
            src="@/assets/images/goBack.svg"
          />
        </div>
        <div class="linkName" v-if="!confirmOrderStatus">
          <span class="linkname-text">{{ $t(routerName) }}</span>
          <!-- 选择支付方式标题添加加密币币种 -->
          <div
            class="receivingMode-currency"
            v-if="$route.path === '/receivingMode'"
          >
            {{ cryptoInfo.crypto }}
          </div>
          <!-- 退款页面标题添加币种 -->
          <span class="currency" v-if="$route.path === '/Refund'">{{
            $route.query.cryptocurrency
          }}</span>
        </div>
      </div>
      <!-- tab隐藏状态 -->
      <div class="navigationBar_view_right">
        <!-- 买币修改表单页面 -->
        <img
          v-if="isMenuBarVisible && AELF_Menu && LegendTrading_Menu"
          class="closeIcon meun-icon"
          src="@/assets/images/meun-icon.svg"
          @click="openMenu"
        />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 导航栏
 */
import { mapState } from "vuex";

export default {
  name: "navigationBar",
  props: ["confirmOrderStatus"],
  data() {
    return {
      routerName: "",
      tabState: false,
      routerPath: "",
      routerCrypto: "",

      routerPath_type: "",

      changeCountry_state: false,
      TimeOut: null,
    };
  },
  computed: {
    ...mapState("cryptoBuyPage", {
      cryptoInfo: (state) => state.cryptoInfo,
      checkMerchant: (state) => state.checkMerchant,
    }),
    ...mapState("buyPayments", {
      payMethodInfo: (state) => state.payMethodInfo,
      orderNo: (state) => state.orderNo,
    }),
    ...mapState("secondaryBuyPayments", {
      backHome_status: (state) => state.backHome_status,
    }),

    //商户信息
    ...mapState("buyCryptoMerchant", ["merchantInfo"]),
    // AELF 商户信息
    ...mapState("sellCryptoMerchantAELF", {
      source: (state) => state.merchantInfo.source,
    }),
    LegendTrading_IDAuthentication() {
      const blockedPaths = ["/id_authentication"];
      return !(
        blockedPaths.includes(this.$route.path) && !this.routerName?.trim()
      );
    },
    AELF_Back() {
      const blockedPaths = ["/emailCode", "/sell-formUserInfo"];
      return !(this.source === "3" && blockedPaths.includes(this.$route.path));
    },
    AELF_Menu() {
      const blockedPaths = [
        "/emailCode",
        "/verifyCode",
        "/sell-formUserInfo",
        "/kycStatus",
        "/kycVerify",
        "/accountsDisabled",
      ];
      return !(this.source === "3" && blockedPaths.includes(this.$route.path));
    },
    LegendTrading_Menu() {
      const blockedPaths = ["/cashierDesk-bankTransfer"];
      return !(
        this.$route.query.from === "buyDetails" &&
        blockedPaths.includes(this.$route.path)
      );
    },
    tabStatus() {
      if (!["/unauthorizedAccess"].includes(this.$route.path)) {
        return true;
      }
      return false;
    },
    buyPage_Back() {
      if (
        this.$route.meta.type === "payPage" &&
        this.merchantInfo.merchantStatus &&
        this.merchantInfo.merchantType === "page" &&
        this.merchantInfo.merchantQueryInfo.merchantOrderNo
      ) {
        return false;
      }
      return true;
    },

    //导航的显示隐藏
    navigationBarIsShow() {
      if (
        (this.tabState &&
          this.$route.name === "sellCardInfo" &&
          !this.changeCountry_state) ||
        (this.tabState &&
          this.$route.name !== "sellOrder" &&
          !this.$parent.routerViewState) ||
        (this.tabState &&
          this.$route.path !== "/index" &&
          this.$route.name !== "sellCardInfo" &&
          this.$route.name !== "sellOrder")
      ) {
        if (this.$route.path === "/index") {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },

    // 商户自定义样式
    isMenuBarVisible() {
      return (
        this.$store.state.merchantConfig.menuBarVisible &&
        this.$route.name !== "tradeHistory"
      );
    },

    /**
     * 返回icon展示状态
     * api商户不展示返回按钮、api商户交易历史列表详情展示返回按钮
     * 支付方式为'10001','20001','601','300','10003'选择支付方式、确认订单页展示返回按钮
     * @returns {boolean}
     */
    backIconStatus() {
      const { merchantType, merchantStatus } = this.merchantInfo;
      const { name: routeName } = this.$route;

      const isApiMerchant = merchantType === "api";

      // const isTradeHistoryOrBuyDetailsRouteName = ['tradeHistory', 'buyDetails'].includes(routeName);
      const isTradeHistoryOrBuyDetailsRouteName = ["buyDetails"].includes(
        routeName
      );
      const buyPage_merchantOrderNo =
        (["paymentResult"].includes(routeName) &&
          this.merchantInfo.merchantQueryInfo.merchantOrderNo !== undefined &&
          this.merchantInfo.merchantQueryInfo.merchantOrderNo) ||
        (["buyDetails"].includes(routeName) &&
          ["payPage"].includes(this.routerPath_type) &&
          this.merchantInfo.merchantQueryInfo.merchantOrderNo !== undefined &&
          this.merchantInfo.merchantQueryInfo.merchantOrderNo);

      if (this.$route.meta.type === "payPage" && this.confirmOrderStatus) {
        return true;
      }

      if (!this.confirmOrderStatus) {
        /**
         * 修改 api商户 返回按钮展示逻辑;
         * tradeHistory 不再展示返回按钮;
         */
        if (buyPage_merchantOrderNo) {
          return false;
        } else if (!isApiMerchant) {
          return true;
        } else if (
          isApiMerchant &&
          merchantStatus &&
          isTradeHistoryOrBuyDetailsRouteName
        ) {
          return true;
        }
        return false;
      }
      return false;
    },
    ...mapState("userInfo", {
      kyc_info: (state) => state.kyc_info,
    }),
  },
  deactivated() {
    clearTimeout(this.TimeOut);
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (val, oldVal) {
        //二次支付从币安反历史订单再反首页
        //如果二次支付从并且币安返回 则返回到历史订单页 返回历史订单列表如果历史订单列表携带参数则直接返回首页
        if (val.path === "/paymentMethod" && val.query.isTwice) {
          this.$router.replace("/");
          clearTimeout(this.TimeOut);
          this.TimeOut = setTimeout(() => {
            this.$parent.$refs.routerView.menuState = false;
          });
          return;
        }
        //如果是二次支付隐藏步骤条val.name === 'paymentMethod' &&
        if (val && val.query.pathHistry === "tradeHistory") {
          this.$store.commit("changeBuyPayProcessTab", false);
        }
        // else {
        //   this.$store.commit("changeBuyPayProcessTab",true)
        // }
        if (val.meta.title) {
          if (val.meta.title === "Home" && !this.$parent.routerViewState) {
            this.tabState = false;
          } else {
            this.tabState = true;
            this.routerName = val.meta.title;
            if (val.path.toLowerCase() == "/kycverification") {
              if (this.kyc_info.kycTips == 1) {
                this.routerName = "nav.routerName_kycOnfido";
              } else if (this.kyc_info.kycTips == 2) {
                this.routerName = "nav.routerName_kycSumsub";
              }
            }
            //如果二次支付时修改导航栏tab名
            if (val.query.ChangeCard && val.name === "paymentMethod") {
              switch (val.query.ChangeCard) {
                case "ChangeCard":
                  this.routerName = "buyHistory.buttonCard";
                  break;
                case "Method":
                  this.routerName = "buyHistory.buttonMethod";
                  break;
              }
            }
          }
          oldVal ? (this.routerPath = oldVal.path) : "";
          oldVal ? (this.routerPath_type = oldVal.meta.type) : "";
          //信用卡支付重复回退
          if (
            val.name !== "creditCardConfig" &&
            this.$store.state.tipsStatus &&
            val.name !== "paymentResult" &&
            val.meta.title !== "Home"
          ) {
            this.$store.commit("set_tipsStatus", false);
            this.$nextTick(() => {
              if (
                (sessionStorage.getItem("merchantType") &&
                  sessionStorage.getItem("merchantType") === "buy") ||
                !sessionStorage.getItem("merchantType")
              ) {
                window.history.replaceState(null, null, "/#/");
              }
              this.$router.replace("/");
            });
            clearTimeout(this.TimeOut);
            this.TimeOut = setTimeout(() => {
              this.$toast(this.$t("payConfig_components.double"));
            }, 1000);
          }
        }
      },
    },
    kyc_info: {
      immediate: true,
      deep: true,
      handler(obj) {
        if (this.$route.path.toLowerCase() == "/kycverification") {
          if (obj.kycTips == 1) {
            this.routerName = "nav.routerName_kycOnfido";
          } else if (obj.kycTips == 2) {
            this.routerName = "nav.routerName_kycSumsub";
          }
        }
      },
    },
  },
  methods: {
    goBack() {
      const { path, name, query } = this.$route;
      const { routerPath } = this;
      //在邮箱页面或在二次支付页面并且路由isTwice不为空时返回首页
      if (
        path === "/emailCode" ||
        (path === "/tradeHistory" && query.isTwice)
      ) {
        this.$router.push("/");
        return;
      }
      //避免Binance返回再返回币安
      if (name === "paymentMethod" && !query.pathHistry) {
        //配置商户携带地址参数(address)并且有效，跳转到支付方式页
        if (
          this.merchantInfo.merchantStatus &&
          this.merchantInfo.merchantQueryInfo.address
        ) {
          this.$router.push("/");
        } else {
          this.$router.push("/receivingMode");
        }
        return;
      }
      if (name === "receivingMode") {
        this.$router.push("/");
        return;
      }
      // 打开第三方收银台，本地为等待页 - 跳转到交易历史详情
      if (
        (([
          "/binancePay",
          "/googlePay",
          "/applePay",
          "/phpPayment",
          "/ArgentinaPay",
          "/pagsmilePay",
          "/PSEWayPay",
          "/nigeriaPay",
        ].includes(path) &&
          !["90007", "80059"].includes(this.payMethodInfo.payWayCode)) ||
          ([
            "10006",
            "10005",
            "40002",
            "201",
            "202",
            "203",
            "90001",
            "90002",
            "40003",
          ].includes(this.payMethodInfo.payWayCode) &&
            ["/otherWayPay"].includes(path))) &&
        this.$store.state.ovo_va_mex_qrs_Status
      ) {
        this.$router.push(`/tradeHistory-BuyDetails?orderId=${this.orderNo}`);
        return;
      }
      //如果支付点击返回默认返回首页
      if (
        [
          "/otherWayPay",
          "/otherWays-VA",
          "/binancePay",
          "/googlePay",
          "/applePay",
          "/brazilPay",
          "/phpPayment",
          "/ArgentinaPay",
          "/pagsmilePay",
          "/PSEWayPay",
          "/nigeriaPay",
          "/cashierDesk-bankTransfer",
        ].includes(path) &&
        this.$store.state.ovo_va_mex_qrs_Status
      ) {
        this.$parent.tipsState = true;
        this.$parent.BuyTimeOut = "backHome";
        return;
      }
      //墨西哥跳转历史订单页回首页 + ovo + 泰国 巴西支付菲律宾支付
      if (
        this.merchantInfo.merchantType !== "api" &&
        ((this.$store.state.ovo_va_mex_qrs_Status &&
          ["/tradeHistory-BuyDetails", "/tradeHistory"].includes(path) &&
          [
            "/otherWays-VA",
            "/binancePay",
            "/googlePay",
            "/applePay",
            "/otherWayPay",
            "/creditCardConfig",
            "/brazilPay",
            "/phpPayment",
            "/ArgentinaPay",
            "/pagsmilePay",
            "/PSEWayPay",
            "/nigeriaPay",
            "/cashierDesk-bankTransfer",
          ].includes(this.routerPath)) ||
          (this.$store.state.ovo_va_mex_qrs_Status &&
            path === "/tradeHistory" &&
            ["/tradeHistory-BuyDetails", "/tradeHistory-details"].includes(
              this.routerPath
            )))
      ) {
        if (path === "/tradeHistory") {
          if (!this.$store.state.routerViewState) {
            this.$router.push("/");
            clearTimeout(this.TimeOut);
            this.TimeOut = setTimeout(() => {
              this.$parent.routerViewState = false;
            });
            return;
          }
        } else {
          this.$store.commit("set_tipsStatus", false);
          clearTimeout(this.TimeOut);
          this.TimeOut = setTimeout(() => {
            this.$parent.$refs.routerView.menuState = false;
          });
          if (
            this.merchantInfo.merchantQueryInfo.merchantOrderNo !== undefined &&
            this.merchantInfo.merchantQueryInfo.merchantOrderNo
          ) {
            this.$router.go(-1);
            return;
          }
          this.$router.push("/");
          return;
        }
      }
      if (name === "paymentResult") {
        if (
          (sessionStorage.getItem("merchantType") &&
            sessionStorage.getItem("merchantType") === "buy") ||
          !sessionStorage.getItem("merchantType")
        ) {
          window.history.replaceState(null, null, "/#/");
        }
        this.$router.push("/");
        return;
      }
      //从输入验证码到后续页面
      if (
        routerPath === "/verifyCode" &&
        [
          "/sell-formUserInfo",
          "/receivingMode",
          "/tradeHistory",
          "/kycStatus",
          "/Refund",
          "/tradeHistory-details",
          "/sellOrder",
        ].includes(path)
      ) {
        this.$router.push("/");
        return;
      }

      //菜单页打开时返回在菜单页
      // if (routerPath !== '/tradeHistory' && !this.$store.state.routerViewState) {
      if (path === "/tradeHistory" && !this.$store.state.routerViewState) {
        this.$router.go(-1);
        clearTimeout(this.TimeOut);
        this.TimeOut = setTimeout(() => {
          this.$parent.routerViewState = false;
        });
        return;
      }
      //在结果页面和卖币订单页面只能返回首页
      if (path === "/paymentResult" || path === "/sellOrder") {
        this.$store.state.nextOrderState = 1;
        if (
          (sessionStorage.getItem("merchantType") &&
            sessionStorage.getItem("merchantType") === "buy") ||
          !sessionStorage.getItem("merchantType")
        ) {
          window.history.replaceState(null, null, "/#/");
        }
        this.$router.push("/");
        return;
      }

      //从选择支付方式页面到填地址页面
      if (routerPath === "/paymentMethod" && path === "/receivingMode") {
        this.$router.push("/");
        return;
      }
      //从邮箱页面到填验证码页面可以返回上一级
      if (routerPath === "/emailCode" && path === "/verifyCode") {
        this.$router.go(-1);
        return;
      }
      //二次支付之后点击返回到首页
      if (
        this.backHome_status &&
        ((this.merchantInfo.merchantType !== "api" &&
          this.merchantInfo.merchantStatus) ||
          !this.merchantInfo.merchantStatus)
      ) {
        if (
          this.merchantInfo.merchantQueryInfo.merchantOrderNo !== undefined &&
          this.merchantInfo.merchantQueryInfo.merchantOrderNo
        ) {
          this.$router.go(-1);
          return;
        }
        this.$router.push("/").then(() => {
          this.$store.commit("secondaryBuyPayments/set_backHome_status", false);
        });
        return;
      }

      // 退款后调回订单页，点击返回，返回首页
      if (path === "/tradeHistory" && this.$store.state.isSourceRefund) {
        this.$router.push("/");
        return;
      }

      this.$router.go(-1);
    },

    //打开菜单
    openMenu() {
      //清除跳首页状态
      this.$store.commit("set_tipsStatus", false);
      this.$parent.routerViewState = false;
      this.$store.state.routerViewState = false;
    },

    sellFormBack() {
      this.$parent.$refs.routerView.goDown_state = false;
      this.changeCountry_state = true;
      this.$parent.$refs.routerView.changeCountry_state = true;
    },
  },
};
</script>

<style lang="scss" scoped>
#navigationBar {
  margin-bottom: 0.32rem;
  &.show-router-menu {
    margin-bottom: 0.24rem;
  }
}
.navigationBar_view {
  height: 0.24rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .navigationBar_view_left {
    display: flex;
    align-items: center;

    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 600;
    font-size: 0.18rem;
    line-height: 0.22rem;
    color: #252830;
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.12rem;
      width: 0.24rem;
      img {
        height: 0.24rem;
        cursor: pointer;
      }
    }
    .linkName {
      display: flex;
      align-items: center;
      .linkname-text {
        white-space: nowrap;
        max-width: 2.18rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .currency {
        margin-left: 0.06rem;
      }
      .receivingMode-currency {
        margin-left: 0.06rem;
      }
      .sellChangeForm {
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: "SF Pro Display";
        font-weight: 400;
        font-size: 0.13rem;
        color: #0059da;
        margin-left: 0.08rem;
        cursor: pointer;
        p:first-child {
          max-width: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        p:last-child {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 0.14rem;
          margin-left: 0.04rem;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .navigationBar_view_right {
    display: flex;
    align-items: center;
    justify-content: center;
    .closeIcon {
      width: 0.24rem;
      cursor: pointer;
    }
    .meun-icon {
    }
  }
}
</style>
