<template>
  <div id="allPaymentMethod">
    <div class="content">
      <!-- 最近一次国际卡记录 -->
      <div
        class="savedCard-box"
        v-if="JSON.stringify(paymethod_savedCard) !== '{}'"
      >
        <div class="allPaymentMethod-title">
          {{ $t("buyPayWay.recentlyUsed") }}
        </div>
        <div
          class="savedCard-view"
          :class="{ 'select-true': selectKey === 'saveCard' }"
          @click="selectMethods('saveCard', paymethod_savedCard)"
        >
          <div class="icon">
            <img :src="cardIcon(paymethod_savedCard.cardNumber)" />
          </div>
          <div class="card-item-info">
            <div>
              <div class="info">
                <div class="card-type">
                  <span
                    >{{ cardType
                    }}<span
                      style="text-transform: lowercase"
                      v-show="cardType === 'Master'"
                      >{{ $t("buyPayWay.card") }}</span
                    ></span
                  >
                </div>
                <div class="card-num">
                  <span>****</span
                  >{{
                    paymethod_savedCard.cardNumber.substring(
                      paymethod_savedCard.cardNumber.length - 4
                    )
                  }}
                </div>
              </div>
            </div>
            <p class="payArrivalTime" v-if="paymethod_savedCard.settleTime">
              {{ paymethod_savedCard.settleTime | onSettleTime }}
            </p>
          </div>
        </div>
      </div>
      <!-- 新添加 -->
      <!-- 二次支付不展示添加支付方式title -->
      <div
        class="allPaymentMethod-title"
        v-if="paymethod_Original.length > 0 && !$route.query.pathHistry"
      >
        <p v-if="isShowPaymentMethodTitle">
          {{ $t("buyPayWay.paymentMethod") }}
        </p>
      </div>

      <div class="newPaymentMethod-list" v-if="isShowPaymentMethodTitle">
        <div
          class="newPaymentMethod-item"
          v-for="(item, index) in paymethod_Original"
          :key="'binancePay_' + index"
        >
          <div
            v-if="
              ['20001', '501', '502', '701', '702'].includes(item.payWayCode)
            "
            @click="selectMethods(item.payWayCode, item)"
          >
            <div
              class="binancePay"
              v-if="item.unavaible"
              :class="{ 'select-true': selectKey === item.payWayCode }"
            >
              <div class="binancePay-left">
                <div class="line bina-logo">
                  <div class="icon" v-if="item.logoIcon">
                    <img :src="item.logoIcon" />
                  </div>
                </div>
                <div class="pay-content">
                  <div class="info">
                    <p class="name">
                      {{ $t(`buyPayWay.${item.name}`) }}
                    </p>
                  </div>
                  <p class="payArrivalTime" v-if="item.settleTime">
                    {{ item.settleTime | onSettleTime }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else @click="selectMethods(item.payWayCode, item)">
            <div class="payment-other-ways" v-if="item.unavaible">
              <div class="logo-icon">
                <div class="icon" v-if="item.logoIcon">
                  <img :src="item.logoIcon" />
                </div>
              </div>
              <div class="pay-content">
                <div class="paymentMethod-name">
                  <p>{{ $t(`buyPayWay.${item.name}`) }}</p>
                </div>
                <p class="payArrivalTime" v-if="item.settleTime">
                  {{ item.settleTime | onSettleTime }}
                </p>
                <div class="iconList" v-if="item.icons?.length">
                  <div class="leftIcon">
                    <p
                      class="iconList-oneOf"
                      v-for="(icon, iconIndex) in item.icons.slice(0, 7)"
                      :key="iconIndex"
                    >
                      <img :src="icon" alt="" />
                    </p>
                    <p class="otherPayWay-num" v-if="item.icons.length > 7">
                      +{{ item.icons.length - 7 }}
                    </p>
                  </div>
                </div>
              </div>
              <img
                class="rightIcon"
                src="@/assets/images/homeRight-icon1.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <content-loader
        primaryColor="#f5f5f5"
        secondaryColor="#ffffff"
        :secondaryOpacity="0.5"
        v-if="!paymethod_Original.length"
        :width="343"
        :height="272"
      >
        <rect x="0" y="0" width="200" height="20" rx="6" ry="6" />
        <rect x="0" y="32" width="100%" height="72" rx="6" ry="6" />
        <rect x="0" y="116" width="100%" height="72" rx="6" ry="6" />
        <rect x="0" y="200" width="100%" height="72" rx="6" ry="6" />
      </content-loader>

      <!-- 超过通道的限额列表 -->

      <div class="unavaible-payment-method">
        <div class="unavaible-title" v-if="isUnavaibleTitle">
          {{ $t("buyPayWay.Unavaible") }}
        </div>
        <div class="unavaible-list">
          <div
            class="unavaible-item"
            v-for="(item, index) in paymethod_Original"
            :key="'binancePay_' + index"
          >
            <div
              v-if="
                ['20001', '501', '502', '701', '702'].includes(item.payWayCode)
              "
            >
              <div
                class="binancePay"
                v-if="!item.unavaible"
                :class="{ 'select-true': selectKey === item.payWayCode }"
              >
                <div class="binancePay-left">
                  <div class="line bina-logo">
                    <div class="icon" v-if="item.logoIcon_unavaible">
                      <img :src="item.logoIcon_unavaible" />
                    </div>
                  </div>
                  <div class="pay-content">
                    <div class="info">
                      <p class="name">
                        {{ $t(`buyPayWay.${item.name}`) }}
                      </p>
                    </div>
                    <div class="fee">
                      <span
                        >{{ $t("buyPayWay.limit") }}:<span class="limit-amount">
                          {{ item.minAmount }} {{ item.fiat }} -
                          {{ item.maxAmount }} {{ item.fiat }}</span
                        ></span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="payment-other-ways" v-if="!item.unavaible">
                <div class="logo-icon">
                  <div class="icon" v-if="item.logoIcon_unavaible">
                    <img :src="item.logoIcon_unavaible" />
                  </div>
                </div>
                <div class="pay-content">
                  <p class="paymentMethod-name">
                    {{ $t(`buyPayWay.${item.name}`) }}
                  </p>
                  <div class="iconList" v-if="item.icons?.length">
                    <div class="leftIcon">
                      <p
                        class="iconList-oneOf"
                        v-for="(icon, iconIndex) in item.icons.slice(0, 7)"
                        :key="iconIndex"
                      >
                        <img :src="icon" alt="" />
                      </p>
                      <p class="otherPayWay-num" v-if="item.icons.length > 7">
                        +{{ item.icons.length - 7 }}
                      </p>
                    </div>
                  </div>
                  <div class="feeView">
                    <span
                      >{{ $t("buyPayWay.limit") }}:<span class="limit-amount">
                        {{ item.minAmount }} {{ item.fiat }} -
                        {{ item.maxAmount }} {{ item.fiat }}</span
                      ></span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import valid from "card-validator";
import { AES_Decrypt, AES_Encrypt } from "@/utils/encryp";
import {
  querySubmitToken,
  getKycRule,
  checkPixKycIsRequired,
} from "@/utils/publicRequest";
import { mapState } from "vuex";

import { allpaymentMethod } from "@/assets/json/paymentMethods.js";
import paymentMethods from "@/assets/json/paymentMethods.json";
import i18n from "@/utils/i18n";

export default {
  name: "allPaymentMethod",
  props: {
    paymethodList: {
      default: null,
      type: Array,
    },
    savedCard: {
      default: null,
      type: Array,
    },
    isDiscount: {
      default: null,
      type: Boolean,
    },
  },
  data() {
    return {
      allpaymentMethod: allpaymentMethod,
      selectKey: "",
      selectVal: "",
      // payMethodInfo: {},
      unavaiblePaymentList: [], // 超过通道的限额列表
      isShowPaymentMethodTitle: true, // 控制 添加支付方式title 是否显示
      paymethod_savedCard: {},
      paymethod_Original: [],
    };
  },
  filters: {
    onSettleTime(val) {
      return JSON.parse(val)[i18n.locale || "en-US"];
    },
  },
  watch: {
    savedCard: {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        if (!val || val.length === 0) {
          this.paymethod_savedCard = {};
          this.selectKey = "";
          this.selectVal = "";
          this.$parent.selectKey = "";
          this.$parent.radioIndex = "";
          return;
        }
        if (val !== oldVal) {
          //历史国际卡信息
          if (val.length > 0) {
            let savedCard = JSON.parse(JSON.stringify(val))[0];
            this.selectMethods("saveCard", savedCard);
            this.paymethod_savedCard = savedCard;
          }
        }
      },
    },
    paymethod_Original: {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
        if (val && val.length > 0 && val !== oldVal) {
          //二次支付本地支付方式只有一种默认展开
          if (
            this.$route.query.pathHistry === "tradeHistory" &&
            val.length === 1 &&
            ["qrCode", "virtualAccount", "eWallet", "Philippines"].includes(
              val[0].name
            )
          ) {
            this.selectKey = "";
            this.$parent.selectKey = "";
            this.selectVal = val[0];
            this.$nextTick(() => {
              this.$parent.$refs.correspondPaymentMethod.initializationData(
                val[0]
              );
            });
            this.$parent.editText = "edit";
            this.$parent.payMethodStatus = false;
          }
        }
      },
    },
    //支付方式列表
    paymethodList: {
      deep: true,
      immediate: true,
      handler() {
        let paymentMethod_filter = [];
        if (this.paymethodList.length > 0) {
          // 处理超过支付方式限额
          this.handleUnavaiblePayment();
          this.allpaymentMethod.forEach((item) => {
            let data = [];
            //单独处理菲律宾支付
            if (["eWallet", "Philippines", "qrCode"].includes(item.name)) {
              data = this.paymethodList.filter((res) => {
                return item.allpayWayCode.split(",").includes(res.payWayCode);
              })[0];
            } else {
              data = this.paymethodList.filter((res) => {
                return item.payWayCode === res.payWayCode;
              })[0];
            }
            if (data !== undefined) {
              let newData = Object.assign({}, data, item);
              newData.rampFee = data.rampFee;
              newData.discountRampFee = data.discountRampFee;
              newData.symbol = data.symbol;

              //钱包转账单独处理数据
              if (
                newData.name === "eWallet" ||
                newData.name === "Philippines" ||
                newData.name === "qrCode"
              ) {
                newData.icons = [];
                this.paymethodList.forEach((serviceData) => {
                  if (newData.allpayWayCode.includes(serviceData.payWayCode)) {
                    newData.payWayCode =
                      newData.payWayCode + serviceData.payWayCode + ",";
                    paymentMethods.some((item) => {
                      if (
                        item.payWayCode == serviceData.payWayCode &&
                        item.icon
                      ) {
                        newData.icons.push(
                          require("@/assets/images/paymentIcon/" + item.icon)
                        );
                        return true;
                      }
                    });
                  }
                });
              }

              // qrCode、Philippines、virtualAccount、eWallet类型到账时间处理
              if (
                ["qrCode", "Philippines", "virtualAccount", "eWallet"].includes(
                  newData.name
                )
              ) {
                let payWayCode_typeInfo = newData.payWayCode
                  .split(",")
                  .filter(
                    (val) => val !== "" && val !== null && val !== undefined
                  );
                let payArrivalTime_num = 0;
                let isInstant1_data = {};
                payWayCode_typeInfo.forEach((typeInfo_item) => {
                  let filterItem =
                    this.paymethodList.filter(
                      (val) => val.payWayCode === typeInfo_item
                    )[0] || [];
                  if (filterItem.isInstant === 1) {
                    isInstant1_data = filterItem;
                    payArrivalTime_num += 1;
                  }
                });
                !payArrivalTime_num
                  ? ((newData.settleTime = ""), (newData.isInstant = 0))
                  : ((newData.settleTime = isInstant1_data.settleTime),
                    (newData.isInstant = 1));
              }

              if (
                newData.payWayCode !== "501" &&
                newData.payWayCode !== "502" &&
                newData.payWayCode !== "701" &&
                newData.payWayCode !== "702"
              ) {
                paymentMethod_filter.push(newData);
              } else if (["501", "502"].includes(newData.payWayCode)) {
                // 环境支持applepay
                try {
                  if (
                    window.ApplePaySession &&
                    window.ApplePaySession.canMakePayments()
                  ) {
                    paymentMethod_filter.push(newData);
                  }
                } catch (e) {
                  console.log(e);
                }
              } else if (
                newData.payWayCode === "701" ||
                newData.payWayCode === "702"
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
                        paymentMethod_filter.push(newData);
                      }
                    });
                } catch (e) {
                  console.error(e);
                }
              }
            }
          });

          //单独处理泰国支付
          if (paymentMethod_filter && paymentMethod_filter.length > 0) {
            paymentMethod_filter.forEach((item) => {
              if (
                (item.name === "Philippines" || item.name === "qrCode") &&
                item.payWayCode.split(",").includes("300")
              ) {
                item.payWayCode = item.payWayCode
                  .split(",")
                  .filter((res) => {
                    return res !== "300";
                  })
                  .join(",");
                item.icons = [item.icons[1]];
              }
            });
          }

          //俄罗斯展示mir
          try {
            if (paymentMethod_filter[0]) {
              if (
                paymentMethod_filter[0].name === "card" &&
                this.faitCode !== "RUB"
              ) {
                paymentMethod_filter[0].icons.length = 4;
              } else if (
                paymentMethod_filter[0].name === "card" &&
                this.faitCode === "RUB"
              ) {
                paymentMethod_filter[0].icons.push(
                  require("@/assets/images/cardIcons/mir-icon.png")
                );
              }
              paymentMethod_filter[0].icons = Array.from(
                new Set(paymentMethod_filter[0].icons)
              );
            }
          } catch (e) {
            console.log(e);
          }
        }
        this.paymethod_Original = paymentMethod_filter;
      },
    },
  },
  computed: {
    ...mapState("cryptoBuyPage", {
      faitCode: (state) => state.fiatCurrencyInfo.fiat,
    }),
    ...mapState("buyPayments", {
      placeOrderQuery: (state) => state.placeOrderQuery,
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
    }),
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
    }),
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),

    //卡类型
    cardType() {
      let validObject = valid.number(this.paymethod_savedCard.cardNumber);
      if (
        this.paymethod_savedCard.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "mastercard"
      ) {
        return "Master";
      }
      if (
        this.paymethod_savedCard.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "visa"
      ) {
        return "Visa";
      }
      if (
        this.paymethod_savedCard.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "mir"
      ) {
        return "Mir";
      }
      if (
        this.paymethod_savedCard.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "diners-club"
      ) {
        return "Diners";
      }
      if (
        this.paymethod_savedCard.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "discover"
      ) {
        return "Discover";
      }
      return "";
    },

    //是否展示
    activityStatus1() {
      //是否支持世界杯活
      return sessionStorage.getItem("activityStatus1");
    },

    // 是否展示被限制支付方式的title
    isUnavaibleTitle() {
      if (this.paymethod_Original.length) {
        let arr = this.paymethod_Original.filter((item) => {
          return item.unavaible === false;
        });
        if (arr.length) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    //选择支付方式
    selectMethods(type, val) {
      this.selectKey = type;
      this.$parent.selectKey = type;
      this.selectVal = val;
      //存储支付方式信息
      this.$store.commit("buyPayments/set_payMethodInfo", val);

      //只针对银行支付阿根廷和菲律宾只有一个时触发
      if (
        val.name &&
        ["Philippines", "qrCode", "eWallet"].includes(val.name) &&
        val.payWayCode.replace(/,$/gi, "").split(",").length === 1
      ) {
        this.selectKey = this.selectKey
          ? this.selectKey.replace(/,$/gi, "")
          : this.selectKey;
        this.selectVal.payWayCode = this.selectVal.payWayCode
          ? this.selectVal.payWayCode.replace(/,$/gi, "")
          : this.selectKey;
        this.$parent.selectKey = "";
        this.confirm();
        return;
      }

      //印尼 - DANA、QRIS、OVO
      if (val.name && ["eWallet", "Philippines"].includes(val.name)) {
        this.selectKey = "";
        this.$parent.selectKey = "";
        this.$nextTick(() => {
          this.$parent.$refs.correspondPaymentMethod.initializationData(val);
        });
        this.$parent.editText = "edit";
        this.$parent.payMethodStatus = false;
        return;
      }

      //印尼 - Virtual Account
      if (type === "10003") {
        this.selectKey = "";
        this.$parent.selectKey = "";
        this.$nextTick(() => {
          this.$parent.$refs.correspondPaymentMethod.initializationData(val);
        });
        this.$parent.editText = "edit";
        this.$parent.payMethodStatus = false;
        return;
      }

      //国际卡
      if (type === "saveCard") {
        this.$store.commit("buyPayments/set_creditCardInfo", val);
        this.$store.commit("buyPayments/set_userCardId", val.userCardId);
        this.$store.commit(
          "buyPayments/set_fullName",
          AES_Encrypt(
            AES_Decrypt(val.firstname) + " " + AES_Decrypt(val.lastname)
          )
        );
        return;
      }

      if (type === "10001") {
        this.$store.commit("buyPayments/set_payMethodInfo", val);
        //订单商户不需要创建订单
        if (this.$route.query.orderNo) {
          this.orderMerchantJump(this.payMethodInfo.payWayCode, val);
          return;
        }
        //没有历史卡信息
        if (this.savedCard.length === 0) {
          //二次支付选择卡信息时如果卡为0个则直接弹出新增信用卡表单
          // if (this.$route.query.pathHistry === 'tradeHistory') {
          this.$parent.request_loading = false;
          this.$parent.addNewCardShow = "2";
          //   return;
          // }
          // this.placeOrder('10001', this.selectVal);
          return;
        }
        //历史卡信息
        this.selectKey = "";
        this.$parent.selectKey = "";
        this.$nextTick(() => {
          this.$parent.$refs.correspondPaymentMethod.initializationData(val);
        });
        this.$parent.editText = "edit";
        this.$parent.payMethodStatus = false;
      }
    },

    //卡类型icon
    cardIcon(icon) {
      let validObject = valid.number(icon);
      if (
        icon !== "" &&
        validObject.isValid &&
        validObject.card.type === "mastercard"
      ) {
        return require("@/assets/images/paymentMethod/master-saved-icon.svg");
      }
      if (
        icon !== "" &&
        validObject.isValid &&
        validObject.card.type === "visa"
      ) {
        return require("@/assets/images/paymentMethod/visa-saved-icon.svg");
      }
      if (
        icon !== "" &&
        validObject.isValid &&
        validObject.card.type === "mir"
      ) {
        return require("@/assets/images/paymentMethod/mir-check.svg");
      }
      if (
        icon !== "" &&
        validObject.isValid &&
        validObject.card.type === "diners-club"
      ) {
        return require("@/assets/images/paymentMethod/diner.svg");
      }
      if (
        icon !== "" &&
        validObject.isValid &&
        validObject.card.type === "discover"
      ) {
        return require("@/assets/images/paymentMethod/discover.png");
      }
      return "";
    },

    // 处理超过支付方式限额
    handleUnavaiblePayment() {
      this.unavaiblePaymentList = [];
      this.paymethodList.forEach((item) => {
        if (item.minAmount && item.maxAmount) {
          if (
            Number(this.placeOrderQuery.amount) < Number(item.minAmount) ||
            Number(this.placeOrderQuery.amount) > Number(item.maxAmount)
          ) {
            item.unavaible = false;
            this.unavaiblePaymentList.push(item);
          } else {
            item.unavaible = true;
          }
        }
      });
      if (this.paymethodList.length <= this.unavaiblePaymentList.length) {
        this.isShowPaymentMethodTitle = false;
      } else {
        this.isShowPaymentMethodTitle = true;
      }
      // if (this.unavaiblePaymentList.length) {
      //   let isEnable = this.handleVNDLimit(this.unavaiblePaymentList);
      // }
    },

    // 单独处理越南vnd eWallet支付是否超过通道限额
    // handleVNDLimit(unavaiblePaymentList) {
    //   let VNDLsit = [];
    //   unavaiblePaymentList.forEach(unavaibleItem => {
    //     if (['201', '202', '203'].includes(unavaibleItem.payWayCode)) {
    //       VNDLsit.push(unavaibleItem.payWayCode);
    //     }
    //   });
    //   if (VNDLsit.length === 3) {
    //     return false; // false 代表
    //   } else {
    //     return true;
    //   }
    // },

    async confirm() {
      // 获取用户支付表单数据(只有本地支付)
      if (
        !["10001", "501", "502", "701", "702", "20001"].includes(
          this.payMethodInfo.payWayCode
        )
      ) {
        let params = {
          payWayCode: this.payMethodInfo.payWayCode,
        };
        let getResult = await this.$axios
          .get(this.$api.get_userPayFormData, params)
          .catch(() => {});
        if (getResult) {
          // 存储用户支付表单数据
          let status =
            getResult.data !== undefined &&
            JSON.stringify(getResult.data) !== "{}" &&
            getResult.data !== null;
          let newData = { status: status, ...getResult.data };
          this.$store.commit(
            "buyPayments/set_lastTimePaymentFormInfo",
            newData
          );
        }
      }

      //信用卡二次支付 - 修改支付方式信息
      if (this.$route.query.pathHistry === "tradeHistory") {
        //保存卡信息
        if (
          this.selectKey === "saveCard" ||
          ["40001", "40002", "501", "502", "701", "702"].includes(
            this.selectVal.payWayCode
          )
        ) {
          let fullName = localStorage.getItem("email");
          let cardData = JSON.parse(JSON.stringify(this.selectVal));
          cardData.cardNumber = AES_Encrypt(cardData.cardNumber);
          this.$store.commit("buyPayments/set_creditCardInfo", cardData);
          this.$store.commit("buyPayments/set_userCardId", cardData.userCardId);
          this.$store.commit("buyPayments/set_fullName", fullName);
        }
        let params = {
          orderNo: this.buyPayment_secondPay.orderNo,
          payWayCode: this.selectVal.payWayCode,
        };
        this.$axios
          .post(this.$api.post_updateOrderInfo, params, "")
          .then(async (val) => {
            if (val) {
              //二次支付选择支付方式不需要创建订单  只针对卡支付  币安支付和巴西支付墨西哥支付
              const ParamsData = JSON.parse(JSON.stringify(this.$route.query));
              let ParamsData1 = "";
              for (let key in ParamsData) {
                ParamsData1 += key + "=" + ParamsData[key] + "&";
              }
              //处理地址栏参数
              ParamsData1 = ParamsData1.substring(0, ParamsData1.length - 1);
              //支持墨西哥页面显示
              let payMethodInfo = {
                payWayCode: this.payMethodInfo.payWayCode,
                payWayName: this.payMethodInfo.payWayName,
              };
              this.$store.commit(
                "buyPayments/set_payMethodInfo",
                payMethodInfo
              );
              //Bank Transfer
              if (this.selectVal.payWayCode === "601") {
                this.$parent.request_loading = false;
                // 二次支付是否需要kyc
                this.isKycStatus(this.selectVal, ParamsData1);
                return;
              }
              //巴西 PAY
              if (this.selectVal.payWayCode === "30001") {
                this.$parent.request_loading = false;
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
              }

              //信用卡支付
              if (
                this.selectKey === "saveCard" &&
                this.selectVal.payWayCode === "10001"
              ) {
                let cardData = JSON.parse(JSON.stringify(this.selectVal));
                cardData.cardNumber = AES_Encrypt(cardData.cardNumber);
                this.$store.commit("buyPayments/set_creditCardInfo", cardData);
                this.$parent.request_loading = false;
                this.isKycStatus(this.selectVal, ParamsData1);
                return;
              }
              paymentMethods.some((item) => {
                if (item.payWayCode == this.selectVal.payWayCode) {
                  this.isKycStatus(this.selectVal, ParamsData1);
                  return true;
                }
              });
            }
          });
        return;
      }

      //订单商户模式不需要创建订单
      if (
        this.$route.query.orderNo &&
        (this.selectKey === "saveCard" || this.selectKey === "saveCard")
      ) {
        this.orderMerchantJump("saveCard", this.selectVal);
        return;
      }

      //api商户 - 币安支付
      if (this.$route.query.orderNo && this.selectKey === "20001") {
        this.orderMerchantJump("20001", this.selectVal);
        return;
      }
      // 非api商户
      if (!this.$route.query.orderNo) {
        await this.placeOrder(this.selectKey, this.selectVal);
      }
    },

    //创建订单
    async placeOrder(type, val) {
      let submitToken = await querySubmitToken();
      if (submitToken === true && this.$parent.request_loading === false) {
        this.$parent.request_loading = true;
        //确认下单 获取订单id
        let params = this.placeOrderQuery;
        params.payWayCode = this.payMethodInfo.payWayCode;
        //存在商户信息将信息带入请求地址
        let urlQuery = "";
        let merchantType = sessionStorage.getItem("merchantType");
        if (
          this.merchantInfo &&
          this.merchantInfo.merchantStatus &&
          merchantType === "buy"
        ) {
          urlQuery = `?${this.merchantInfo.merchantFullPath}`;
          params.merchantParam = this.merchantInfo.merchantFullPath;
        }
        this.$axios
          .post(this.$api.post_buy + urlQuery, params, "submitToken")
          .then((res) => {
            if (res && res.data) {
              //存储订单号
              this.$store.commit("buyPayments/set_orderNo", res.data.orderNo);
              //存储信用卡信息
              // this.$store.commit('buyPayments/set_creditCardInfo', JSON.parse(JSON.stringify(res.data)));

              this.$store.state.buyRouterParams.kyc = res.data.kyc;
              //国际卡信息表单
              if (type === "10001") {
                this.$parent.addNewCardShow = 2;
                this.$parent.request_loading = false;
                return;
              }

              //存储支付方式信息
              let payMethodInfo = {
                payWayCode: this.payMethodInfo.payWayCode,
                payWayName: this.payMethodInfo.payWayName,
              };
              // 尼日利亚的本地支付，这里希望拿到所有数据
              if (val.payWayCode !== "18000") {
                this.$store.commit(
                  "buyPayments/set_payMethodInfo",
                  payMethodInfo
                );
              }

              //所有支付方式都要做kyc
              if (
                type === "saveCard" ||
                [
                  "40001",
                  "40002",
                  "501",
                  "502",
                  "701",
                  "702",
                  "30001",
                  "18000",
                ].includes(val.payWayCode) ||
                val.payWayCode
              ) {
                //选择历史卡信息然后进行kyc验证 修改位传输email
                let fullName = localStorage.getItem("email");
                let payMethodInfo = JSON.parse(
                  JSON.stringify(this.payMethodInfo)
                );
                payMethodInfo.cardNumber = AES_Encrypt(
                  payMethodInfo.cardNumber
                );
                this.$store.commit("buyPayments/set_fullName", fullName);
                let newCardInfo = JSON.parse(JSON.stringify(this.selectVal));
                newCardInfo.cardNumber = AES_Encrypt(newCardInfo.cardNumber);
                this.$store.commit(
                  "buyPayments/set_creditCardInfo",
                  newCardInfo
                );
                this.$store.commit(
                  "buyPayments/set_userCardId",
                  newCardInfo.userCardId
                );
                if (type === "saveCard") {
                  this.$store.commit(
                    "buyPayments/set_payMethodInfo",
                    this.paymethod_savedCard
                  );
                }
                //支持墨西哥页面显示
                this.isKycStatus(val);
                return;
              }

              paymentMethods.some((item) => {
                if (item.payWayCode == val.payWayCode) {
                  this.$parent.request_loading = false;
                  this.$router.push(`${item.routerPath}`);
                }
                return true;
              });
            } else {
              this.$parent.request_loading = false;
            }
            this.$parent.request_loading = false;
          })
          .catch(() => {
            this.$parent.request_loading = false;
          });
      } else {
        this.$parent.request_loading = false;
      }
    },

    //订单商户页面跳转
    async orderMerchantJump(type, val) {
      let _this = this;

      //存储支付方式信息
      // let payMethodInfo_store = {
      //   payWayCode: val.payWayCode,
      //   payWayName: val.payWayName
      // };
      this.$store.commit("buyPayments/set_payMethodInfo", val);

      //币安支付
      if (this.$route.query.orderNo && type === "20001") {
        this.$router.push(`/binancePay?orderNo=${this.$route.query.orderNo}`);
        return;
      }

      //新增信用卡 - 10001 判读是否有历史卡
      if (
        this.$route.query.orderNo &&
        type === "10001" &&
        this.savedCard.length !== 0
      ) {
        this.selectKey = "";
        this.$parent.selectKey = "";
        this.$store.state.buyRouterParams.payMethod = val;
        this.$nextTick(() => {
          this.$parent.$refs.correspondPaymentMethod.initializationData(val);
        });
        this.$parent.editText = "edit";
        this.$parent.payMethodStatus = false;
        return;
      }

      //新增信用卡 - 10001
      if (
        this.$route.query.orderNo &&
        type === "10001" &&
        this.savedCard.length === 0
      ) {
        this.selectKey = "";
        this.$parent.selectKey = "";
        this.$parent.addNewCardShow = 2;
        this.$parent.addNewCardShow = 2;
        return;
      }

      let kycRule = await getKycRule(this.orderNo);
      if (kycRule === "1") {
        // onfido 验证方式
        this.orderMerchantJump_onfido(_this, type);
      } else if (kycRule === "2") {
        // sumsub 验证方式
        this.orderMerchantJump_sumsub(_this, type);
      }
    },

    orderMerchantJump_onfido(_this, type) {
      let params = {
        orderAmount: this.placeOrderQuery.amount,
        fiat: this.placeOrderQuery.fiatCurrency,
        payType: this.selectVal.payWayCode,
        businessType: 1,
      };
      this.$axios.post(this.$api.post_check, params, "").then((res) => {
        if (res && res.returnCode === "0000") {
          try {
            if (
              (res.data.kycFlag == 1 || res.data.kycFlag == 2) &&
              res.data.userLevel == 2
            ) {
              // 需要做kyc 并且需要做的kyc等级是 2;
              localStorage.setItem("getKycTokenByOnfidoWay", "true");
              localStorage.setItem("kyc_info_onfido", JSON.stringify(res.data));
              this.orderMerchantJump_sumsub(_this, type, "kyc_onfido");
              return;
            }
            // kyc成功后,查询国籍和kyc验证信息是否一致
            if (res.data.kycFlag === 0 && res.data.currKycLevel > 0) {
              let params = {
                payWayCode:
                  this.payMethodInfo.payWayCode ||
                  this.placeOrderQuery.payWayCode,
              };
              this.$axios
                .get(this.$api.get_findUserDetail, params)
                .then((res) => {
                  if ((!res && res.returnCode !== "0000") || !res.data) return;
                  let pathHistry =
                    this.$route.query.pathHistry === "tradeHistory"
                      ? "?pathHistry=tradeHistory"
                      : "";
                  if (res.data.isPassByPwcWorld === false) {
                    this.$router.push(`/kyc-error-countryCheck${pathHistry}`);
                    return;
                  }
                });
            }
            localStorage.removeItem("getKycTokenByOnfidoWay");
          } catch (e) {
            console.log(e);
          }

          //kyc所需name字段
          // this.$store.state.sellRouterParams.fullName = AES_Encrypt(AES_Decrypt(this.payMethodInfo.firstname) + ' ' + AES_Decrypt(this.payMethodInfo.lastname))
          this.$store.commit(
            "buyPayments/set_fullName",
            AES_Encrypt(
              AES_Decrypt(this.payMethodInfo.firstname) +
                " " +
                AES_Decrypt(this.payMethodInfo.lastname)
            )
          );

          if (res.data.kycFlag == 1) {
            this.$store.state.WhichPage = `/creditCardConfig?orderNo=${this.$route.query.orderNo}`;
            this.$router.push("/kycVerify");
            return;
          } else if (res.data.kycFlag == 2) {
            this.$router.push("/kycStatus");
          } else if (res.data.kycFlag == 0) {
            //历史信用卡 - 10001
            if (this.$route.query.orderNo && type === "saveCard") {
              this.$store.commit(
                "buyPayments/set_orderNo",
                this.$route.query.orderNo
              );
              this.$store.commit(
                "buyPayments/set_userCardId",
                this.payMethodInfo.userCardId
              );
              let payMethodInfo = JSON.parse(
                JSON.stringify(this.payMethodInfo)
              );
              payMethodInfo.cardNumber = AES_Encrypt(payMethodInfo.cardNumber);
              this.$store.commit(
                "buyPayments/set_creditCardInfo",
                JSON.parse(JSON.stringify(payMethodInfo))
              );
              this.$router.push(
                `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`
              );
            }
          }
        }
      });
    },
    orderMerchantJump_sumsub(_this, type, _type) {
      //kyc所需name字段
      // this.$store.state.sellRouterParams.fullName = AES_Encrypt(AES_Decrypt(this.payMethodInfo.firstname) + ' ' + AES_Decrypt(this.payMethodInfo.lastname))
      this.$store.commit(
        "buyPayments/set_fullName",
        AES_Encrypt(
          AES_Decrypt(this.payMethodInfo.firstname) +
            " " +
            AES_Decrypt(this.payMethodInfo.lastname)
        )
      );
      if (_type == "kyc_onfido") {
        _this.$store.state.WhichPage = `/creditCardConfig?orderNo=${this.$route.query.orderNo}`;
        _this.$router.push("/kycVerification");
        return;
      }

      //kyc验证
      this.$axios
        .post(this.$api.post_getKycThrough, { orderNo: this.orderNo }, "")
        .then((_res) => {
          if (_res && _res.returnCode === "0000") {
            if (_res.data.isKyc === true && _res.data.kycLevel !== "3") {
              //用户kyc信息存储
              this.$store.commit(
                "userInfo/set_kycInfo_levelIndex",
                _res.data.kycLevel
              );
              if (
                _res.data.kycLevel === "1" ||
                _res.data.kycLevel === "1,2" ||
                _res.data.kycLevel === "1,2,3"
              ) {
                this.$store.commit("userInfo/set_kycInfo_kycTips", 1);
              } else {
                this.$store.commit("userInfo/set_kycInfo_kycTips", 2);
              }
              _this.$store.state.WhichPage = `/creditCardConfig?orderNo=${this.$route.query.orderNo}`;
              _this.$router.push("/kycVerification");
              return;
            }

            //历史信用卡 - 10001
            if (this.$route.query.orderNo && type === "saveCard") {
              this.$store.commit(
                "buyPayments/set_orderNo",
                this.$route.query.orderNo
              );
              this.$store.commit(
                "buyPayments/set_userCardId",
                this.payMethodInfo.userCardId
              );
              let payMethodInfo = JSON.parse(
                JSON.stringify(this.payMethodInfo)
              );
              payMethodInfo.cardNumber = AES_Encrypt(payMethodInfo.cardNumber);
              this.$store.commit(
                "buyPayments/set_creditCardInfo",
                JSON.parse(JSON.stringify(payMethodInfo))
              );
              this.$router.push(
                `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`
              );
            }

            // 查询国籍和kyc验证信息是否一致
            if (!_res.data.isKyc) {
              let params = {
                payWayCode:
                  this.payMethodInfo.payWayCode ||
                  this.placeOrderQuery.payWayCode,
              };
              this.$axios
                .get(this.$api.get_findUserDetail, params)
                .then((res) => {
                  if ((!res && res.returnCode !== "0000") || !res.data) return;
                  let pathHistry =
                    this.$route.query.pathHistry === "tradeHistory"
                      ? "?pathHistry=tradeHistory"
                      : "";
                  if (res.data.isPassByPwcWorld === false) {
                    this.$router.push(`/kyc-error-countryCheck${pathHistry}`);
                  }
                });
            }
          }
        });
    },

    /**
     * kyc优化调整
     * val 对象，里面携带 payWayCode
     * ParamsData1 二次支付时路由跳转携带携带参数
     */
    async isKycStatus(val, ParamsData1) {
      let params = { orderNo: this.orderNo };
      let kycRule = await getKycRule(this.orderNo);
      if (kycRule === "1") {
        // onfido 验证方式
        this.isKycStatus_onfido(val, params, ParamsData1);
      } else if (kycRule === "2") {
        // sumsub 验证方式
        this.isKycStatus_sumsub(val, params, "", ParamsData1);
      }
    },

    /**
     * val 携带有payWayCode
     * params kyc请求参数
     * ParamsData1 二次支付路由跳转时携带参数
     */
    isKycStatus_onfido(val, params, ParamsData1) {
      let new_params = {
        orderAmount: this.placeOrderQuery.amount,
        fiat: this.placeOrderQuery.fiatCurrency,
        payType: this.payMethodInfo.payWayCode,
        businessType: 1,
      };
      this.$axios
        .post(this.$api.post_check, new_params, "")
        .then((res) => {
          try {
            if (
              (res.data.kycFlag == 1 || res.data.kycFlag == 2) &&
              res.data.userLevel == 2
            ) {
              // 需要做kyc 并且需要做的kyc等级是 2;
              localStorage.setItem("getKycTokenByOnfidoWay", "true");
              localStorage.setItem("kyc_info_onfido", JSON.stringify(res.data));
              this.isKycStatus_sumsub(val, params, "kyc_onfido", ParamsData1);
              return;
            }
            localStorage.removeItem("getKycTokenByOnfidoWay");
            if (val.payWayCode === "10001") {
              if (ParamsData1) {
                this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment&${ParamsData1}`;
              } else {
                this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment`;
              }
            } else {
              paymentMethods.some((item) => {
                if (item.payWayCode == this.payMethodInfo.payWayCode) {
                  if (ParamsData1) {
                    this.$store.state.WhichPage = `${item.routerPath}?${ParamsData1}`;
                  } else {
                    this.$store.state.WhichPage = `${item.routerPath}`;
                  }
                  return true;
                }
              });
            }

            if (res && res.data.kycFlag == 1) {
              this.$parent.request_loading = false;
              //type为applePay ｜ eWallet新加坡支付
              if (val.payWayCode === "10001") {
                this.$router.push("/kycVerify");
              } else if (["501", "502"].includes(val.payWayCode)) {
                this.$router.push("/kycVerify?type=applePay");
              } else if (val.payWayCode === "701" || val.payWayCode === "702") {
                this.$router.push("/kycVerify?type=googlePay");
              } else if (
                ["40001", "40002"].includes(this.payMethodInfo.payWayCode)
              ) {
                this.$router.push("/kycVerify?type=eWallet");
              } else if (["30001"].includes(this.payMethodInfo.payWayCode)) {
                this.$router.push("/kycVerify?type=brazilPay");
              } else if (["18000"].includes(this.payMethodInfo.payWayCode)) {
                this.$router.push("/kycVerify?type=nigeriaPay");
              } else {
                this.$router.push("/kycVerify");
              }
            } else if (res.data.kycFlag == 2) {
              this.$router.push("/kycStatus");
            } else if (res.data.kycFlag == 0) {
              // 查询国籍和kyc验证信息是否一致
              let params = {
                payWayCode:
                  this.payMethodInfo.payWayCode ||
                  this.placeOrderQuery.payWayCode,
              };
              this.$axios
                .get(this.$api.get_findUserDetail, params)
                .then((res2) => {
                  if ((!res2 && res2.returnCode !== "0000") || !res2.data)
                    return;
                  let pathHistry =
                    this.$route.query.pathHistry === "tradeHistory"
                      ? "?pathHistry=tradeHistory"
                      : "";
                  if (res2.data.isPassByPwcWorld === false) {
                    this.$router.push(`/kyc-error-countryCheck${pathHistry}`);
                    return;
                  }

                  this.isKycStatus_NoNeedKyc(val, ParamsData1);
                });
            }
          } catch (e) {
            console.log(e);
          }
        })
        .catch(() => {
          this.$parent.request_loading = false;
        });
    },

    /**
     * val 携带有payWayCode
     * params kyc请求参数
     * _type 'kyc_onfido',是不是需要做kyc_onfido
     * ParamsData1 二次支付路由跳转时携带参数
     */
    isKycStatus_sumsub(val, params, _type, ParamsData1) {
      if (_type == "kyc_onfido") {
        if (val.payWayCode === "10001") {
          // this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment`;
          if (ParamsData1) {
            this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment&${ParamsData1}`;
          } else {
            this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment`;
          }
        } else {
          paymentMethods.some((item) => {
            if (item.payWayCode == this.payMethodInfo.payWayCode) {
              if (ParamsData1) {
                this.$store.state.WhichPage = `${item.routerPath}?${ParamsData1}`;
              } else {
                this.$store.state.WhichPage = `${item.routerPath}`;
              }
              return true;
            }
          });
        }
        this.$parent.request_loading = false;
        //type为applePay ｜ eWallet新加坡支付
        if (val.payWayCode === "10001") {
          this.$router.push("/kycVerification");
        } else if (["501", "502"].includes(val.payWayCode)) {
          this.$router.push("/kycVerification?type=applePay");
        } else if (val.payWayCode === "701" || val.payWayCode === "702") {
          this.$router.push("/kycVerification?type=googlePay");
        } else if (["40001", "40002"].includes(this.payMethodInfo.payWayCode)) {
          this.$router.push("/kycVerification?type=eWallet");
        } else if (["30001"].includes(this.payMethodInfo.payWayCode)) {
          this.$router.push("/kycVerification?type=brazilPay");
        } else if (val.payWayCode === "18000") {
          this.$router.push("/kycVerification?type=nigeriaPay");
        } else {
          this.$router.push("/kycVerification");
        }

        return;
      }
      this.$axios
        .post(this.$api.post_getKycThrough, params, "")
        .then((res) => {
          if (res && res.data && !res.data.isKyc) {
            // 查询国籍和kyc验证信息是否一致
            let params = {
              payWayCode:
                this.payMethodInfo.payWayCode ||
                this.placeOrderQuery.payWayCode,
            };
            this.$axios
              .get(this.$api.get_findUserDetail, params)
              .then((res2) => {
                if ((!res2 && res2.returnCode !== "0000") || !res2.data) return;
                let pathHistry =
                  this.$route.query.pathHistry === "tradeHistory"
                    ? "?pathHistry=tradeHistory"
                    : "";
                if (res2.data.isPassByPwcWorld === false) {
                  this.$router.push(`/kyc-error-countryCheck${pathHistry}`);
                  return;
                }

                this.isKycStatus_NoNeedKyc(val, ParamsData1);
              });
            return;
          }
          if (res && res.data.isKyc === true && res.data.kycLevel !== "3") {
            if (val.payWayCode === "10001") {
              // this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment`;
              if (ParamsData1) {
                this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment&${ParamsData1}`;
              } else {
                this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment`;
              }
            } else {
              paymentMethods.some((item) => {
                if (item.payWayCode == this.payMethodInfo.payWayCode) {
                  if (ParamsData1) {
                    this.$store.state.WhichPage = `${item.routerPath}?${ParamsData1}`;
                  } else {
                    this.$store.state.WhichPage = `${item.routerPath}`;
                  }
                  return true;
                }
              });
            }

            this.$parent.request_loading = false;
            //用户kyc信息存储
            this.$store.commit(
              "userInfo/set_kycInfo_levelIndex",
              res.data.kycLevel
            );
            if (
              res.data.kycLevel === "1" ||
              res.data.kycLevel === "1,2" ||
              res.data.kycLevel === "1,2,3"
            ) {
              this.$store.commit("userInfo/set_kycInfo_kycTips", 1);
            } else {
              this.$store.commit("userInfo/set_kycInfo_kycTips", 2);
            }
            //type为applePay ｜ eWallet新加坡支付
            if (val.payWayCode === "10001") {
              this.$router.push("/kycVerification");
            } else if (["501", "502"].includes(val.payWayCode)) {
              this.$router.push("/kycVerification?type=applePay");
            } else if (val.payWayCode === "701" || val.payWayCode === "702") {
              this.$router.push("/kycVerification?type=googlePay");
            } else if (
              ["40001", "40002"].includes(this.payMethodInfo.payWayCode)
            ) {
              this.$router.push("/kycVerification?type=eWallet");
            } else if (["30001"].includes(this.payMethodInfo.payWayCode)) {
              this.$router.push("/kycVerification?type=brazilPay");
            } else if (["18000"].includes(this.payMethodInfo.payWayCode)) {
              this.$router.push("/kycVerification?type=nigeriaPay");
            } else {
              this.$router.push("/kycVerification");
            }
          } else {
            this.isKycStatus_NoNeedKyc(val, ParamsData1);
          }
        })
        .catch(() => {
          this.$parent.request_loading = false;
        });
    },

    /**
     * val 携带有payWayCode
     * ParamsData1 二次支付路由跳转时携带参数
     *
     */
    isKycStatus_NoNeedKyc(val, ParamsData1) {
      this.$parent.request_loading = false;
      if (ParamsData1) {
        //信用卡支付
        if (val.payWayCode === "10001") {
          let cardData = JSON.parse(JSON.stringify(val));
          cardData.cardNumber = AES_Encrypt(cardData.cardNumber);
          this.$store.commit("buyPayments/set_creditCardInfo", cardData);
          this.$parent.request_loading = false;
          this.$router.push(
            `/creditCardConfig?configPaymentFrom=userPayment&${ParamsData1}`
          );
          return;
        } else {
          paymentMethods.some((item) => {
            if (item.payWayCode == val.payWayCode) {
              this.$parent.request_loading = false;
              this.$router.push(`${item.routerPath}?${ParamsData1}`);
              return true;
            }
          });
        }
      } else {
        //历史信用卡 - 10001
        if (this.$route.query.orderNo && this.selectKey === "saveCard") {
          this.$store.commit(
            "buyPayments/set_orderNo",
            this.$route.query.orderNo
          );
          this.$store.commit(
            "buyPayments/set_userCardId",
            this.payMethodInfo.userCardId
          );
          let payMethodInfo = JSON.parse(JSON.stringify(this.payMethodInfo));
          payMethodInfo.cardNumber = AES_Encrypt(payMethodInfo.cardNumber);
          this.$store.commit(
            "buyPayments/set_creditCardInfo",
            JSON.parse(JSON.stringify(payMethodInfo))
          );
          this.$router.push(
            `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`
          );
          return;
        }
        if (val.payWayCode === "10001") {
          this.$router.push(`/creditCardConfig?configPaymentFrom=userPayment`);
        } else {
          paymentMethods.some((item) => {
            if (item.payWayCode == this.payMethodInfo.payWayCode) {
              this.$router.push(`${item.routerPath}`);
              return true;
            }
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" src="./index.scss" scoped></style>
