<template>
  <div id="binancePay" :class="{ heightAuto: waitState }">
    <div class="buyPayWaitPage" v-if="waitState" key="1">
      <BuyPayWaitPage :url="payUrl" />
    </div>
    <div
      id="cardConfigPayment"
      ref="box_ref"
      v-else
      @scroll="handleScroll"
      key="2"
    >
      <div class="cardConfigPayment-content" ref="form_ref">
        <!-- 新增支付方式信息模块 -->
        <PayMethodInfo />
        <!-- 支付费用模块 -->
        <IncludedDetails
          class="includedDetails"
          ref="includedDetails_ref"
          :type="2"
          :payWayCode="payMethodInfo.payWayCode"
        />
        <!-- tips icon -->
        <transition>
          <div class="downTips-icon" v-show="goDown_state" @click="goDown">
            <img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt="" />
          </div>
        </transition>
      </div>
      <footer class="footer" ref="footer_ref">
        <CustomButton
          :buttonData="buttonData"
          :disabled="disabled"
          :loadingDisabled="true"
          @click.native="queryPay"
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
import { forterCookie, querySubmitToken } from "@/utils/publicRequest";
import { risk_publishRiskData } from "@/utils/risk_deviceSessionId";

import BuyPayWaitPage from "@/components/PaymentWaitingPage/buyPayWaitPage";
import { isElementNotInViewport } from "@/utils";
import { AES_Decrypt } from "@/utils/encryp";
import { mapState } from "vuex";
import PayMethodInfo from "@/components/PayMethodInfo/index";

export default {
  name: "binancePay",
  components: { BuyPayWaitPage, IncludedDetails, PayMethodInfo },
  data() {
    return {
      cardData: {},
      wishCardData: "",

      submitState: true,
      cardName: "",

      //勾选协议
      childData: {
        agreement: true,
      },

      feeInfo: {},

      //按钮状态
      buttonData: {
        loading: false,
        triggerNum: 0,
      },

      goDown_state: false,
      oldOffsetTop: 0,
      scrollTimeDown: null,

      timeDown: null,

      waitState: false,

      forter_Cookie: "",
      checkoutCookie: "",

      //公司地址展示状态
      companyAddress: true,

      // 支付链接
      payUrl: "",
      newWindow: "",
      googlepay_parameters: {
        environment: "",
        gatewayMerchantId: "",
        merchantId: "",
        merchantName: "",
        gateway: "",
      },
    };
  },
  //清除页面数据
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //清空二次支付状态
      if (to.query.isTwice === "1") {
        let newQuery = { pathHistry: "tradeHistory" };
        sessionStorage.removeItem("indonesiaPayment");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.$router.replace({ query: newQuery });
      }
      // 新增如果是二次支付时 进入页面清空数据
      if (
        to.name === "binancePay" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        window.sessionStorage.removeItem("indonesiaPayment");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
      }
    });
  },
  computed: {
    ...mapState("buyPayments", {
      payMethodInfo: (state) => state.payMethodInfo,
      orderNo: (state) => state.orderNo,
      placeOrderQuery: (state) => state.placeOrderQuery,
    }),
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),

    disabled() {
      return this.childData.agreement === true ? false : true;
    },
  },

  async mounted() {
    if (this.payMethodInfo.payWayCode === "701") {
      this.googlepay_parameters = {
        environment: process.env.VUE_APP_googlePay_environment,
        gatewayMerchantId: process.env.VUE_APP_googlePay_gatewayMerchantId_702,
        merchantId: process.env.VUE_APP_googlePay_merchantId_702,
        merchantName: process.env.VUE_APP_googlePay_merchantName_702,
        gateway: process.env.VUE_APP_googlePay_gateway_702,
      };
    } else if (this.payMethodInfo.payWayCode === "702") {
      this.googlepay_parameters = {
        environment: process.env.VUE_APP_googlePay_environment,
        gatewayMerchantId: process.env.VUE_APP_googlePay_gatewayMerchantId_702,
        merchantId: process.env.VUE_APP_googlePay_merchantId_702,
        merchantName: process.env.VUE_APP_googlePay_merchantName_702,
        gateway: process.env.VUE_APP_googlePay_gateway_702,
      };
    }
    // Google Pay、Apple Pay需要调用forter风控方法
    if (["501", "502", "701", "702"].includes(this.payMethodInfo.payWayCode)) {
      this.forter_Cookie = await forterCookie();
      this.checkoutCookie = await this.retryRiskData();
    }

    //参数为空跳转到首页
    if (
      this.orderNo === "" ||
      this.orderNo === undefined ||
      this.orderNo === null
    ) {
      this.$router.replace("/");
      return;
    }

    //历史数据恢复 - 用户刷新
    if (sessionStorage.getItem("indonesiaPayment")) {
      if (
        JSON.parse(sessionStorage.getItem("indonesiaPayment")).webUrl &&
        ["300", "701"].includes(this.payMethodInfo.payWayCode)
      ) {
        this.waitState = true;
        this.payUrl = JSON.parse(
          sessionStorage.getItem("indonesiaPayment")
        ).payUrl;
        this.$store.commit("changeBuyPayProcessTab", false);
        //不展示返回模块
        if (["300", "701"].includes(this.payMethodInfo.payWayCode)) {
          this.$parent.confirmOrderStatus = true;
          window.clearInterval(this.timeDown);
          this.timeDown = setInterval(() => {
            this.queryOrderStatus();
          }, 1000);
        }
      }
    }

    //初始化根据可视高度控制向下提示按钮状态
    if (!this.waitState) {
      if (this.$refs.box_ref) {
        setTimeout(() => {
          if (isElementNotInViewport("binancePay", this.$refs.footer_ref)) {
            this.goDown_state = true;
          } else {
            this.goDown_state = false;
          }
        }, 100);
      }
    }
  },
  methods: {
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
    async queryPay() {
      //苹果支付
      if (
        this.submitState === true &&
        ["501", "502"].includes(this.payMethodInfo.payWayCode)
      ) {
        this.submitState = false;
        this.onApplePay(this.orderNo);
        return;
      }

      if (
        this.submitState === true &&
        ["701", "702"].includes(this.payMethodInfo.payWayCode)
      ) {
        this.submitState = false;
        this.onGooglePay(this.orderNo);
        return;
      }

      let submitToken = await querySubmitToken();
      if (this.submitState === true && submitToken === true) {
        this.submitState = false;
        let queryPath = "";
        let params = {
          orderNo: this.orderNo,
        };
        //binance支付
        if (this.payMethodInfo.payWayCode === "20001") {
          queryPath = this.$api.post_binancePay;
        } else {
          //泰铢支付
          queryPath = this.$api.post_internationalCard;
          params.token = "token";
          this.newWindow = window.open();
        }
        //二次支付携带payWayCode
        if (this.$route.query.pathHistry === "tradeHistory") {
          params.payWayCode = this.payMethodInfo.payWayCode;
        }
        this.$axios
          .post(queryPath, params, "submitToken")
          .then((res) => {
            if (res && JSON.stringify(res.data) !== "{}") {
              //隐藏公司地址
              this.companyAddress = false;

              //泰铢支付另唤起一个tab
              if (this.payMethodInfo.payWayCode !== "20001") {
                this.openNewPageChangeStatus(res.data.webUrl);

                return;
              }
              window.location = res.data.webUrl;
            }
          })
          .catch(() => {
            this.submitState = true;
            this.buttonData = {
              loading: false,
              triggerNum: 0,
            };
            this.payMethodInfo.payWayCode !== "20001"
              ? this.newWindow.close()
              : "";
          });
      }
    },
    // applepay
    onApplePay(orderNo) {
      if (!window.ApplePaySession) {
        return;
      }
      const payWayCode = this.payMethodInfo.payWayCode;
      // Define ApplePayPaymentRequest
      const request = {
        countryCode: this.placeOrderQuery.alpha2, // 国家代码
        currencyCode: this.placeOrderQuery.fiatCurrency, // 货币代码
        merchantCapabilities: [
          "supports3DS",
          "supportsCredit",
          "supportsDebit",
          "supportsEMV",
        ], // 商业能力, 3ds, 信用卡,借记卡, emv
        supportedNetworks: [
          // 支持的网络,
          "amex",
          // "bancomat",
          // "bancontact",
          "cartesBancaires",
          "chinaUnionPay",
          "discover",
          "eftpos",
          "electron",
          "elo",
          "girocard",
          "interac",
          "jcb",
          "mada",
          "maestro",
          "masterCard",
          "mir",
          "privateLabel",
          "visa",
          "vPay",
        ],
        total: {
          label: "ALCHEMY GPS EUROPE UAB",
          type: "final",
          amount: this.placeOrderQuery.amount,
        },
      };
      // Create ApplePaySession
      const session = new window.ApplePaySession(3, request);
      session.onvalidatemerchant = async (event) => {
        let params = {
          validationURL: event.validationURL,
          payWayCode: payWayCode,
        };
        this.$axios
          .post(this.$api.post_domainNameVerify, params, "")
          .then((res) => {
            if (res && res.returnCode === "0000") {
              // let merchantSession = res.data;
              // let result = session.completeMerchantValidation(merchantSession);
            }
          });

        //  "validationURL":"https://cn-apple-pay-gateway.apple.com/paymentservices/startSession",
        // Call your own server to request a new merchant session.
        // const merchantSession = await validateMerchant();
        // console.log({ merchantSession });
      };
      session.onpaymentmethodselected = () => {
        // Define ApplePayPaymentMethodUpdate based on the selected payment method.
        // No updates or errors are needed, pass an empty object.
        const update = {
          newTotal: {
            label: "ALCHEMY GPS EUROPE UAB",
            type: "final",
            amount: this.placeOrderQuery.amount,
          },
        };
        session.completePaymentMethodSelection(update);
      };

      session.onshippingmethodselected = () => {
        // Define ApplePayShippingMethodUpdate based on the selected shipping method.
        // No updates or errors are needed, pass an empty object.
        const update = {};
        session.completeShippingMethodSelection(update);
      };

      session.onshippingcontactselected = () => {
        // Define ApplePayShippingContactUpdate based on the selected shipping contact.
        const update = {};
        session.completeShippingContactSelection(update);
      };

      session.onpaymentauthorized = (event) => {
        // Define ApplePayPaymentAuthorizationResult
        const result = {
          status: window.ApplePaySession.STATUS_SUCCESS,
        };
        session.completePayment(result);

        (async () => {
          let postAlchemyPay = (orderNo) => {
            const email = AES_Decrypt(localStorage.getItem("email"));
            let params;
            if (payWayCode === "502") {
              params = {
                payWayCode,
                orderNo,
                customParam: {
                  email,
                  encryptedData: JSON.stringify(event.payment),
                },
                businessParams: {
                  cookie: this.forter_Cookie,
                  checkoutCookie: this.checkoutCookie,
                },
              };
            } else if (payWayCode === "501") {
              const userId = localStorage.getItem("userId").replace("ACH", "");
              params = {
                payWayCode,
                orderNo,
                customParam: {
                  encryptedData: JSON.stringify(event.payment),
                },
                businessParams: {
                  email,
                  cookie: this.forter_Cookie,
                  checkoutCookie: this.checkoutCookie,
                  userId,
                },
              };
            }

            this.$axios
              .post(this.$api.post_alchemyPay, params, "")
              .then((res) => {
                if (res && res.returnCode === "0000") {
                  if (res.data) {
                    this.submitState = true;
                    this.buttonData = {
                      loading: false,
                      triggerNum: 0,
                    };
                    if (payWayCode === "502") {
                      window.location = res.data.webUrl;
                    } else if (payWayCode === "501") {
                      window.clearInterval(this.timeDown);
                      this.timeDown = setInterval(() => {
                        this.queryOrderStatus();
                      }, 1000);

                      // this.newWindow = window.open('', '_blank');
                      // this.openNewPageChangeStatus(res.data.webUrl);
                    }
                  }
                } else {
                  this.submitState = true;
                  this.buttonData = {
                    loading: false,
                    triggerNum: 0,
                  };
                }
              })
              .catch(() => {
                this.submitState = true;
                this.buttonData = {
                  loading: false,
                  triggerNum: 0,
                };

                this.$toast({
                  duration: 3000,
                  message: "This card is not supported currently",
                });
              });
          };

          if (orderNo) {
            postAlchemyPay(orderNo);
          } else {
            let submitToken = await querySubmitToken();
            if (submitToken === true && this.submitState === false) {
              this.submitState = true;
              //确认下单 获取订单id
              let params = this.placeOrderQuery;
              params.payWayCode = this.payMethodInfo.payWayCode;
              //存在商户信息将信息带入请求地址
              let urlQuery = "";
              let merchantType = sessionStorage.getItem("merchantType");
              if (
                this.merchantInfo &&
                this.merchantInfo.merchantType === "page" &&
                this.merchantInfo.merchantStatus &&
                merchantType === "buy"
              ) {
                urlQuery = `?${this.merchantInfo.merchantFullPath}`;
                params.merchantParam = this.merchantInfo.merchantFullPath;
              }
              this.$axios
                .post(this.$api.post_buy + urlQuery, params, "submitToken")
                .then((res) => {
                  if (res && res.returnCode === "0000") {
                    // removeMerchantOrder()
                    //存储订单号
                    this.$store.commit(
                      "buyPayments/set_orderNo",
                      res.data.orderNo
                    );
                    //存储信用卡信息
                    // this.$store.commit('buyPayments/set_creditCardInfo', JSON.parse(JSON.stringify(res.data)));

                    this.$store.state.buyRouterParams.kyc = res.data.kyc;
                    //存储支付方式信息
                    let payMethodInfo = {
                      payWayCode: this.payMethodInfo.payWayCode,
                      payWayName: this.payMethodInfo.payWayName,
                    };
                    this.$store.commit(
                      "buyPayments/set_payMethodInfo",
                      payMethodInfo
                    );
                    // postAlchemyPay(res.data.orderNo);
                    postAlchemyPay(res.data.orderNo);
                  } else {
                    this.submitState = true;
                    this.buttonData = {
                      loading: false,
                      triggerNum: 0,
                    };
                  }
                })
                .catch(() => {
                  this.submitState = true;
                  this.buttonData = {
                    loading: false,
                    triggerNum: 0,
                  };
                });
            } else {
              this.submitState = true;
              this.buttonData = {
                loading: false,
                triggerNum: 0,
              };
            }
          }
        })();
      };

      session.oncouponcodechanged = (event) => {
        // Define ApplePayCouponCodeUpdate
        const newTotal = window.calculateNewTotal(event.couponCode);
        const newLineItems = window.calculateNewLineItems(event.couponCode);
        const newShippingMethods = window.calculateNewShippingMethods(
          event.couponCode
        );
        const errors = window.calculateErrors(event.couponCode);

        session.completeCouponCodeChange({
          newTotal: newTotal,
          newLineItems: newLineItems,
          newShippingMethods: newShippingMethods,
          errors: errors,
        });
      };
      session.oncancel = () => {
        // Payment cancelled by WebKit
        this.submitState = true;
        this.buttonData = {
          loading: false,
          triggerNum: 0,
        };
      };
      session.begin();
    },
    // googlepay
    onGooglePay(orderNo) {
      let _this = this;

      let paymentsClient = null;
      function getGooglePaymentsClient() {
        if (paymentsClient === null) {
          paymentsClient = new window.google.payments.api.PaymentsClient({
            environment: _this.googlepay_parameters.environment,
            paymentDataCallbacks: {
              onPaymentAuthorized: onPaymentAuthorized,
            },
          });
        }
        return paymentsClient;
      }

      function onPaymentAuthorized(paymentData) {
        return new Promise(function (resolve) {
          // handle the response
          if (_this.payMethodInfo.payWayCode === "701") {
            _this.newWindow = window.open("", "_blank");
            processPayment(paymentData)
              .then(function (res) {
                _this.openNewPageChangeStatus(res.webUrl);
                resolve({ transactionState: "SUCCESS" });
              })
              .catch(function (e) {
                if (_this.newWindow == null) {
                  resolve({ transactionState: "SUCCESS" });
                  return;
                }
                _this.newWindow.close();
                resolve({
                  transactionState: "ERROR",
                  error: {
                    intent: "PAYMENT_AUTHORIZATION",
                    message: e.message,
                    reason: "PAYMENT_DATA_INVALID",
                  },
                });
              });
          } else if (_this.payMethodInfo.payWayCode === "702") {
            processPayment(paymentData)
              .then(function (res) {
                resolve({ transactionState: "SUCCESS" });
                window.location = res.webUrl;
              })
              .catch(function (e) {
                resolve({
                  transactionState: "ERROR",
                  error: {
                    intent: "PAYMENT_AUTHORIZATION",
                    message: e.message,
                    reason: "PAYMENT_DATA_INVALID",
                  },
                });
              });
          }
        });
      }
      function onGooglePaymentButtonClicked() {
        const paymentDataRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: "CARD",
              parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["MASTERCARD", "VISA"],
              },
              tokenizationSpecification: {
                type: "PAYMENT_GATEWAY",
                parameters: {
                  gateway: _this.googlepay_parameters.gateway,
                  gatewayMerchantId:
                    _this.googlepay_parameters.gatewayMerchantId,
                },
              },
            },
          ],
          transactionInfo: {
            countryCode: _this.placeOrderQuery.alpha2,
            currencyCode: _this.placeOrderQuery.fiatCurrency,
            totalPriceStatus: "FINAL",
            totalPrice: String(_this.placeOrderQuery.amount),
            totalPriceLabel: "Total",
          },
          merchantInfo: {
            // @todo a merchant ID is available for a production environment after approval by Google
            // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
            merchantId: _this.googlepay_parameters.merchantId,
            merchantName: _this.googlepay_parameters.merchantName,
          },
          callbackIntents: ["PAYMENT_AUTHORIZATION"],
        };
        const paymentsClient = getGooglePaymentsClient();
        paymentsClient.loadPaymentData(paymentDataRequest).catch(() => {
          _this.submitState = true;
          _this.buttonData = {
            loading: false,
            triggerNum: 0,
          };
        });
      }
      onGooglePaymentButtonClicked();

      function processPayment(paymentData) {
        return new Promise(function (resolve, reject) {
          // @todo pass payment token to your gateway to process payment
          const paymentToken =
            paymentData.paymentMethodData.tokenizationData.token;
          let postAlchemyPay = (orderNo) => {
            let params = {};
            if (_this.payMethodInfo.payWayCode === "701") {
              params = {
                payWayCode: _this.payMethodInfo.payWayCode,
                orderNo: orderNo,
                customParam: {
                  encryptedData: paymentToken,
                },
                businessParams: {
                  email: AES_Decrypt(localStorage.getItem("email")),
                  cookie: _this.forter_Cookie,
                  checkoutCookie: _this.checkoutCookie,
                },
              };
            } else if (_this.payMethodInfo.payWayCode === "702") {
              params = {
                payWayCode: _this.payMethodInfo.payWayCode,
                orderNo: orderNo,
                customParam: {
                  email: AES_Decrypt(localStorage.getItem("email")),
                  encryptedData: paymentToken,
                },
                businessParams: {
                  cookie: _this.forter_Cookie,
                  checkoutCookie: _this.checkoutCookie,
                },
              };
            }

            _this.$axios
              .post(_this.$api.post_alchemyPay, params, "")
              .then((res) => {
                if (res && res.returnCode === "0000") {
                  if (res.data) {
                    _this.payUrl = res.data.webUrl;
                    resolve({ webUrl: res.data.webUrl });
                  }
                }
              })
              .catch((res) => {
                _this.submitState = true;
                _this.buttonData = {
                  loading: false,
                  triggerNum: 0,
                };
                // reject(new Error('This card is not supported currently'));
                reject(new Error(res.returnMsg));
              });
          };
          postAlchemyPay(orderNo);
        });
      }
    },
    //查询支付状态
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
          this.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },

    //Store data to prevent page refresh
    storeData() {
      let newData = {};
      newData.webUrl = "newUrl";
      newData.payUrl = this.payUrl;
      sessionStorage.setItem("indonesiaPayment", JSON.stringify(newData));
    },

    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll(val) {
      window.clearTimeout(this.scrollTimeDown);
      this.scrollTimeDown = null;
      let offset =
        this.$refs.button_ref.$refs.buttonChild_ref.getBoundingClientRect();

      //滚动的像素+容器的高度>可滚动的总高度-50像素
      if (
        this.oldOffsetTop !== offset.top &&
        val.srcElement.scrollTop + val.srcElement.offsetHeight <
          val.srcElement.scrollHeight - 50
      ) {
        this.goDown_state = false;
        window.clearTimeout(this.scrollTimeDown);
        this.scrollTimeDown = null;
        this.scrollTimeDown = setTimeout(() => {
          this.goDown_state = true;
        }, 1000);
      }

      if (
        val.srcElement.scrollTop + val.srcElement.offsetHeight >
        val.srcElement.scrollHeight - 50
      ) {
        window.clearTimeout(this.scrollTimeDown);
        this.scrollTimeDown = null;
        this.goDown_state = false;
      }
      this.oldOffsetTop = offset.top;
    },
    goDown() {
      setTimeout(() => {
        this.$refs.button_ref.$refs.buttonChild_ref.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
        this.goDown_state = false;
      });
    },
    // 打开三方收银台时 修改数据
    openNewPageChangeStatus(url) {
      this.waitState = true;
      this.$parent.confirmOrderStatus = true;
      this.$store.commit("set_ovo_va_mex_qrs_Status", true);
      this.$store.commit("changeBuyPayProcessTab", false);
      window.clearInterval(this.timeDown);
      this.timeDown = setInterval(() => {
        this.queryOrderStatus();
      }, 1000);
      this.newWindow.location = url;
      this.payUrl = url;
      this.storeData();
    },
  },
  destroyed() {
    this.$store.dispatch("request/clearAllQuery");
    this.buttonData = {
      loading: false,
      triggerNum: 0,
    };
    this.submitState = true;
    window.clearInterval(this.timeDown);
    this.timeDown = null;
    // this.$store.state.ovo_va_mex_qrs_Status = false
    this.waitState = false;
    this.$store.commit("changeBuyPayProcessTab", true);
    this.$parent.confirmOrderStatus = false;
  },
};
</script>

<style lang="scss" src="../creditCard/css/configPayment.scss" scoped></style>
