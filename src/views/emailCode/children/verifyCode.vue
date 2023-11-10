<template>
  <div class="verifyCode-container">
    <div class="verifyCode-container-children">
      <div class="verifyCode_title">
        <!--  {{ $t('loginPage.codeTitle1') }} -->
        <div class="p1">{{ $t("loginPage.tips") }}</div>
        <div class="p2">{{ email }}</div>
      </div>

      <div class="verifyCode_content">
        <span
          v-for="(item, index) in number"
          :key="index"
          @click="changeBlur"
          :class="index === value.length ? 'active' : ''"
          >{{ value[index] }}</span
        >
        <input type="input" v-model="value" :maxlength="6" ref="input" />
      </div>

      <div class="tips" v-if="codeTime > 0">
        {{ $t("nav.codeTitle3") }} {{ codeTime }}{{ $t("nav.codeSecond") }}
      </div>
      <div class="tips" v-else>
        {{ $t("nav.codeTitle2") }}
        <span @click="getEmailCode">&nbsp;{{ $t("nav.login_getCode") }} </span>
      </div>
    </div>
    <footer>
      <powered-by />
    </footer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { AES_Encrypt, AES_Decrypt } from "@/utils/encryp.js";
import {
  detadogMonitor,
  fingerprintId,
  getKycRule,
} from "@/utils/publicRequest.js";

export default {
  name: "verifyCode",
  data() {
    return {
      number: 6,
      value: "",
      codeTime: 0,
      timeVal: null,
      showLoading: false,

      codeClickStatus: true,
      email: "",
    };
  },
  mounted() {},
  activated() {
    this.email = this.$store.state.userEmail
      ? AES_Decrypt(this.$store.state.userEmail)
      : "";

    this.value = "";
    setTimeout(() => {
      this.changeBlur();
    }, 500);
    this.codeTime = sessionStorage.getItem("codeTime")
      ? sessionStorage.getItem("codeTime")
      : "";
    if (this.codeTime > 0) {
      clearInterval(this.timeVal);
      this.timeVal = setInterval(() => {
        this.codeTime--;
        sessionStorage.setItem("codeTime", this.codeTime);
        if (this.codeTime <= 0) {
          window.clearInterval(this.timeVal);
          this.timeVal = null;
        }
      }, 1000);
    }
  },
  methods: {
    //input聚焦
    changeBlur() {
      this.$refs.input.focus();
    },
    //获取邮箱code
    getEmailCode() {
      if (this.codeClickStatus === true) {
        let _this = this;
        this.codeClickStatus = false;
        this.value = "";
        this.changeBlur();
        let params = {
          email: this.$store.state.userEmail,
        };
        this.$axios
          .post(this.$api.post_sendEmail, params, "")
          .then((res) => {
            if (res) {
              _this.codeTime = 300;
              sessionStorage.setItem("codeTime", _this.codeTime);
              _this.codeClickStatus = true;
              window.clearInterval(_this.timeVal);
              _this.timeVal = null;
              _this.timeVal = setInterval(() => {
                _this.codeTime--;
                if (_this.codeTime <= 0) {
                  window.clearInterval(_this.timeVal);
                  _this.timeVal = null;
                }
              }, 1000);
            }
          })
          .catch(() => {
            _this.codeClickStatus = false;
          });
      }
    },

    //登陆
    async toLogin() {
      localStorage.removeItem("getKycTokenByOnfidoWay");
      localStorage.removeItem("kyc_info_onfido");
      localStorage.removeItem("kycRule");
      localStorage.removeItem("kyc_user_detail");
      localStorage.removeItem("kycStatus");
      localStorage.removeItem("goKycStatusAfterLogin");

      let _this = this;
      if (this.netActive && this.showLoading) {
        let params = {
          email: this.$store.state.userEmail,
          verificationCode: AES_Encrypt(this.value),
          fingerprintId: await fingerprintId(),
        };
        this.$axios
          .postForm(this.$api.post_login, params)
          .then((response) => {
            if (response && response.data) {
              // 登录后重新调用detadog监控
              detadogMonitor();

              _this.codeErrorState = false;

              _this.$store.state.isLogin = true;
              _this.$store.state.menuState = "login";
              localStorage.removeItem("loginOut");
              localStorage.setItem("login_email", _this.$store.state.userEmail);
              setTimeout(async () => {
                _this.showLoading = false;
                let kycRule = await getKycRule();
                if (kycRule === "1") {
                  _this.getKycStatus();
                }
              }, 2000);
              if (localStorage.getItem("goKycStatusAfterLogin") === "true") {
                localStorage.removeItem("goKycStatusAfterLogin");
                _this.$router.replace("/kycStatus");
                return;
              }
              if (_this.$store.state.routerQueryPath === true) {
                _this.$router.push("/");
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
                  _this.$router.push("/");
                }
              }
            }
          })
          .catch((error) => {
            //风险账号弹出框
            if (error && error.returnCode === "110") {
              _this.isKycLoginToast(_this.$parent);
              _this.showLoading = false;
              _this.value = "";
              return;
            }
            if (
              error &&
              (error.returnCode === "10002" ||
                error.returnCode === "10003" ||
                error.returnCode === "1026" ||
                error.returnCode === "1027" ||
                error.returnCode === "1025")
            ) {
              _this.codeErrorState = false;
              _this.showLoading = false;
              _this.$toast({
                duration: 3000,
                message: error.returnMsg,
              });
              _this.value = "";
              return;
            }
            _this.showLoading = false;
          });
      } else if (this.value.length < 6) {
        this.showLoading = false;
        this.$toast({
          duration: 3000,
          message: this.$t("nav.login_VerifyCode"),
        });
      }
    },
    getKycStatus() {
      this.$axios.get(this.$api.get_findUserDetail, "", "").then((res) => {
        if (res && res.returnCode === "0000" && res.data) {
          localStorage.setItem("kyc_user_detail", JSON.stringify(res.data));
        }
      });
    },
  },
  computed: {
    netActive() {
      if (this.value.length === 6) {
        return true;
      } else if (isNaN(this.value) === true) {
        return false;
      } else {
        return false;
      }
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
  watch: {
    //验证码输入完成直接登陆
    value(newVal) {
      if (newVal.length >= 6) {
        this.showLoading = true;
        this.toLogin();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.verifyCode-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .verifyCode-container-children {
    position: relative;
    flex: 1;
    .verifyCode_title {
      margin-bottom: 0.12rem;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.14rem;
      line-height: 0.18rem;
      .p1 {
        color: #5d636d;
      }
      .p2 {
        color: #252830;
      }
    }
    .verifyCode_content {
      width: 100%;
      height: 0.6rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      margin-bottom: 0.24rem;
      span {
        // display: inline-block;
        width: 0.48rem;
        height: 100%;
        border: 1px solid #e6e8eb;
        border-radius: 0.06rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "HarmonyOS Sans";
        font-style: normal;
        font-weight: 700;
        font-size: 0.24rem;
        line-height: 0.28rem;
        color: #252830;
      }
      .active {
        border: 1px solid #0b48e6;
        // box-shadow: 0 0 0px 0.02rem rgba(0, 89, 218, 0.3);
      }
      input {
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        z-index: -1;
        pointer-events: none;
        text-indent: -999em; /*文本向左缩进*/
        margin-left: -100%; /*输入框光标起始点向左左移*／
    width: 200%; /*输入框增大一倍*/
        opacity: 0;
      }
    }
    .tips {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.17rem;
      color: #848b96;
      span {
        color: #0059da;
        cursor: pointer;
      }
    }
  }
}
</style>
