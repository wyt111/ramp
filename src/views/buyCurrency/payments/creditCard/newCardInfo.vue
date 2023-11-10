<template>
  <div id="internationalCardPay_box">
    <div id="internationalCardPay" ref="box_ref" @scroll="handleScroll">
      <p class="internationalCardPay_box_title">
        {{ $t("buyForm_components.formTitle") }}
      </p>
      <div class="view-content" ref="form_ref">
        <div class="formLine formLine_flex">
          <div class="formLine_flex_child">
            <div
              id="firstname"
              class="formContent"
              :class="{
                formContentError: errorFirstname,
                formContentFocus: focusFirstname,
              }"
            >
              <div class="formTitle">
                {{ $t("buyForm_components.firstName") }}
              </div>
              <van-field
                class="number_input input-box"
                v-model="params.firstname"
                :formatter="formatter"
                @input="nameChange('first', 'input')"
                maxlength="50"
                :placeholder="'Martin'"
                @focus="inputFocus('firstname')"
                @blur="inputBlur('firstname')"
              />
            </div>
            <el-collapse-transition>
              <div class="errorTips" v-if="errorFirstname">
                {{ $t("buyForm_components.nameTips") }}
              </div>
            </el-collapse-transition>
          </div>

          <div class="formLine_flex_child">
            <div
              id="lastname"
              class="formContent"
              :class="{
                formContentError: errorLastname,
                formContentFocus: focusLastname,
              }"
            >
              <div class="formTitle">
                {{ $t("buyForm_components.lastName") }}
              </div>
              <van-field
                class="number_input input-box"
                v-model="params.lastname"
                :formatter="formatter"
                @input="nameChange('last', 'input')"
                maxlength="50"
                :placeholder="'Christina'"
                @focus="inputFocus('lastname')"
                @blur="inputBlur('lastname')"
              />
            </div>
            <el-collapse-transition>
              <div class="errorTips" v-if="errorLastname">
                {{ $t("buyForm_components.nameTips") }}
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <div class="formLine">
          <div
            id="cardNumber"
            class="formContent"
            :class="{
              formContentError: errorCard,
              formContentFocus: focusCard,
            }"
          >
            <div class="formTitle">
              {{ $t("buyForm_components.cardNumber") }}
            </div>
            <van-field
              class="number_input input-box"
              type="digit"
              v-model="params.cardNumber"
              @input="cardChange"
              maxlength="23"
              :placeholder="'1234 1234 1234 1234'"
              @focus="inputFocus('cardNumber')"
              @blur="inputBlur('cardNumber')"
              :right-icon="cardLogo"
            />
          </div>
          <!-- error tips -->
          <el-collapse-transition>
            <div class="errorTips cardNumberError" v-if="errorCard">
              {{ $t("buyForm_components.cardNumTips") }}
            </div>
          </el-collapse-transition>
        </div>

        <div class="formLine formLine_flex">
          <div class="formLine_flex_child">
            <div
              id="timeData"
              class="formContent"
              :class="{
                formContentError: errorTime,
                formContentFocus: focusTime,
              }"
            >
              <div class="formTitle">
                {{ $t("buyForm_components.expirationDate") }}
              </div>
              <div class="input-box">
                <input
                  type="text"
                  maxlength="7"
                  class="dataName"
                  v-model.trim="timeData"
                  @input="timeChange"
                  @blur="inputBlur('timeData')"
                  :placeholder="'MM/YY'"
                  @focus="inputFocus('timeData')"
                  @paste="onPaste"
                />
              </div>
            </div>
            <!-- error tips -->
            <el-collapse-transition>
              <div class="errorTips" v-if="errorTime">
                {{ $t("buyForm_components.dataTips") }}
              </div>
            </el-collapse-transition>
          </div>

          <div class="formLine_flex_child">
            <div
              id="cardCvv"
              class="formContent"
              :class="{
                formContentError: errorCvv,
                formContentFocus: focusCvv,
              }"
            >
              <div class="formTitle">{{ $t("buyForm_components.cvv") }}</div>
              <van-field
                class="number_input input-box"
                type="digit"
                @input="cvvChange('input')"
                v-model="params.cardCvv"
                maxlength="3"
                :placeholder="'123'"
                @focus="inputFocus('cardCvv')"
                @blur="inputBlur('cardCvv')"
                @paste="onPaste"
              />
            </div>
            <!-- error tips -->
            <el-collapse-transition>
              <div class="errorTips" v-if="errorCvv">
                {{ $t("buyForm_components.cvvTips") }}
              </div>
            </el-collapse-transition>
          </div>
        </div>

        <!-- tips icon -->
        <transition>
          <div class="downTips-icon" v-show="goDown_state" @click="goDown">
            <img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt="" />
          </div>
        </transition>
      </div>
    </div>
    <footer>
      <button
        class="continue"
        :disabled="buttonState"
        @click="submitPay"
        v-show="buttonIsShow"
        ref="button_ref"
      >
        {{ $t("nav.Confirm") }}
        <img
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
          v-if="!request_loading"
        />
        <button-loading v-else class="rightIcon" />
      </button>
      <powered-by />
    </footer>
  </div>
</template>

<script>
import { AES_Decrypt, AES_Encrypt } from "@/utils/encryp.js";
import valid from "card-validator";
import { querySubmitToken, getKycRule, getEmail } from "@/utils/publicRequest";
import { mapState } from "vuex";
export default {
  name: "International-card-payment",
  props: ["savedCard"],
  data() {
    return {
      params: {
        firstname: "",
        lastname: "",
        email: "",
        cardNumber: "",
        cardCvv: "",
        cardExpireYear: "",
        cardExpireMonth: "",
        source: 0,
      },

      timeData: "",
      oldTimeData: "",

      errorFirstname: false,
      errorLastname: false,
      errorCard: false,
      errorCvv: false,
      errorTime: false,

      focusFirstname: false,
      focusLastname: false,
      focusCard: false,
      focusCvv: false,
      focusTime: false,

      buttonIsShow: true,

      request_loading: false,

      goDown_state: false,
      oldOffsetTop: 0,
      timeDown: null,
      timeDown1: null,

      cardLogo: "", // 卡logo
    };
  },
  computed: {
    ...mapState("cryptoBuyPage", {
      fiat: (state) => state.fiatCurrencyInfo.fiat,
    }),
    ...mapState("buyPayments", {
      userCardId: (state) => state.userCardId,
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      placeOrderQuery: (state) => state.placeOrderQuery,
    }),
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
    }),
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),

    buttonState() {
      const { firstname, lastname, cardNumber, cardCvv } = this.params;
      const timeData = this.timeData;
      const patrn = /(.)\1\1/;
      let isInvalidFirstName =
        firstname.length < 2 ||
        patrn.exec(firstname) ||
        (firstname.length === 2 && firstname.match(new RegExp(/(\w)\1+/g)));

      let isInvalidLastName =
        lastname.length < 2 ||
        patrn.exec(lastname) ||
        (lastname.length === 2 && lastname.match(new RegExp(/(\w)\1+/g)));

      let validObject = valid.number(cardNumber);

      let isInvalidCardNumber =
        cardNumber === "" ||
        !validObject.isValid ||
        !["mastercard", "visa", "mir", "diners-club", "discover"].includes(
          validObject.card.type
        );

      let isInvalidCardCvv = cardCvv.length < 3;

      const expirationDateRegex = /^(0[1-9]|1[0-2])\s{1}\/\s{1}\d{2}$/;

      let isInvalidTimeData;

      if (expirationDateRegex.test(timeData)) {
        let month = new Date().getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }

        let currentTime = new Date().getFullYear() + "-" + month;

        let _timeDate =
          "20" + timeData.substring(5, 7) + "-" + timeData.substring(0, 2);
        if (
          Date.parse(new Date(_timeDate)) < Date.parse(new Date(currentTime))
        ) {
          isInvalidTimeData = true;
        }
      } else {
        isInvalidTimeData = true;
      }

      if (
        isInvalidFirstName ||
        isInvalidLastName ||
        isInvalidCardNumber ||
        isInvalidCardCvv ||
        isInvalidTimeData ||
        this.request_loading
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  activated() {
    //初始化根据可视高度控制向下提示按钮状态
    this.$nextTick(() => {
      if (
        this.$refs.box_ref.offsetHeight + 4 <
        document.getElementById("internationalCardPay").scrollHeight - 50
      ) {
        this.goDown_state = true;
      } else {
        this.goDown_state = false;
      }
    });
    //清空数据
    this.clearData();
  },
  watch: {
    //Enter date limit manually - Store value before change
    timeData(val, oldVal) {
      this.oldTimeData = oldVal;
    },
  },
  methods: {
    onPaste(event) {
      event.preventDefault();
      this.$toast({
        duration: 3000,
        message: this.$t("buyForm_components.paste_tips"),
        className: "paste_tips_toast",
      });
    },
    formatter(value) {
      return value.replace(/[^a-zA-Z ]/g, "");
    },

    // Enter date limit manually
    timeChange(event) {
      const expirationDateRegex = /^(0[1-9]|1[0-2])\s{1}\/\s{1}\d{2}$/;
      const monthRegex = /^(0?[1-9]|1[0-2])$/;

      this.timeData = this.timeData.replace(/[^0-9/\s]/g, "");

      if (
        this.timeData.length == 2 &&
        monthRegex.test(this.timeData) &&
        event.data !== null
      ) {
        this.timeData += " / ";
      }

      if (!this.timeData.trim()) {
        this.errorTime = false;
        return;
      }
      if (expirationDateRegex.test(this.timeData)) {
        let month = new Date().getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }

        let currentTime = new Date().getFullYear() + "-" + month;
        let timeDate =
          "20" +
          this.timeData.substring(5, 7) +
          "-" +
          this.timeData.substring(0, 2);
        if (
          Date.parse(new Date(timeDate)) >= Date.parse(new Date(currentTime))
        ) {
          this.errorTime = false;
        }
      }
    },

    nameChange(witch, type) {
      let patrn = /(.)\1\1/;
      if (witch === "first") {
        if (
          this.params.firstname.length < 2 ||
          patrn.exec(this.params.firstname) ||
          (this.params.firstname.length === 2 &&
            this.params.firstname.match(new RegExp(/(\w)\1+/g)))
        ) {
          if (type === "blur") {
            this.errorFirstname = true;
          }
        } else {
          this.errorFirstname = false;
        }
      } else if (witch === "last") {
        if (
          this.params.lastname.length < 2 ||
          patrn.exec(this.params.lastname) ||
          (this.params.lastname.length === 2 &&
            this.params.lastname.match(new RegExp(/(\w)\1+/g)))
        ) {
          if (type === "blur") {
            this.errorLastname = true;
          }
        } else {
          this.errorLastname = false;
        }
      }
      if (!this.params.firstname.length) {
        this.errorFirstname = false;
      }
      if (!this.params.lastname.length) {
        this.errorLastname = false;
      }
    },

    inputFocus(eleId) {
      if (eleId === "firstname") {
        this.focusFirstname = true;
      } else if (eleId === "lastname") {
        this.focusLastname = true;
      } else if (eleId === "cardNumber") {
        this.focusCard = true;
      } else if (eleId === "timeData") {
        this.focusTime = true;
      } else if (eleId === "cardCvv") {
        this.focusCvv = true;
      }
    },

    timeBlur() {
      const expirationDateRegex = /^(0[1-9]|1[0-2])\s{1}\/\s{1}\d{2}$/;

      if (!this.timeData.trim()) {
        this.errorTime = false;
        return;
      }
      if (expirationDateRegex.test(this.timeData)) {
        let month = new Date().getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }

        let currentTime = new Date().getFullYear() + "-" + month;
        let timeDate =
          "20" +
          this.timeData.substring(5, 7) +
          "-" +
          this.timeData.substring(0, 2);

        if (
          Date.parse(new Date(timeDate)) >= Date.parse(new Date(currentTime))
        ) {
          this.errorTime = false;
        } else {
          this.errorTime = true;
        }
      } else {
        this.errorTime = true;
      }
    },

    inputBlur(eleId) {
      if (eleId === "firstname") {
        this.focusFirstname = false;
        // 失去焦点前判断是否正确
        this.nameChange("first", "blur");
      } else if (eleId === "lastname") {
        this.focusLastname = false;
        // 失去焦点前判断是否正确
        this.nameChange("last", "blur");
      } else if (eleId === "cardNumber") {
        this.focusCard = false;

        if (
          this.params.cardNumber !== "" &&
          this.params.cardNumber !== undefined
        ) {
          this.params.cardNumber = this.params.cardNumber
            .replace(/\s/g, "")
            .replace(/....(?!$)/g, "$& ");
          //卡号验证
          let validObject = valid.number(this.params.cardNumber);
          const payMethodInfo = {
            payWayCode: "10001",
            ...this.params,
          };
          this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
          try {
            if (
              this.params.cardNumber !== "" &&
              validObject.isValid &&
              ["mastercard", "visa", "mir", "diners-club", "discover"].includes(
                validObject.card.type
              )
            ) {
              this.errorCard = false;
              this.cardLogo = "";
              const cardTypeMap = {
                mastercard: require("@/assets/images/cardIcons/masterIcon.svg"),
                visa: require("@/assets/images/cardIcons/visaText.svg"),
                mir: require("@/assets/images/cardIcons/mir-form.svg"),
                "diners-club": require("@/assets/images/cardIcons/diner.svg"),
                discover: require("@/assets/images/cardIcons/discover.png"),
              };

              const cardType = validObject.card.type;
              if (cardTypeMap[cardType]) {
                this.cardLogo = cardTypeMap[cardType];
              }
            } else {
              this.errorCard = true;
              this.cardLogo = require("@/assets/images/cardIcons/cardError.svg");
            }
          } catch (e) {
            console.log(e);
          }
        }
      } else if (eleId === "timeData") {
        this.focusTime = false;
        this.timeBlur();
      } else if (eleId === "cardCvv") {
        this.focusCvv = false;
        this.cvvChange("blur");
      }
    },

    cardChange(value) {
      if (value !== "" && value !== undefined) {
        this.params.cardNumber = value
          .replace(/\s/g, "")
          .replace(/....(?!$)/g, "$& ");
        //卡号验证
        let validObject = valid.number(this.params.cardNumber);

        if (
          this.params.cardNumber !== "" &&
          validObject.isValid &&
          ["mastercard", "visa", "mir", "diners-club", "discover"].includes(
            validObject.card.type
          )
        ) {
          this.errorCard = false;
          this.cardLogo = "";
        } else {
          /* this.errorCard = true;
          this.cardLogo = require('@/assets/images/cardIcons/cardError.svg');*/
        }
      } else {
        this.cardLogo = "";
        this.errorCard = false;
      }

      let validObject = valid.number(value);
      const cardTypeMap = {
        mastercard: require("@/assets/images/cardIcons/masterIcon.svg"),
        visa: require("@/assets/images/cardIcons/visaText.svg"),
        mir: require("@/assets/images/cardIcons/mir-form.svg"),
        "diners-club": require("@/assets/images/cardIcons/diner.svg"),
        discover: require("@/assets/images/cardIcons/discover.png"),
      };
      if (value !== "" && validObject.isValid) {
        const cardType = validObject.card.type;
        if (cardTypeMap[cardType]) {
          this.cardLogo = cardTypeMap[cardType];
        }
      }
    },

    //CVV验证
    cvvChange(type) {
      if (this.params.cardCvv.length < 3) {
        if (type == "blur") {
          this.errorCvv = true;
        }
      } else {
        this.errorCvv = false;
      }
      if (!this.params.cardCvv.length) {
        this.errorCvv = false;
      }
    },

    //验证、提交卡信息
    submitPay() {
      this.request_loading = true;
      //二次支付
      if (this.$route.query.pathHistry === "tradeHistory") {
        //修改订单支付方式
        let params = {
          orderNo: this.buyPayment_secondPay.orderNo,
          payWayCode: "10001",
        };
        this.$axios
          .post(this.$api.post_updateOrderInfo, params, "")
          .then((_res) => {
            if (_res) {
              this.saveCardInfo();
            }
          })
          .catch(() => {
            this.request_loading = false;
          });
        return;
      }

      this.saveCardInfo();
    },

    //保存卡信息
    saveCardInfo() {
      let _this = this;
      //卡号验证
      let cardNumber = this.params.cardNumber.replace(/\s*/g, "");
      //拼接年月日期参数
      this.params.cardExpireMonth = this.timeData.substring(0, 2);
      this.params.cardExpireYear = "20" + this.timeData.substring(5, 7);
      //需要加密的敏感字段
      let queryParams = JSON.parse(JSON.stringify(this.params));
      queryParams.cardNumber = AES_Encrypt(cardNumber).replace(/ /g, "");
      queryParams.cardCvv = AES_Encrypt(queryParams.cardCvv);
      queryParams.firstname = AES_Encrypt(queryParams.firstname.trim());
      queryParams.lastname = AES_Encrypt(queryParams.lastname.trim());
      const { enc_email } = getEmail(localStorage.getItem("email"));
      queryParams.email = enc_email;
      queryParams.source = 0;
      queryParams.failCode ? delete queryParams.failCode : "";
      // console.log('queryParams', queryParams);
      this.$axios
        .post(this.$api.post_saveCardInfo, queryParams, "")
        .then((res) => {
          if (res && res.data) {
            //存储信用卡信息id
            this.$store.commit(
              "buyPayments/set_userCardId",
              res.data.userCardId
            );
            //存储信用卡name全称
            this.$store.commit(
              "buyPayments/set_fullName",
              AES_Encrypt(
                AES_Decrypt(res.data.firstName) +
                  " " +
                  AES_Decrypt(res.data.lastName)
              )
            );
            //存储信用卡信息
            queryParams.userCardId = res.data.userCardId;
            _this.$store.commit("buyPayments/set_creditCardInfo", queryParams);
            //二次支付修改卡信息直接去历史订单页
            //二次支付新增卡和选择支付方式新增卡时 直接跳确认订单 未作kyc
            if (this.$route.query.pathHistry === "tradeHistory") {
              this.$router
                .push(`/creditCardConfig?pathHistry=tradeHistory`)
                .then(() => {
                  this.request_loading = false;
                });
              return;
            }
            //api商户不需要创建订单
            if (this.$route.query.orderNo) {
              this.isKyc();
              return;
            }
            //创建订单
            _this.placeOrder(queryParams);
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },

    //创建订单
    async placeOrder() {
      let submitToken = await querySubmitToken();
      if (submitToken === true && this.$parent.request_loading === false) {
        this.$parent.request_loading = true;
        //确认下单 获取订单id
        let buyParams = this.placeOrderQuery;
        buyParams.payWayCode = "10001";
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
              //存储订单号
              this.$store.commit("buyPayments/set_orderNo", res.data.orderNo);
              this.isKyc();
            }
          })
          .catch(() => {
            this.request_loading = false;
            this.$parent.request_loading = false;
          });
      } else {
        this.request_loading = false;
        this.$parent.request_loading = false;
      }
    },

    //kyc验证
    async isKyc() {
      let kycRule = await getKycRule(this.orderNo);
      if (kycRule === "1") {
        // onfido 验证方式
        this.isKyc_onfido();
      } else if (kycRule === "2") {
        // sumsub 验证方式
        this.isKyc_sumsub();
      }
    },
    isKyc_onfido() {
      let params = {
        orderAmount: this.placeOrderQuery.amount,
        fiat: this.placeOrderQuery.fiatCurrency,
        payType: this.payMethodInfo.payWayCode,
        businessType: 1,
      };
      let _this = this;
      this.$axios
        .post(this.$api.post_check, params, "")
        .then((_res) => {
          try {
            if (
              (_res.data.kycFlag == 1 || _res.data.kycFlag == 2) &&
              _res.data.userLevel == 2
            ) {
              // 需要做kyc 并且需要做的kyc等级是 2;
              localStorage.setItem("getKycTokenByOnfidoWay", "true");
              localStorage.setItem(
                "kyc_info_onfido",
                JSON.stringify(_res.data)
              );
              this.isKyc_sumsub("kyc_onfido");
              return;
            } else {
              localStorage.removeItem("getKycTokenByOnfidoWay");
            }
          } catch (e) {
            console.log(e);
          }

          if (_res && _res.data) {
            this.clearData();

            if (_res.data.kycFlag == 1) {
              _this.$store.state.WhichPage = `/creditCardConfig?orderNo=${this.orderNo}`;
              _this.$router.push("/kycVerify").then(() => {
                this.request_loading = false;
              });
              return;
            } else if (_res.data.kycFlag == 2) {
              _this.$store.state.WhichPage = `/creditCardConfig?orderNo=${this.orderNo}`;

              _this.$router.push("/kycStatus").then(() => {
                this.request_loading = false;
              });
            } else if (_res.data.kycFlag == 0) {
              //卡隐藏
              //填完卡的过度动画
              this.$parent.addNewCardShow = 3;
              this.$parent.$refs.addNewCard.style = "";
              this.timeDown1 = setTimeout(() => {
                this.$parent.$refs.addNewCard.style =
                  "transition:0;transform: translate(0,100%);";
              }, 600);
              let goUrl = `/creditCardConfig`;
              if (
                this.merchantInfo.merchantStatus &&
                this.merchantInfo.merchantType === "api"
              ) {
                goUrl = `/creditCardConfig?orderNo=${this.orderNo}`;
              }
              this.$router.push(goUrl).then(() => {
                this.request_loading = false;
              });
            }
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },
    isKyc_sumsub(_type) {
      let _this = this;

      if (_type == "kyc_onfido") {
        this.clearData();
        _this.$store.state.WhichPage = `/creditCardConfig?orderNo=${this.orderNo}`;
        _this.$router.push("/kycVerification").then(() => {
          this.request_loading = false;
        });
        return;
      }
      //是否验证过baseId
      this.$axios
        .post(this.$api.post_getKycThrough, { orderNo: this.orderNo }, "")
        .then((_res) => {
          if (_res && _res.data) {
            this.clearData();
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
              _this.$store.state.WhichPage = `/creditCardConfig?orderNo=${this.orderNo}`;
              _this.$router.push("/kycVerification").then(() => {
                this.request_loading = false;
              });
              return;
            }
            //卡隐藏
            //填完卡的过度动画
            this.$parent.addNewCardShow = 3;
            this.$parent.$refs.addNewCard.style = "";
            this.timeDown1 = setTimeout(() => {
              this.$parent.$refs.addNewCard.style =
                "transition:0;transform: translate(0,100%);";
            }, 600);
            let goUrl = `/creditCardConfig`;
            if (
              this.merchantInfo.merchantStatus &&
              this.merchantInfo.merchantType === "api"
            ) {
              goUrl = `/creditCardConfig?orderNo=${this.orderNo}`;
            }
            this.$router.push(goUrl).then(() => {
              this.request_loading = false;
            });
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },

    clearData() {
      this.params = {
        firstname: "",
        lastname: "",
        email: localStorage.getItem("email"),
        cardNumber: "",
        cardCvv: "",
        cardExpireYear: "",
        cardExpireMonth: "",
        source: 0,
      };
      this.timeData = "";
      this.errorCard = false;
      this.errorCvv = false;
      this.errorTime = false;
      this.errorFirstname = false;
      this.errorLastname = false;
      this.cardLogo = "";
    },

    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll(val) {
      window.clearTimeout(this.timeDown);
      this.timeDown = null;
      let offset = this.$refs.button_ref.getBoundingClientRect();

      //滚动的像素+容器的高度>可滚动的总高度-50像素
      if (
        this.oldOffsetTop !== offset.top &&
        val.srcElement.scrollTop + val.srcElement.offsetHeight <
          val.srcElement.scrollHeight - 50
      ) {
        this.goDown_state = false;
        window.clearTimeout(this.timeDown);
        this.timeDown = null;
        this.timeDown = setTimeout(() => {
          this.goDown_state = true;
        }, 1000);
      }

      if (
        val.srcElement.scrollTop + val.srcElement.offsetHeight >
        val.srcElement.scrollHeight - 50
      ) {
        window.clearTimeout(this.timeDown);
        this.timeDown = null;
        this.goDown_state = false;
      }
      this.oldOffsetTop = offset.top;
    },
    goDown() {
      setTimeout(() => {
        this.$refs.button_ref.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
        this.goDown_state = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#internationalCardPay_box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.internationalCardPay_box_title {
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 700;
  font-size: 0.18rem;
  line-height: 0.22rem;
  color: #252830;
  margin-bottom: 0.33rem;
}

#internationalCardPay {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0.16rem;

  .view-content {
    .errorTips {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.13rem;
      line-height: 0.18rem;
      color: #f53f3f;
      margin-top: 0.02rem;
    }
    .cardNumberError {
      margin-bottom: 0.06rem;
    }
  }
  .formLine {
    position: relative;
    margin-bottom: 0.25rem;
    .formContent {
      display: flex;
      height: 0.48rem;
      width: 100%;
      position: relative;
      .formTitle {
        position: absolute;
        left: 0.07rem;
        top: -0.09rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.13rem;
        line-height: 0.18rem;
        color: #5d636d;
        z-index: 1;
        padding: 0 0.04rem;
        background: #fff;
      }
      .input-box {
        width: 100%;
        height: 100%;
        border: 1px solid #dbdee3;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
        border-radius: 0.06rem;
        overflow: hidden;
      }

      input.dataName {
        min-height: 0;
        height: 0.46rem;
        width: 100%;
        font-family: "HarmonyOS Sans";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.24rem;
        color: #252830;
        border: 0;
        outline: 0;
        padding: 0 0.12rem;

        &::placeholder {
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 300;
          font-size: 0.16rem;
          line-height: 0.24rem;
          color: #b7bcc5;
        }
      }

      .rightIcon {
        display: flex;
        position: absolute;
        top: 0.23rem;
        right: 0.2rem;
        img {
          width: 0.12rem;
        }
      }
      .loadingIcon {
        top: 0.15rem;
      }
      &:hover {
        .input-box {
          border-color: #babfc8;
        }
      }
      &.formContentFocus {
        .formTitle {
          color: #0059da;
        }
        .input-box {
          border-color: #0059da;
          // box-shadow: 0 0 0px 0.02rem rgba(0, 89, 218, 0.3);
        }
      }

      &.formContentError {
        .formTitle {
          color: #f53f3f;
        }
        .input-box {
          border-color: #f53f3f;
          box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
        }
      }
    }
  }
  .formLine_flex {
    display: flex;
    justify-content: space-between;
    .formLine_flex_child {
      position: relative;
      width: 1.64rem;
    }
  }

  .downTips-icon {
    position: absolute;
    bottom: 0.8rem;
    left: 45%;
    width: 0.5rem;
    height: 0.36rem;
    background: rgba(0, 128, 247, 0.24);
    box-shadow: 0 0 0.15rem rgba(65, 184, 253, 0.25);
    border-radius: 0.18rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img {
      width: 0.2rem;
    }
  }
  .downTips-icon img {
    animation: jumpBoxHandler 1.8s infinite;
    /* 1.8s 事件完成时间周期 infinite无限循环 */
  }
  .v-enter-active,
  .v-leave-active {
    transition: all 1s;
  }
  .v-enter,
  .v-leave-to {
    opacity: 0;
  }
  .v-enter-to,
  .v-leave {
    opacity: 1;
  }

  @keyframes jumpBoxHandler {
    /* css事件 */
    0% {
      transform: translate(0px, 0);
    }
    50% {
      transform: translate(0px, 0.06rem);
      /* 可配置跳动方向 */
    }
    100% {
      transform: translate(0px, 0px);
    }
  }
}

.loadingIcon {
  font-size: 0.24rem;
}

//数字输入框
.van-cell {
  padding: 0 !important;
  overflow: visible !important;
}

.number_input :deep(.van-field__body) {
  overflow: visible !important;
}
.number_input :deep(.van-cell__value) {
  overflow: visible !important;
}
.number_input :deep(.van-field__control:focus) {
  // border: 1px solid #6e7687;
  // box-shadow: 0px 0px 35px rgba(89, 153, 248, 0.2);
}
.continue {
  width: 3.43rem;
  margin: 0 auto;
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
.input-box {
  ::v-deep .van-field__control {
    min-height: 0;
    height: 0.46rem;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 500;
    font-size: 0.16rem;
    line-height: 0.24rem;
    color: #252830;
    padding: 0 0.12rem;
    border: none;
    &::placeholder {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 300;
      font-size: 0.16rem;
      line-height: 0.24rem;
      color: #b7bcc5;
    }
  }
}
// 有值后输入框样式
#cardNumber,
#cardCvv {
  ::v-deep .van-field__control {
    font-family: "HarmonyOS Sans";
    &::placeholder {
      font-family: "HarmonyOS Sans";
    }
  }

  ::v-deep .van-field__right-icon {
    position: absolute;
    right: 0.16rem;
    top: 50%;
    transform: translateY(-50%);
    padding: 0;
    margin: 0;
    width: 0.36rem;
    height: 0.24rem;
    border-radius: 0.03rem;
    box-shadow: 0 0 0 0.75px #dbdee3;
    overflow: hidden;
    img {
      width: 0.36rem;
      height: 0.24rem;
      display: block;
    }
  }

  &.formContentError {
    ::v-deep .van-field__right-icon {
      position: absolute;
      right: 0.16rem;
      top: 50%;
      transform: translateY(-50%);
      padding: 0;
      margin: 0;
      width: 0.16rem;
      height: 0.16rem;
      box-shadow: none;

      img {
        width: 0.16rem;
        height: 0.16rem;
        display: block;
      }
    }
  }
}
</style>
<style>
.van-overlay {
  background-color: rgba(0, 0, 0, 0);
}
</style>
