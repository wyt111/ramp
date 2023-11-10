<template>
  <div id="paymentMethod">
    <div class="paymentMethod-content" ref="padding_bottom_box">
      <AllPaymentMethod
        :class="
          payMethodStatus
            ? 'allPaymentMethod'
            : 'allPaymentMethod allPaymentMethodView'
        "
        :style="{ zIndex: payMethodStatus ? 1000 : 100 }"
        :paymethodList="paymethodList"
        :savedCard="savedCard"
        :isDiscount="isDiscount"
        ref="allPaymentMethod"
      />
      <CorrespondPaymentMethod
        :class="
          !payMethodStatus
            ? 'correspondPaymentMethod '
            : 'correspondPaymentMethod allPaymentMethodView'
        "
        :style="{ zIndex: !payMethodStatus ? 1000 : 100 }"
        :allSavedCard="savedCard"
        ref="correspondPaymentMethod"
      />
    </div>
    <footer ref="footer_ref">
      <button
        class="continue"
        :disabled="disabled"
        @click="placeOrder"
        v-if="buttonState"
      >
        {{ $t("button_components.proceed") }}
        <img
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
          v-if="!request_loading"
        />
        <button-loading v-else class="rightIcon" />
      </button>
      <bottom-bar
        @setPaddingBottom="
          $refs.padding_bottom_box.style.paddingBottom =
            $refs.footer_ref.clientHeight + 'px'
        "
      />
    </footer>
    <!-- 添加国际卡表单 -->
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
        <p>{{ $t("buyPayWay.useCardTitle") }}</p>
        <img src="@/assets/images/ShutDown2.svg" alt="" @click="goBack" />
      </div>
      <newCardInfo ref="newCardInfo_ref" />
    </div>
  </div>
</template>

<script>
import { AES_Decrypt } from "@/utils/encryp";
import AllPaymentMethod from "./childrens/allPaymentMethod";
import CorrespondPaymentMethod from "./childrens/correspondPaymentMethod";
import newCardInfo from "../payments/creditCard/newCardInfo";
import allBankCards from "@/assets/json/bankCardInfo";
import { merchantInfo, hashQuery } from "@/utils/publicRequest";
import { mapState } from "vuex";
import { noData } from "@/utils";
import { checkKyc, checkKyc_onfido, getKycRule } from "@/utils/publicRequest";
import paymentMethods from "@/assets/json/paymentMethods.json";

export default {
  name: "paymentMethod",
  components: { CorrespondPaymentMethod, AllPaymentMethod, newCardInfo },
  data() {
    return {
      buyParams: {},

      isDiscount: false,

      //历史国际卡信息
      savedCard: [],

      //法币支持支付方式
      paymethodList: [],

      request_loading: false,

      payMethodStatus: true,

      //子组件按钮状态
      selectKey: "",
      radioIndex: "",

      //新增卡信息组件状态
      addNewCardShow: "1",
    };
  },
  watch: {
    buttonState: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.$refs.padding_bottom_box.style.paddingBottom =
            this.$refs.footer_ref.clientHeight + "px";
        });
      },
    },
  },
  computed: {
    ...mapState("cryptoBuyPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
    }),
    ...mapState("buyPayments", {
      payMethodInfo: (state) => state.payMethodInfo,
    }),
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
      fiatCurrencyAmount_secondPay: (state) =>
        state.fiatCurrencyAmount_secondPay,
    }),
    // 商户信息
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),

    disabled() {
      if (this.payMethodStatus === true) {
        return this.selectKey !== "" && this.request_loading === false
          ? false
          : true;
      } else {
        return this.radioIndex !== "" && this.request_loading === false
          ? false
          : true;
      }
    },
    buttonState() {
      if (!this.$route.query.orderNo) {
        return true;
      }
      if (
        this.$route.query.orderNo &&
        ((this.payMethodInfo.payWayCode === "10001" &&
          this.savedCard.length !== 0) ||
          ["20001", "601", "300", "10003"].includes(
            this.payMethodInfo.payWayCode
          ))
      ) {
        return true;
      }
      return false;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (
        to.path === "/paymentMethod" &&
        [
          "recedivingMode",
          "/tradeHistory",
          "/tradeHistory-BuyDetails",
          "/paymentResult",
          "/errorFormInfo",
        ].includes(from.path)
      ) {
        //除正常支付流程外初始化页面选择状态
        vm.selectKey = "";
        vm.radioIndex = "";
        vm.$refs.allPaymentMethod.selectKey = "";
        vm.$refs.allPaymentMethod.selectVal = "";
        vm.$refs.correspondPaymentMethod.radioIndex = "";
      }
    });
  },
  activated() {
    //接入商户逻辑
    if (this.$route.query.orderNo) {
      merchantInfo();
      this.buyOrderInfo();
      return;
    }

    //参数为空跳转到首页
    if (
      this.fiatCurrencyInfo.fiat === "" ||
      this.fiatCurrencyInfo.fiat === undefined ||
      this.fiatCurrencyInfo.fiat === null ||
      this.fiatCurrencyInfo.alpha2 === "" ||
      this.fiatCurrencyInfo.alpha2 === undefined ||
      this.fiatCurrencyInfo.alpha2 === null
    ) {
      this.$router.replace("/");
      return;
    }

    this.InitializationData();
  },
  deactivated() {
    this.addNewCardShow = "1";
    this.request_loading = false;
  },
  methods: {
    //初始化数据
    InitializationData() {
      this.payMethodStatus = true;
      this.savedCard = [];
      this.paymethodList = [];
      if (!this.$route.query.orderNo) {
        this.queryPayMethods();
      }
    },
    //创建订单
    placeOrder() {
      if (this.payMethodStatus === true) {
        this.$refs.allPaymentMethod.confirm();
        return;
      }
      this.$refs.correspondPaymentMethod.confirm();
    },
    //新增或者返回历史订单
    goBack() {
      this.addNewCardShow = 1;
      this.$refs.newCardInfo_ref.clearData();
      //初始化支付方式变量数据
      this.selectKey = "";
      this.$refs.allPaymentMethod.selectKey = "";
      this.$refs.allPaymentMethod.selectVal = "";
    },
    //商户接入查询
    buyOrderInfo() {
      let _this = this;
      this.$axios
        .get(this.$api.get_orderState + this.$route.query.orderNo, "")
        .then((res) => {
          if (res && res.data !== null && res.data) {
            // 商户logo
            if (res.data?.merchantConfig?.merchantLogo) {
              this.$store.commit(
                "buyCryptoMerchant/set_merchantLogo",
                res.data.merchantConfig.merchantLogo
              );
            } else {
              this.$store.commit("buyCryptoMerchant/set_merchantLogo", "");
            }
            //商户订单超时直接跳转超时页面
            if (res.data.orderState === 6) {
              this.$router.replace(
                `/paymentResult?customParam=${res.data.orderNo}`
              );
              return;
            }
            _this.$parent.$refs.viewTab.tabState = true;
            //存储商户订单信息
            let fullName = localStorage.getItem("email");

            this.$store.commit("buyPayments/set_fullName", fullName);
            //订单id
            this.$store.commit("buyPayments/set_orderNo", res.data.orderNo); //this.$route.query.orderNo
            //法币
            let fiatCurrencyInfo = {
              fiat: noData(res.data.fiatCurrency),
              fiatSymbol: noData(res.data.currencySymbol),
              alpha2: noData(res.data.alpha2),
            };
            this.$store.commit(
              "cryptoBuyPage/set_fiatCurrencyInfo",
              fiatCurrencyInfo
            );
            //加密币
            let cryptoInfo = {
              crypto: noData(res.data.cryptoCurrency),
            };
            this.$store.commit("cryptoBuyPage/set_cryptoInfo", cryptoInfo);
            //网络
            let networkInfo = {
              network: noData(res.data.network),
            };
            this.$store.commit("cryptoBuyPage/set_networkInfo", networkInfo);
            //钱包地址
            let placeOrderQuery = {
              address: noData(res.data.address),
              amount: noData(res.data.fiatCurrencyAmount),
              alpha2: noData(res.data.alpha2),
              fiatCurrency: noData(res.data.fiatCurrency),
              payWayCode: noData(res.data.payWayCode),
            };
            this.$store.commit(
              "buyPayments/set_placeOrderQuery",
              placeOrderQuery
            );
            //法币数量
            this.$store.commit(
              "cryptoBuyPage/set_fiatCurrencyAmount",
              res.data.fiatCurrencyAmount
            );
            //支付方式信息
            let payMethodInfo = {
              payWayCode: res.data.payWayCode,
              payWayName: "",
            };
            this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
            //存储商户appId
            let buyMerchantInfo = JSON.parse(
              sessionStorage.getItem("buyMerchantInfo")
            );
            buyMerchantInfo.appId = res.data.appId;
            window.sessionStorage.setItem(
              "buyMerchantInfo",
              JSON.stringify(buyMerchantInfo)
            );
            //存储商户信息
            let routeInfo = JSON.parse(JSON.stringify(hashQuery()));
            routeInfo.query.appId = res.data.appId;
            let merchantInfo_carry = {
              //商户类型
              merchantType: "api", //api、page
              //商户状态
              merchantStatus: true,
              //api商户信息｜page商户信息
              merchantQueryInfo: routeInfo.query,
              //商户地址栏信息
              merchantFullPath: routeInfo.fullPath,
            };
            this.$store.commit(
              "buyCryptoMerchant/set_merchantInfo",
              merchantInfo_carry
            );
            //信用卡历史
            if (res.data.cardInfo && res.data.cardInfo.length > 0) {
              this.savedCard = res.data.cardInfo;
              this.savedCard.forEach((item, index) => {
                this.savedCard[index].payWayCode = "10001";
                this.savedCard[index].cardNumber = AES_Decrypt(item.cardNumber);
              });
            }
            this.paymethodList = [
              {
                payWayCode: res.data.payWayCode,
                name: "",
                rampFee: res.data.rampFee,
                discountRampFee:
                  res.data.discount == "1"
                    ? res.data.discountRampFee
                    : res.data.rampFee,
                symbol: res.data.currencySymbol,
                unavaible: true, // 默认当前支付方式不会超过限额
              },
            ];
            if (
              !["10001", "501", "502", "701", "702", "20001"].includes(
                this.payMethodInfo.payWayCode
              )
            ) {
              this.requestPayFormInfo(res.data);
            } else {
              //商户订单支付方式对应页面
              this.buyOrderPath(res.data);
            }
          }
          // 商户验签通过后商户进行了配置之后
          if (res.data && res.data?.merchantConfig) {
            this.merchantCustomStyle(res.data.merchantConfig);
          } else {
            this.merchantCustomStyle();
          }
        })
        .catch((err) => {
          console.log("err==>", err);
          this.$store.commit("buyCryptoMerchant/set_merchantLogo", "");
          this.merchantCustomStyle();
        });
    },

    // 获取用户支付表单数据
    async requestPayFormInfo(val) {
      let params = {
        payWayCode: this.payMethodInfo.payWayCode,
      };
      let res = await this.$axios
        .get(this.$api.get_userPayFormData, params)
        .catch(() => {});
      if (res) {
        // 存储用户支付表单数据
        let status =
          res.data !== undefined &&
          JSON.stringify(res.data) !== "{}" &&
          res.data !== null;
        let newData = { status: status, ...res.data };
        this.$store.commit("buyPayments/set_lastTimePaymentFormInfo", newData);
      }
      //商户订单支付方式对应页面
      this.buyOrderPath(val);
    },

    // 控制商户自定义样式
    merchantCustomStyle(merchantConfig) {
      let merchantConfigData = {
        menuBarVisible: true,
        customerServiceVisible: true,
        onOrderCompletionBtnVisible: true,
      };
      try {
        if (merchantConfig) {
          if (merchantConfig?.menuBarVisible === 0) {
            merchantConfigData.menuBarVisible = false;
          }
          if (
            merchantConfig?.customerServiceVisible === 0 &&
            window?.Intercom
          ) {
            merchantConfigData.customerServiceVisible = false;
            // 隐藏聊天机器人
            window?.Intercom("shutdown");
          }
          if (merchantConfig?.onOrderCompletionBtnVisible === 0) {
            merchantConfigData.onOrderCompletionBtnVisible = false;
          }
        }
      } catch (err) {
        console.log("err==>", err);
        merchantConfigData = {
          menuBarVisible: true,
          customerServiceVisible: true,
          onOrderCompletionBtnVisible: true,
        };
      }

      this.$store.commit("set_merchantConfig", merchantConfigData);
    },

    // 判断要做kyc
    async isNeedKyc(orderNo, val) {
      let kycRule = await getKycRule(orderNo);
      let isKyc;
      if (kycRule === "1") {
        // onfido 验证方式
        isKyc = await checkKyc_onfido(orderNo);
      } else if (kycRule === "2") {
        // sumsub 验证方式
        isKyc = await checkKyc(orderNo);
      }

      // 2 表示不需要做 kyc
      if ([2].includes(isKyc)) {
        // 不需要做kyc
        let params = {
          payWayCode: this.payMethodInfo.payWayCode,
        };
        this.$axios.get(this.$api.get_findUserDetail, params).then((res) => {
          if ((!res && res.returnCode !== "0000") || !res.data) return;
          let pathHistry =
            this.$route.query.pathHistry === "tradeHistory"
              ? "?pathHistry=tradeHistory"
              : "";
          if (res.data.isPassByPwcWorld === false) {
            this.$router.push(`/kyc-error-countryCheck${pathHistry}`);
            return;
          } else {
            //Virtual Account、Bank Transfer
            if (["10003", "601"].includes(val.payWayCode)) {
              if (val.payWayCode === "10003") {
                let payMethodInfo = {
                  payWayCode: val.payWayCode,
                  payWayName: "Virtual Account",
                  bankInfo: allBankCards.filter((res) => {
                    return res.payBankCode === val.bankCode;
                  })[0],
                };
                this.$store.commit(
                  "buyPayments/set_payMethodInfo",
                  payMethodInfo
                );
                return;
              }
              let payMethodInfo = {
                payWayCode: val.payWayCode,
                payWayName: "Bank Transfer",
              };
              this.$store.commit(
                "buyPayments/set_payMethodInfo",
                payMethodInfo
              );
              this.$router.push(
                `/otherWays-VA?orderNo=${this.$route.query.orderNo}`
              );
              return;
            }
            paymentMethods.some((item) => {
              if (
                item.payWayCode == val.payWayCode &&
                val.payWayCode !== "10001"
              ) {
                this.$parent.request_loading = false;
                this.$router.push(
                  `${item.routerPath}?orderNo=${this.$route.query.orderNo}`
                );
                return true;
              }
            });
          }
        });
      }
    },

    //商户订单支付方式对应页面
    buyOrderPath(val) {
      this.$store.state.buyRouterParams.merchantFees_state = true;
      sessionStorage.removeItem("indonesiaPayment");
      this.$store.state.toastStatus = false;
      //Virtual Account、Bank Transfer
      if (["10003", "601"].includes(val.payWayCode)) {
        if (val.payWayCode === "10003") {
          let payMethodInfo = {
            payWayCode: val.payWayCode,
            payWayName: "Virtual Account",
            bankInfo: allBankCards.filter((res) => {
              return res.payBankCode === val.bankCode;
            })[0],
          };
          this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
          return;
        }
        let payMethodInfo = {
          payWayCode: val.payWayCode,
          payWayName: "Bank Transfer",
        };
        this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
        this.isNeedKyc(this.$route.query.orderNo, val);
        // this.$router.push(`/otherWays-VA?orderNo=${this.$route.query.orderNo}`);
        return;
      }

      if (val.payWayCode != "10001") {
        this.$parent.request_loading = false;
        this.isNeedKyc(this.$route.query.orderNo, val);
      }
    },

    //请求支付方式
    queryPayMethods() {
      let _this = this;
      let params = {
        fiat: this.fiatCurrencyInfo?.fiat,
        alpha2: this.fiatCurrencyInfo?.alpha2,
        amount: this.fiatCurrencyAmount,
        crypto: this.cryptoInfo?.crypto,
        network: this.networkInfo?.network,
      };
      //二次支付请求支付方式参数
      if (this.$route.query.pathHistry === "tradeHistory") {
        params = {
          fiat: this.buyPayment_secondPay?.currency,
          alpha2: this.buyPayment_secondPay?.alpha2,
          amount: this.buyPayment_secondPay?.amount,
          orderNo: this.buyPayment_secondPay?.orderNo,
          crypto: this.buyPayment_secondPay?.cryptoCurrency,
          network: this.buyPayment_secondPay?.network,
        };
      }
      this.$axios.get(this.$api.get_payMethods, params).then((res) => {
        if (res && res.data) {
          //存储货币支持的支付方式
          this.$nextTick(() => {
            _this.isDiscount = res.data.isDiscount;
            _this.paymethodList = res.data.paymentList;
            _this.savedCard = [];
            //统计eWallet类型支付方式最低rampFee
            let minNumList = [];
            let minDiscountRampFeeList = [];
            _this.paymethodList.forEach((item) => {
              if (
                [
                  "10003",
                  "10004",
                  "10005",
                  "10006",
                  "201",
                  "202",
                  "203",
                ].includes(item.payWayCode)
              ) {
                minNumList.push(item.rampFee);
                minDiscountRampFeeList.push(item.discountRampFee);
              }
            });
            let rampFeeEWallet = this.$numberHandle(Math.min(...minNumList));
            let discountRampFeeEWallet = this.$numberHandle(
              Math.min(...minDiscountRampFeeList)
            );
            //每个支付方式Processing fee
            _this.paymethodList.forEach((item, index) => {
              if (item.payWayCode === "10003") {
                this.$set(
                  _this.paymethodList[index],
                  "rampFee",
                  rampFeeEWallet
                );
                this.$set(
                  _this.paymethodList[index],
                  "discountRampFee",
                  discountRampFeeEWallet
                );
              }
              this.$set(
                _this.paymethodList[index],
                "rampFee",
                noData(item.rampFee)
              );
              this.$set(
                _this.paymethodList[index],
                "discountRampFee",
                noData(item.discountRampFee)
              );
              this.$set(
                _this.paymethodList[index],
                "settleTime",
                item.settleTime
              );
              this.$set(
                _this.paymethodList[index],
                "isInstant",
                item.isInstant
              );
              //法币符号
              _this.paymethodList[index].symbol = noData(item.fiatSymbol);
            });

            //历史信用卡信息 - 不是二次支付赋值历史信用卡
            if (
              res.data.userCardList &&
              res.data.userCardList !== null &&
              res.data.userCardList.length !== 0 &&
              !_this.$route.query.pathHistry
            ) {
              let payWayCode_10001_info =
                this.paymethodList.filter(
                  (val) => val.payWayCode === "10001"
                )[0] || [];
              res.data.userCardList.forEach((item2, index2) => {
                res.data.userCardList[index2].cardNumber = AES_Decrypt(
                  item2.cardNumber
                );
                res.data.userCardList[index2].payWayCode = "10001";
                res.data.userCardList[index2].payWayName = "Credit Card";
                res.data.userCardList[index2].settleTime =
                  payWayCode_10001_info.settleTime;
                _this.savedCard.push(item2);
              });
            }
            this.merchantPayMethods();
          });
        }
      });
    },
    //商户过滤支付方式数据
    merchantPayMethods() {
      if (this.$route.query.orderNo) {
        if (this.payMethodInfo.payWayCode !== "10001") {
          this.savedCard = [];
        }
        this.paymethodList = this.paymethodList.filter((res) => {
          return this.payMethodInfo.payWayCode === res.payWayCode;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#paymentMethod {
  display: flex;
  flex-direction: column;
  .paymentMethod-content {
    padding-bottom: 0.6rem;
  }
  footer {
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0.16rem 0rem;
    z-index: 999;
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
      &:disabled {
        background: #0059da;
        opacity: 0.2;
        cursor: no-drop;
      }
    }
  }
}

// 新增国际卡表单、动画
.allPaymentMethod,
.correspondPaymentMethod {
  opacity: 1;
  transition: 0.5s ease;
}
.addNewCard {
  padding: 0.26rem 0 0.2rem;
  width: 100%;
  height: 100%;
  background: #ffffff;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1200;
  border-radius: 0;
  transform: translate(0, 110%);
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .addNewCar {
    padding: 0 0.16rem;
    margin-bottom: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 600;
      font-size: 0.18rem;
      line-height: 0.22rem;
      color: #252830;
    }
    img {
      width: 0.24rem;
      height: 0.24rem;
      cursor: pointer;
    }
  }
}
.addNewCardTop {
  transform: translate(0, 0) !important;
  // transition: transform 0.2s;
  // transition-delay: 0.1s;
  // transition-timing-function: ease-out;
}
.addNewCardBottom {
  transform: translate(0, 110%) !important;
  // transition: transform 0.2s;
  // transition-delay: 0.1s;
  // transition-timing-function: ease-out;
}
.animation_opacity {
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translate(0, 0px);
  // transition: transform 0.2s;
  // transition-delay: 0.1s;
  // transition-timing-function: ease-out;
}
.allPaymentMethodView {
  opacity: 0 !important;
  transition: 0s ease;
  z-index: 100;
  height: 0;
  overflow: hidden;
}
</style>
