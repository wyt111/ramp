<template>
  <div class="emailCode-container" ref="emailCode">
    <div class="emailCode-container_top">
      <img src="@/assets/images/slices/pay.png" alt="" />
      <h2>{{ $t("nav.loginTitle1") }}</h2>
      <p>{{ $t("nav.loginTitle2") }}</p>
    </div>

    <div class="emailCode_content">
      <p v-if="!loggedIn">{{ $t("loginPage.enterEmail") }}</p>
      <p v-else>{{ $t("loginPage.enterEmail1") }}</p>
      <div class="input-box">
        <input
          type="text"
          v-model.trim="email"
          @blur="emailBlur"
          :disabled="loggedIn"
          placeholder="Esther@example.com"
        />
        <img src="@/assets/images/slices/emailIcon.svg" alt="" />
      </div>
      <div
        class="errorMessage"
        v-if="emailErrorState"
        v-html="emailError"
      ></div>
    </div>

    <div class="emailCode_content_title" v-if="loggedIn">
      {{ $t("loginPage.emailNotyou") }}
      <span @click="signAddress">{{ $t("loginPage.emailanother") }}</span>
    </div>

    <div class="emailCode_check" v-else>
      <div
        class="checkbox-container"
        :class="{ checked: checked }"
        @click="checked = !checked"
      >
        <!-- <el-checkbox class="checkbox" v-model="checked"></el-checkbox> -->
        <img
          class="checkbox-img"
          v-show="checked"
          src="@/assets/images/check-true.svg"
          alt=""
        />
        <img
          class="checkbox-img"
          v-show="!checked"
          src="@/assets/images/check-false.svg"
          alt=""
        />
      </div>
      <div class="text">
        {{ $t("nav.code_text") }}
        <span @click="openView('Terms')">{{ $t("menu.service") }}</span>
        {{ $t("nav.code_and") }}
        <span @click="openView('Privacy')">{{ $t("nav.code_name2") }}.</span>
      </div>
    </div>

    <footer class="footer" ref="footer_ref">
      <button
        class="emailCode_button"
        :disabled="!(emailRep && login_loading)"
        @click="nextStep"
      >
        {{ $t("nav.Proceed") }}
        <img
          v-if="login_loading"
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
        />
        <button-loading v-else class="rightIcon" />
      </button>
      <powered-by />
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { debounce } from "../../utils/index";
import { AES_Encrypt, AES_Decrypt } from "@/utils/encryp.js";
import { detadogMonitor, recordInfoCaseIdentity } from "@/utils/publicRequest";
export default {
  name: "emailCode",
  data() {
    return {
      timeDown: 60,
      emailErrorState: false,
      checked: false,
      emailError: "",
      email: "",
      code: "",

      getCode_state: true,
      login_loading: true,
      loggedIn: false,
      i18nLocale: sessionStorage.getItem("language") || "en-US",
    };
  },
  activated() {
    this.$parent.routerViewState = true;
    this.login_loading = true;
    this.code = "";
    this.timeDown = 60;
    setTimeout(() => {
      if (localStorage.getItem("login_email")) {
        this.email = AES_Decrypt(localStorage.getItem("login_email"));
        this.loggedIn = true;
        this.checked = true;
      } else {
        this.loggedIn = false;
        this.checked = false;
        this.email = "";
      }
    }, 300);
    if (
      sessionStorage.getItem("buyMerchantInfo") !== "{}" &&
      sessionStorage.getItem("buyMerchantInfo") !== null
    ) {
      this.email = JSON.parse(sessionStorage.getItem("buyMerchantInfo")).mail;
    }
  },
  deactivated() {
    this.emailError = "";
    this.emailErrorState = false;
  },
  mounted() {
    this.$parent.routerViewState = true;
    setTimeout(() => {
      if (localStorage.getItem("login_email")) {
        this.email = AES_Decrypt(localStorage.getItem("login_email"));
        this.loggedIn = true;
        this.checked = true;
      } else {
        this.loggedIn = false;
        this.checked = false;
        this.email = "";
      }
    }, 300);
  },
  methods: {
    nextStep: debounce(function () {
      this.getCode_state = false;
      //校验规则
      if (this.email === "") {
        return;
      }
      var reg = new RegExp(`^.+@.+\\..+$`);
      if (!reg.test(this.email)) {
        this.emailErrorState = true;
        this.emailError = this.$t("nav.login_required");
        return;
      }
      if (!this.checked) {
        this.$toast({
          duration: 3000,
          message: this.$t("nav.login_Agreement"),
        });
        return;
      }
      let isLoginOut = localStorage.getItem("loginOut");
      //一键登录
      if (this.loggedIn === true && isLoginOut !== "1") {
        this.login_loading = false;
        this.exemptLogin();
        return;
      }
      this.emailErrorState = false;
      this.login_loading = false;

      //获取邮箱code
      this.getCode();
    }, 800),

    //一键登录(免登陆)
    exemptLogin() {
      let _this = this;
      localStorage.setItem("token", localStorage.getItem("fin_token"));
      localStorage.setItem("email", localStorage.getItem("login_email"));

      this.$axios
        .get(this.$api.getUserLogin, "")
        .then((response) => {
          if (response && response.data) {
            recordInfoCaseIdentity();
            // 登录后重新调用detadog监控
            detadogMonitor();
            setTimeout(() => {
              _this.login_loading = true;
            });
            if (_this.$store.state.routerQueryPath === true) {
              _this.$router.replace("/");
              return;
            }
            if (_this.$route.query.fromName === "tradeList") {
              _this.$router.replace("/tradeHistory");
            } else {
              //登陆跳转路径根据router.from的路由跳转不同页面
              if (_this.emailFromPath === "buyCrypto") {
                //配置商户携带地址参数(address)并且有效，跳转到支付方式页
                if (
                  this.merchantInfo.merchantStatus &&
                  this.merchantInfo.merchantQueryInfo.address
                ) {
                  //定义创建订单参数
                  let params = {
                    cryptoCurrency: _this.cryptoInfo.crypto,
                    address: this.merchantInfo.merchantQueryInfo.address,
                    network: _this.networkInfo.network,
                    fiatCurrency: _this.fiatCurrencyInfo.fiat,
                    amount: _this.fiatCurrencyAmount,
                    depositType: 2,
                    payWayCode: "",
                    cryptoCurrencyVolume: _this.cryptoAmount,
                    alpha2: _this.fiatCurrencyInfo.alpha2,
                    memo: this.merchantInfo.merchantQueryInfo.memo,
                    //商户信息有效携带商户参数
                    merchantParam: this.merchantInfo.merchantFullPath,
                  };
                  _this.$store.commit(
                    "buyPayments/set_placeOrderQuery",
                    params
                  );
                  _this.$router.replace(`/paymentMethod`);
                } else {
                  _this.$router.replace(`/receivingMode`);
                }
              } else if (_this.emailFromPath === "sellCrypto") {
                _this.$router.replace("/sell-formUserInfo");
              } else if (_this.emailFromPath === "Refund") {
                _this.$router.replace(
                  `/Refund?cryptocurrency=${_this.$store.state.emailFromquery_refund_view.cryptocurrency}`
                );
              } else if (_this.emailFromPath === "tradeHistory-details") {
                _this.$router.replace(
                  `/tradeHistory-details?orderId=${_this.$store.state.emailFromquery_tradeHistoryDetails_view.orderId}`
                );
              } else if (_this.emailFromPath === "sellOrder") {
                _this.$router.replace(
                  `/sellOrder?orderId=${_this.$store.state.emailFromquery_sellCardInfo_view.orderId}`
                );
              } else {
                _this.$router.replace("/");
              }
            }
          }
        })
        .catch((error) => {
          //风险账号弹框
          if (error && error.returnCode === "110") {
            _this.isKycLoginToast(_this.$parent);
            _this.login_loading = true;
            return;
          }
          //token过期时 再次调用自己 修改一键登陆变量
          localStorage.setItem("loginOut", "1");
          _this.getCode();
          _this.login_loading = true;
        });
    },

    //获取邮箱code
    getCode() {
      let _this = this;
      let params = {
        email: AES_Encrypt(this.email),
      };
      this.$axios
        .post(this.$api.post_sendEmail, params, "")
        .then((res) => {
          _this.login_loading = false;
          _this.getCode_state = true;

          if (res) {
            _this.login_loading = true;
            sessionStorage.setItem("codeTime", "300");
            _this.$store.state.userEmail = AES_Encrypt(_this.email);
            _this.$router.push({
              path: "/verifyCode",
            });
          }
        })
        .catch((error) => {
          _this.login_loading = true;
          if (error.returnCode === "110") {
            _this.isKycLoginToast(_this.$parent);
            _this.login_loading = true;
            _this.getCode_state = true;
          }
        });
    },

    //不使用本地邮箱,重新输入邮箱
    signAddress() {
      this.loggedIn = false;
      this.checked = false;
      this.email = "";
      localStorage.removeItem("login_email");
    },

    //跳转协议
    openView(name) {
      if (name === "Privacy") {
        window.open("https://alchemypay.org/privacy-policy/", "_blank");
        return;
      }
      if (name === "Terms") {
        window.open("https://alchemypay.org/terms-of-use/", "_blank");
      }
    },

    //输入框失去焦点时样式
    emailBlur() {
      if (this.email === "") {
        this.emailError = this.$t("loginPage.necessary");
        this.emailErrorState = true;
      } else {
        this.emailError = "";
        this.emailErrorState = false;
      }
    },
  },
  computed: {
    //计算邮箱输入并且勾选协议时按钮高亮
    emailRep() {
      let status = false;
      let reg = new RegExp(`^.+@.+\\..+$`);
      if (this.checked && reg.test(this.email)) {
        status = true;
      }
      return status;
    },
    ...mapState("cryptoBuyPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoAmount: (state) => state.cryptoAmount,
      checkMerchant: (state) => state.checkMerchant,
    }),
    ...mapState({
      emailFromPath: (state) => state.emailFromPath,
    }),
    // 商户信息
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),
  },
};
</script>

<style lang="scss" scoped>
.emailCode-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  .emailCode-container_top {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.4rem;
    img {
      width: 0.58rem;
      margin-bottom: 0.24rem;
    }
    h2 {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 700;
      font-size: 0.2rem;
      line-height: 0.24rem;
      color: #252830;
      margin-bottom: 0.08rem;
    }
    p {
      width: 2.44rem;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.18rem;
      text-align: center;
      color: #848b96;
    }
  }

  .emailCode_content {
    position: relative;
    padding-bottom: 0.24rem;
    p {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.19rem;
      color: #252830;
      margin-bottom: 0.12rem;
    }
    .input-box {
      position: relative;
      height: 0.48rem;
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0.16rem;
        z-index: 1;
        width: 0.24rem;
      }
      input {
        height: 100%;
        width: 100%;
        position: absolute;
        border: 1px solid #e6e8eb;
        border-radius: 0.06rem;
        padding: 0 0.52rem 0 0.16rem;
        outline: none;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.19rem;
        color: #252830;
        &:focus {
          background: #fff;
          border: 1px solid #0059da;
          // box-shadow: 0 0 0px 0.02rem rgba(0, 89, 218, 0.3);
        }
        &[disabled],
        &:disabled {
          cursor: not-allowed;
          background: #f4f8fb;
          -webkit-text-fill-color: #252830;
          color: #252830;
          opacity: 1;
        }
      }
      input::placeholder {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.16rem;
        line-height: 0.19rem;
        color: #848b96;
        opacity: 0.5;
      }
    }
    .errorMessage {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.14rem;
      color: #f53f3f;
      position: absolute;
      bottom: 0.08rem;
    }
  }

  .emailCode_check {
    position: relative;
    padding-left: 0.24rem;
    .checkbox-container {
      position: absolute;
      left: 0;
      width: 0.16rem;
      height: 0.16rem;
      border-radius: 0.03rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 100%;
      }
      &.checked {
        background: #0059da;
        overflow: hidden;

        img {
          width: 0.08rem;
        }
      }
    }

    .text {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.16rem;
      color: #848b96;
      span {
        color: #0059da;
        cursor: pointer;
      }
    }
  }

  .footer {
    // position: absolute;
    // bottom: 0;
    // left: 0;
    // right: 0;
    // padding: 0.08rem 0.16rem 0;
    background: #fff;
    position: sticky;
    padding: 0.08rem 0 0;
    top: calc(100% - 0.89rem);
    .emailCode_button {
      width: 100%;
      height: 0.48rem;
      border-radius: 0.06rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.19rem;
      text-align: center;
      color: #ffffff;

      background: #0059da;
      opacity: 1;
      cursor: pointer;

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

      &[disabled] {
        background: #0059da;
        opacity: 0.2;
        cursor: no-drop;
      }
    }
  }

  .emailCode_content_title {
    font-size: 0.13rem;
    text-align: center;
    font-family: Regular;
    color: #949ea4;
    span {
      color: rgba(0, 71, 173, 1);
      cursor: pointer;
    }
  }

  .emailCode_tab {
    width: 100%;
    height: 0.35rem;
    cursor: pointer;
    img {
      height: 0.24rem;
      // float: right;
    }
  }
}
</style>
