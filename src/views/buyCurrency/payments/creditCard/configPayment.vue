<template>
  <div id="configPayment">
    <div id="cardConfigPayment" ref="box_ref" @scroll="handleScroll">
      <div class="cardConfigPayment-content" ref="form_ref">
        <!-- 支付失败信息 -->
        <p class="errorTipsCard" v-if="failMessage_state">
          <img src="@/assets/images/cardErrorIcon.svg" alt="" />
          <span>{{ resultText }}</span>
        </p>
        <!-- 新增支付方式信息模块 -->
        <PayMethodInfo />
        <!-- 选择支付方式页选择的是之间交易过的卡信息需要重新填写CVV -->
        <div
          class="cvv-view"
          v-if="newCvvState"
          :class="{ focus: inputFocus, formContentError: errorCvv }"
        >
          <p class="title">{{ $t("creditCard.cvv") }}</p>
          <p class="cvv-input">
            <input
              type="digit"
              @focus="inputFocus = true"
              @blur="inputBlur"
              v-model="newCvv"
              placeholder="123"
              :disabled="cvvDisabled"
              @input="cvvChange('input')"
              maxlength="3"
              @paste="onPaste"
            />
          </p>
        </div>
        <!-- error tips -->
        <el-collapse-transition>
          <div class="errorTips" v-if="errorCvv">
            {{ $t("buyForm_components.cvvTips") }}
          </div>
        </el-collapse-transition>
        <!-- 支付费用模块 -->
        <IncludedDetails
          class="includedDetails"
          ref="includedDetails_ref"
          :type="2"
          :payWayCode="payMethodInfo.payWayCode"
        />
        <transition>
          <div class="downTips-icon" v-show="goDown_state" @click="goDown">
            <img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt="" />
          </div>
        </transition>
      </div>

      <footer ref="footer_ref">
        <CustomButton
          :buttonData="buttonData"
          :disabled="disabled"
          :loadingDisabled="true"
          @click.native="submit"
          ref="button_ref"
        ></CustomButton>
        <bottom-bar
          @setPaddingBottom="
            $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`
          "
        />
      </footer>
    </div>
  </div>
</template>

<script>
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import {
  checkKyc,
  checkKyc_onfido,
  getKycRule,
  forterCookie,
  querySubmitToken,
} from "@/utils/publicRequest";
import { isElementNotInViewport } from "@/utils";
import { AES_Encrypt, AES_Decrypt } from "@/utils/encryp.js";
import { mapState } from "vuex";
import PayMethodInfo from "@/components/PayMethodInfo/index";
import { risk_publishRiskData } from "@/utils/risk_deviceSessionId";

export default {
  name: "configPayment",
  components: { IncludedDetails, PayMethodInfo },
  data() {
    return {
      inputFocus: false,
      cardData: {
        cardNumber: "",
      },

      timeDown: null,
      submitState: true,

      newCvvState: false,
      newCvv: "",
      cvvDisabled: false,

      //按钮状态
      buttonData: {
        loading: false,
        triggerNum: 0,
      },

      goDown_state: false,
      oldOffsetTop: 0,
      scrollTimeDown: null,

      i18nLocale: sessionStorage.getItem("language") || "en-US",

      //支付错误code
      failMessage: {},
      failMessage_state: false,
      errorCvv: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //初始化cvv
      if (
        [
          "/paymentMethod",
          "/tradeHistory",
          "/tradeHistory-BuyDetails",
          "/paymentResult",
          "/errorFormInfo",
        ].includes(from.path) &&
        to.path === "/creditCardConfig" &&
        !from.query.configPaymentFrom
      ) {
        vm.newCvv = "";
      }
      //初始化支付错误提示
      if (
        [
          "/paymentMethod",
          "/tradeHistory",
          "/tradeHistory-BuyDetails",
          "/errorFormInfo",
        ].includes(from.path) &&
        to.path === "/creditCardConfig"
      ) {
        vm.failMessage_state = false;
      }
      if (
        to.name === "creditCardConfig" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        window.sessionStorage.removeItem("indonesiaPayment");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
      }
    });
  },
  async activated() {
    //参数为空跳转到首页
    if (
      this.orderNo === "" ||
      this.orderNo === undefined ||
      this.orderNo === null
    ) {
      this.$router.replace("/");
      return;
    }

    //初始化根据可视高度控制向下提示按钮状态
    setTimeout(() => {
      if (isElementNotInViewport("configPayment", this.$refs.footer_ref)) {
        this.goDown_state = true;
      } else {
        this.goDown_state = false;
      }
    }, 500);

    window.addEventListener("scroll", this.handleScroll, true);
    //恢复页面默认状态
    this.buttonData = {
      loading: false,
      triggerNum: 0,
    };
    this.submitState = true;
    this.cvvDisabled = false;
    //接入商户逻辑

    this.newCvvState =
      this.$route?.query?.configPaymentFrom === "userPayment" ||
      !this.newCardData.cardCvv;

    this.reviceInfo();
  },
  computed: {
    disabled() {
      if (this.newCvvState === true && this.newCvv.length !== 3) {
        return true;
      } else {
        return false;
      }
    },

    ...mapState("cryptoBuyPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      networkInfo: (state) => state.networkInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      feeInfo: (state) => state.feeInfo,
      cryptoAmount: (state) => state.cryptoAmount,
    }),
    ...mapState("buyPayments", {
      newCardData: (state) => state.creditCardInfo,
      userCardId: (state) => state.userCardId,
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      placeOrderQuery: (state) => state.placeOrderQuery,
    }),
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
    }),

    cardNumber() {
      return AES_Decrypt(this.cardData.cardNumber);
    },

    //信用卡类型
    cardType() {
      let cardNum = AES_Decrypt(this.cardData.cardNumber).substring(0, 1);
      if (cardNum === "4") {
        return "Visa";
      } else if (
        AES_Decrypt(this.cardData.cardNumber).substring(0, 3) === "220"
      ) {
        //  && this.fiat === 'RUB'
        return "Mir";
      } else {
        return "Master";
      }
    },

    //信用卡脱敏信息
    cardNum() {
      let card = AES_Decrypt(this.newCardData.cardNumber);
      return card && card !== "" ? card.substring(card.length - 4) : "";
    },

    //支付失败原因
    resultText() {
      let failMessage = this.failMessage[this.i18nLocale];
      if (
        failMessage !== "" &&
        failMessage !== undefined &&
        failMessage !== null
      ) {
        return failMessage;
      }
      return `${this.$t("nav.payResult_timeErrorMessage")}`;
    },
  },
  methods: {
    inputBlur() {
      this.inputFocus = false;
      this.cvvChange("blur");
    },
    onPaste(event) {
      event.preventDefault();
      this.$toast({
        duration: 3000,
        message: this.$t("buyForm_components.paste_tips"),
        className: "paste_tips_toast",
      });
    },
    cvvChange(type) {
      let str = String(this.newCvv).replace(/[^0-9]/g, "");
      this.newCvv = str;

      if (String(this.newCvv).length < 3) {
        if (type == "blur") {
          this.errorCvv = true;
        }
      } else {
        this.errorCvv = false;
      }
      if (!String(this.newCvv).length) {
        this.errorCvv = false;
      }
    },
    reviceInfo() {
      this.cardData = this.newCardData;
      //判断上一页路由 控制填写CVV状态

      this.newCvvState =
        this.$route?.query?.configPaymentFrom === "userPayment" ||
        !this.newCardData.cardCvv;
    },

    /**
     * buttonData.agreement: 1 - 支付 >1 查询支付状态
     * @returns {Promise<void>}
     */
    async submit() {
      if (this.buttonData.triggerNum === 1) {
        this.cvvDisabled = true;
        // console.log('234324', this.buttonData.triggerNum);
        await this.pay();
      }
    },
    /**
     * 获取风控数据
     */
    async retryRiskData() {
      let checkoutCookie = "";
      for (let retry = 0; retry < 2; retry++) {
        try {
          checkoutCookie = await risk_publishRiskData();
          return checkoutCookie; // 如果成功，返回 checkoutCookie 并跳出循环
        } catch (e) {
          console.log(e);
        }
      }
      return checkoutCookie; // 如果所有重试失败，返回 checkoutCookie
    },
    //支付
    /**
     * submitToken: true状态为已经请求到submit-token
     * submitState: 只能触发一次，直到上一次有回调
     */
    async pay() {
      if (!this.submitState) return;

      //验证是否通过kyc 二次支付不验证kyc
      if (!this.$route.query.pathHistry) {
        this.submitState = false;

        let kycRule = await getKycRule(this.orderNo);
        let isKyc;
        if (kycRule === "1") {
          // onfido 验证方式
          isKyc = await checkKyc_onfido();
        } else if (kycRule === "2") {
          // sumsub 验证方式
          isKyc = await checkKyc();
        }
        if ([1, 3].includes(isKyc)) {
          this.submitState = true;
          return;
        }
      }

      //支付
      let submitToken = await querySubmitToken();
      if (submitToken) {
        const forter_Cookie = await forterCookie();
        let userId = localStorage.getItem("userId");
        userId = userId.replace("ACH", "");
        const checkoutCookie = await this.retryRiskData();

        let newParams = {
          payWayCode: this.payMethodInfo.payWayCode,
          orderNo: this.orderNo,
          userCardId: this.userCardId,
          cvv: this.newCvvState
            ? AES_Encrypt(this.newCvv)
            : this.newCardData.cardCvv,
          customParam: {},
          businessParams: {
            cookie: forter_Cookie,
            userId: userId,
            checkoutCookie: checkoutCookie,
          },
        };
        this.$axios
          .post(this.$api.post_alchemyPayPay, newParams, "")
          .then((res) => {
            if (
              res === undefined &&
              this.$route.query.pathHistry === "tradeHistory"
            ) {
              this.$store.commit("set_ovo_va_mex_qrs_Status", true);
            }
            if (res && res.data) {
              //如果确定下单并且返回 则直接触发返回首页
              this.$store.commit("set_tipsStatus", true);
              this.$store.commit("set_ovo_va_mex_qrs_Status", true);
              if (JSON.stringify(res.data) !== "{}") {
                //日本卡 - JPY10002
                if (res.data.channelNum === "JPY10002") {
                  this.$store.commit("set_ovo_va_mex_qrs_Status", true);
                  let newForm = {
                    PaReq: res.data.PaReq,
                    TermUrl: res.data.TermUrl,
                    MD: res.data.MD,
                  };
                  var temp_form = document.createElement("form");
                  temp_form.action = res.data.ACSUrl;
                  // temp_form.target = "_blank";
                  temp_form.method = "post";
                  temp_form.style.display = "none";
                  for (var x in newForm) {
                    var opt = document.createElement("input");
                    opt.name = x;
                    opt.value = newForm[x];
                    temp_form.appendChild(opt);
                  }
                  document.body.appendChild(temp_form);
                  temp_form.submit();
                } else {
                  window.location = res.data.webUrl;
                }
                this.submitState = true;
              } else {
                this.timeDown = setInterval(() => {
                  this.queryOrderStatus();
                }, 1000);
              }
            }
          })
          .catch((error) => {
            // console.log('3455dfa45566rem', error);
            this.$store.commit(
              "secondaryBuyPayments/set_backHome_status",
              true
            );
            //二次支付失败code处理
            //92000-再次尝试&展示支付失败原因
            if (error.returnCode.search("92000") !== -1) {
              this.$store.commit("changeBuyPayProcessTab", false);
              this.submitState = true;
              this.cvvDisabled = false;
              this.buttonData = {
                loading: false,
                triggerNum: 0,
              };
              let failCode = error.returnCode.substring(
                error.returnCode.indexOf("-") + 1,
                error.returnCode.length
              );
              this.queryCodeMessage(failCode);
              return;
            }
            //二次支付 92001-修改卡信息
            if (error.returnCode.search("92001") !== -1) {
              let submitForm = this.cardData;
              submitForm.email = localStorage.getItem("email");
              this.storeData();
              this.$router.push(
                `/errorFormInfo?pathHistry=tradeHistory&ChangeCard=CardInformation&submitForm=${JSON.stringify(
                  submitForm
                )}&orderNo=${this.orderNo}&from=creditCard`
              );
              return;
            }
            //92002-更换银行卡、92004-更换银行卡&更换支付方式
            if (
              error.returnCode.search("92002") !== -1 ||
              error.returnCode.search("92004") !== -1
            ) {
              this.storeData();
              //请求支付方式获取历史卡信息
              let params = {
                alpha2: this.buyPayment_secondPay?.alpha2,
                fiat: this.buyPayment_secondPay?.currency,
                amount: this.buyPayment_secondPay?.amount,
                orderNo: this.buyPayment_secondPay?.orderNo,
                crypto: this.buyPayment_secondPay?.cryptoCurrency,
                network: this.buyPayment_secondPay?.network,
              };
              this.$axios.get(this.$api.get_payMethods, params).then((res) => {
                if (res && res.data) {
                  //存储货币支持的支付方式
                  this.$nextTick(() => {
                    //历史信用卡信息
                    let savedCard = [];
                    if (
                      res &&
                      res.data &&
                      res.data.userCardList !== null &&
                      res.data.userCardList &&
                      res.data.userCardList.length > 0
                    ) {
                      res.data.userCardList.forEach((item2, index2) => {
                        res.data.userCardList[index2].payWayCode = "10001";
                        res.data.userCardList[index2].payWayName =
                          "Credit Card";
                        savedCard.push(item2);
                      });
                    }
                    this.$store.commit(
                      "buyPayments/set_creditCardList",
                      savedCard
                    );
                    this.$router.push(
                      `/errorFormInfo?pathHistry=tradeHistory&ChangeCard=ChangeCard&orderNo=${this.orderNo}&from=creditCard&Symbol=${this.fiatCurrencyInfo.fiatSymbol}`
                    );
                  });
                }
              });
              return;
            }
            //91003-支付失败、92003-修改支付通道
            if (
              ["91003", "60007"].includes(error.returnCode) ||
              error.returnCode.search("92003") !== -1
            ) {
              this.storeData();
              setTimeout(() => {
                this.$router.push(
                  `/paymentResult?customParam=${this.orderNo}&payCode=${error.returnCode}&from=creditCard&Symbol=${this.fiatCurrencyInfo.fiatSymbol}`
                );
              }, 600);
              return;
            }
            this.cvvDisabled = false;
            this.submitState = true;
            this.buttonData = {
              loading: false,
              triggerNum: 0,
            };
          });
      }
    },
    //查询订单状态
    queryOrderStatus() {
      let params = {
        orderNo: this.orderNo,
      };
      this.$axios.get(this.$api.get_payResult, params).then((res2) => {
        if (
          res2.data.orderStatus === 0 ||
          (res2.data.orderStatus >= 2 && res2.data.orderStatus <= 6)
        ) {
          // Clear create order token
          localStorage.removeItem("submit-token");
          this.submitState = true;
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },

    //查询订单失败原因
    queryCodeMessage(code) {
      let params = {
        code: code,
      };
      this.$axios.get(this.$api.get_codeMessage, params).then((res) => {
        this.failMessage_state = true;
        if (res && res.data) {
          this.failMessage = res.data;
          this.goTop();
        }
      });
    },

    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll(val) {
      window.clearTimeout(this.scrollTimeDown);
      this.scrollTimeDown = null;
      let offset =
        this.$refs.button_ref.$refs.buttonChild_ref.getBoundingClientRect();
      if (
        this.oldOffsetTop !== offset.top &&
        val.srcElement.scrollTop + val.srcElement.offsetHeight <
          val.srcElement.scrollHeight - 70
      ) {
        this.goDown_state = false;
        window.clearTimeout(this.scrollTimeDown);
        this.scrollTimeDown = null;
        this.scrollTimeDown = setTimeout(() => {
          this.goDown_state = true;
        }, 1000);
      }
      this.oldOffsetTop = offset.top;
    },
    goDown() {
      setTimeout(() => {
        document
          .getElementById("cardConfigPayment")
          .scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
        // this.$refs.button_ref.$refs.buttonChild_ref.scrollIntoView({behavior: "smooth", block: "end", inline: 'end'})
        this.goDown_state = false;
      });
    },
    goTop() {
      setTimeout(() => {
        // this.$refs.form_ref.scrollIntoView({behavior: 'smooth',block: 'start'});
        this.$refs.form_ref.scrollIntoView(false);
        // this.$refs.button_ref.$refs.buttonChild_ref.scrollIntoView({behavior: "smooth", block: "end", inline: 'end'})
      });
    },

    //存储二次支付信息
    storeData() {
      //二次确认订单时修改倒计时费率
      let dataVal = {
        cryptoCurrency: this.cryptoInfo.crypto,
        amount: this.placeOrderQuery.amount,
        netWorkFee: this.feeInfo.networkFee,
        payCommission: {
          symbol: this.fiatCurrencyInfo.fiatSymbol,
          symbolNative: this.fiatCurrencyInfo.fiatSymbol,
          code: this.fiatCurrencyInfo.fiat,
          rampFee: this.feeInfo.rampFee,
          getAmount: this.cryptoAmount,
        },
        depositType: this.$route.query.depositType,
        network: this.networkInfo.network,
        cardNumber: this.newCardData.cardNumber,
        email: localStorage.getItem("email"),
        userCardId: this.userCardId,
        orderNo: this.orderNo,
        alpha2: this.fiatCurrencyInfo.alpha2,
        currency: this.fiatCurrencyInfo.fiat,
      };

      //存储法币国家信息
      let fiatCurrencyInfo = {
        fiat: this.fiatCurrencyInfo.fiat, //法币
        fiatSymbol: this.fiatCurrencyInfo.fiatSymbol, //法币符号
        flag: this.fiatCurrencyInfo.flag, //国旗
        alpha2: this.fiatCurrencyInfo.alpha2, //国家code
      };
      this.$store.commit(
        "secondaryBuyPayments/set_fiatCurrencyInfo",
        fiatCurrencyInfo
      );
      //数字货币信息
      let cryptoInfo = {
        crypto: this.cryptoInfo.crypto, //数字货币
        cryptoIcon: this.cryptoInfo.cryptoIcon, //数字货币图标
        cryptoToFiatPrice: this.cryptoInfo.cryptoToFiatPrice, //数字货币兑法币单价 - 1crypto 约等于 多少 fiat
      };
      this.$store.commit("secondaryBuyPayments/set_cryptoInfo", cryptoInfo);
      //网络信息
      let networkInfo = {
        network: this.networkInfo.network, //网络
        networkName: this.networkInfo.networkName, //网络全称
        networkIcon: this.networkInfo.networkIcon, //网络图标
        addressRegex: this.networkInfo.addressRegex, //地址正则
        memoRegex: this.networkInfo.memoRegex, //memo正则
      };
      this.$store.commit("secondaryBuyPayments/set_networkInfo", networkInfo);
      //法币金额
      let fiatCurrencyAmount = this.fiatCurrencyAmount;
      this.$store.commit(
        "secondaryBuyPayments/set_fiatCurrencyAmount",
        fiatCurrencyAmount
      );
      //确认订单卡号和地址的参数设置需要参数
      let networkInfo_2 = {
        network: this.placeOrderQuery.network,
        address: this.placeOrderQuery.address,
      };
      this.$store.commit(
        "buyPayments/set_placeOrderQuery_addressNetwork",
        networkInfo_2
      );
      this.$store.commit("buyPayments/set_orderNo", this.orderNo);
      //往state数据里面赋值
      this.$store.commit(
        "secondaryBuyPayments/set_buyPayment_secondPay",
        dataVal
      );
    },
  },
  deactivated() {
    this.$store.dispatch("request/clearAllQuery");
    window.clearInterval(this.timeDown);
    // 取消监听
    window.removeEventListener("scroll", this.handleScroll, true);
    this.timeDown = null;
    this.newCvvState = false;
    if (this.newCvvState && this.newCvvState === true) {
      this.newCvv = "";
    }
    this.failMessage_state = false;
  },
};
</script>

<style lang="scss" src="./css/configPayment.scss" scoped></style>
