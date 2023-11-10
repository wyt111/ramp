<template>
  <div id="correspondPaymentMethod">
    <header>
      <div class="title">{{ $t(`buyPayWay.${cardTitle}`) }}</div>
      <div class="edit-icon">
        <div class="icon" @click="goback">
          <img src="@/assets/images/paymentMethod/left-icon.svg" alt="" />
        </div>

        <div
          class="edit"
          @click="edit"
          v-if="savedCard.length > 0 && payMethodInfo.payWayCode === '10001'"
        >
          {{ $t(`buyPayWay.${editText}`) }}
        </div>
      </div>
    </header>
    <!-- 国际卡新增和历史 -->
    <div
      class="cardView international-card"
      v-if="payMethodInfo.payWayCode === '10001'"
    >
      <!-- 历史卡信息 -->
      <div class="card-list">
        <div
          class="card-item"
          v-for="(item, index) in savedCard"
          :key="'savedCard' + index"
          :class="{ 'check-true': radioIndex === index }"
          @click="selectRadio(item, index)"
        >
          <div class="card-icon history-card-icon">
            <img :src="cardIcon(item)" />
          </div>
          <div class="card-item-info">
            <div>
              <div class="card-type">
                {{ cardType(item.cardNumber) }}
                <span
                  style="text-transform: lowercase"
                  v-show="cardType(item.cardNumber) === 'Master'"
                  >{{ $t("buyPayWay.card") }}</span
                >
              </div>
              <div class="card-num">
                <span>****</span
                >{{ item.cardNumber.substring(item.cardNumber.length - 4) }}
              </div>
            </div>
            <p class="payArrivalTime" v-if="item.settleTime">
              {{ item.settleTime | onSettleTime }}
            </p>
          </div>
          <div class="checkView">
            <div
              class="deleteIcon"
              v-if="item.deleteStatus"
              @click.stop="deleteCard(item, index)"
            >
              <img src="@/assets/images/paymentMethod/deleteIcon.svg" alt="" />
            </div>
            <div class="checkView-false" v-else></div>
          </div>
        </div>
      </div>
      <div class="cardLimit-tips" v-if="savedCard.length >= 6">
        {{ $t("buyPayWay.cardLimitTips") }}
      </div>
      <!-- 新增卡 -->
      <div
        class="cardView-line newCardView"
        @click="addCard"
        v-if="savedCard.length < 6"
      >
        <div class="card-icon">
          <img src="@/assets/images/paymentMethod/newCard1.svg" />
        </div>
        <div class="card-type">{{ $t("buyPayWay.useCardTitle") }}</div>
      </div>

      <div class="fromIcon">
        <div class="support">{{ $t("buyPayWay.support") }}</div>
        <img src="@/assets/images/paymentMethod/visa-saved-icon.svg" alt="" />
        <img src="@/assets/images/paymentMethod/master-saved-icon.svg" alt="" />
        <img
          v-if="fiat === 'RUB'"
          src="@/assets/images/paymentMethod/mir-check.svg"
          alt=""
        />
        <img src="@/assets/images/paymentMethod/diner.svg" alt="" />
        <img src="@/assets/images/paymentMethod/discover.png" alt="" />
      </div>
    </div>
    <!-- OVO、DANA、QRIS  payNow  payso-->
    <div
      class="cardView idr-cardView"
      v-else-if="
        ['eWallet', 'saas', 'Philippines', 'promptPay'].includes(
          payMethodInfo.name
        )
      "
    >
      <div
        class="idr-cardView-item"
        v-for="(item, index) in EWalletList"
        :key="'EWalletList' + index"
        @click="selectRadio(item, index)"
      >
        <div
          class="cardView-line IDRView"
          :class="{ 'check-true': radioIndex === index }"
          v-if="item.unavaible"
        >
          <div class="card-icon"><img :src="item.icon" /></div>
          <div class="card-type">
            <p>{{ item.payWayName }}</p>
            <p class="payArrivalTime" v-if="item.settleTime">
              {{ item.settleTime | onSettleTime }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 被限制的支付方式 -->

    <div class="unavaible-payment">
      <div class="unavaible-title" v-if="isUnavaibleTitle">
        {{ $t("buyPayWay.Unavaible") }}
      </div>
      <div class="unavaible-list">
        <div
          class="cardView"
          v-if="['eWallet', 'Philippines'].includes(payMethodInfo.name)"
        >
          <div
            class="unavaible-item"
            v-for="(item, index) in EWalletList"
            :key="'EWalletList' + index"
          >
            <div class="cardView-line IDRView" v-if="!item.unavaible">
              <div class="card-icon"><img :src="item.icon" /></div>
              <div class="checkView">
                <div class="card-type">{{ item.payWayName }}</div>
                <div class="limit">
                  <span>
                    {{ $t("buyPayWay.limit") }}:
                    <span class="limit-amount">
                      {{ item.minAmount }} {{ item.fiat }} -
                      {{ item.maxAmount }} {{ item.fiat }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Virtual Account -->
    <div
      class="cardView bank-cardView"
      v-if="payMethodInfo.payWayCode === '10003'"
    >
      <div
        class="cardView-line bankView"
        v-for="(item, index) in paymethodListVA"
        :key="'bankCardList' + index"
        :class="{ 'check-true': radioIndex === index }"
        @click="selectRadio(item, index)"
      >
        <div class="card-icon">
          <img :src="require(`@/assets/images/bankCard/${item.bankLogo}`)" />
        </div>
        <!-- paymentMethod -->
        <div class="card-type">
          <div class="card-type-number">
            <span class="cardType">{{ item.bankCardName }}</span>
            <span class="fullname"> {{ item.bankCardFullName }}</span>
          </div>
          <p class="payArrivalTime" v-if="item.settleTime">
            {{ item.settleTime | onSettleTime }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import valid from "card-validator";
import allBankCards from "@/assets/json/bankCardInfo";
import paymentMethods from "@/assets/json/paymentMethods.json";
import { querySubmitToken, getKycRule } from "@/utils/publicRequest";
import { AES_Encrypt } from "@/utils/encryp";
import i18n from "@/utils/i18n";

export default {
  name: "correspondPaymentMethod",
  props: ["allSavedCard"],
  data() {
    return {
      radioIndex: "",

      editText: "edit",

      //组件标题
      cardTitle: "",

      //所有历史信用卡
      savedCard: [],

      //OVO、DANA、QRIS
      EWalletList: [],
      //支付列表图片
      dataIcon: paymentMethods,
      //Virtual Account - 银行列表
      bankCardList: [],
      isUnavaibleTitle: false,
    };
  },
  filters: {
    onSettleTime(val) {
      return JSON.parse(val)[i18n.locale || "en-US"];
    },
  },
  watch: {
    allSavedCard() {
      this.savedCard = this.allSavedCard;
    },
  },
  computed: {
    ...mapState("cryptoBuyPage", {
      fiat: (state) => state.fiatCurrencyInfo.fiat,
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

    paymethodListVA() {
      //银行数据
      if (this.$parent.paymethodList && this.$parent.paymethodList.length > 0) {
        let allBankCardList = this.$parent.paymethodList.filter((item) => {
          return item.payWayCode === "10003";
        })[0];
        if (allBankCardList) {
          let newData = allBankCards.filter((item, index) => {
            allBankCards[index].payWayCode = "10003";
            allBankCards[index].payWayName = "Virtual Account";
            allBankCards[index].expire = allBankCardList.expire;
            allBankCards[index].settleTime = allBankCardList.settleTime;
            return item.allHelpTips.filter((value) => {
              return (value.openState = false);
            });
          });
          return newData;
        }
      }
      return [];
    },
  },
  mounted() {},
  activated() {
    this.isUnavaibleTitle = false;
    this.savedCard = this.allSavedCard;
    this.EWalletList =
      paymentMethods.filter((item) => {
        return item.type === "eWallet";
      }) || [];
  },
  methods: {
    initializationData(val) {
      this.$store.commit("buyPayments/set_payMethodInfo", val);
      this.radioIndex = "";
      this.$parent.radioIndex = "";
      if (this.payMethodInfo.payWayCode === "10001") {
        this.cardTitle = "creditCard";
      } else if (this.payMethodInfo.payWayCode === "10003") {
        this.cardTitle = "virtualAccount";
      } else {
        //针对所以支付列表
        this.cardTitle = val.name;
        let payList = val.allpayWayCode.split(",");
        this.EWalletList = this.$parent.paymethodList.filter((item) => {
          this.dataIcon.forEach((item1) => {
            if (item1.payWayCode === item.payWayCode && item1.icon) {
              item.icon = require("@/assets/images/paymentIcon/" + item1.icon);
            }
          });
          return payList.includes(item.payWayCode);
        });
      }
      // 是否显示被限制支付方式的title
      this.isShowTitle();
    },

    // 是否显示被限制支付方式的title
    isShowTitle() {
      // 信用卡不展示别显示支付方式
      if (this.payMethodInfo.name === "card") {
        this.isUnavaibleTitle = false;
        return;
      }
      if (this.EWalletList.length) {
        let arr = this.EWalletList.filter((item) => {
          return item.unavaible === false;
        });
        if (arr.length) {
          // return true;
          this.isUnavaibleTitle = true;
        } else {
          this.isUnavaibleTitle = false;
          // return false;
        }
      }
    },

    cardIcon(icon) {
      let validObject = valid.number(icon.cardNumber);
      if (
        icon.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "mastercard"
      ) {
        return require("@/assets/images/paymentMethod/master-saved-icon.svg");
      }
      if (
        icon.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "visa"
      ) {
        return require("@/assets/images/paymentMethod/visa-saved-icon.svg");
      }
      if (
        icon.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "mir"
      ) {
        return require("@/assets/images/paymentMethod/mir-check.svg");
      }
      if (
        icon.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "diners-club"
      ) {
        return require("@/assets/images/paymentMethod/diner.svg");
      }
      if (
        icon.cardNumber !== "" &&
        validObject.isValid &&
        validObject.card.type === "discover"
      ) {
        return require("@/assets/images/paymentMethod/discover.png");
      }
    },

    cardType(val) {
      let validObject = valid.number(val);
      if (
        val !== "" &&
        validObject.isValid &&
        validObject.card.type === "mastercard"
      ) {
        return "Master";
      }
      if (
        val !== "" &&
        validObject.isValid &&
        validObject.card.type === "visa"
      ) {
        return "Visa";
      }
      if (
        val !== "" &&
        validObject.isValid &&
        validObject.card.type === "mir"
      ) {
        return "Mir";
      }
      if (
        val !== "" &&
        validObject.isValid &&
        validObject.card.type === "diners-club"
      ) {
        return "Diners";
      }
      if (
        val !== "" &&
        validObject.isValid &&
        validObject.card.type === "discover"
      ) {
        return "Discover";
      }
    },

    //新增国际卡
    addCard() {
      //弹出显示
      let payMethodInfo = {
        payWayCode: "10001",
        payWayName: "addCard",
      };
      this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
      this.radioIndex = "";
      this.$parent.radioIndex = "";
      //存储商户订单号
      if (this.$route.query.orderNo) {
        this.$store.commit(
          "buyPayments/set_orderNo",
          this.$route.query.orderNo
        );
      }
      this.JumpRouter();
    },
    //创建订单
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

      //接入商户模式不需要创建订单
      if (this.$route.query.orderNo) {
        //存储订单号
        this.$store.commit(
          "buyPayments/set_orderNo",
          this.$route.query.orderNo
        );
        this.JumpRouter();
        return;
      }

      //二次支付
      if (this.$route.query.pathHistry === "tradeHistory") {
        //修改订单支付方式
        let params = {
          orderNo: this.buyPayment_secondPay.orderNo,
          payWayCode: this.payMethodInfo.payWayCode,
        };
        this.$axios
          .post(this.$api.post_updateOrderInfo, params, "")
          .then((val) => {
            if (val) {
              let querydata = { pathHistry: "tradeHistory" };
              this.JumpRouter(querydata);
            }
          });
        return;
      }

      this.$parent.request_loading = true;
      let submitToken = await querySubmitToken();
      if (submitToken === true) {
        //确认下单 获取订单id
        let buyParams = this.placeOrderQuery;
        buyParams.payWayCode = this.payMethodInfo.payWayCode;
        //Virtual Account入参添加银行code
        buyParams.payBankCode = this.payMethodInfo.bankCode;
        //存在商户信息将信息带入请求地址
        let urlQuery = "";
        let merchantType = sessionStorage.getItem("merchantType");
        if (
          this.merchantInfo &&
          this.merchantInfo.merchantStatus &&
          merchantType === "buy"
        ) {
          urlQuery = `?${this.merchantInfo.merchantFullPath}`;
          buyParams.merchantParam = this.merchantInfo.merchantFullPath;
        }
        this.$axios
          .post(this.$api.post_buy + urlQuery, buyParams, "submitToken")
          .then((res) => {
            if (res && res.data) {
              this.$store.commit("buyPayments/set_orderNo", res.data.orderNo);
              this.$store.commit("buyPayments/set_creditCardInfo", res.data);
              this.$store.state.buyRouterParams.kyc = res.data.kyc;
              this.JumpRouter();
            }
          })
          .catch(() => {
            this.$parent.request_loading = false;
          });
      } else {
        this.$parent.request_loading = false;
      }
    },

    async isNeedKyc(routeQuery) {
      let kycRule = await getKycRule(this.orderNo);
      if (kycRule === "1") {
        // onfido 验证方式
        this.JumpRouter_onfido(routeQuery);
      } else if (kycRule === "2") {
        // sumsub 验证方式
        this.JumpRouter_sumsub("", routeQuery);
      }
    },

    //根据支付方式 控制跳转路径
    async JumpRouter(val) {
      /**
       * 正常创建订单跳转流程
       */
      let fullName = localStorage.getItem("email");
      this.$store.commit("buyPayments/set_fullName", fullName);
      //SGD本土支付--没做
      if (["40001", "40002"].includes(this.payMethodInfo.payWayCode)) {
        this.isNeedKyc(val);
        return;
      }
      //选择历史信用卡支付
      if (
        (this.payMethodInfo.payWayName !== "addCard" &&
          this.payMethodInfo.payWayCode === "10001") ||
        ["40001", "40002"].includes(this.payMethodInfo.payWayCode)
      ) {
        let payMethodInfo = JSON.parse(JSON.stringify(this.payMethodInfo));
        let fullName = localStorage.getItem("email");
        this.$store.commit("buyPayments/set_fullName", fullName);
        payMethodInfo.cardNumber = AES_Encrypt(payMethodInfo.cardNumber);
        this.$store.commit(
          "buyPayments/set_userCardId",
          payMethodInfo.userCardId
        );
        this.$store.commit(
          "buyPayments/set_creditCardInfo",
          JSON.parse(JSON.stringify(payMethodInfo))
        );

        let kycRule = await getKycRule(this.orderNo);
        if (kycRule === "1") {
          // onfido 验证方式
          this.JumpRouter_onfido();
        } else if (kycRule === "2") {
          // sumsub 验证方式
          this.JumpRouter_sumsub();
        }
      }
      //新增信用卡--没做
      if (
        this.payMethodInfo.payWayName === "addCard" &&
        this.payMethodInfo.payWayCode === "10001" &&
        this.savedCard.length <= 6
      ) {
        //USD
        this.$parent.addNewCardShow = 2;
        this.$parent.request_loading = false;
        return;
      }
      //Virtual Account、Bank Transfer
      if (
        this.payMethodInfo.payWayCode === "10003" ||
        this.payMethodInfo.payWayCode === "601"
      ) {
        this.payMethodInfo.payWayCode === "10003"
          ? this.$store.commit(
              "buyPayments/set_payMethodInfo",
              this.payMethodInfo
            )
          : "";
        let routeQuery = val || {};
        this.$parent.request_loading = false;
        if (this.$route.query.orderNo) {
          routeQuery.orderNo = this.$route.query.orderNo;
        }
        this.isNeedKyc(routeQuery);
        return;
      }
      this.isNeedKyc(val);
    },

    JumpRouter_onfido(routeQuery) {
      let params = {
        orderAmount: this.placeOrderQuery.amount,
        fiat: this.placeOrderQuery.fiatCurrency,
        payType: this.payMethodInfo.payWayCode,
        businessType: 1,
      };
      this.$axios
        .post(this.$api.post_check, params, "")
        .then((res) => {
          try {
            if (
              (res.data.kycFlag == 1 || res.data.kycFlag == 2) &&
              res.data.userLevel == 2
            ) {
              // 需要做kyc 并且需要做的kyc等级是 2;
              localStorage.setItem("getKycTokenByOnfidoWay", "true");
              localStorage.setItem("kyc_info_onfido", JSON.stringify(res.data));
              this.JumpRouter_sumsub("kyc_onfido");
              return;
            }
            localStorage.removeItem("getKycTokenByOnfidoWay");
            if (res && res.data && res.data.kycFlag == 1) {
              let goKycUrl = "/kycVerify";

              if (["40001", "40002"].includes(this.payMethodInfo.payWayCode)) {
                this.$store.state.WhichPage = "/otherWayPay";
                goKycUrl = "/kycVerify?type=eWallet";
              } else if (["10001"].includes(this.payMethodInfo.payWayCode)) {
                this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`;
              } else {
                paymentMethods.some((item) => {
                  if (item.payWayCode == this.payMethodInfo.payWayCode) {
                    this.$store.state.WhichPage = item.routerPath;
                    return true;
                  }
                });
              }

              this.$parent.request_loading = false;
              this.$router.push(goKycUrl);
              return;
            } else if (res.data.kycFlag == 2) {
              if (["10001"].includes(this.payMethodInfo.payWayCode)) {
                this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`;
              } else {
                paymentMethods.some((item) => {
                  if (item.payWayCode == this.payMethodInfo.payWayCode) {
                    this.$store.state.WhichPage = item.routerPath;
                    return true;
                  }
                });
              }
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
                  let goUrl;
                  if (
                    ["40001", "40002"].includes(this.payMethodInfo.payWayCode)
                  ) {
                    goUrl = "/otherWayPay";
                  } else if (
                    ["10001"].includes(this.payMethodInfo.payWayCode)
                  ) {
                    goUrl = `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`;
                  } else {
                    paymentMethods.some((item) => {
                      if (item.payWayCode == this.payMethodInfo.payWayCode) {
                        this.$parent.request_loading = false;
                        this.$router.push({
                          path: item.routerPath,
                          query: routeQuery,
                        });
                        return true;
                      }
                    });
                  }

                  this.$parent.request_loading = false;
                  this.$router.push(goUrl);
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
    JumpRouter_sumsub(_type, routeQuery) {
      if (_type == "kyc_onfido") {
        //用户kyc信息存储
        let goKycUrl = "/kycVerification";
        if (["40001", "40002"].includes(this.payMethodInfo.payWayCode)) {
          this.$store.state.WhichPage = "/otherWayPay";
          goKycUrl = "/kycVerification?type=eWallet";
        } else if (["10001"].includes(this.payMethodInfo.payWayCode)) {
          this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`;
        } else {
          paymentMethods.some((item) => {
            if (item.payWayCode == this.payMethodInfo.payWayCode) {
              this.$store.state.WhichPage = item.routerPath;
              return true;
            }
          });
        }

        this.$parent.request_loading = false;
        this.$router.push(goKycUrl);
        return;
      }
      this.$axios
        .post(this.$api.post_getKycThrough, { orderNo: this.orderNo }, "")
        .then((res) => {
          if (
            res &&
            res.data &&
            res.data.isKyc === true &&
            res.data.kycLevel !== "3"
          ) {
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
            let goKycUrl = "/kycVerification";
            if (["40001", "40002"].includes(this.payMethodInfo.payWayCode)) {
              this.$store.state.WhichPage = "/otherWayPay";
              goKycUrl = "/kycVerification?type=eWallet";
            } else if (["10001"].includes(this.payMethodInfo.payWayCode)) {
              this.$store.state.WhichPage = `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`;
            } else {
              paymentMethods.some((item) => {
                if (item.payWayCode == this.payMethodInfo.payWayCode) {
                  this.$store.state.WhichPage = item.routerPath;
                  return true;
                }
              });
            }
            this.$parent.request_loading = false;
            this.$router.push(goKycUrl);
            return;
          }

          // 查询国籍和kyc验证信息是否一致
          let params = {
            payWayCode:
              this.payMethodInfo.payWayCode || this.placeOrderQuery.payWayCode,
          };
          this.$axios.get(this.$api.get_findUserDetail, params).then((res2) => {
            if ((!res2 && res2.returnCode !== "0000") || !res2.data) return;
            let pathHistry =
              this.$route.query.pathHistry === "tradeHistory"
                ? "?pathHistry=tradeHistory"
                : "";
            if (res2.data.isPassByPwcWorld === false) {
              this.$router.push(`/kyc-error-countryCheck${pathHistry}`);
              return;
            }
            let goUrl;
            if (["40001", "40002"].includes(this.payMethodInfo.payWayCode)) {
              goUrl = "/otherWayPay";
            } else if (["10001"].includes(this.payMethodInfo.payWayCode)) {
              goUrl = `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`;
            } else {
              paymentMethods.some((item) => {
                if (item.payWayCode == this.payMethodInfo.payWayCode) {
                  this.$parent.request_loading = false;
                  this.$router.push({
                    path: item.routerPath,
                    query: routeQuery,
                  });
                  return true;
                }
              });
            }
            this.$parent.request_loading = false;
            this.$router.push(goUrl);
          });
        })
        .catch(() => {
          this.$parent.request_loading = false;
        });
    },
    selectRadio(val, index) {
      //删除状态不可以选择历史卡信息
      if (this.editText === "edit") {
        this.radioIndex = index;
        this.$parent.radioIndex = index;
        val.name = this.cardTitle;
        this.$store.commit("buyPayments/set_payMethodInfo", val);
      }
    },

    //展示卡信息删除状态
    edit() {
      this.radioIndex = "";
      this.$parent.radioIndex = "";
      if (this.editText === "edit") {
        this.editText = "cancel";
        this.savedCard.forEach((item, index) => {
          this.savedCard[index].deleteStatus = true;
        });
        this.$forceUpdate();
        return;
      }
      this.editText = "edit";
      this.savedCard.forEach((item, index) => {
        this.savedCard[index].deleteStatus = false;
      });
      this.$forceUpdate();
    },
    deleteCard(val, index) {
      this.$axios
        .post(this.$api.post_deleteForm + val.userCardId, "", "")
        .then((res) => {
          if (res && res.data) {
            this.savedCard.splice(index, 1);
            this.$forceUpdate();
            this.$toast({
              duration: 3000,
              message: res.returnMsg,
            });
          }
        });
    },

    goback() {
      this.$store.commit("buyPayments/set_payMethodInfo", {});
      this.radioIndex = "";
      this.$parent.radioIndex = "";
      this.$parent.payMethodStatus = true;
    },
  },
  deactivated() {
    this.editText = "edit";
  },
};
</script>

<style lang="scss" src="./index.scss" scoped></style>
