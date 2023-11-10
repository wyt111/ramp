<template>
  <div id="internationalCardPay_box">
    <div id="internationalCardPay">
      <div class="view-content">
        <div class="form-tips">
          {{ $t("sellFormUserInfo.card_information") }}
        </div>
        <div class="formLine formLine_flex">
          <div class="formLine_flex_child">
            <div
              id="firstname"
              class="formContent"
              :class="{
                formContentError: paramsError.errorFirstname,
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
                @input="nameChange('first')"
                maxlength="32"
                :placeholder="'Martin'"
                @focus="inputFocus('firstname')"
                @blur="inputBlur('firstname')"
              />
            </div>
            <div class="errorTips" v-if="paramsError.errorFirstname">
              {{ $t("buyForm_components.nameTips") }}
            </div>
          </div>
          <div class="formLine_flex_child">
            <div
              id="lastname"
              class="formContent"
              :class="{
                formContentError: paramsError.errorLastname,
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
                @input="nameChange('last')"
                maxlength="32"
                :placeholder="'Christina'"
                @focus="inputFocus('lastname')"
                @blur="inputBlur('lastname')"
              />
            </div>
            <div class="errorTips" v-if="paramsError.errorLastname">
              {{ $t("buyForm_components.nameTips") }}
            </div>
          </div>
        </div>
        <div class="formLine">
          <div
            id="cardNumber"
            class="formContent"
            :class="{
              formContentError: paramsError.errorCard,
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
          <div class="errorTips cardNumberError" v-if="paramsError.errorCard">
            {{ $t("buyForm_components.cardNumTips") }}
          </div>
        </div>

        <!-- 手机号、出生日期 -->
        <div class="formLine">
          <div
            id="phone"
            class="formContent"
            :class="{
              formContentError: paramsError.errorPhone,
              formContentFocus: focusPhone,
            }"
          >
            <div class="formTitle">{{ $t("buyForm_components.phone") }}</div>
            <van-field
              class="number_input input-box"
              type="digit"
              v-model="params.phone"
              maxlength="32"
              @input="formDataChange('phone')"
              :placeholder="''"
              @focus="inputFocus('phone')"
              @blur="inputBlur('phone')"
            />
          </div>
          <div class="errorTips" v-if="paramsError.errorPhone">
            {{ $t("buyForm_components.phoneTips") }}
          </div>
        </div>
        <div class="formLine">
          <div
            id="birthDate"
            class="formContent"
            :class="{
              formContentError: paramsError.errorBirthDate,
              formContentFocus: focusBirthDate,
            }"
          >
            <div class="formTitle">
              {{ $t("buyForm_components.birthDate") }}
            </div>
            <van-field
              class="number_input input-box"
              :class="{ birthDate_true: params.birthDate.length > 0 }"
              v-model="params.birthDate"
              :readonly="true"
              @click="timePopup = true"
              @input="formDataChange('birthDate')"
              :placeholder="''"
              @focus="inputFocus('birthDate')"
              @blur="inputBlur('birthDate')"
            />
          </div>
          <div class="errorTips" v-if="paramsError.errorBirthDate">
            {{ $t("buyForm_components.birthDateTips") }}
          </div>
        </div>
        <div class="attention">
          {{ $t("sellFormPageTitle.Attention") }}:
          {{ $t("sellPayType.creditcard_form_tips") }}
        </div>
      </div>
    </div>

    <!-- 日期选择器 -->
    <van-popup
      class="time-popup"
      v-model="timePopup"
      round
      position="bottom"
      :style="{ height: '40%' }"
      @close="currentDate = new Date()"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :title="$t('buyForm_components.birthDate_select_title')"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmTime"
        @cancel="onCancelTime"
        :confirm-button-text="$t('buyForm_components.birthDate_select_confirm')"
        :cancel-button-text="$t('buyForm_components.birthDate_select_cancel')"
      />
    </van-popup>
  </div>
</template>

<script>
import valid from "card-validator";
import { mapState } from "vuex";
import moment from "moment";
import { AES_Decrypt, AES_Encrypt } from "@/utils/encryp.js";
import { getKycRule } from "@/utils/publicRequest";

export default {
  name: "International-card-payment",
  data() {
    return {
      params: {
        firstname: "",
        lastname: "",
        email: "",
        cardNumber: "",
        userAccountId: "",
        phone: "",
        birthDate: "",
      },

      //日期限制
      timePopup: false,
      minDate: new Date(1923, 1, 1),
      maxDate: new Date(),
      currentDate: new Date(),

      // 卡logo
      cardLogo: "",

      // 错误信息提示
      paramsError: {
        errorFirstname: false,
        errorLastname: false,
        errorCard: false,
        errorPhone: false,
        errorBirthDate: false,
      },

      focusFirstname: false,
      focusLastname: false,
      focusCard: false,
      focusPhone: false,
      focusBirthDate: false,

      // 按钮点击状态
      request_loading: false,
    };
  },
  computed: {
    ...mapState("cryptoBuyPage", {
      fiat: (state) => state.fiatCurrencyInfo.fiat,
    }),
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),
    ...mapState("sellCryptoMerchantAELF", {
      source: (state) => state.merchantInfo.source,
      merchantFullPathAELF: (state) => state.merchantFullPath,
      appId: (state) => state.merchantInfo.appId,
      merchantInfo_AELF: (state) => state.merchantInfo,
    }),
    ...mapState("cryptoSellPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoAmount: (state) => state.cryptoAmount,
    }),
    //历史卖币信息
    ...mapState("sellPayments", {
      history_cryptoInfo: (state) => state.cryptoInfo,
      history_cryptoAmount: (state) => state.cryptoAmount,
      history_fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      history_networkInfo: (state) => state.networkInfo,
    }),
    // 页面基本数据
    initData() {
      let data = {};
      if (this.$route.query.payWayCode || this.$route.query.emailFromPath) {
        data = {
          cryptoInfo: this.history_cryptoInfo,
          cryptoAmount: this.history_cryptoAmount,
          fiatCurrencyInfo: this.history_fiatCurrencyInfo,
          networkInfo: this.history_networkInfo,
        };
        return data;
      }
      data = {
        cryptoInfo: this.cryptoInfo,
        cryptoAmount: this.cryptoAmount,
        fiatCurrencyInfo: this.fiatCurrencyInfo,
        networkInfo: this.networkInfo,
      };
      return data;
    },
  },
  watch: {
    params: {
      deep: true,
      immediate: true,
      handler() {
        this.$emit("getDisabled", this.buttonState());
      },
    },
    paramsError: {
      deep: true,
      immediate: true,
      handler() {
        this.$emit("getDisabled", this.buttonState());
      },
    },
    request_loading: {
      immediate: true,
      handler(val) {
        this.$emit("getDisabled", this.buttonState());
        this.$emit("getRequest_loading", val);
      },
    },
    timePopup() {
      if (!this.timePopup) {
        this.inputBlur("birthDate");
      }
    },
  },
  activated() {
    //清空数据
    this.clearData();
  },
  methods: {
    formatter(value) {
      return value.replace(/[^a-zA-Z ]/g, "");
    },

    //选择日期
    onConfirmTime(val) {
      this.currentDate = val;
      this.params.birthDate = moment(val).format("YYYY-MM-DD");
      this.timePopup = false;
    },
    onCancelTime() {
      this.timePopup = false;
      this.currentDate = new Date();
    },

    nameChange(witch) {
      let patrn = /(.)\1\1/;
      if (witch === "first") {
        if (
          this.params.firstname.length < 2 ||
          patrn.exec(this.params.firstname) ||
          (this.params.firstname.length === 2 &&
            this.params.firstname.match(new RegExp(/(\w)\1+/g)))
        ) {
          this.paramsError.errorFirstname = true;
        } else {
          this.paramsError.errorFirstname = false;
        }
      } else if (witch === "last") {
        if (
          this.params.lastname.length < 2 ||
          patrn.exec(this.params.lastname) ||
          (this.params.lastname.length === 2 &&
            this.params.lastname.match(new RegExp(/(\w)\1+/g)))
        ) {
          this.paramsError.errorLastname = true;
        } else {
          this.paramsError.errorLastname = false;
        }
      }
      if (!this.params.firstname.length) {
        this.paramsError.errorFirstname = false;
      }
      if (!this.params.lastname.length) {
        this.paramsError.errorLastname = false;
      }
    },

    formDataChange(witch) {
      if (witch === "phone") {
        if (this.params.phone.length < 1 || this.params.phone.length > 32) {
          this.paramsError.errorPhone = true;
        } else {
          this.paramsError.errorPhone = false;
        }
      }
      if (!this.params.phone.length) {
        this.paramsError.errorPhone = false;
      }
    },

    inputFocus(eleId) {
      if (eleId === "firstname") {
        this.focusFirstname = true;
      } else if (eleId === "lastname") {
        this.focusLastname = true;
      } else if (eleId === "cardNumber") {
        this.focusCard = true;
      } else if (eleId === "phone") {
        this.focusPhone = true;
      } else if (eleId === "birthDate") {
        this.focusBirthDate = true;
      }
    },

    inputBlur(eleId) {
      if (eleId === "firstname") {
        // 失去焦点前判断是否正确
        this.focusFirstname = false;
        this.nameChange("first");
      } else if (eleId === "lastname") {
        // 失去焦点前判断是否正确
        this.focusLastname = false;
        this.nameChange();
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
          if (
            this.params.cardNumber !== "" &&
            validObject.isValid &&
            ["mastercard", "visa"].includes(validObject.card.type)
          ) {
            this.paramsError.errorCard = false;
          } else {
            this.paramsError.errorCard = true;
          }
        }
      } else if (eleId === "phone") {
        // 失去焦点前判断是否正确
        this.focusPhone = false;
        this.nameChange();
      } else if (eleId === "birthDate") {
        // 失去焦点前判断是否正确
        this.nameChange();
        this.focusBirthDate = false;
      }
    },

    cardChange(value) {
      //Add a space between every four digits of the credit card number
      if (value !== "" && value !== undefined) {
        this.params.cardNumber = value
          .replace(/\s/g, "")
          .replace(/....(?!$)/g, "$& ");
        //卡号验证
        let validObject = valid.number(this.params.cardNumber);
        if (
          this.params.cardNumber !== "" &&
          validObject.isValid &&
          ["mastercard", "visa"].includes(validObject.card.type)
        ) {
          this.paramsError.errorCard = false;
        } else if ([2, 4, 5, 3, 6].includes(Number(value.slice(0, 1)))) {
          this.paramsError.errorCard = false;
        } else {
          this.paramsError.errorCard = true;
        }
      } else {
        this.cardLogo = "";
        this.paramsError.errorCard = false;
      }

      // 判断卡类型
      let validObject = valid.number(value);
      if (
        value !== "" &&
        validObject.isValid &&
        validObject.card.type === "mastercard"
      ) {
        this.cardLogo = require("@/assets/images/cardIcons/masterIcon.png");
      }
      if (
        value !== "" &&
        validObject.isValid &&
        validObject.card.type === "visa"
      ) {
        this.cardLogo = require("@/assets/images/cardIcons/visaText.png");
      }
    },

    // kyc验证、保存卡信息、创建订单
    submitPay() {
      this.request_loading = true;
      let queryForm = JSON.parse(JSON.stringify(this.params));
      queryForm.name = queryForm.firstname.trim() + queryForm.lastname.trim();
      // 修改订单卡信息
      if (this.$route.query.payWayCode || this.$route.query.emailFromPath) {
        this.userAccountId = this.$route.query.userAccountId || "";
        this.saveCardInfo("changeOrderInfo");
        return;
      }
      this.isKyc(queryForm);
    },

    // 存储支付方式信息、支付信息
    storePayInfo() {
      // 支付信息
      let sellPayInfo = {
        bankAccountInfo: {}, // Bank Account表单
        userAccountId: this.params.userAccountId, // 历史表单id
        // 信用卡表单
        firstName: AES_Encrypt(this.params.firstname.trim()),
        lastName: AES_Encrypt(this.params.lastname.trim()),
        accountNumber: AES_Encrypt(this.params.cardNumber.replace(/ /g, "")),
        phone: AES_Encrypt(this.params.phone),
        birthDate: AES_Encrypt(this.params.birthDate.replace(/-/g, "")),
      };
      this.$store.commit("sellPayments/set_sellPayInfo", sellPayInfo);
      // 支付方式信息
      let sellPayType = {
        accountType: "2", // 1-Bank Account、2-Credit Card
        payWayCode: "10010", // 19000-Bank Account、10010-Credit Card
      };
      this.$store.commit("sellPayments/set_sellPayType", sellPayType);
    },

    // 保存卡信息
    saveCardInfo(state) {
      let _this = this;
      let params = {
        firstName: AES_Encrypt(this.params.firstname.trim()),
        lastName: AES_Encrypt(this.params.lastname.trim()),
        accountNumber: AES_Encrypt(this.params.cardNumber.replace(/ /g, "")),
        alpha2: this.initData.fiatCurrencyInfo.alpha2,
        userAccountId: this.params.userAccountId,
        fiat: this.initData.fiatCurrencyInfo.fiat,
        birthDate: AES_Encrypt(this.params.birthDate.replace(/-/g, "")),
        phone: AES_Encrypt(this.params.phone),
        accountType: 2,
        bankAccountInfo: {},
      };
      this.$axios
        .post(this.$api.post_sellPayInfo, params, "")
        .then((res) => {
          if (res && res.data) {
            // 修改订单卡信息
            if (state === "changeOrderInfo") {
              this.changeOrderInfo(res.data.userAccountId);
              return;
            }
            //创建订单
            _this.placeOrder(res.data.userAccountId);
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },

    // 创建订单
    async placeOrder(userAccountId) {
      let params = {
        cryptoCurrency: this.initData.cryptoInfo.crypto,
        sellVolume: this.initData.cryptoAmount,
        network: this.initData.networkInfo.network,
        alpha2: this.initData.fiatCurrencyInfo.alpha2,
        fiat: this.initData.fiatCurrencyInfo.fiat,
        userAccountId: userAccountId, //this.$store.state.cardInfoFromPath === 'configSell' ? '' : this.$store.state.sellOrderId,
        payWayCode: "10010",
      };
      //存在商户信息将信息带入请求地址
      let urlQuery = "";
      if (
        this.merchantInfo.merchantStatus &&
        this.merchantInfo.merchantFullPath
      ) {
        urlQuery = `?${this.merchantInfo.merchantFullPath}`;
      }
      if (this.source === "3") {
        urlQuery = this.merchantFullPathAELF;
      }
      this.$axios
        .post(this.$api.post_sellCreatePayOrder + urlQuery, params, "")
        .then((res) => {
          if (res && res.data) {
            //存储数据 加密字段
            let sellForm = {};
            // this.formJson.forEach(item => {
            //   sellForm[item.paramsName] = item.model;
            // });
            sellForm.name = AES_Encrypt(
              AES_Decrypt(this.params.firstname) +
                " " +
                AES_Decrypt(this.params.lastname)
            );
            sellForm.email = localStorage.getItem("email");
            sellForm.accountNumbe = AES_Encrypt(sellForm.cardNumber);
            sellForm.idNumber = AES_Encrypt(this.params.cardNumber);
            this.$store.state.sellForm = sellForm;
            this.$store.state.sellOrderId = res.data.orderId;
            this.$store.state.nextOrderState = 1;
            //跳转状态
            this.request_loading = false;

            if (
              this.source === "3" &&
              this.appId.toLowerCase() !=
                process.env.VUE_APP_AELF_APPID.toLowerCase()
            ) {
              window.location = this.merchantInfo_AELF.withdrawUrl;
            } else {
              this.$router.push(`/sellOrder?sellOrderId=${res.data.orderId}`);
            }

            return;
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },

    // 修改订单卡信息
    changeOrderInfo(userAccountId) {
      let params = {
        orderId: this.$route.query.orderId,
        userAccountId: userAccountId,
      };
      this.$axios
        .post(this.$api.post_sellUpdateOrderFormInfo, params, "")
        .then((res) => {
          if (res) {
            //存储数据 加密字段
            let sellForm = {};
            // this.formJson.forEach(item => {
            //   sellForm[item.paramsName] = item.model;
            // });
            sellForm.name = AES_Encrypt(
              AES_Decrypt(this.params.firstname) +
                " " +
                AES_Decrypt(this.params.lastname)
            );
            sellForm.email = localStorage.getItem("email");
            sellForm.accountNumbe = AES_Encrypt(sellForm.cardNumber);
            sellForm.idNumber = AES_Encrypt(this.params.cardNumber);
            this.$store.state.sellForm = sellForm;
            this.$store.state.sellOrderId = res.data.orderId;
            this.$store.state.nextOrderState = 1;
            //跳转状态
            this.request_loading = false;
            this.$router.push(`/sellOrder?sellOrderId=${res.data.orderId}`);
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },

    // kyc验证
    async isKyc(val) {
      // 存储支付信息
      this.storePayInfo();
      let kycRule = await getKycRule();
      if (kycRule === "1") {
        // onfido 验证方式
        this.isKyc_onfido(val);
      } else if (kycRule === "2") {
        // sumsub 验证方式
        this.isKyc_sumsub(val);
      }
    },
    isKyc_onfido(val) {
      let params = {
        payType: "10001",
        businessType: 2, // 卖币传2, 买币传1
      };
      this.$axios.post(this.$api.post_check, params, "").then((res) => {
        try {
          if (
            (res.data.kycFlag == 1 || res.data.kycFlag == 2) &&
            res.data.userLevel == 2
          ) {
            // 需要做kyc 并且需要做的kyc等级是 2;
            localStorage.setItem("getKycTokenByOnfidoWay", "true");
            localStorage.setItem("kyc_info_onfido", JSON.stringify(res.data));
            this.isKyc_sumsub(val, "kyc_onfido");
            return;
          } else {
            localStorage.removeItem("getKycTokenByOnfidoWay");
          }
        } catch (e) {
          console.log(e);
        }

        if ((res && res.data.kycFlag == 1) || res.data.kycFlag == 2) {
          this.$store.state.sellRouterParams.confirmParams = val;
          //存储数据 加密字段
          let sellForm = {};
          // this.formJson.forEach(item => {
          //   sellForm[item.paramsName] = item.model;
          // });

          this.$store.state.sellForm = sellForm;
          this.$store.state.sellOrderId = res.data.orderId;
          this.$store.commit("buyPayments/set_fullName", AES_Encrypt(val.name));
          this.$store.state.sellRouterParams.historyBack = "back";
          if (res.data.kycFlag == 1) {
            this.$router.push("/kycVerify");
          } else if (res.data.kycFlag == 2) {
            this.$router.push("/kycStatus");
          }
        } else if (res.data.kycFlag == 0) {
          this.saveCardInfo();
          this.$store.state.sellRouterParams.historyBack = "back";
        }
        this.request_loading = false;
      });
    },
    isKyc_sumsub(val, _type) {
      this.request_loading = true;

      if (_type == "kyc_onfido") {
        try {
          this.$store.state.sellRouterParams.confirmParams = val;
          //存储数据 加密字段
          let sellForm = {};
          // this.formJson.forEach(item => {
          //   sellForm[item.paramsName] = item.model;
          // });
          sellForm.name = AES_Encrypt(
            AES_Decrypt(this.params.firstname) +
              " " +
              AES_Decrypt(this.params.lastname)
          );
          sellForm.email = localStorage.getItem("email");
          sellForm.accountNumbe = AES_Encrypt(sellForm.cardNumber);
          sellForm.idNumber = AES_Encrypt(this.params.cardNumber);
          this.$store.state.sellForm = sellForm;

          this.$store.commit("buyPayments/set_fullName", AES_Encrypt(val.name));
          this.$store.state.sellRouterParams.historyBack = "back";
          this.request_loading = false;

          this.$router.push("/kycVerification");
        } catch (e) {
          console.log(e);
        }

        return;
      }

      let params = {
        amount: this.cryptoAmount * this.initData.cryptoInfo.cryptoToFiatPrice,
      };
      var FormData = require("form-data");
      var data = new FormData();
      data.append("amount", params.amount);

      this.$axios.post(this.$api.post_getKycStatus, data, "").then((res) => {
        if (res && res.data) {
          this.$store.commit("userInfo/set_kycInfo_levelIndex", "1");
          this.$store.commit("userInfo/set_kycInfo_kycTips", 1);

          this.$store.state.sellRouterParams.confirmParams = val;
          //存储数据 加密字段
          let sellForm = {};
          // this.formJson.forEach(item => {
          //   sellForm[item.paramsName] = item.model;
          // });
          sellForm.name = AES_Encrypt(
            AES_Decrypt(this.params.firstname) +
              " " +
              AES_Decrypt(this.params.lastname)
          );
          sellForm.email = localStorage.getItem("email");
          sellForm.accountNumbe = AES_Encrypt(sellForm.cardNumber);
          sellForm.idNumber = AES_Encrypt(this.params.cardNumber);
          this.$store.state.sellForm = sellForm;
          this.$store.state.sellOrderId = res.data.orderId;
          this.$store.commit("buyPayments/set_fullName", AES_Encrypt(val.name));
          this.$store.state.sellRouterParams.historyBack = "back";
          this.request_loading = false;
          this.$router.push("/kycVerification");
        } else {
          this.request_loading = false;
          this.saveCardInfo();
          this.$store.state.sellRouterParams.historyBack = "back";
        }
      });
    },

    // 初始化表单状态
    clearData() {
      this.params = {
        firstname: "",
        lastname: "",
        email: localStorage.getItem("email"),
        cardNumber: "",
        userAccountId: "",
        phone: "",
        birthDate: "",
      };
      this.paramsError.errorCard = false;
      this.errorTime = false;
      this.paramsError.errorFirstname = false;
      this.paramsError.errorLastname = false;
      this.paramsError.errorPhone = false;
      this.paramsError.errorBirthDate = false;
      this.cardLogo = "";
    },

    buttonState() {
      let validObject = valid.number(this.params.cardNumber);
      if (
        this.params.firstname !== "" &&
        this.params.lastname !== "" &&
        this.params.cardNumber !== "" &&
        this.params.phone !== "" &&
        this.params.birthDate !== "" &&
        this.paramsError.errorFirstname === false &&
        this.paramsError.errorLastname === false &&
        this.paramsError.errorCard === false &&
        this.paramsError.errorPhone === false &&
        this.paramsError.errorBirthDate === false &&
        this.request_loading === false &&
        validObject.isValid &&
        ["mastercard", "visa"].includes(validObject.card.type)
      ) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
//日期选择器
::v-deep .time-popup {
  position: absolute !important;
  padding-bottom: 0 !important;
}
::v-deep .van-picker {
  height: 100% !important;
  overflow: hidden;
}
::v-deep .van-picker__columns {
  //height: 80% !important
}

#birthDate {
  ::v-deep .input-box {
    .van-field__control {
      font-family: "HarmonyOS Sans";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.24rem;
      color: #252830;
      -webkit-text-fill-color: #252830;
      &::placeholder {
        font-family: "HarmonyOS Sans";
        font-style: normal;
        font-weight: 300;
        font-size: 0.16rem;
        line-height: 0.24rem;
        color: #b7bcc5;
        -webkit-text-fill-color: #b7bcc5;
      }
    }

    &.birthDate_true {
    }
  }
}

#internationalCardPay_box {
  height: 100%;
  #internationalCardPay {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .view-content {
      .form-tips {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.2rem;
        color: #5d636d;
        margin-bottom: 0.21rem;
      }
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
      .formLine {
        position: relative;
        margin-bottom: 0.24rem;
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
      .van-cell {
        padding: 0 !important;
        overflow: visible !important;
      }
      // 有值后输入框样式
      #cardNumber,
      #phone,
      #birthDate {
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

      .attention {
        background: rgba(255, 125, 0, 0.05);
        border-radius: 0.06rem;
        padding: 0.08rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.11rem;
        line-height: 0.15rem;
        color: #252830;
        margin-bottom: 0.24rem;
        border: 1px solid rgba(255, 125, 0, 0.15);
      }
    }
  }
  .footer {
    width: 100%;
    position: sticky;
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0 0rem;
    z-index: 999;
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
    }
  }
}
</style>
