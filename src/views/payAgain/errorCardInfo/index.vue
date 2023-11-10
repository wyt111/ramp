<template>
  <div id="errorCardInfo_box">
    <div id="errorCardInfo" ref="box_ref">
      <div class="view-content" ref="form_ref">
        <div class="formLine formLine_flex">
          <div class="formLine_flex_child">
            <div
              id="firstname"
              class="formContent"
              :class="{
                formContentError: NameErrorMsg || formError.firstname,
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
              <div class="errorTips" v-if="formError.firstname">
                {{ $t("buyForm_components.nameTips") }}
              </div>
            </el-collapse-transition>
            <el-collapse-transition>
              <div class="errorTips" v-if="NameErrorMsg">
                *{{ $t("buyForm_components.NameError") }}
              </div>
            </el-collapse-transition>
          </div>

          <div class="formLine_flex_child">
            <div
              id="lastname"
              class="formContent"
              :class="{
                formContentError: formError.lastname,
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
              <div class="errorTips" v-if="formError.lastname">
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
              formContentError: formError.cardNumber || cardMsgError,
              formContentFocus: focusCard,
            }"
          >
            <div class="formTitle">
              {{ $t("buyForm_components.cardNumber") }}
            </div>
            <van-field
              class="number_input input-box cardNumber_input"
              :formatter="cardFormatter"
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
            <div class="errorTips cardNumberError" v-if="formError.cardNumber">
              {{ $t("buyForm_components.cardNumTips") }}
            </div>
          </el-collapse-transition>
          <el-collapse-transition>
            <div class="errorTips" v-if="cardMsgError">
              *{{ $t("buyForm_components.cardNumTips") }}
            </div>
          </el-collapse-transition>
        </div>

        <div class="formLine formLine_flex">
          <div class="formLine_flex_child">
            <div
              id="timeData"
              class="formContent"
              :class="{
                formContentError: formError.timeData || timeMsgError,
                formContentFocus: focusTime,
              }"
            >
              <div class="formTitle">
                {{ $t("buyForm_components.expirationDate") }}
              </div>
              <div class="input-box">
                <input
                  type="text"
                  class="dataName"
                  v-model="timeData"
                  @input="timeChange"
                  @blur="inputBlur('timeData')"
                  @keyup.delete="timeDelete"
                  maxlength="7"
                  :placeholder="'MM/YY'"
                  @focus="inputFocus('timeData')"
                />
              </div>
            </div>
            <!-- error tips -->
            <el-collapse-transition>
              <div class="errorTips" v-if="formError.timeData">
                {{ $t("buyForm_components.dataTips") }}
              </div>
            </el-collapse-transition>
            <el-collapse-transition>
              <div class="errorTips" v-if="timeMsgError">
                *{{ $t("buyForm_components.dataTips") }}
              </div>
            </el-collapse-transition>
          </div>

          <div class="formLine_flex_child">
            <div
              id="cardCvv"
              class="formContent"
              :class="{
                formContentError: formError.cardCvv,
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
              <div class="errorTips" v-if="formError.cardCvv">
                {{ $t("buyForm_components.cvvTips") }}
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AES_Decrypt, AES_Encrypt } from "@/utils/encryp.js";
import valid from "card-validator";
import { mapState } from "vuex";
import { initForm } from "@/utils/dataTools";
import { getEmail } from "@/utils/publicRequest";

export default {
  name: "International-card-payment",
  props: ["orderAllInfo"],
  data() {
    return {
      //表单数据
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

      //表单错误信息
      formError: {
        firstname: false,
        lastname: false,
        cardNumber: false,
        cardCvv: false,
        timeData: false,
      },

      focusFirstname: false,
      focusLastname: false,
      focusCard: false,
      focusCvv: false,
      focusTime: false,

      //表单time数据
      timeData: "",
      oldTimeData: "",
      timeChangeVal: "",

      //信用卡类型
      cardTypes: [
        {
          type: "visa",
          icon: require("@/assets/images/cardIcons/visaText.svg"),
          state: true,
        },
        {
          type: "master",
          icon: require("@/assets/images/cardIcons/masterIcon.svg"),
          state: true,
        },
        {
          type: "mir",
          icon: require("@/assets/images/cardIcons/mir-form.svg"),
          state: true,
        },
        {
          type: "diner",
          icon: require("@/assets/images/cardIcons/diner.svg"),
          state: true,
        },
        {
          type: "discover",
          icon: require("@/assets/images/cardIcons/discover.png"),
          state: true,
        },
      ],
      //信用卡类型logo
      cardLogo: "",

      request_loading: false,

      timeDown1: null,

      //卡是否为0张为0张时为true 则是新增卡
      newCardData: false,

      //二次支付错误name提示
      NameErrorMsg: false,
      //二次支付卡信息错误
      cardMsgError: false,
      //二次支付时间错误
      timeMsgError: false,
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
  },
  watch: {
    //Enter date limit manually - Store value before change
    timeData(val, oldVal) {
      this.oldTimeData = oldVal;
    },
    //监听卡长度
    newCardData(newVal) {
      if (this.$route.query.ChangeCard === "CardInformation") {
        if (newVal) {
          this.clearData();
        }
      }
    },
    //订单信息
    orderAllInfo: {
      deep: true,
      handler(val) {
        if (
          val &&
          JSON.stringify(val) !== "{}" &&
          this.$route.query.pathHistry === "tradeHistory" &&
          this.$route.query.ChangeCard === "CardInformation"
        ) {
          this.$nextTick(() => {
            // val.failCode = '30002';
            //name错误
            if (val.failCode && val.failCode === "30001") {
              this.NameErrorMsg = true;
              return;
            }
            //卡时间错误
            if (val.failCode && val.failCode === "30002") {
              this.timeMsgError = true;
              return;
            }
            //卡号错误
            if (val.failCode && val.failCode === "30003") {
              this.cardMsgError = true;
              this.cardLogo = require("@/assets/images/cardIcons/cardError.svg");
            }
          });
        }
      },
    },
  },
  activated() {
    this.$nextTick(() => {
      this.formError = initForm(this.formError);
      if (
        this.$route.query.pathHistry === "tradeHistory" &&
        this.$route.query.ChangeCard !== "CardInformation"
      ) {
        this.params = initForm(this.params, {
          email: localStorage.getItem("email"),
        });
      }
      this.cardLogo = "";
      this.NameErrorMsg = false;
      this.timeMsgError = false;
      this.cardMsgError = false;
      this.cardChange(this.params.cardNumber);
    });
    //二次支付修改卡信息
    //获取地址卡信息或历史卡信息
    if (
      this.$route.query.pathHistry === "tradeHistory" &&
      this.$route.query.ChangeCard === "CardInformation"
    ) {
      let addressForm = JSON.parse(this.$route.query.submitForm);
      addressForm.cardNumber = AES_Decrypt(
        addressForm.cardNumber.replace(/ /g, "+")
      );
      addressForm.cardNumber = addressForm.cardNumber
        .replace(/\s/g, "")
        .replace(/....(?!$)/g, "$& ");
      //去除地址栏穿参导致参数中拼有空格问题
      addressForm.firstname = AES_Decrypt(
        addressForm.firstname.replace(/ /g, "+")
      );
      addressForm.lastname = AES_Decrypt(
        addressForm.lastname.replace(/ /g, "+")
      );
      // addressForm.phone = AES_Decrypt(addressForm.phone.replace(/ /g,'+'));
      addressForm.email = addressForm.email.replace(/ /g, "+");
      this.params = { ...this.params, ...addressForm };
      this.params.cardCvv = "";
      //获取历史卡信息中的日期
      if (
        this.$route.query.submitForm &&
        this.params.cardExpireMonth !== null &&
        this.params.cardExpireYear !== null &&
        this.params.cardExpireMonth !== "" &&
        this.params.cardExpireYear !== ""
      ) {
        this.timeData =
          this.params.cardExpireMonth +
          " / " +
          this.params.cardExpireYear.substring(2, 4);
      }
      //只有确认支付方式页
      if (this.params.cardCvv !== "") {
        this.params.cardCvv = AES_Decrypt(this.params.cardCvv);
      } else {
        this.params.cardCvv = "";
      }
    }
  },
  deactivated() {
    this.params = initForm(this.params, {
      email: localStorage.getItem("email"),
    });
    this.timeData = "";
    this.cardLogo = "";
  },
  methods: {
    formatter(value) {
      return value.replace(/[^a-zA-Z ]/g, "");
    },
    cardFormatter(value) {
      return value.replace(/[^0-9 ]/g, "");
    },

    formDisabled() {
      if (
        this.params.firstname !== "" &&
        this.params.lastname !== "" &&
        this.formError.firstname === false &&
        this.formError.lastname === false &&
        this.params.cardNumber !== "" &&
        this.formError.cardNumber === false &&
        this.params.cardCvv !== "" &&
        this.params.cardCvv.length >= 3 &&
        this.timeData.length === 7 &&
        this.formError.timeData === false &&
        this.request_loading === false
      ) {
        this.$parent.selectKey = false;
      } else {
        this.$parent.selectKey = true;
      }
    },

    //Enter date limit manually
    timeChange(val) {
      //二次支付时间错误提示
      this.timeMsgError = false;
      this.timeChangeVal = val.target.value;
      this.timeData = this.timeData.replace(/[^0-9][s+][/]/g, "");
      var target = Number(val.target.value[val.target.value.length - 1]);
      if (
        target == "1" ||
        target == "2" ||
        target == "3" ||
        target == "4" ||
        target == "5" ||
        target == "6" ||
        target == "7" ||
        target == "8" ||
        target == "9" ||
        target == "0"
      ) {
        setTimeout(() => {
          if (Number(val.target.value.substring(0, 2)) > 12) {
            this.formError.timeData = true;
          } else {
            this.formError.timeData = false;
          }
          if (val.target.value.length === 1 && val.target.value > 1) {
            this.timeData = "0" + val.target.value + " /\u00a0";
          } else if (
            val.target.value.length === 2 &&
            this.oldTimeData.length === 1
          ) {
            this.timeData = val.target.value + " /\u00a0";
          }
          let timeDate =
            "20" +
            val.target.value.substring(5, 7) +
            "-" +
            val.target.value.substring(0, 2);

          let month = new Date().getMonth() + 1;
          if (month < 10) {
            month = "0" + month;
          }
          let currentTime = new Date().getFullYear() + "-" + month;

          if (
            val.target.value.length === 7 &&
            Date.parse(new Date(timeDate)) < Date.parse(new Date(currentTime))
          ) {
            this.formError.timeData = true;
          }
        });
      } else {
        this.formError.timeData = true;
      }
      if (!val.target.value.length) {
        this.formError.timeData = false;
      }
      this.formDisabled();
    },
    timeBlur() {
      if (this.timeData.length !== 7) {
        this.formError.timeData = true;
      }
      if (this.timeData.length === 7) {
        let arrNewList = this.timeData.split("/");
        if (
          arrNewList.length !== 2 ||
          arrNewList[0].length !== 3 ||
          arrNewList[1].length !== 3
        ) {
          this.formError.timeData = true;
        }
      }
      if (!this.timeData.length) {
        this.formError.timeData = false;
      }
    },
    timeDelete(val) {
      setTimeout(() => {
        if (val.target.value.length === 4 && this.oldTimeData.length === 5) {
          this.timeData = val.target.value.substring(0, 1);
        }
      });
    },

    nameChange(witch, type) {
      let patrn = /(.)\1\1/;
      this.NameErrorMsg = false;
      if (witch === "first") {
        if (
          this.params.firstname.length < 2 ||
          patrn.exec(this.params.firstname) ||
          (this.params.firstname.length === 2 &&
            this.params.firstname.match(new RegExp(/(\w)\1+/g)))
        ) {
          if (type === "blur") {
            this.formError.firstname = true;
          }
        } else {
          this.formError.firstname = false;
        }
      } else {
        if (
          this.params.lastname.length < 2 ||
          patrn.exec(this.params.lastname) ||
          (this.params.lastname.length === 2 &&
            this.params.lastname.match(new RegExp(/(\w)\1+/g)))
        ) {
          if (type === "blur") {
            this.formError.lastname = true;
          }
        } else {
          this.formError.lastname = false;
        }
      }
      if (!this.params.firstname.length) {
        this.formError.firstname = false;
      }
      if (!this.params.lastname.length) {
        this.formError.lastname = false;
      }
      this.formDisabled();
    },

    //表单项获取焦点
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

    //表单项失去焦点
    inputBlur(eleId) {
      if (eleId === "firstname") {
        this.focusFirstname = false;
        this.nameChange("first", "blur");
      } else if (eleId === "lastname") {
        this.focusLastname = false;
        this.nameChange("last", "blur");
      } else if (eleId === "cardNumber") {
        this.focusCard = false;
      } else if (eleId === "timeData") {
        this.focusTime = false;
        this.timeBlur();
      } else if (eleId === "cardCvv") {
        this.focusCvv = false;
        this.cvvChange("blur");
      }

      //二次支付失败信息不清空样式
      if (this.NameErrorMsg || this.timeMsgError || this.cardMsgError) {
        return;
      }
      //二次支付name错误信息检验
      //某个表单项单独校验
      switch (eleId) {
        case "cardNumber":
          if (
            this.params.cardNumber !== "" &&
            this.params.cardNumber !== undefined
          ) {
            this.params.cardNumber = this.params.cardNumber
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
              this.formError.cardNumber = false;
            } else {
              this.formError.cardNumber = true;
              this.cardLogo = require("@/assets/images/cardIcons/cardError.svg");
            }
          }
          break;
      }
    },

    cardChange(value) {
      //Add a space between every four digits of the credit card number
      if (value !== "" && value !== undefined) {
        //二次支付时清空提示
        this.cardMsgError = false;
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
          this.formError.cardNumber = false;
        } else {
          // this.formError.cardNumber = true;
          // this.cardLogo = require('@/assets/images/cardIcons/cardError.svg');
        }
      } else {
        this.cardLogo = "";
        this.formError.cardNumber = false;
      }
      this.formDisabled();
      //判断卡类型
      let type = "";
      let validObject = valid.number(value);
      switch (true) {
        case validObject.isValid && validObject.card.type === "visa":
          type = "visa";
          break;
        case validObject.isValid && validObject.card.type === "mir":
          type = "mir";
          break;
        case validObject.isValid && validObject.card.type === "mastercard":
          type = "master";
          break;
        case validObject.isValid && validObject.card.type === "diners-club":
          type = "diner";
          break;
        case validObject.isValid && validObject.card.type === "discover":
          type = "discover";
          break;
      }
      let cardInfo = this.cardTypes.filter((val) => {
        return val.type === type;
      });
      cardInfo.length > 0 ? (this.cardLogo = cardInfo[0].icon) : "";
    },
    onPaste(event) {
      event.preventDefault();
      this.$toast({
        duration: 3000,
        message: this.$t("buyForm_components.paste_tips"),
        className: "paste_tips_toast",
      });
    },

    //CVV验证
    cvvChange(type) {
      if (this.params.cardCvv.length < 3 || this.params.cardCvv.length > 4) {
        if (type == "blur") {
          this.formError.cardCvv = true;
        }
      } else {
        this.formError.cardCvv = false;
      }
      if (!this.params.cardCvv.length) {
        this.formError.cardCvv = false;
      }
      this.formDisabled();
    },

    //验证、提交卡信息
    submitPay() {
      let _this = this;
      this.request_loading = true;
      //修改订单支付方式
      let params = {
        orderNo: this.$route.query.orderNo,
        payWayCode: "10001",
      };
      this.$axios
        .post(this.$api.post_updateOrderInfo, params, "")
        .then((_res) => {
          if (_res) {
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
            this.$route.query.ChangeCard === "ChangeCard"
              ? (queryParams.userCardId = null)
              : "";
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
                  setTimeout(() => {
                    queryParams.userCardId = res.data.userCardId;
                    queryParams.cardNumber = res.data.cardNumber;
                    // queryParams.cardCvv = res.data.cardCvv;
                    _this.$store.commit(
                      "buyPayments/set_creditCardInfo",
                      queryParams
                    );
                  });
                  //存储支付方式信息
                  let payMethodInfo = {
                    payWayCode: "10001", //支付方式code
                    payWayName: "card", //支付方式名称
                    cardNumber: AES_Decrypt(queryParams.cardNumber),
                  };
                  this.$store.commit(
                    "buyPayments/set_payMethodInfo",
                    payMethodInfo
                  );
                  //二次支付新增卡和选择支付方式新增卡时 直接跳确认订单 二次支付修改卡信息直接去历史订单页
                  if (
                    this.$route.query.pathHistry === "tradeHistory" &&
                    (this.$route.query.ChangeCard === "ChangeCard" ||
                      this.$route.query.ChangeCard === "Method" ||
                      this.$route.query.ChangeCard === "changeMethod" ||
                      this.$route.query.ChangeCard === "CardInformation")
                  ) {
                    this.$router
                      .push(`/creditCardConfig?pathHistry=tradeHistory`)
                      .then(() => {
                        this.request_loading = false;
                      });
                  }
                }
              })
              .catch(() => {
                this.request_loading = false;
              });
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },

    clearData() {
      this.params = initForm(this.params, {
        email: localStorage.getItem("email"),
      });
      this.formError = initForm(this.formError);
      this.cardMsgError = false;
      this.NameErrorMsg = false;
      this.timeMsgError = false;
      this.timeData = "";
      this.cardLogo = "";
    },
  },
};
</script>

<style lang="scss" src="./index.scss" scoped></style>
