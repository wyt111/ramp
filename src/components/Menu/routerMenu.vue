<template>
  <div id="routerMenu">
    <transition name="slide-left">
      <div class="routerMenu-inner" v-show="showRouterMenu">
        <div class="router_nav">
          <div class="navigationBar_view_left">{{ $t("menu.menu") }}</div>
          <div class="navigationBar_view_right" @click="closeMenu">
            <img class="closeIcon" src="@/assets/images/ShutDown.svg" />
          </div>
        </div>
        <div class="scroll-box">
          <div class="routerMenu_isLogo" v-if="token === false">
            <img class="logo" src="@/assets/images/slices/pay.png" alt="" />
            <p class="welcome">{{ $t("menu.RouterMenu_Welcome") }}</p>
            <p class="login-tips">{{ $t("menu.RouterMenu_experience") }}</p>
            <div
              class="login-btn"
              :class="{ 'login-btn-loading': loading }"
              @click="goLogin"
            >
              <span class="text">
                {{ $t("nav.login") }}
              </span>
              <img
                class="rightIcon"
                src="@/assets/images/button-right-icon.svg"
                alt=""
                v-if="!loading"
              />
              <button-loading v-else class="rightIcon" />
            </div>
          </div>

          <div class="history-list">
            <div
              class="routerMenu_history"
              @click="goView('/', $store.state.homeTabstate)"
              v-if="token !== false && merchantInfo.merchantType !== 'api'"
            >
              <img
                class="lineIcon"
                src="@/assets/images/slices/goHome-icon.svg"
              />
              <div class="lineName">
                <span class="text1">
                  {{ $t("menu.home") }}
                </span>
              </div>
              <img
                class="right_icon"
                src="@/assets/images/slices/right_icon1.svg"
              />
            </div>

            <div
              class="routerMenu_history"
              @click="goView('/tradeHistory')"
              v-if="token !== false"
            >
              <img class="lineIcon" src="@/assets/images/slices/histry.svg" />

              <div class="lineName">
                <span class="text1">{{ $t("menu.transactions") }}</span>
                <!-- <span class="text2">No history yet</span> -->
              </div>
              <img
                class="right_icon"
                src="@/assets/images/slices/right_icon1.svg"
              />
            </div>
          </div>

          <div class="menu-list">
            <div class="routerMenu_line" @click="LanguageIsShow">
              <div class="lineIcon">
                <img src="@/assets/images/slices/iconLang.svg" />
              </div>
              <div class="lineName">{{ $t("menu.language") }}</div>

              <div class="lineRight">
                <p>{{ languageName() }}</p>
                <img
                  class="right_icon"
                  src="@/assets/images/slices/right_icon1.svg"
                />
              </div>
            </div>

            <div class="routerMenu_line" @click="goProtocol('termsUse')">
              <div class="lineIcon">
                <img src="@/assets/images/slices/terms.svg" />
              </div>
              <div class="lineName">{{ $t("menu.service") }}</div>
              <div class="lineRight">
                <img
                  class="right_icon"
                  src="@/assets/images/slices/right_icon1.svg"
                />
              </div>
            </div>

            <div class="routerMenu_line" @click="goProtocol('privacyPolicy')">
              <div class="lineIcon">
                <img src="@/assets/images/slices/privacy.svg" />
              </div>
              <div class="lineName">{{ $t("menu.privacy") }}</div>
              <div class="lineRight">
                <img
                  class="right_icon"
                  src="@/assets/images/slices/right_icon1.svg"
                />
              </div>
            </div>

            <div
              class="routerMenu_line"
              @click="loginOutIsShow"
              v-if="
                token && email !== '' && merchantInfo.merchantType !== 'api'
              "
            >
              <div style="display: flex; align-items: center">
                <div class="lineIcon">
                  <img src="@/assets/images/slices/logOut.svg" />
                </div>
                <div class="lineName">{{ $t("menu.logOut") }}</div>
              </div>

              <div class="lineRight">
                <div class="email">
                  <img v-if="kycCertified" :src="kycPassed" alt="" />
                  <img
                    v-else
                    :src="
                      disAbled === true
                        ? kycError
                        : disAbled === false
                        ? kycSess
                        : ''
                    "
                    alt=""
                  />
                  {{ emailSlice }}
                </div>
                <img
                  class="right_icon"
                  src="@/assets/images/slices/right_icon1.svg"
                />
              </div>
            </div>
          </div>
        </div>

        <footer class="footer">
          <powered-by :show-pay-way="true" />
        </footer>
      </div>
    </transition>
    <div class="routerMenu_loginOut" v-show="show" @click="show = false">
      <div class="content" ref="loginOutView" @click.stop="show = true">
        <h2>{{ $t("menu.loginOut_title") }}</h2>
        <div>
          <button @click.stop="show = false">
            {{ $t("menu.loginOut_Dismiss") }}
          </button>
          <button @click.stop="outLogin" :disabled="loginOutLoading">
            {{ $t("menu.logOut") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 菜单组件
 */
import { AES_Decrypt } from "@/utils/encryp";
import { mapState } from "vuex";
import { getKycRule } from "@/utils/publicRequest";
import { defaultLang } from "@/utils/i18n/lang.config.js";

export default {
  name: "routerMenu",
  components: {},
  data() {
    return {
      showRouterMenu: false,
      email: "",
      token: false,
      show: false,
      loading: false,
      query: {
        orderState: 1,
        orderType: 1,
        pageIndex: 1,
        pageSize: 5,
        historyList: [],
      },

      finished: false,
      newVal: "",
      disAbled: "",
      kycError: require("@/assets/images/AccountRisk.png"),
      kycSess: require("@/assets/images/kyc/kycScuss.png"),
      kycPassed: require("@/assets/images/kyc/kycPassed.svg"),
      loginOutLoading: false,
      kycCertified: false,
    };
  },
  activated() {
    // localStorage.getItem("token") ? this.token = true&& this.is_kycDisabled(): this.token =false;
    localStorage.getItem("token") ? (this.token = true) : false;
    localStorage.getItem("email")
      ? (this.email = AES_Decrypt(localStorage.getItem("email")))
      : (this.email = "");

    // this.transationsList()
  },
  deactivated() {
    localStorage.getItem("token") ? (this.token = true) : (this.token = false);
    localStorage.getItem("email")
      ? (this.email = AES_Decrypt(localStorage.getItem("email")))
      : (this.email = "");
  },
  mounted() {
    this.showRouterMenu = true;
  },
  // mounted(){
  //   localStorage.getItem("token") ? this.token = true : false;
  //   localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) : '';
  // },
  methods: {
    closeMenu() {
      this.showRouterMenu = false;
      this.$store.state.routerViewState = true;
      setTimeout(() => {
        this.$parent.routerViewState = true;
      }, 300);
    },

    //Select menu
    goView(name, homeTab) {
      //首页打开菜单 跳转交易历史 交易历史返回到菜单
      // if(this.$route.path === '/' && name === '/tradeHistory'){
      if (name === "/tradeHistory") {
        //this.$route.path === '/' &&
        this.$parent.routerViewState = true;
        this.$router.push(name);
      } else if (name === "/") {
        if (this.$route.path == "/index" || this.$route.path == "/") {
          this.closeMenu();
        } else {
          //清空页面状态
          this.$store.commit("set_tipsStatus", false);
          this.$parent.routerViewState = true;
          this.$store.state.routerViewState = true;
          this.$store.state.toastStatus = false;
          this.$store.state.homeTabstate = homeTab;
          this.$router.push(name);
          setTimeout(() => {
            this.$parent.$refs.routerView
              ? (this.$parent.$refs.routerView.menuState = false)
              : "";
          }, 100);
        }
      }
    },
    //语言栏显示切换语言
    languageName() {
      let language = sessionStorage.getItem("language")
        ? sessionStorage.getItem("language")
        : defaultLang;
      let LanguageName = "";
      for (let item of Object.keys(this.$i18n.messages)) {
        if (item === language) {
          // console.log(this.$i18n.messages[item].language);
          LanguageName = this.$i18n.messages[item].language;
        }
      }
      return LanguageName;
    },
    //Exit the login hidden menu and clear the login information
    outLogin() {
      if (this.email && !this.loginOutLoading) {
        this.loginOutLoading = true;
        this.$axios
          .post(this.$api.post_outLogin, "", "")
          .then((res) => {
            if (res) {
              localStorage.removeItem("getKycTokenByOnfidoWay");
              localStorage.removeItem("kyc_info_onfido");
              localStorage.removeItem("kycRule");
              localStorage.removeItem("kyc_user_detail");
              localStorage.removeItem("sign");
              localStorage.removeItem("token");
              localStorage.removeItem("email");
              localStorage.setItem("loginOut", "1");
              this.kycCertified = false;
              this.$store.commit("userInfo/set_token", "");
              // localStorage.removeItem("userNo");
              // localStorage.removeItem("userId");
              // localStorage.removeItem("login_email");
              // localStorage.removeItem("fin_token");
              this.loginOutLoading = false;
              localStorage.removeItem("kycStatus");
              sessionStorage.removeItem("store");
              this.show = false;
              this.$router.replace("/");
              this.token = false;
              this.email = "";
            }
            this.loginOutLoading = false;
          })
          .catch(() => {
            this.loginOutLoading = false;
          });
      }
    },
    goProtocol(name) {
      if (name === "privacyPolicy") {
        window.open("https://alchemypay.org/privacy-policy/", "_blank");
        return;
      }
      if (name === "termsUse") {
        window.open("https://alchemypay.org/terms-of-use/", "_blank");
        return;
      }
    },
    goLogin() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$store.commit("changeRouterQueryPath", true);
        this.$parent.routerViewState = true;
        //是否是从菜单进入
        // 修改地址栏信息(功能: 清除地址栏商户信息)
        if (
          (sessionStorage.getItem("merchantType") &&
            sessionStorage.getItem("merchantType") === "buy") ||
          !sessionStorage.getItem("merchantType")
        ) {
          window.history.replaceState(null, null, "/#/emailCode");
        }
        this.$router.push("/emailCode");
      }, 200);
    },
    //显示退出登陆判断是否是pc 还是 移动
    loginOutIsShow() {
      let winWidth =
        document.body.clientWidth || document.documentElement.clientWidth;
      if (winWidth < 791) {
        this.$refs.loginOutView.style =
          "top:20%;tannsfrom:translate(-50%,-20%)";
      } else {
        this.$refs.loginOutView.style =
          "left:50%;top:30%;tannsfrom:translate(-50%,-30%)";
      }
      this.show = true;
    },
    //是否有历史记录
    transationsList() {
      let _this = this;
      this.$axios
        .get(this.$api.get_transactionHistory, this.query)
        .then((res) => {
          if (res && res.data) {
            // console.log(res.data);
            let newArray = res.data.result;
            if (newArray.length <= 0) {
              _this.finished = true;
            }
          }
        });
    },
    //语言切换的显示隐藏
    LanguageIsShow() {
      // this.$store.state.LanguageIsShow = true
      this.$parent.$parent.LanguageShow = true;
      this.$parent.LanguageShow = true;
    },
    async getKycStatus() {
      if (localStorage.getItem("kycRule") == 2) {
        if (localStorage.getItem("kycStatus") == 10) {
          this.kycCertified = true;
        } else {
          this.kycCertified = false;
        }
      }
      if (localStorage.getItem("kycRule") == 1) {
        await getKycRule();
        this.$axios
          .get(this.$api.get_findUserDetail, "", "")
          .then((res) => {
            if (res && res.returnCode === "0000" && res.data) {
              this.kycCertified = res.data.currKycLevel != 0;

              localStorage.setItem("kyc_user_detail", JSON.stringify(res.data));
            } else {
              console.log("get key status error");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    //查看用户是否为风险用户
    // is_kycDisabled(){
    //   let _this = this
    //   this.$axios.post(this.$api.post_kycDisabled,'','').then(res=>{
    //     if(res && res.data){
    //       if(res.data){
    //         this.disAbled = res.data
    //         return
    //       }else{
    //          _this.$axios.post(_this.$api.post_menuKYC,'','').then(_res=>{
    //           if(_res && _res.data){
    //             if(_res.data===false){
    //               _this.disAbled = false
    //               return
    //             }else{
    //               _this.disAbled = ''
    //             }
    //           }
    //         })
    //       }
    //     }
    //   })
    // },
  },
  computed: {
    emailSlice() {
      let email = this.email;
      let email1 =
        email.slice(0, 3) +
        " *** " +
        email.slice(email.indexOf("@"), email.indexOf("@") + 6) +
        "...";
      return email1;
    },

    //商户信息
    ...mapState("buyCryptoMerchant", ["merchantInfo"]),
  },
  watch: {
    //打开菜单栏并且已经登陆以后才会获取有没有历史记录
    "$store.state.menuState": {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal === true) {
          localStorage.getItem("token")
            ? (this.token = true)
            : (this.token = false);
          localStorage.getItem("email")
            ? (this.email = AES_Decrypt(localStorage.getItem("email")))
            : (this.email = "");
        }
        if (newVal === true && localStorage.getItem("token")) {
          if (this.token === true) {
            this.getKycStatus();
            this.transationsList();
          }

          //用户是否为风险用户
          // this.is_kycDisabled()
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
#routerMenu {
  padding: 0 !important;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  .routerMenu-inner {
    position: relative;
    height: 100%;
    padding-bottom: 0.67rem;
    background: #fff;
    z-index: 1000;
    padding: 0.26rem 0.08rem 0.67rem;
  }
  .scroll-box {
    height: calc(100% - 0.67rem);
    overflow: auto;
  }
  .router_nav {
    height: 0.24rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.24rem;
    padding: 0 0.08rem;
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
        img {
          height: 0.24rem;
          cursor: pointer;
        }
      }
      .linkName {
        display: flex;
        align-items: center;
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
  .routerMenu_isLogo {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.16rem 0.08rem 0;
    margin-bottom: 0.24rem;

    .logo {
      width: 0.58rem;
      margin-bottom: 0.24rem;
    }
    .welcome {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 700;
      font-size: 0.2rem;
      line-height: 0.24rem;
      color: #252830;
      margin-bottom: 0.08rem;
    }
    .login-tips {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.17rem;
      color: #848b96;
      margin-bottom: 0.24rem;
    }
    .login-btn {
      width: 100%;
      height: 0.48rem;
      background: #0059da;
      border-radius: 0.06rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.19rem;
        text-align: center;
        color: #ffffff;
      }
      .rightIcon {
        width: 0.2rem;
        margin-left: 0.08rem;
        span {
          height: 0.17rem;
        }
      }
      &:hover {
        background: #0052c9;
      }
      &:active {
        background: #004bb7;
      }
      &.login-btn-loading {
        background: #0059da;
        opacity: 0.2;
        cursor: no-drop;
      }
    }
  }
  .history-list {
    padding: 0 0.08rem;
    margin-bottom: 0.24rem;
    .routerMenu_history {
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      padding: 0.16rem;
      cursor: pointer;
      min-height: 0.74rem;
      &:hover {
        border-color: #cbcfd6;
      }
      &:active {
        border-color: #babfc8;
        background: #f5f5f5;
      }
      &:not(:last-child) {
        margin-bottom: 0.12rem;
      }
      .lineIcon {
        width: 0.4rem;
        margin-right: 0.12rem;
      }
      .lineName {
        display: flex;
        flex-direction: column;
        .text1 {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 700;
          font-size: 0.16rem;
          line-height: 0.19rem;
          color: #252830;
        }
        .text2 {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.12rem;
          line-height: 0.14rem;
          color: #848b96;
          margin-top: 0.04rem;
        }
      }
      .right_icon {
        margin-left: auto;
      }
    }
  }

  .menu-list {
    .routerMenu_line {
      display: flex;
      align-items: center;
      cursor: pointer;
      height: 0.48rem;
      border-radius: 0.06rem;
      padding: 0 0.08rem;

      &:not(:last-child) {
        margin-bottom: 0.08rem;
      }
      .lineIcon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.12rem;
        img {
          width: 0.2rem;
        }
      }
      .lineName {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.2rem;
        color: #252830;
      }
      .lineRight {
        margin-left: auto;
        display: flex;
        align-items: center;
        p {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.14rem;
          line-height: 0.2rem;
          text-align: right;
          color: #848b96;
          margin-right: 0.12rem;
        }
        .right_icon {
          width: 0.12rem;
        }

        .email {
          display: flex;
          align-items: center;
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.14rem;
          line-height: 0.2rem;
          text-align: right;
          color: #848b96;
          margin-right: 0.12rem;
          img {
            margin-right: 0.08rem;
            width: 0.16rem;
          }
        }
      }

      &:hover {
        background: #f5f5f5;
      }
      &:active {
        background: #ededed;
      }
    }
  }

  .footer {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0.2rem;
    // height: 0.57rem;
  }

  .routerMenu_loginOut {
    z-index: 9999;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.16rem;

    .content {
      background: #ffffff;
      border-radius: 0.08rem;
      overflow: hidden;
      width: 100%;
      padding: 0.24rem 0 0;
      h2 {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.16rem;
        line-height: 0.24rem;
        text-align: center;
        color: #252830;
        padding: 0 0.12rem;
      }
      div {
        display: flex;
        align-items: center;
        margin-top: 0.24rem;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
          box-shadow: 0 0 0 0.25px #e6e8eb;
        }
        &:after {
          content: "";
          position: absolute;
          height: 100%;
          left: 50%;
          top: 0;
          box-shadow: 0 0 0 0.25px #e6e8eb;
        }

        button {
          height: 0.48rem;
          width: 50%;
          border: 0;
          border-radius: 0;
          background: #fff;
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.16rem;
          line-height: 0.24rem;
          text-align: center;
          color: #5d636d;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:hover {
            background: #f5f5f5;
          }
          &:active {
            background: #ededed;
          }
          & + button {
            color: #f53f3f;
            font-weight: 500;
          }
        }
      }
    }
  }
}

.slide-left-enter-active,
.slide-left-leave-active {
  // transition: transform 0.2s;
  // transition-delay: 0.1s;
  // transition-timing-function: ease-out;
}

.slide-left-enter,
.slide-left-leave-to {
  // transform: translateX(100%);
}
</style>
