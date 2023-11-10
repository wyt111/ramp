<template>
  <div class="buyDetails-container" :style="{ paddingBottom: paddingBottom }">
    <div class="buyDetails-container-content">
      <div
        class="buyDetails_title"
        :class="{
          buyUnpaid: buyData.orderStatus == 1,
          buyProcessing: [2, 3, 4].includes(buyData.orderStatus),
          buyCompleted: buyData.orderStatus == 5,
          buyFailed: [0, 7, 11].includes(buyData.orderStatus),
          buyClosed: buyData.orderStatus == 6,
        }"
      >
        <div class="line_left">
          <img :src="buyData.cryptoIcon" alt="" />
          <span class="text">
            {{ $t("buyHistory.buy") }} {{ buyData.cryptocurrency }}
          </span>
        </div>

        <div
          class="line_right lineRight_Unpaid"
          v-if="buyData.orderStatus == 1"
        >
          <img src="@/assets/images/tradeHistory/buyUnpaid.svg" alt="" />
          <p>{{ $t("buyHistory.buyUnpaid") }}</p>
        </div>
        <div
          class="line_right lineRight_Processing"
          v-else-if="[2, 3, 4].includes(buyData.orderStatus)"
        >
          <img src="@/assets/images/tradeHistory/buyProcessing.svg" alt="" />
          <p>{{ $t("buyHistory.buyProcessing") }}</p>
        </div>
        <div
          class="line_right lineRight_Completed"
          v-else-if="buyData.orderStatus == 5"
        >
          <img src="@/assets/images/tradeHistory/buyCompleted.svg" alt="" />
          <p>{{ $t("buyHistory.buyCompleted") }}</p>
        </div>
        <div
          class="line_right lineRight_Failed"
          v-else-if="[0, 7].includes(buyData.orderStatus)"
        >
          <img src="@/assets/images/tradeHistory/buyFailed.svg" alt="" />
          <p>{{ $t("buyHistory.buyFailed") }}</p>
        </div>
        <div
          class="line_right lineRight_Failed"
          v-else-if="[11].includes(buyData.orderStatus)"
        >
          <img src="@/assets/images/tradeHistory/buyFailed.svg" alt="" />
          <p>{{ $t("buyHistory.buyFailed_11") }}</p>
        </div>
        <div
          class="line_right lineRight_Closed"
          v-else-if="buyData.orderStatus == 6"
        >
          <img src="@/assets/images/tradeHistory/buyClosed.svg" alt="" />
          <p>{{ $t("buyHistory.buyClosed") }}</p>
        </div>
      </div>

      <div class="buyDetails_content">
        <div class="buyDetails_con">
          <p class="label">
            {{ $t("buyHistory.buyOrderAmount") }} ({{ buyData.fiatCode }})
          </p>
          <p class="value">{{ buyData.orderAmount }}</p>
        </div>
        <div class="buyDetails_con">
          <p class="label">
            {{ $t("buyHistory.buyPrice") }}({{ buyData.fiatCode }})
          </p>
          <p class="value" :class="{ empty: buyData.orderStatus != 5 }">
            {{ buyData.orderStatus == 5 ? buyData.price : "--" }}
          </p>
        </div>
        <div class="buyDetails_con">
          <p class="label">
            {{ $t("buyHistory.buyRampFee") }} ({{ buyData.fiatCode }})
          </p>
          <p class="value">{{ buyData.rampFee }}</p>
        </div>
        <div class="buyDetails_con">
          <p class="label">
            {{ $t("buyHistory.buyNetworkFee") }}({{ buyData.cryptocurrency }})
          </p>
          <p class="value" :class="{ empty: buyData.networkFee == null }">
            {{ buyData.networkFee == null ? "--" : buyData.networkFee }}
          </p>
        </div>
        <div class="buyDetails_con">
          <p class="label">
            {{ $t("buyHistory.buyTotal") }} ({{ buyData.cryptocurrency }})
          </p>
          <p class="value" :class="{ empty: buyData.orderStatus != 5 }">
            {{ buyData.orderStatus == 5 ? buyData.total : "--" }}
          </p>
        </div>
      </div>

      <div class="buyDetails_OrderId">
        <div class="item copyView">
          <p class="label">{{ $t("buyHistory.buyOrderID") }}:</p>
          <p class="val">
            <span>{{ buyData.orderNo }}</span>

            <copy-img
              v-clipboard:copy="buyData.orderNo"
              v-clipboard:success="copySuccess"
              v-clipboard:error="copyError"
            />
          </p>
        </div>
        <div class="item">
          <p class="label">{{ $t("buyHistory.buyOrdeTime") }}:</p>
          <p class="val">{{ buyData.orderTime }}</p>
        </div>
        <div class="item" v-if="[2, 3, 4, 5].includes(buyData.orderStatus)">
          <p class="label">{{ $t("buyHistory.buyPaymentTime") }}:</p>
          <p class="val">{{ buyData.paymentTime }}</p>
        </div>
      </div>
      <div class="buyDetails_OrderId second">
        <div class="item" v-if="buyData.orderStatus == 5">
          <p class="label">{{ $t("buyHistory.buyNetwork") }}:</p>
          <p class="val">{{ buyData.network }}</p>
        </div>
        <div class="copyView item" v-if="buyData.orderStatus == 5">
          <p class="label">{{ $t("buyHistory.buyAddress") }}:</p>
          <p class="val">
            <span>{{ buyData.address }}</span>
            <copy-img
              v-clipboard:copy="buyData.address"
              v-clipboard:success="copySuccess"
              v-clipboard:error="copyError"
            />
          </p>
        </div>
        <div class="copyView item" v-if="buyData.orderStatus == 5">
          <p class="label">{{ $t("buyHistory.buyTxID") }}:</p>
          <p class="val">
            <span>{{ buyData.txId }}</span>
            <copy-img
              v-clipboard:copy="buyData.txId"
              v-clipboard:success="copySuccess"
              v-clipboard:error="copyError"
            />
          </p>
        </div>

        <div class="item" @click="goCashierDesk">
          <p class="label">{{ $t("buyHistory.buyPayerAccount") }}:</p>
          <p class="val">
            {{ buyData.paymentMethod }} {{ cardNoData }}
            <img
              v-if="showArrow"
              src="@/assets/images/tradeHistory/arrow.svg"
              alt=""
            />
          </p>
        </div>
      </div>
    </div>

    <footer class="buyfooter footer" ref="buy_footer">
      <template v-if="[0, 7].includes(buyData.orderStatus)">
        <div class="Payment-error">
          <p v-if="[7].includes(buyData.orderStatus)">
            {{ $t("buyHistory.place_new_order") }}
          </p>
          <template
            v-if="
              [7].includes(buyData.orderStatus) &&
              buyData.twicePayType &&
              buyData.twicePayType.length > 0
            "
          >
            <!--  isTwice为0时则开启禁用1时支持可点击  -->
            <button
              :disabled="buyData.isTwice === '0'"
              :class="`buttonStyle ${item.classData}`"
              @click="goPayment(item, buyData)"
              v-for="item in buttonStatus(buyData)"
              :key="item.id"
            >
              <span class="text">{{ $t(`buyHistory.${item.name2}`) }}</span>
              <img
                class="rightIcon"
                src="@/assets/images/button-right-icon.svg"
                alt=""
              />
            </button>
          </template>
        </div>
      </template>
      <powered-by />
    </footer>
  </div>
</template>
<script>
import { AES_Decrypt } from "@/utils/encryp";
import { mapState } from "vuex";
import {
  checkPixKycIsRequired,
  requestPayFormInfo,
} from "@/utils/publicRequest";
import { allPayType } from "@/assets/json/paymentMethods.js";
import paymentMethods from "@/assets/json/paymentMethods.json";

export default {
  name: "buyDetails",
  data() {
    return {
      buyData: "",
      timeOut: null,
      allPayType,
      paddingBottom: "0px",
    };
  },
  activated() {
    //卖币详情
    this.buyDetailsData();
    clearInterval(this.timeOut);
    this.timeOut = setInterval(() => {
      setTimeout(() => {
        this.buyDetailsData();
      }, 0);
    }, 3000);
  },
  computed: {
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
      buyAgainFromData: (state) => state.buyForm,
    }),

    cardNoData() {
      let data =
        this.buyData && this.buyData.cardNo
          ? AES_Decrypt(this.buyData.cardNo)
          : "";
      return data ? "****" + data.slice(data.length - 4, data.length) : "";
    },
    showArrow() {
      return (
        ["ACH", "Domestic Wire", "SEPA", "FPS"].includes(
          this.buyData.paymentMethod
        ) && this.buyData.orderStatus == 1
      );
    },
  },
  methods: {
    goCashierDesk() {
      if (this.showArrow) {
        this.$store.commit("buyPayments/set_orderNo", this.buyData.orderNo);
        const paymentMethod = this.buyData.paymentMethod;
        const payWayCodeMap = {
          ACH: "53001",
          "Domestic Wire": "53002",
          SEPA: "53003",
          FPS: "53004",
        };
        const payWayCode = payWayCodeMap[paymentMethod] || "";

        this.$store.commit("buyPayments/set_payMethodInfo", {
          payWayCode: payWayCode,
        });
        this.$store.commit("buyPayments/set_placeOrderQuery_fiatInfo", {
          alpha2: this.buyData.alpha2,
          fiatCurrency: this.buyData.fiatCode,
        });

        const newData = {
          ...this.buyData.payInfo,
          paymentCountDownMinute: "00:00",
        };
        sessionStorage.setItem(
          "cashierDesk_bankTransfer_payResult",
          JSON.stringify(newData)
        );

        this.$router.push({
          path: "/cashierDesk-bankTransfer",
          query: {
            from: this.$route.name,
          },
        });
      }
    },
    copySuccess() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
    copyError() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
    //买币详情参数请求
    buyDetailsData() {
      let params = {
        orderNo: this.$route.query.orderId,
      };
      this.$axios.get(this.$api.get_buyDetailsData, params).then((res) => {
        if (res && res.data) {
          // console.log('res.data', res.data);
          this.buyData = res.data;
          this.$nextTick(() => {
            const height = this.$refs.buy_footer.clientHeight;
            this.paddingBottom = height + "px";
          });
          //失败  成功  关闭订单时清除定时器
          if ([0, 5, 6, 7].includes(res.data.orderStatus)) {
            clearInterval(this.timeOut);
          }
        }
      });
    },
    //处理二次支付按钮展示样式  包括有指定支付方式和支付类型
    buttonStatus(val) {
      // console.log('val--', val);
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
        // console.log('filterPayType', filterPayType);
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
          //twicePayType为4 展示修改卡、1种本地支付
          if (status.includes("4")) {
            returnData.push(
              buttonData.filter((item) => {
                return item.isShow === "2";
              })[0]
            );
          }
          return returnData;
        }
        returnData = buttonData.filter((item) => {
          //选择支付方式和修改卡信息 并且本地支付数量为0
          if (status.includes("4") && filterPayType.length < 1) {
            return "2".includes(item.isShow);
          }
          //选择支付方式和修改卡信息 并且本地支付数量大于等于2
          if (status.includes("4")) {
            return status.includes(item.isShow) || "2".includes(item.isShow);
          }
          //选择支付方式 并且本地支付数量为0
          if (status.includes("3") && filterPayType.length < 1) {
            return;
          }
          //选择支付方式 并且本地支付数量大于等于2
          return ["3"].includes(item.isShow);
        });
        return returnData;
      }

      return buttonData.filter((item) => {
        //选择支付方式和修改卡信息
        if (status.includes("4")) {
          return status.includes(item.isShow) || "2".includes(item.isShow);
        }
        return status.includes(item.isShow);
      });
    },
    //二次支付跳转页面
    async goPayment(val, data) {
      //isTwice 为0时是不支持二次支付
      if (data.isTwice === "0") {
        return;
      }

      //存储二次支付数据
      this.storePaymentAgainData(data);

      //选择支付方式页、选择支付方式页 不包含信用卡支付、更改卡、本地支付类型中存在多种 - eWallet类型、Philippines类型、qrCode类型
      if (
        ["Method", "ChangeMethod", "ChangeCard"].includes(val.classData) ||
        (val.classData === "localPayment" &&
          ["eWallet", "Philippines", "qrCode"].includes(val.name2) &&
          val.matchingPayWayCode.length > 1)
      ) {
        this.paymentAgainPath(val, data);
        return;
      }

      //跳转到确认订单页前修改订单支付方式
      let params = {
        orderNo: data.orderNo,
        payWayCode: ["0", "1"].includes(val.isShow) ? "10001" : val.isShow,
      };
      //只存在一种本地支付类型并且只有一个支付方式 - eWallet类型、Philippines类型、qrCode类型
      if (
        val.classData === "localPayment" &&
        ["eWallet", "Philippines", "qrCode"].includes(val.name2) &&
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
            //卡信息错误修改卡信息、确认订单页
            if (["Information", "TryAgain"].includes(val.classData)) {
              this.paymentAgainPath(val, data);
              return;
            }
            //本地支付类型中只有一种 - eWallet类型、Philippines类型、qrCode类型
            if (
              val.classData === "localPayment" &&
              ["eWallet", "Philippines", "qrCode"].includes(val.name2) &&
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
              this.paymentAgainPath(val, data);
              return;
            }
            //指定支付需要的页面展示参数
            let payMethodInfo = {
              payWayCode: val.isShow, //支付方式code
              payWayName: val.payWayName, //支付方式名称
            };
            this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
            this.paymentAgainPath(val, data);
          }
        });
    },

    //二次支付跳转地址
    async paymentAgainPath(val, data) {
      //--------------- 不需要更改订单支付方式 跳转支付方式页 ---------------
      //选择支付方式页
      if (val.classData === "Method") {
        this.$router.push(
          `/paymentMethod?pathHistry=tradeHistory&ChangeCard=Method`
        );
        return;
      }
      //选择支付方式页 不包含信用卡支付
      if (val.classData === "ChangeMethod") {
        this.$router.push(
          `/paymentMethod?pathHistry=tradeHistory&ChangeCard=changeMethod`
        );
        return;
      }
      //本地支付类型中存在多种 - eWallet类型、Philippines类型、qrCode类型
      if (
        val.classData === "localPayment" &&
        ["eWallet", "Philippines", "qrCode"].includes(val.name2) &&
        val.matchingPayWayCode.length > 1
      ) {
        this.$router.push(
          `/paymentMethod?pathHistry=tradeHistory&ChangeCard=Method`
        );
        return;
      }

      //--------------- 需要更改订单支付方式 跳转修改信用卡页、重新支付信用卡 ---------------
      //更改卡
      if (val.classData === "ChangeCard") {
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
                  res.data.userCardList[index2].payWayName = "Credit Card";
                  savedCard.push(item2);
                });
              }
              this.$store.commit("buyPayments/set_creditCardList", savedCard);
              this.$router.push(
                `/errorFormInfo?pathHistry=tradeHistory&ChangeCard=ChangeCard&orderNo=${data.orderNo}`
              );
            });
          }
        });
        return;
      }
      //卡信息错误修改卡信息
      if (["Information"].includes(val.classData)) {
        this.buyAgainFromData.email = localStorage.getItem("email");
        let submitForm = JSON.stringify(this.buyAgainFromData);
        //alpha2=${data.alpha2}&currency=${data.cryptocurrency}&
        this.$router.push(
          `/errorFormInfo?pathHistry=tradeHistory&ChangeCard=CardInformation&submitForm=${submitForm}&orderNo=${data.orderNo}`
        );
        return;
      }
      //确认订单页
      if (val.classData === "TryAgain") {
        let payMethodInfo = {
          payWayCode: "10001", //支付方式code
          payWayName: "card", //支付方式名称
          cardNumber: data.cardNo,
        };
        this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
        let cardInfo = JSON.parse(JSON.stringify(data));
        cardInfo.cardNumber = cardInfo.cardNo;
        cardInfo.cardExpireYear = cardInfo.cardExpireYear
          ? AES_Decrypt(cardInfo.cardExpireYear)
          : "";
        cardInfo.cardExpireMonth = cardInfo.cardExpireMonth
          ? AES_Decrypt(cardInfo.cardExpireMonth)
          : "";
        this.$store.commit("buyPayments/set_creditCardInfo", cardInfo);
        this.$store.commit("buyPayments/set_userCardId", cardInfo.userCardId);
        this.$router.push(
          "/creditCardConfig?configPaymentFrom=userPayment&pathHistry=tradeHistory"
        );
        return;
      }

      //--------------- 需要修改订单支付方式 只存在一种本地支付类型并且只有一个支付方式 跳转到确认订单页 ---------------
      let ParamsData1 = "pathHistry=tradeHistory";
      if (val.matchingPayWayCode && val.matchingPayWayCode.length === 1) {
        if (val.matchingPayWayCode[0] === "30001") {
          let { kycIsRequired, path } = await checkPixKycIsRequired(data);
          if (kycIsRequired) {
            this.$router.push(
              `${path}?${ParamsData1}&isTwice=1&type=brazilPay`
            );
          } else {
            this.$router.push(`${path}?${ParamsData1}&isTwice=1`);
          }
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
      //币安支付、苹果支付、googlepay
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
  deactivated() {
    this.buyData = "";
    clearInterval(this.timeOut);
  },
};
</script>
<style lang="scss" scoped>
.copyView {
}
.buyDetails-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  .buyDetails_title {
    padding-bottom: 0.16rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.2rem;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: 0 0 0 0.25px #e6e8eb;
    }
    .line_left {
      display: flex;
      align-items: center;
      img {
        width: 0.24rem;
        margin-right: 0.08rem;
      }
      .text {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 700;
        font-size: 0.16rem;
        line-height: 0.18rem;
        color: #252830;
      }
    }
    .line_right {
      display: flex;
      align-items: center;

      img {
        width: 0.16rem;
        margin-right: 0.04rem;
      }
      p {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.16rem;
        text-align: right;
      }
    }
    &.buyUnpaid {
      .line_right {
        p {
          color: #ff7d00;
        }
      }
    }
    &.buyProcessing {
      .line_right {
        p {
          color: #0260e7;
        }
      }
    }
    &.buyCompleted {
      .line_right {
        p {
          color: #00b42a;
        }
      }
    }
    &.buyFailed {
      .line_right {
        p {
          color: #f53f3f;
        }
      }
    }
    &.buyClosed {
      .line_right {
        p {
          color: #5d636d;
        }
      }
    }
  }

  .buyDetails_content {
    margin-bottom: 0.2rem;
    .buyDetails_con {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:not(:last-child) {
        margin-bottom: 0.2rem;
      }
      .label {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.14rem;
        line-height: 0.14rem;
        color: #252830;
      }
      .value {
        font-family: "HarmonyOS Sans";
        font-style: normal;
        font-weight: 500;
        font-size: 0.14rem;
        line-height: 0.14rem;
        text-align: right;
        color: #252830;
      }
      .empty {
        font-weight: 400;
      }
    }
  }

  .buyDetails_OrderId {
    padding: 0.2rem 0.12rem;
    background: #f4f8fb;
    border: 1px solid #e6e8eb;
    border-radius: 0.06rem;
    overflow: hidden;
    .item {
      display: flex;
      justify-content: space-between;
      &:not(:last-child) {
        margin-bottom: 0.16rem;
      }
      .label {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.14rem;
        color: #5d636d;
      }
      .val {
        font-family: "HarmonyOS Sans";
        font-style: normal;
        font-weight: 500;
        font-size: 0.14rem;
        line-height: 0.14rem;
        text-align: right;
        color: #252830;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 1;
        word-break: break-all;
        padding-left: 0.16rem;
        span {
          color: #5d636d;
          word-break: break-all;
          // width: 1.48rem;
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
        }
        img {
          margin-left: 0.12rem;
          width: 0.16rem;
        }
      }
      &.copyView {
      }
    }

    &.second {
      margin-top: 0.08rem;
    }
  }
  .buyDetails-container-content {
    padding-bottom: 0.24rem;
  }
  .Payment-error {
    p {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.22rem;
      text-align: center;
      letter-spacing: 0.5px;
      color: #252830;
      padding-bottom: 0.12rem;
    }
    button {
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
      &[disabled] {
        background: #0059da;
        opacity: 0.2;
        cursor: no-drop;
      }
      & + button {
        margin-top: 0.08rem;
        .rightIcon {
          display: none;
        }
        color: #252830;
        border: 1px solid #e6e8eb;
        background: transparent !important;
        &:hover {
          border-color: #cbcfd6;
        }
        &:active {
          border-color: #babfc8;
        }
      }
    }
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0.16rem 0;
    z-index: 999;
  }
}
</style>
