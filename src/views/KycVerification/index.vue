<template>
  <div class="KycVer-container">
    <!-- 展示成功失败等待状态页面 -->
    <div class="Verification_content" v-if="status === 0" :key="0">
      <div class="Verification_content">
        <div class="kyc_nav">
          <!-- {{ kycVerState }} -->
          <!-- <div style="padding:.1rem;float:right;cursor: pointer;margin-right:-.05rem" @click="goHome"> <img v-if="kycVerState===0" src="@/assets/images/ShutDown.png"  alt=""></div> -->
          <span class="tips">
            {{ $t("kycVerificationFonts.kycminutestitle") }}
          </span>
        </div>
        <div class="content" v-if="kyc_info.kycTips === 1">
          <!--------------------------------- kyc状态文案展示 --------------------------------->
          <!-- 点击进行kyc验证 -->
          <div class="content" v-if="kycVerState === 0">
            <img src="@/assets/images/kyc/kycIcon1.svg" alt="" />
            <p class="tips-text">
              <span class="lvText">Lv.1</span>
              {{ $t("kycVerificationFonts.kycminutestitle") }}
            </p>
            <div class="tips-list tips-list-start">
              <p>·</p>
              <p>{{ $t("kycVerificationFonts.kycPrepareyour") }}</p>
            </div>
            <div class="tips-list tips-list-start">
              <p>·</p>
              <p>{{ $t("kycVerificationFonts.kycminutesdocument") }}</p>
            </div>
          </div>
          <!-- kyc验证成功 -->
          <div class="content" v-else-if="kycVerState === 1">
            <img src="@/assets/images/kyc/kycIcon2.svg" alt="" />
            <p class="tips-text">
              {{ $t("kycVerificationFonts.kyccompleted1") }}<br />{{
                $t("kycVerificationFonts.kyccompleted2")
              }}
            </p>
          </div>
          <!-- kyc验证失败 可以重试 -->
          <div class="content" v-else-if="kycVerState === 2">
            <img src="@/assets/images/kyc/kycIcon3.svg" alt="" />
            <p class="tips-text">
              {{ $t("kycVerificationFonts.kycErrorTryAgain_title") }}
            </p>
            <div class="error-title">
              {{ $t("kycVerificationFonts.kycErrorTryAgain_tipsTitle") }}:
            </div>
            <div class="tips-list">
              <p>·</p>
              <p>{{ $t("kycVerificationFonts.kycErrorTryAgain_tips1") }}</p>
            </div>
            <div class="tips-list">
              <p>·</p>
              <p>{{ $t("kycVerificationFonts.kycErrorTryAgain_tips2") }}</p>
            </div>
            <div class="tips-list">
              <p>·</p>
              <p>{{ $t("kycVerificationFonts.kycErrorTryAgain_tips3") }}</p>
            </div>
          </div>
          <!-- kyc验证失败 不可重试 -->
          <div class="content" v-else>
            <img src="@/assets/images/kyc/kycIcon3.svg" alt="" />
            <p class="tips-text">
              {{ $t("kycVerificationFonts.kycRiskAccount") }}
            </p>
          </div>
        </div>
        <div class="content" v-else>
          <AddressMaterial :kycVerState="kycVerState" />
        </div>

        <!--------------------------------- 按钮区域 --------------------------------->
        <div
          class="Verification_button"
          v-if="kycVerState === 0"
          @click="nextKycVer(0)"
          :disabled="!nextKyc"
        >
          <p>{{ $t("kycVerificationFonts.kycButtonminutes") }}</p>
          <img
            class="rightIcon"
            src="@/assets/images/button-right-icon.svg"
            alt=""
            v-if="nextKyc"
          />
          <button-loading v-if="!nextKyc" class="icon rightIcon" />
        </div>

        <div v-else-if="kycVerState === 1">
          <!--  <div class="transactionAmount">
            {{ $t('kycVerificationFonts.kycPayLimitUpTips') }} <span> ${{ monthLimitAmount }}</span>
          </div> -->
          <div class="Verification_button" @click="nextKycVer(1)">
            <p>{{ $t("kycVerificationFonts.kycButtoncompleted") }}</p>
            <img
              class="rightIcon"
              src="@/assets/images/button-right-icon.svg"
              alt=""
              v-if="nextKyc"
            />
            <button-loading v-if="!nextKyc" class="icon rightIcon" />
          </div>
        </div>

        <div
          class="Verification_button"
          v-else-if="kycVerState === 2"
          @click="nextKycVer(0)"
        >
          <p>{{ $t("kycVerificationFonts.kycButtonTryAgain") }}</p>
          <img
            class="rightIcon"
            src="@/assets/images/button-right-icon.svg"
            alt=""
            v-if="nextKyc"
          />
          <button-loading v-if="!nextKyc" class="icon rightIcon" />
        </div>

        <div v-else>
          <div class="Verification_button" @click="nextKycVer(2)">
            <p>{{ $t("kycVerificationFonts.kycButtonError") }}</p>
            <img
              class="rightIcon"
              src="@/assets/images/button-right-icon.svg"
              alt=""
              v-if="nextKyc"
            />
            <button-loading v-if="!nextKyc" class="icon rightIcon" />
          </div>
        </div>
      </div>
    </div>
    <!--------------------------------- kyc验证页面 --------------------------------->
    <div class="verif_kyc" v-else :key="1">
      <div class="verif_kyc_nav">
        <!-- <div @click="removeItemKyv"><img src="@/assets/images/ShutDown.png"  alt="" ></div> -->
        <span class="tips">
          {{ $t("kycVerificationFonts.kycminutestitle") }}
        </span>
      </div>
      <div id="sumsub-websdk-container"></div>
    </div>

    <KycMessageBox showName="kyc_tipsState" v-if="kyc_tipsState" />
  </div>
</template>
<script>
import snsWebSdk from "@sumsub/websdk";
import { mapState } from "vuex";
import AddressMaterial from "./addressMaterial/index";
import KycMessageBox from "@/components/kycMessageBox";

export default {
  name: "KycVerification",
  components: {
    AddressMaterial,
    KycMessageBox,
  },
  data() {
    return {
      status: 0,
      kycVerState: 0,
      getToken: "",
      nextKyc: true,
      timeOut: null,
      //重复失败状态
      kycErrorStatus: false,
      kyc_tipsState: false,
      //累积月金额
      // monthLimitAmount: 0,
      kycResultTimer: null,
    };
  },
  computed: {
    // 卖币支付信息
    // 卖币支付方式信息
    ...mapState("sellPayments", {
      sellPayType: (state) => state.sellPayType,
      sellPayInfo: (state) => state.sellPayInfo,
    }),
    ...mapState("userInfo", {
      kyc_info: (state) => state.kyc_info,
    }),
    ...mapState("buyPayments", {
      fullName: (state) => state.fullName,
      placeOrderQuery: (state) => state.placeOrderQuery,
      payMethodInfo: (state) => state.payMethodInfo,
    }),
    // 卖币信息
    ...mapState("cryptoSellPage", {
      sell_fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      sell_cryptoInfo: (state) => state.cryptoInfo,
      sell_cryptoAmount: (state) => state.cryptoAmount,
      sell_networkInfo: (state) => state.networkInfo,
    }),
    ...mapState("sellCryptoMerchantAELF", {
      source: (state) => state.merchantInfo.source,
      merchantFullPathAELF: (state) => state.merchantFullPath,
      appId: (state) => state.merchantInfo.appId,
      merchantInfo_AELF: (state) => state.merchantInfo,
    }),
    ...mapState("kycInfo", {
      kycResultInfo: (state) => state.kycResultInfo,
    }),
  },
  methods: {
    //kyc验证
    launchWebSdk(accessToken) {
      let _this = this;
      let snsWebSdkInstance = snsWebSdk
        .init(
          accessToken,
          // token update callback, must return Promise
          // Access token expired
          // get a new one and pass it to the callback to re-initiate the WebSDK
          () => this.getNewAccessToken()
        )
        .withConf({
          lang: this.$i18n.locale === "zh-HK" ? "zh-tw" : "en", //language of WebSDK texts and comments (ISO 639-1 format)
        })

        .withOptions({ addViewportTag: false, adaptIframeHeight: true })
        //获取成功或失败或等待状态
        .on("idCheck.applicantStatus", (type) => {
          console.log(type);
          if (!type) {
            return;
          }
          //正在处理
          if (type.reviewStatus === "pending") {
            return false;
            //重新验证
          } else if (
            type.reviewStatus !== "pending" &&
            type.reviewResult.reviewAnswer === "RED" &&
            type.reviewResult.reviewRejectType === "RETRY"
          ) {
            //kycErrorStatus 如果为true时 则已经验证过一次
            if (this.kycErrorStatus) {
              this.kycErrorStatus = false;
              return false;
            }

            this.setPageStatus();

            /*  this.status = 0;
              this.kycVerState = 2;
              return;*/
          } else if (
            type.reviewStatus !== "pending" &&
            type.reviewResult.reviewAnswer === "GREEN"
          ) {
            //成功
            this.status = 0;
            this.kycVerState = 1;
            /*  _this.$axios.post(_this.$api.post_getQuota, { userLevel: this.kyc_info.kycTips }, '').then(val => {
              if (val) {
                _this.monthLimitAmount = val.data.model.dayLimitAmount / 100;
              }
            });*/
            return;
          } else {
            //失败
            this.status = 0;
            this.kycVerState = 3;
            return;
          }
        })

        //获取kyc高度 并且高度变化的话让kyc里面的页面回到顶部
        .on("idCheck.onResize", () => {
          let kycChangeHeight = document.querySelector(
            "#sumsub-websdk-container"
          );
          let innerHeight = document.querySelector(".verif_kyc");
          let kycInneHeight = document.querySelector(".KycVer-container");
          innerHeight.style = `height:${kycInneHeight.clientHeight}px;overflow:scroll`;
          kycChangeHeight.scrollTop = "0";
        })
        .on("idCheck.onError", (type, error) => {
          console.log("onError", error);
        })
        .build();
      //kyc容器
      snsWebSdkInstance.launch("#sumsub-websdk-container");
    },
    //获取kyc验证的token
    getNewAccessToken() {
      this.getUserToken();
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        return Promise.resolve(this.getToken);
      }, 1000);
      // get a new token from your backend
    },
    //next 下一步
    async nextKycVer(val) {
      let fullName = this.fullName;
      if (!fullName) {
        this.$toast(this.$t("nav.cardinformation"));
        // this.$toast('卡信息不正確');
        return;
      }
      //展示第二个kyc二次确认弹框  this.kyc_info.levelIndex  kyc这个值时number  不转字符串用indexof报错
      if (
        val === 1 &&
        this.kyc_info.kycTips === 1 &&
        this.kyc_info.levelIndex.indexOf("2") > 0
      ) {
        this.kyc_tipsState = true;
        return;
      }
      //0进行kyc验证 1 成功跳转到卖币或者卖币订单page 2失败重新验证kyc
      if (val === 0 && this.nextKyc) {
        if (this.kycVerState === 2) {
          this.kycErrorStatus = true;
        }
        this.nextKyc = false;
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
          this.status = 1;
          this.getUserToken();
        }, 1000);
        return;
      }

      //成功下一步
      if (val === 1 && this.nextKyc) {
        this.nextKyc = false;

        //单独针对新加坡支付、如果是苹果支付走上一层、巴西支付
        if (
          this.$route.query.type &&
          ["eWallet", "applePay", "brazilPay", "googlePay"].includes(
            this.$route.query.type
          )
        ) {
          this.$router.replace(this.$store.state.WhichPage);
          return;
        }

        if (this.$store.state.homeTabstate === "sellCrypto") {
          // 保存卡信息
          let params = {
            alpha2: this.sell_fiatCurrencyInfo.alpha2,
            fiat: this.sell_fiatCurrencyInfo.fiat,
            accountType: this.sellPayType.accountType,
            bankAccountInfo: this.sellPayInfo.bankAccountInfo, // 银行转账信息
            userAccountId: this.sellPayInfo.userAccountId,
            firstName: this.sellPayInfo.firstName,
            lastName: this.sellPayInfo.lastName,
            accountNumber: this.sellPayInfo.accountNumber,
            phone: this.sellPayInfo.phone,
            birthDate: this.sellPayInfo.birthDate,
          };
          this.$axios
            .post(this.$api.post_sellPayInfo, params, "")
            .then((res) => {
              if (res) {
                // 创建订单
                let params = {
                  cryptoCurrency: this.sell_cryptoInfo.crypto,
                  sellVolume: this.sell_cryptoAmount,
                  network: this.sell_networkInfo.network,
                  alpha2: this.sell_fiatCurrencyInfo.alpha2,
                  fiat: this.sell_fiatCurrencyInfo.fiat,
                  userAccountId: res.data.userAccountId,
                  payWayCode: this.sellPayType.payWayCode,
                };
                //存在商户信息将信息带入请求地址
                let urlQuery = "";
                let accessMerchantInfo =
                  sessionStorage.getItem("buyMerchantInfo");
                if (
                  accessMerchantInfo !== undefined &&
                  accessMerchantInfo &&
                  JSON.parse(accessMerchantInfo).merchantParam
                ) {
                  urlQuery = `?${JSON.parse(accessMerchantInfo).merchantParam}`;
                }

                if (this.source === "3") {
                  urlQuery = this.merchantFullPathAELF;
                }
                this.$axios
                  .post(
                    this.$api.post_sellCreatePayOrder + urlQuery,
                    params,
                    ""
                  )
                  .then((res) => {
                    if (res && res.data) {
                      // 存储数据、清空状态
                      this.$store.state.sellOrderId = res.data.orderId;
                      this.$store.state.nextOrderState = 1;
                      sessionStorage.removeItem("getToken");
                      sessionStorage.removeItem("sellState");
                      //跳转状态;

                      if (
                        this.source === "3" &&
                        this.appId.toLowerCase() !=
                          process.env.VUE_APP_AELF_APPID.toLowerCase()
                      ) {
                        window.location = this.merchantInfo_AELF.withdrawUrl;
                      } else {
                        this.$router
                          .push(`/sellOrder?sellOrderId=${res.data.orderId}`)
                          .then(() => {
                            this.status = 0;
                            this.kycVerState = 0;
                            this.nextKyc = true;
                          });
                      }
                    }
                  })
                  .catch(() => {
                    this.status = 0;
                    this.kycVerState = 0;
                    this.nextKyc = true;
                  });
              }
            })
            .catch(() => {
              this.status = 0;
              this.kycVerState = 0;
              this.nextKyc = true;
            });
        } else {
          this.$router.replace(this.$store.state.WhichPage);
          this.status = 0;
          this.kycVerState = 0;
          this.nextKyc = true;
        }
        return;
      }
      if (val === 2) {
        this.status = 0;
        this.kycVerState = 0;
        this.$router.replace("/");
      } else {
        return false;
      }
    },
    //关闭页面
    /* goHome() {
                  //返回来的页面并且清空状态
                  clearTimeout(this.timeOut)
                  this.timeOut = setTimeout(() => {
                    this.kycVerState = 0
                    sessionStorage.setItem('kycVerState', this.kycVerState)
                  })
                  sessionStorage.removeItem('sellState')
                  sessionStorage.removeItem('getToken')
                  this.$router.go('-1')
                }, */
    //关闭kyc验证
    /*removeItemKyv() {
                  this.status = 0;
                  this.kycVerState = 0
                  sessionStorage.removeItem('sellState')
                  sessionStorage.removeItem('getToken')
                  //  this.$router.replace('/')
                },*/
    //获取用户的kyc验证token
    getUserToken() {
      if (localStorage.getItem("getKycTokenByOnfidoWay") === "true") {
        this.getUserToken_onfido();
        return;
      }

      var FormData = require("form-data");
      var data = new FormData();
      data.append("fullName", this.fullName);
      data.append("levelIndex", this.kyc_info.kycTips);
      this.$axios
        .post(this.$api.post_getKycToken, data, "")
        .then((res) => {
          if (!res) {
            this.status = 0;
            this.nextKyc = true;
            // this.$toast('未知错误')
            return;
          }
          if (res.data) {
            this.getToken = res.data;
            this.nextKyc = true;
            sessionStorage.setItem("getToken", res.data);
            sessionStorage.setItem("sellState", this.status);
            clearTimeout(this.timeOut);
            this.timeOut = setTimeout(() => {
              this.launchWebSdk(this.getToken);
            }, 1000);
          }
        })
        .catch((error) => {
          if (error && error.returnCode === "110") {
            this.status = 0;
            this.kycVerState = 3;
            this.nextKyc = true;
            this.isKycLoginToast(this.$parent);
          }
        });
    },
    getUserToken_onfido() {
      const params = {
        userNo: window.localStorage.getItem("userNo"),
        reference: window.location.origin + "/",
      };
      this.$axios
        .post(this.$api.post_getToken, params, "")
        .then((res) => {
          if (!res) {
            this.status = 0;
            this.nextKyc = true;
            // this.$toast('未知错误')
            return;
          }
          if (res.data) {
            this.getToken = res.data.token;
            this.nextKyc = true;
            sessionStorage.setItem("getToken", res.data.token);
            sessionStorage.setItem("sellState", this.status);
            clearTimeout(this.timeOut);
            this.timeOut = setTimeout(() => {
              this.launchWebSdk(this.getToken);
            }, 1000);
          }
        })
        .catch((error) => {
          if (error && error.returnCode === "110") {
            this.status = 0;
            this.kycVerState = 3;
            this.nextKyc = true;
            this.isKycLoginToast(this.$parent);
          }
        });
    },
    getKycResult() {
      return new Promise((resolve, reject) => {
        if (localStorage.getItem("getKycTokenByOnfidoWay") === "true") {
          let params = {
            payWayCode:
              this.payMethodInfo.payWayCode || this.placeOrderQuery.payWayCode,
          };
          this.$axios
            .get(this.$api.get_findUserDetail, params, "")
            .then((res) => {
              if (res && res.returnCode === "0000" && res.data) {
                let result = "";
                if (this.kyc_info.kycTips == 1) {
                  if (
                    res.data.currKycLevel == 1 &&
                    res.data.currKycStatus == 1
                  ) {
                    // 存储kyc信息
                    this.$store.commit(
                      "kycInfo/set_kycCheck",
                      res.data.isPassByPwcWorld
                    );
                    this.$store.commit("kycInfo/set_kycResultInfo", res.data);
                    result = "success";
                  } else if (
                    res.data.currKycLevel == 0 &&
                    res.data.currKycStatus == 2
                  ) {
                    result = "final";
                  } else if (
                    res.data.currKycLevel == 0 &&
                    res.data.currKycStatus == 3
                  ) {
                    result = "fail";
                  }
                } else if (this.kyc_info.kycTips == 2) {
                  if (
                    res.data.currKycLevel == 2 &&
                    res.data.currKycStatus == 1
                  ) {
                    // 存储kyc信息
                    this.$store.commit(
                      "kycInfo/set_kycCheck",
                      res.data.isPassByPwcWorld
                    );
                    this.$store.commit("kycInfo/set_kycResultInfo", res.data);
                    result = "success";
                  } else if (
                    res.data.currKycLevel != 2 &&
                    res.data.currKycStatus == 2
                  ) {
                    result = "final";
                  } else if (
                    res.data.currKycLevel != 2 &&
                    res.data.currKycStatus == 3
                  ) {
                    result = "fail";
                  }
                }
                resolve({ status: result, info: res });
              } else {
                reject("getKycResult Error");
              }
            })
            .catch((error) => {
              reject("getKycResult Error");
            });
        } else {
          this.$axios
            .post(
              this.$api.post_kycResult,
              { level: this.kyc_info.kycTips },
              ""
            )
            .then((res) => {
              if (res.returnCode === "0000") {
                resolve({ status: res.data });

                /* res.data == "";
                                res.data == "final"; //最终失败，
                                res.data == "fail"; //临时失败
                                res.data == "success"; //成功 */
              } else {
                reject("getKycResult Error");
              }
            })
            .catch((e) => {
              reject("getKycResult Error");
            });
        }
      });
    },
    async setPageStatus() {
      let kycResult = await this.getKycResult();
      if (
        kycResult.status === "success" &&
        kycResult.info.data.isPassByPwcWorld === false &&
        this.$store.state.homeTabstate === "buyCrypto"
      ) {
        this.$router.replace("/kyc-error-countryCheck");
        return;
      }
      if (kycResult.status === "success") {
        this.status = 0;
        this.kycVerState = 1;
        /*this.$axios.post(this.$api.post_getQuota, { userLevel: this.kyc_info.kycTips }, '').then(val => {
          if (val) {
            this.monthLimitAmount = val.data.model.dayLimitAmount / 100; // 修改为展示日限额
          }
        });*/
        // clearInterval(this.kycResultTimer);
        return;
      } else if (kycResult.status === "fail") {
        //kycErrorStatus 如果为true时 则已经验证过一次
        if (this.kycErrorStatus) {
          this.kycErrorStatus = false;
          return false;
        }
        this.status = 0;
        this.kycVerState = 2;
        return;
      } else if (kycResult.status === "final") {
        this.status = 0;
        this.kycVerState = 3;
        // clearInterval(this.kycResultTimer);
        return;
      }
    },
  },
  watch: {
    //保存页面状态
    kycVerState(newVal, oldVal) {
      if (newVal !== oldVal) {
        sessionStorage.setItem("kycVerState", newVal);
      }
    },
  },

  mounted() {
    /*this.setPageStatus();
    clearInterval(this.kycResultTimer);
    this.kycResultTimer = setInterval(() => {
      this.setPageStatus();
    }, 5000);*/

    // this.$store.commit('userInfo/set_kycInfo_kycTips',2)
    // this.kycVerState = 2;
    //保存页面状态

    if (localStorage.getItem("getKycTokenByOnfidoWay") === "true") {
      let kyc_info_onfido = JSON.parse(localStorage.getItem("kyc_info_onfido"));

      this.$store.commit(
        "userInfo/set_kycInfo_levelIndex",
        String(kyc_info_onfido.userLevel)
      );
      this.$store.commit(
        "userInfo/set_kycInfo_kycTips",
        Number(kyc_info_onfido.userLevel)
      );

      if (kyc_info_onfido.currKycStatus == 0) {
        this.kycVerState = 0;
      } else if (kyc_info_onfido.currKycStatus == 1) {
        this.kycVerState = 1;
      } else if (kyc_info_onfido.currKycStatus == 3) {
        this.kycVerState = 2;
        console.log(this.kycVerState);
      } else if (kyc_info_onfido.currKycStatus == 2) {
        this.kycVerState = 3;
      }
    }

    // this.kycVerState = sessionStorage.getItem('kycVerState') ? sessionStorage.getItem('kycVerState') - 0 : 0;

    if (
      sessionStorage.getItem("sellState") &&
      sessionStorage.getItem("getToken")
    ) {
      this.status = sessionStorage.getItem("sellState");
      this.getToken = sessionStorage.getItem("getToken");
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        this.launchWebSdk(this.getToken);
      }, 200);
    } else {
      // this.status=1
      // this.kycVerState = 1
      return false;
    }
  },
  deactivated() {
    this.$store.state.emailFromPath = "kyc";
    clearTimeout(this.timeOut);
    clearInterval(this.kycResultTimer);

    sessionStorage.removeItem("kycVerState");
    sessionStorage.removeItem("sellState");
    sessionStorage.removeItem("getToken");
    this.nextKyc = true;
  },
  destroyed() {
    this.$store.state.emailFromPath = "kyc";
    clearTimeout(this.timeOut);
    clearInterval(this.kycResultTimer);

    sessionStorage.removeItem("kycVerState");
    sessionStorage.removeItem("sellState");
    sessionStorage.removeItem("getToken");
    this.nextKyc = true;
  },
};
</script>

<style lang="scss" src="./index.scss" scoped></style>
