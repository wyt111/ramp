<!--
Three channels for successful payment --- 'depositType'
1.There is an ACh account
2.Chain address
3.No ACh account Auto register ACh account
-->
<template>
  <div id="paymentResult">
    <div class="paymentResult-content">
      <component
        :is="currentComponentName"
        :order-status="orderStatus"
        :details-parameters="detailsParameters"
        :fail-message="failMessage"
      ></component>
    </div>
    <footer class="footer">
      <template v-if="isOrderCompletionBtnVisible">
        <button class="continue" @click="goHome">
          {{ backText }}
          <img
            class="rightIcon"
            src="@/assets/images/button-right-icon.svg"
            alt=""
          />
        </button>
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
          <i
            class="el-icon-loading rightIcon"
            v-if="otherPayMethods_loading"
          ></i>
        </button>
      </template>
      <powered-by />
    </footer>
  </div>
</template>

<script>
import { AES_Decrypt } from "@/utils/encryp.js";
import { mapState } from "vuex";
import {
  hashQuery,
  checkPixKycIsRequired,
  requestPayFormInfo,
} from "@/utils/publicRequest";

import PaymentSucceeded from "./PaymentResultChildren/PaymentSucceeded.vue";
import PaymentFailed from "./PaymentResultChildren/PaymentFailed.vue";
import PaymentTimeout from "./PaymentResultChildren/PaymentTimeout.vue";
import { allPayType } from "@/assets/json/paymentMethods.js";
import paymentMethods from "@/assets/json/paymentMethods.json";

export default {
  name: "paymentResult",
  components: {
    PaymentSucceeded,
    PaymentFailed,
    PaymentTimeout,
  },
  data() {
    return {
      orderNo: "", // 当前订单号

      orderStatus: "", // 5: success 0: error 6: timeOut
      detailsParameters: {},
      countDown: null,
      detailsState: false,
      detailsTitleState: true,

      i18nLocale: sessionStorage.getItem("language") || "en-US",
      failMessage: {},

      orderAllInfo: {},
      secondaryPayStatus: false,

      //跳转其他支付方式loading状态
      otherPayMethods_loading: false,

      //支付方式类型
      allPayType,
    };
  },
  created() {
    this.queryDetails();
    // console.log('this.$route', this.$route);
  },
  computed: {
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
    }),
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),

    // 商户自定义样式
    isOrderCompletionBtnVisible() {
      return this.$store.state.merchantConfig.onOrderCompletionBtnVisible;
    },

    backText() {
      if (
        this.merchantInfo.merchantStatus &&
        this.detailsParameters.redirectUrl !== undefined &&
        this.detailsParameters.redirectUrl &&
        this.detailsParameters.redirectUrl.trim() !== ""
      ) {
        const returnText =
          this.detailsParameters.merchantName &&
          this.detailsParameters.merchantName.trim() !== ""
            ? `${this.$t("nav.result_returnText_merchant")} ${
                this.detailsParameters.merchantName
              }`
            : this.$t("nav.result_returnText_merchant1");
        return returnText;
      }

      // page商户携带merchantOrderNo展示check order
      if (
        this.detailsParameters.merchantOrderNo &&
        this.detailsParameters.merchantOrderNo !== "" &&
        this.detailsParameters.merchantOrderNo !== null
      ) {
        return this.$t("payConfig_components.button_THB");
      }

      if ([0, 7, 11].includes(this.orderStatus)) {
        //页面失败展示文案
        return this.$t("payConfig_components.button_THB");
      }

      return this.$t("nav.orderRsult");
    },
    currentComponentName() {
      let currentComponentName = "";
      switch (true) {
        case [1, 2, 3, 4, 5].includes(this.orderStatus):
          currentComponentName = "PaymentSucceeded";
          break;
        case [0, 7, 11].includes(this.orderStatus):
          // [0,7]: 7 超时 0 失败
          currentComponentName = "PaymentFailed";
          break;
        case [6].includes(this.orderStatus):
          // [6]:Invoice Expired!
          currentComponentName = "PaymentTimeout";
          break;
      }
      // return 'PaymentTimeout';
      return currentComponentName;
    },
  },
  methods: {
    //Get result information
    queryDetails() {
      this.orderInfo();
      window.clearInterval(this.countDown);
      this.countDown = setInterval(() => {
        this.orderInfo();
      }, 3000);
    },
    orderInfo() {
      this.orderNo =
        this.$route.query.customParam?.indexOf("ach") > 0
          ? this.$route.query.customParam.substring(
              0,
              this.$route.query.customParam?.indexOf("ach")
            )
          : this.$route.query.customParam;
      let params = {
        orderNo: this.orderNo,
      };
      // this.$axios.get(this.$api.get_payResult, params).then(res => {
      this.$axios.get(this.$api.get_buyDetailsData, params).then((res) => {
        if (res && res.data) {
          this.detailsParameters = res.data;
          // page商户携带merchantOrderNo参数隐藏导航栏返回按钮
          let merchantInfo_carry = {
            //商户类型
            merchantType: this.merchantInfo.merchantType, //api、page
            //商户状态
            merchantStatus: this.merchantInfo.merchantStatus,
            //api商户信息｜page商户信息
            merchantQueryInfo: {
              ...this.merchantInfo.merchantQueryInfo,
              ...{ merchantOrderNo: res.data.merchantOrderNo },
            },
            //商户地址栏信息
            merchantFullPath: this.merchantInfo.merchantFullPath,
          };
          this.$store.commit(
            "buyCryptoMerchant/set_merchantInfo",
            merchantInfo_carry
          );
          //order status
          this.orderStatus = res.data.orderStatus;
          [0, 5, 6, 7, 11].includes(this.orderStatus)
            ? (window.clearInterval(this.countDown), (this.countDown = null))
            : "";

          if ([0, 6, 7, 11].includes(res.data.orderStatus)) {
            this.detailsState = true;
            this.detailsTitleState = false;
          }

          //查询订单失败原因
          if (
            [0, 7, 11].includes(res.data.orderStatus) &&
            this.detailsParameters.failCode &&
            this.detailsParameters.failCode !== "" &&
            this.detailsParameters.failCode !== null
          ) {
            this.queryCodeMessage(this.detailsParameters.failCode);
          }
          //查询二次支付信息
          if (this.orderStatus === 7) {
            this.queryOrderInfo();
          }
        }
      });
    },
    //查询订单失败原因
    queryCodeMessage(code) {
      let params = {
        code: code,
      };
      // console.log('this.$api.get_codeMessage', this.$api.get_codeMessage);
      this.$axios.get(this.$api.get_codeMessage, params).then((res) => {
        if (res) {
          // console.log('res', res);
          this.failMessage = res.data;
        }
      });
    },

    //Control details display status
    expandCollapse() {
      this.detailsState = this.detailsState === true ? false : true;
      if (this.$route.path === "/receivingMode" && this.detailsState === true) {
        this.$nextTick(() => {
          this.$parent.$refs.includedDetails_ref.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        });
        return;
      }
    },

    goHome() {
      this.$store.commit("set_tipsStatus", false);
      // SDK接入方式 - 向SDK传递信息
      if (
        this.detailsParameters.orderType &&
        this.detailsParameters.orderType === 3
      ) {
        window.parent.postMessage("closeOrder", "*");
        return;
      }
      // 商户配置redirectUrl参数
      if (
        this.detailsParameters.redirectUrl &&
        this.detailsParameters.redirectUrl !== "" &&
        this.detailsParameters.redirectUrl !== undefined
      ) {
        window.location = this.detailsParameters.redirectUrl;
        return;
      }
      // page商户携带merchantOrderNo
      if (
        this.detailsParameters.merchantOrderNo &&
        this.detailsParameters.merchantOrderNo !== "" &&
        this.detailsParameters.merchantOrderNo !== null
      ) {
        this.$router.push(`/tradeHistory-BuyDetails?orderId=${this.orderNo}`);
        return;
      }
      //失败跳转历史订单页
      if ([0, 7, 11].includes(this.orderStatus)) {
        // if ((sessionStorage.getItem("merchantType") && sessionStorage.getItem("merchantType") === 'buy') || !sessionStorage.getItem("merchantType")) {
        //   window.history.replaceState(null, null, '/#/tradeHistory');
        // }
        window.history.replaceState(null, null, "/#/tradeHistory");
        this.$router.push("/tradeHistory?isTwice=0");
        return;
      }
      // if ((sessionStorage.getItem("merchantType") && sessionStorage.getItem("merchantType") === 'buy') || !sessionStorage.getItem("merchantType")) {
      //   window.history.replaceState(null, null, '/#/');
      // }
      window.history.replaceState(null, null, "/#/");
      this.$router.push("/");
    },

    //查询订单二次支付信息
    queryOrderInfo() {
      let params = {
        orderNo:
          this.$route.query.customParam?.indexOf("ach") > 0
            ? this.$route.query.customParam.substring(
                0,
                this.$route.query.customParam?.indexOf("ach")
              )
            : this.$route.query.customParam,
      };

      this.$axios.get(this.$api.get_buyDetailsData, params).then((res) => {
        if (res) {
          this.orderAllInfo = res.data;
          // console.log('res.data345', res.data);
          if (["3", "4"].includes(res.data.twicePayType)) {
            this.secondaryPayStatus = true;
          } else {
            this.secondaryPayStatus = false;
          }
        }
      });
    },

    //处理二次支付按钮展示样式  包括有指定支付方式和支付类型
    buttonStatus(val) {
      // console.log('val', val);
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
        //巴西 PAY
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
      //币安支付、苹果支付、Googlepay

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
  },
  destroyed() {
    window.clearInterval(this.countDown);
    this.otherPayMethods_loading = false;
    this.secondaryPayStatus = false;
  },
};
</script>

<style lang="scss" scoped>
#paymentResult {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .paymentResult-content {
    flex: 1;
    overflow: auto;

    .results_img {
      width: 1.55rem;
      margin: 0 auto;
      display: flex;
      img {
        width: 1.55rem;
      }
    }
    .results_text {
      margin-top: 0.2rem;
      font-size: 0.13rem;
      font-family: Regular;
      font-weight: normal;
      color: #6e7687;
      line-height: 0.2rem;
      text-align: center;
      // word-break: break-all;
    }
    .results_text ::v-deep span {
      color: #0059da;
      // cursor: ;
    }
    .errorMessage {
      margin-top: 0.24rem;
      font-size: 0.14rem;
      font-family: Regular;
      font-weight: normal;
      color: #252830;
      letter-spacing: 0.005rem;
      line-height: 0.22rem;
      text-align: center;
      padding: 0 0.3rem;
    }
  }
  .footer {
    background: #ffffff;
    padding: 0.08rem 0 0;

    .continue {
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
      .rightIcon {
        width: 0.2rem;
        margin-left: 0.08rem;
        span {
          height: 0.17rem;
        }
      }
      background: #0059da;
      opacity: 1;
      cursor: pointer;
      &:hover {
        background: #0052c9;
      }
      &:active {
        background: #004bb7;
      }
    }
  }
}

.success-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  .pay-eth {
    font-weight: 700;
    font-size: 0.2rem;
    line-height: 0.22rem;
    text-align: center;
    letter-spacing: 0.005rem;
    color: #0059da;
    margin-bottom: 0.08rem;
  }
  .pay-info {
    max-width: 3.15rem;
    font-weight: 400;
    font-size: 0.14rem;
    line-height: 0.22rem;
    text-align: center;
    letter-spacing: 0.005rem;
    color: #252830;
  }
  .email {
    font-weight: 500;
    font-size: 0.14rem;
    line-height: 0.22rem;
    text-align: center;
    letter-spacing: 0.005rem;
    color: #0059da;
  }
}

.otherPayMethods {
  width: 100%;
  height: 0.48rem;
  border-radius: 0.06rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 0.16rem;
  line-height: 0.19rem;
  text-align: center;
  color: #252830;
  margin-top: 0.08rem;
  border: 1px solid #e6e8eb;
  background: transparent;
  cursor: pointer;

  &:hover {
    border-color: #cbcfd6;
  }
  &:active {
    border-color: #babfc8;
  }
}
</style>
