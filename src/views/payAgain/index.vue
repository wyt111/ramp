<template>
  <div id="paymentMethod" ref="padding_bottom_box">
    <!-------------------------------------------- 不同状态组件 -------------------------------------------->
    <div class="paymentMethod-content">
      <!-- 支付错误信息 -->
      <p class="errorTipsCard" :class="{ mb24: !payMethodStatus }">
        <img src="@/assets/images/cardErrorIcon.svg" alt="" />
        <span>{{ resultText }}</span>
      </p>
      <!-- 信用卡数量为0 -->
      <errorCard
        v-show="!!payMethodStatus"
        ref="errorCard"
        :orderAllInfo="orderAllInfo"
      />
      <!-- 信用卡数量大于0 -->
      <historyCard
        v-show="!payMethodStatus"
        :allSavedCard="savedCard"
        ref="historyCard"
      />
    </div>
    <!-------------------------------------------- 底部按钮 -------------------------------------------->
    <footer class="footer" ref="footer_ref">
      <button class="continue" :disabled="disabled" @click="placeOrder">
        {{ $t("button_components.proceed") }}
        <img
          v-if="!request_loading"
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
        />
        <button-loading v-else class="rightIcon" />
      </button>
      <div class="others-btn">
        <!-- 其他支付方式入口 -->
        <button
          class="otherPayMethods"
          @click="
            goPayMethods(buttonStatus(orderAllInfo)[0] || [], orderAllInfo)
          "
          v-if="secondaryPayStatus"
        >
          <span>{{
            buttonStatus(orderAllInfo).length > 0
              ? $t(`buyHistory.${buttonStatus(orderAllInfo)[0].name1}`)
              : ""
          }}</span>
        </button>
        <!-- 商户默认返回入口 -->
        <button class="merchantBack" v-if="merchantBack">
          <span>Come Back to OPENSEA</span>
        </button>
      </div>
      <powered-by
        @setPaddingBottom="
          $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`
        "
      />
    </footer>
    <!-------------------------------------------- 新增信用卡组件 -------------------------------------------->
    <!-- 信用卡数量大于0 添加国际卡表单 -->
    <div
      ref="addNewCard"
      class="addNewCard"
      :class="
        addNewCardShow == 1
          ? 'addNewCardBottom'
          : addNewCardShow == 2
          ? 'addNewCardTop'
          : 'animation_opacity'
      "
    >
      <div class="addNewCar">
        <p v-if="this.savedCard.length > 0">
          {{ $t("sellFormUserInfo.card_information") }}
        </p>
        <p v-else>{{ $t("buyPayWay.useCardTitle") }}</p>
        <img src="@/assets/images/ShutDown2.svg" alt="" @click="goBack" />
      </div>
      <newCardInfo ref="newCardInfo_ref" />
    </div>
  </div>
</template>

<script>
import newCardInfo from "@/views/buyCurrency/payments/creditCard/newCardInfo";
import historyCard from "@/views/payAgain/historyCard/index";
import errorCard from "@/views/payAgain/errorCardInfo/index";
import { mapState } from "vuex";
import { AES_Decrypt } from "@/utils/encryp";
import {
  checkPixKycIsRequired,
  requestPayFormInfo,
} from "@/utils/publicRequest";
import { allPayType } from "@/assets/json/paymentMethods.js";
import paymentMethods from "@/assets/json/paymentMethods.json";

export default {
  name: "errorFormInfo",
  components: { newCardInfo, historyCard, errorCard },
  beforeRouteEnter(to, from, next) {
    /* 二次支付原因是卡信息错误修改页面title */
    if (to.query.ChangeCard === "CardInformation") {
      to.meta.title = "nav.routerName_errorFormInfo2";
    }
    next();
  },
  data() {
    return {
      //按钮请求状态
      request_loading: false,

      //跳转其他支付方式loading状态
      otherPayMethods_loading: false,

      //页面展示状态
      payMethodStatus: "", //true展示填写卡信息 false展示选择卡信息

      //填写卡信息组件按钮状态
      selectKey: true,
      //选择卡信息组件按钮状态
      radioIndex: "",
      //选择卡信息组件中新增卡信息组件状态
      addNewCardShow: "1",

      //支付失败信息
      failMessage: {},
      i18nLocale: sessionStorage.getItem("language") || "en-US",

      orderAllInfo: {},
      //选择其他支付方式展示状态
      secondaryPayStatus: false,

      //支付方式类型
      allPayType,
    };
  },
  computed: {
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
    }),
    ...mapState("buyPayments", {
      creditCardList: (state) => state.creditCardList,
    }),

    //历史国际卡信息
    savedCard() {
      if (
        this.creditCardList !== undefined &&
        this.creditCardList &&
        this.creditCardList.length > 0
      ) {
        let cardData = JSON.parse(JSON.stringify(this.creditCardList));
        cardData.forEach((val, index) => {
          cardData[index].cardNumber = AES_Decrypt(val.cardNumber);
        });
        this.queryPayMethods();
        return cardData;
      }
      this.queryPayMethods();
      return [];
    },

    disabled() {
      if (this.payMethodStatus === true) {
        return this.selectKey !== true && this.request_loading === false
          ? false
          : true;
      } else {
        return this.radioIndex !== "" && this.request_loading === false
          ? false
          : true;
      }
    },

    merchantBack() {
      //
      // if(){
      //   return true
      // }
      return false;
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
  activated() {
    this.queryPayMethods();
    this.queryOrderInfo();
  },
  deactivated() {
    this.payMethodStatus = "";
    this.otherPayMethods_loading = false;
    //初始化组件状态
    this.addNewCardShow = 1;
    this.radioIndex = "";
    this.selectKey = true;
    this.request_loading = false;
    this.$nextTick(() => {
      this.$refs.errorCard.clearData();
    });
  },
  methods: {
    //请求支付方式
    queryPayMethods() {
      //二次支付 - 修改卡信息操作
      if (
        this.$route.query.pathHistry === "tradeHistory" &&
        this.$route.query.ChangeCard === "CardInformation"
      ) {
        this.payMethodStatus = true;
      }
      //二次支付 - 更换卡操作 历史信用卡数量为0则添加卡、历史信用卡数量>0则选择历史信用卡
      if (
        this.$route.query.pathHistry === "tradeHistory" &&
        this.$route.query.ChangeCard === "ChangeCard" &&
        this.creditCardList.length === 0
      ) {
        this.payMethodStatus = true;
      }
      if (
        this.$route.query.pathHistry === "tradeHistory" &&
        this.$route.query.ChangeCard === "ChangeCard" &&
        this.creditCardList.length > 0
      ) {
        this.payMethodStatus = false;
      }
    },

    //确认按钮
    placeOrder() {
      if (this.payMethodStatus === true) {
        this.$refs.errorCard.submitPay();
        return;
      }
      this.$refs.historyCard.confirm();
    },

    //查询订单信息
    queryOrderInfo() {
      let params = {
        orderNo:
          this.$route.query.orderNo.indexOf("ach") > 0
            ? this.$route.query.orderNo.substring(
                0,
                this.$route.query.orderNo.indexOf("ach")
              )
            : this.$route.query.orderNo,
      };
      this.$axios.get(this.$api.get_buyDetailsData, params).then((res) => {
        if (res && res.data) {
          this.orderAllInfo = res.data;
          this.queryCodeMessage(res.data.failCode);
          //查询订单失败原因
          if (["3", "4"].includes(res.data.twicePayType)) {
            this.secondaryPayStatus = true;
          } else {
            this.secondaryPayStatus = false;
          }
        }
      });
    },

    //查询订单失败原因
    queryCodeMessage(code) {
      let params = {
        code: code,
      };
      this.$axios.get(this.$api.get_codeMessage, params).then((res) => {
        if (res && res.data) {
          this.failMessage = res.data;
        }
      });
    },

    //处理二次支付按钮展示样式  包括有指定支付方式和支付类型
    buttonStatus(val) {
      let returnData = [];
      let buttonData = this.allPayType;
      let status = val.twicePayType.split(",");
      //二次支付类型
      if (
        (val.twicePayType.includes("3") || val.twicePayType.includes("4")) &&
        val.payWayCodeList
      ) {
        let allPayType = buttonData;
        let filterPayType = [];
        allPayType.forEach((item) => {
          val.payWayCodeList.forEach((_item) => {
            if (item.allpayWayCode) {
              item.allpayWayCode.forEach((data) => {
                _item == data ? filterPayType.push(item.isShow) : "";
              });
            }
          });
        });
        filterPayType = [...new Set(filterPayType)];
        if (val.payWayCodeList.includes("20001")) {
          filterPayType.push("20001");
        }
        if (
          val.payWayCodeList.includes("501") ||
          val.payWayCodeList.includes("502")
        ) {
          try {
            if (
              window.ApplePaySession &&
              window.ApplePaySession.canMakePayments()
            ) {
              if (val.payWayCodeList.includes("501")) {
                filterPayType.push("501");
              } else if (val.payWayCodeList.includes("502")) {
                filterPayType.push("502");
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
        if (
          val.payWayCodeList.includes("701") ||
          val.payWayCodeList.includes("702")
        ) {
          // 需要判断环境支持GooglePay
          try {
            const paymentsClient =
              new window.google.payments.api.PaymentsClient({
                environment: process.env.VUE_APP_googlePay_environment,
              });
            paymentsClient
              .isReadyToPay({
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                  {
                    type: "CARD",
                    parameters: {
                      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                      allowedCardNetworks: ["MASTERCARD", "VISA"],
                    },
                  },
                ],
              })
              .then(function (response) {
                if (response.result) {
                  if (val.payWayCodeList.includes("701")) {
                    filterPayType.push("701");
                  } else if (val.payWayCodeList.includes("702")) {
                    filterPayType.push("702");
                  }
                }
              });
          } catch (e) {
            console.error(e);
          }
        }
        //支付类型大于等于1小于2展示本地支付入口 否则展示选择全部本地支付
        if (filterPayType.length >= 1 && filterPayType.length < 2) {
          returnData = buttonData.filter((item) => {
            return filterPayType.includes(item.isShow);
          });
          let matchingPayWayCode = [];
          val.payWayCodeList.forEach((item) => {
            if (returnData[0].allpayWayCode) {
              returnData[0].allpayWayCode.forEach((_item) => {
                item == _item ? matchingPayWayCode.push(item) : "";
              });
            }
          });
          returnData[0].matchingPayWayCode = matchingPayWayCode;
          return returnData;
        }
        return buttonData.filter((item) => {
          //本地支付数量为0
          if (filterPayType.length < 1) {
            this.secondaryPayStatus = false;
            return;
          }
          //选择支付方式
          return ["3"].includes(item.isShow);
        });
      }
      return buttonData.filter((item) => {
        return status.includes(item.isShow);
      });
    },

    //跳转其他支付方式
    async goPayMethods(val, data) {
      this.$store.commit("changeBuyPayProcessTab", false);
      this.otherPayMethods_loading = true;
      //isTwice 为0时是不支持二次支付
      if (data.isTwice === "0") {
        return;
      }

      //存储二次支付数据
      this.storePaymentAgainData(data);

      //选择支付方式页、选择支付方式页 不包含信用卡支付、本地支付类型>0 - eWallet类型、Philippines类型、qrCode类型
      if (
        val.classData === "Method" ||
        val.classData === "ChangeMethod" ||
        (val.classData === "localPayment" &&
          ["eWallet", "Philippines", "qrCode"].includes(val.name1) &&
          val.matchingPayWayCode.length > 1)
      ) {
        this.paymentAgainPath(val);
        return;
      }

      //跳转到确认订单页前修改订单支付方式
      let params = {
        orderNo: data.orderNo,
        payWayCode: val.isShow,
      };
      //只存在一种本地支付类型并且只有一个支付方式 - eWallet类型、Philippines类型、qrCode类型
      if (
        val.classData === "localPayment" &&
        ["eWallet", "Philippines", "qrCode"].includes(val.name1) &&
        val.matchingPayWayCode.length === 1
      ) {
        params.payWayCode = val.matchingPayWayCode[0];
        // 查询用户支付表单数据
        await requestPayFormInfo(params.payWayCode);
      }
      this.$axios
        .post(this.$api.post_updateOrderInfo, params, "")
        .then((_res) => {
          if (_res) {
            //只存在一种本地支付类型并且只有一个支付方式 - eWallet类型、Philippines类型、qrCode类型
            if (
              val.classData === "localPayment" &&
              ["eWallet", "Philippines", "qrCode"].includes(val.name1) &&
              val.matchingPayWayCode.length === 1
            ) {
              let payMethodInfo = {
                payWayCode: val.matchingPayWayCode[0], //支付方式code
                payWayName: val.payWayName, //支付方式名称
              };
              this.$store.commit(
                "buyPayments/set_payMethodInfo",
                payMethodInfo
              );
              this.paymentAgainPath(val);
              return;
            }
            //指定支付需要的页面展示参数
            let payMethodInfo = {
              payWayCode: val.isShow, //支付方式code
              payWayName: val.payWayName, //支付方式名称
            };
            this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
            this.paymentAgainPath(val);
          }
        });
    },

    //二次支付跳转地址
    async paymentAgainPath(val) {
      //--------------- 不需要更改订单支付方式 跳转支付方式页 ---------------
      //选择支付方式页
      if (val.classData === "Method") {
        this.$router
          .push(`/paymentMethod?pathHistry=tradeHistory&ChangeCard=Method`)
          .then(() => {
            this.otherPayMethods_loading = false;
          });
        return;
      }
      //选择支付方式页 不包含信用卡支付
      if (val.classData === "ChangeMethod") {
        this.$router
          .push(
            `/paymentMethod?pathHistry=tradeHistory&ChangeCard=changeMethod`
          )
          .then(() => {
            this.otherPayMethods_loading = false;
          });
        return;
      }
      //本地支付类型>0 - eWallet类型、Philippines类型、qrCode类型
      if (
        val.classData === "localPayment" &&
        ["eWallet", "Philippines", "qrCode"].includes(val.name1) &&
        val.matchingPayWayCode.length > 1
      ) {
        this.$router.push(
          `/paymentMethod?pathHistry=tradeHistory&ChangeCard=Method`
        );
        return;
      }

      //--------------- 需要修改订单支付方式 只存在一种本地支付类型并且只有一个支付方式 跳转到确认订单页 ---------------
      let ParamsData1 = "pathHistry=tradeHistory";

      if (val.matchingPayWayCode && val.matchingPayWayCode.length === 1) {
        if (val.matchingPayWayCode[0] === "30001") {
          let { kycIsRequired, path } = await checkPixKycIsRequired({
            orderNo: this.buyPayment_secondPay.orderNo,
            amount: this.buyPayment_secondPay.amount,
            fiatCurrency: this.buyPayment_secondPay.currency,
          });
          if (kycIsRequired) {
            this.$router.push(
              `${path}?${ParamsData1}&isTwice=1&type=brazilPay`
            );
          } else {
            this.$router.push(`${path}?${ParamsData1}&isTwice=1`);
          }
          return;
        } else {
          paymentMethods.some((item) => {
            if (item.payWayCode == val.matchingPayWayCode[0]) {
              this.$router.push(`${item.routerPath}?${ParamsData1}&isTwice=1`);
              return true;
            }
          });
        }
        return;
      }

      //--------------- 需要修改订单支付方式 本地支付方式不存在子级 ---------------
      //币安支付、苹果支付
      if (["20001"].includes(val.isShow)) {
        this.$router.push(`/binancePay?${ParamsData1}&isTwice=1`);
      } else if (["501", "502"].includes(val.isShow)) {
        this.$router.push(`/applePay?${ParamsData1}&isTwice=1`);
      } else if (["701", "702"].includes(val.isShow)) {
        this.$router.push(`/googlePay?${ParamsData1}&isTwice=1`);
      }
    },

    //存储二次支付所需参数
    storePaymentAgainData(data) {
      //二次确认订单时修改倒计时费率
      let dataVal = {
        cryptoCurrency: data.cryptocurrency,
        amount: data.orderAmount,
        netWorkFee: data.networkFee,
        payCommission: {
          symbol: this.$route.query.Symbol,
          symbolNative: this.$route.query.Symbol,
          code: data.fiatCode,
          rampFee: data.rampFee,
          getAmount: data.total,
        },
        depositType: this.$route.query.depositType,
        network: data.networkName,
        cardNumber: data.cardNo,
        email: localStorage.getItem("email"),
        userCardId: data.userCardId,
        orderNo: data.orderNo,
        alpha2: data.alpha2,
        currency: data.fiatCode,
      };

      //存储法币国家信息
      let fiatCurrencyInfo = {
        fiat: data.fiatCode, //法币
        fiatSymbol: this.$route.query.Symbol, //法币符号
        flag: "", //国旗
        alpha2: data.alpha2, //国家code
      };
      this.$store.commit(
        "secondaryBuyPayments/set_fiatCurrencyInfo",
        fiatCurrencyInfo
      );
      //数字货币信息
      let cryptoInfo = {
        crypto: data.cryptocurrency, //数字货币
        cryptoIcon: "", //数字货币图标
        cryptoToFiatPrice: "", //数字货币兑法币单价 - 1crypto 约等于 多少 fiat
      };
      this.$store.commit("secondaryBuyPayments/set_cryptoInfo", cryptoInfo);
      //网络信息
      let networkInfo = {
        network: data.networkName, //网络
        networkName: "", //网络全称
        networkIcon: "", //网络图标
        addressRegex: "", //地址正则
        memoRegex: "", //memo正则
      };
      this.$store.commit("secondaryBuyPayments/set_networkInfo", networkInfo);
      //法币金额
      let fiatCurrencyAmount = data.orderAmount;
      this.$store.commit(
        "secondaryBuyPayments/set_fiatCurrencyAmount",
        fiatCurrencyAmount
      );

      //确认订单卡号和地址的参数设置需要参数
      let networkInfo_2 = {
        network: data.networkName ? data.networkName : data.network,
        address: data.address,
      };
      this.$store.commit(
        "buyPayments/set_placeOrderQuery_addressNetwork",
        networkInfo_2
      );
      this.$store.commit(
        "buyPayments/set_placeOrderQuery_amount",
        data.orderAmount
      );
      let fiatInfo = {
        alpha2: data.alpha2,
        fiatCurrency: data.fiatCode,
      };
      this.$store.commit("buyPayments/set_placeOrderQuery_fiatInfo", fiatInfo);
      this.$store.commit("buyPayments/set_orderNo", data.orderNo);
      //卡的一些参数
      let buyfrom = {
        cardNumber: data.cardNo,
        cardExpireYear: data.cardExpireYear
          ? AES_Decrypt(data.cardExpireYear)
          : "",
        cardExpireMonth: data.cardExpireMonth
          ? AES_Decrypt(data.cardExpireMonth)
          : "",
        firstname: data.firstName,
        lastname: data.lastName,
        userCardId: data.userCardId,
        failCode: data.failCode,
      };
      //往state数据里面赋值
      this.$store.commit(
        "secondaryBuyPayments/set_buyPayment_secondPay",
        dataVal
      );
      this.$store.commit("secondaryBuyPayments/setBuyFromData", buyfrom);
    },

    goBack() {
      this.addNewCardShow = 1;
      this.$refs.errorCard.clearData();
    },
  },
};
</script>

<style lang="scss" src="./index.scss" scoped></style>
