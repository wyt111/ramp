<template>
  <div id="viewBox" ref="viewApp">
    <div class="alchemy-pay-logo" v-if="!merchantInfo?.merchantStatus"></div>
    <div class="buyCrypto_iframe_view" ref="buyCrypto_iframe_view">
      <!-- 填写卡信息 -->
      <div id="App">
        <top-bar :notice-list="noticeList" :logo-state="logoState" />
        <!-- 导航栏 -->
        <tab ref="viewTab" :confirmOrderStatus="confirmOrderStatus" />
        <!-- 页面内容 -->
        <div class="contentView" ref="routerView_box">
          <div class="routerView_box">
            <div class="routerView">
              <!-- 买币下单步骤 -->
              <BuyNavTab />
              <keep-alive :exclude="keepAlive">
                <router-view ref="routerView" class="router-view" />
              </keep-alive>
            </div>
          </div>
          <!-- 菜单栏  -->
          <routerMenu v-if="!routerViewState" />
          <!-- 语言切换 -->
          <Language v-if="LanguageShow" />
          <!-- 买币 - 确认支付后查询支付状态提示框、泰铢支付确认跳转弹框 -->
          <QueryOrderStatusTips :buyOrderStatus="BuyTimeOut" v-if="tipsState" />
        </div>
      </div>
    </div>
    <notice-bar
      :notice-list="noticeList"
      :logo-state="logoState"
      v-if="logoState && noticeList.length > 0"
    ></notice-bar>
    <ImportantUpdates
      v-if="$store.state.isShowImportantUpdates"
      :height="$refs?.buyCrypto_iframe_view?.clientHeight"
    />
  </div>
</template>

<script>
import common from "./utils/common";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    routerMenu: () => import("./components/Menu/routerMenu"),
    QueryOrderStatusTips: () =>
      import("./components/Dialog/QueryOrderStatusTips"),
    Language: () => import("./components/Language/Language.vue"),
    tab: () => import("./components/NavBar/navigationBar"),
    BuyNavTab: () => import("./components/StepBar/buyNavTab"),
    TopBar: () => import("./components/TopBar/Index.vue"),
  },
  data() {
    return {
      routerViewState: true,
      logoState: true,
      tipsState: false,
      LanguageShow: false,
      BuyTimeOut: "",
      confirmOrderStatus: false,
      noticeList: [],
    };
  },
  computed: {
    //路由是否需要缓存状态
    keepAlive() {
      let keepAliveName = "";
      let keepAliveList = this.$router.options.routes.filter((item) => {
        if (item.meta === undefined) {
          return false;
        }
        return !item.meta.keepAlive;
      });
      keepAliveList.forEach((item) => {
        keepAliveName = item.name + "," + keepAliveName;
      });
      return keepAliveName;
    },
    //商户信息
    ...mapState("buyCryptoMerchant", ["merchantInfo"]),
    ...mapState("cryptoBuyPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
    }),
    ...mapState("secondaryBuyPayments", {
      fiatCurrencyInfo_secondaryBuy: (state) => state.fiatCurrencyInfo,
      cryptoInfo_secondaryBuy: (state) => state.cryptoInfo,
      networkInfo_secondaryBuy: (state) => state.networkInfo,
      fiatCurrencyAmount_secondaryBuy: (state) => state.fiatCurrencyAmount,
    }),
  },
  watch: {
    routerViewState(newVal) {
      this.$store.state.menuState = !newVal;
    },
    "$store.state.languageValue": {
      immediate: true,
      handler() {
        this.getNotice();
      },
    },
  },
  mounted() {
    console.log(
      `%c version %c ${require("../package.json").version} `,
      "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
      "background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff"
    );

    // 清空商户logo
    this.$store.commit("buyCryptoMerchant/set_merchantLogo", "");

    this.getNotice();

    // 窗口滚动监听
    window.addEventListener("scroll", this.handleScroll, true);
    this.obtainWidth();
    //存储重新复制store数据
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    //api商户进入关闭当前浏览器清空商户登陆信息
    let beginTime = 0; //开始时间
    let differTime = 0; //时间差
    window.onunload = function () {
      differTime = new Date().getTime() - beginTime;
      let buyMerchantInfo = JSON.parse(
        sessionStorage.getItem("buyMerchantInfo")
      );
      if (
        differTime <= 1 &&
        buyMerchantInfo &&
        buyMerchantInfo.merchantParam_state === true &&
        buyMerchantInfo.type === "api"
      ) {
        if (window.localStorage.getItem("token")) {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("sign");
          window.localStorage.removeItem("email");
          window.localStorage.removeItem("fin_token");
          window.localStorage.removeItem("login_email");
          window.localStorage.removeItem("userId");
          window.localStorage.removeItem("fingerprint_id");
          window.localStorage.removeItem("userNo");
        }
      }
    };
    //pagehide防止移动端beforeunload不能触发
    window.addEventListener("pagehide", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
    window.addEventListener("beforeunload", () => {
      beginTime = new Date().getTime();
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });

    this.handleMerchantCustom();
  },
  methods: {
    getNotice() {
      this.getNoticeList();
      setInterval(() => {
        this.getNoticeList();
      }, 1000 * 60 * 60); // 每隔一个小时请求一次公告接口;
    },
    getNoticeList() {
      this.$axios
        .get(this.$api.get_notice_list, "", "")
        .then((res) => {
          if (res.returnCode === "0000" && res.data) {
            this.noticeList = res.data;
          } else {
            this.noticeList = [];
          }
        })
        .catch(() => {
          this.noticeList = [];
        });
    },
    defineQueryData(type) {
      let params = {};
      //type - 1首页数据参数
      if (type === 1) {
        params = {
          crypto: this.cryptoInfo.crypto,
          fiat: this.fiatCurrencyInfo.fiat,
          side: "buy",
          amount: this.fiatCurrencyAmount,
          alpha2: this.fiatCurrencyInfo.alpha2,
          network: this.networkInfo.network,
          payWayCode: "",
        };
        return params;
      }
      //type - 2二次支付场景参数
      if (type === 2) {
        params = {
          crypto: this.cryptoInfo_secondaryBuy.crypto,
          fiat: this.fiatCurrencyInfo_secondaryBuy.fiat,
          side: "buy",
          amount: this.fiatCurrencyAmount_secondaryBuy,
          alpha2: this.fiatCurrencyInfo_secondaryBuy.alpha2,
          network: this.networkInfo_secondaryBuy.network,
          payWayCode: "",
        };
        return params;
      }
    },
    //动态获取屏幕大小计算rem
    obtainWidth() {
      this.changeRem(document.body.clientWidth);
      window.onresize = () => {
        this.changeRem(document.body.clientWidth);
      };
    },
    changeRem(width) {
      setTimeout(() => {
        if (width < 791) {
          common.equipmentEnd = "phone";
          this.logoState = false;
          this.$store.state.isPcAndPhone = "phone";
        } else {
          common.equipmentEnd = "pc";
          this.logoState = true;
          this.$store.state.isPcAndPhone = "pc";
        }
      });
    },
    // 监听页面加载完成

    // 解决商户自定时样式时，刷新页面后还会有聊天机器人出现问题
    handleMerchantCustom() {
      // console.log('merchantConfigData==>', this.$store.state.merchantConfig?.customerServiceVisible);
      try {
        if (!this.$store.state.merchantConfig?.customerServiceVisible) {
          // 隐藏聊天机器人
          window?.Intercom("shutdown");
        }
      } catch (err) {
        console.log("err==>app", err);
      }
    },

    //监听页面滚动给footer设置阴影
    handleScroll(e) {
      // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (e) {
        this.$store.state.scrollState = true;
        setTimeout(() => {
          this.$store.state.scrollState = false;
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss" src="@/assets/css/app.scss"></style>
