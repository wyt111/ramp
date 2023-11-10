<template>
  <div id="correspondPaymentMethod">
    <header>
      <div class="title">{{ $t(`buyPayWay.creditCard`) }}</div>
      <div class="edit-icon">
        <div class="edit" @click="edit" v-if="savedCard.length > 0">
          {{ $t(`buyPayWay.${editText}`) }}
        </div>
      </div>
    </header>
    <!-- 国际卡新增和历史 -->
    <div class="cardView international-card">
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
          <div class="card-type">
            {{ cardType(item.cardNumber)
            }}<span
              style="text-transform: lowercase"
              v-show="cardType(item.cardNumber) === 'Master'"
              >{{ $t("buyPayWay.card") }}</span
            >
          </div>
          <div class="card-num">
            <span>****</span
            >{{ item.cardNumber.substring(item.cardNumber.length - 4) }}
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
  </div>
</template>

<script>
import valid from "card-validator";
import { AES_Encrypt, AES_Decrypt } from "@/utils/encryp";
import { mapState } from "vuex";

export default {
  name: "historyCard",
  props: ["allSavedCard"],
  data() {
    return {
      savedCard: [],
      radioIndex: "",

      // payMethodGroup: {},

      editText: "edit",

      //组件标题
      cardTitle: "creditCard",
    };
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
  },
  activated() {
    this.savedCard = this.allSavedCard;
  },
  methods: {
    initializationData(val) {
      // this.payMethodGroup = val;
      this.$store.commit("buyPayments/set_payMethodInfo", val);
      this.radioIndex = "";
      this.$parent.radioIndex = "";
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

      return "";
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
      if (
        this.payMethodInfo.payWayName === "addCard" &&
        this.payMethodInfo.payWayCode === "10001"
      ) {
        this.$parent.addNewCardShow = "2";
      }
    },
    //创建订单
    async confirm() {
      //修改订单支付方式
      let params = {
        orderNo: this.$route.query.orderNo,
        payWayCode: "10001",
      };
      this.$axios
        .post(this.$api.post_updateOrderInfo, params, "")
        .then((_res) => {
          if (_res) {
            //二次支付选择卡时不创建订单直接使用二次订单号 未验证kyc  只针对卡支付
            if (
              this.payMethodInfo.payWayName !== "addCard" &&
              this.payMethodInfo.payWayCode === "10001"
            ) {
              //如果是选择支付方式或者更换卡时走这个
              let payMethodInfo = JSON.parse(
                JSON.stringify(this.payMethodInfo)
              );
              payMethodInfo.cardNumber = AES_Encrypt(payMethodInfo.cardNumber);
              let fullName =
                AES_Decrypt(payMethodInfo.firstname) +
                " " +
                AES_Decrypt(payMethodInfo.lastname);
              this.$store.commit(
                "buyPayments/set_fullName",
                AES_Encrypt(fullName)
              );
              this.$store.commit(
                "buyPayments/set_userCardId",
                payMethodInfo.userCardId
              );
              this.$store.commit(
                "buyPayments/set_creditCardInfo",
                JSON.parse(JSON.stringify(payMethodInfo))
              );
              let goUrl = `/creditCardConfig?configPaymentFrom=userPayment&pathHistry=tradeHistory`;
              this.$router.push(goUrl);
              return;
            }
            //接入商户模式不需要创建订单
            if (this.$route.query.orderNo) {
              //存储订单号
              this.$store.commit(
                "buyPayments/set_orderNo",
                this.$route.query.orderNo
              );
              this.JumpRouter();
            }
          }
        });
    },

    //根据支付方式 控制跳转路径
    JumpRouter() {
      //选择历史支付
      if (
        this.payMethodInfo.payWayName !== "addCard" &&
        this.payMethodInfo.payWayCode === "10001"
      ) {
        let payMethodInfo = JSON.parse(JSON.stringify(this.payMethodInfo));
        let fullName =
          AES_Decrypt(payMethodInfo.firstname) +
          " " +
          AES_Decrypt(payMethodInfo.lastname);
        this.$store.commit("buyPayments/set_fullName", AES_Encrypt(fullName));
        payMethodInfo.cardNumber = AES_Encrypt(payMethodInfo.cardNumber);
        this.$store.commit(
          "buyPayments/set_userCardId",
          payMethodInfo.userCardId
        );
        this.$store.commit(
          "buyPayments/set_creditCardInfo",
          JSON.parse(JSON.stringify(payMethodInfo))
        );
        //跳转地址
        let goUrl = `/creditCardConfig?configPaymentFrom=userPayment&orderNo=${this.$route.query.orderNo}`;
        this.$router.push(goUrl).then(() => {
          this.$parent.request_loading = false;
        });
      }

      //选择新填写支付方式
      //国际卡
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
    },

    //选择卡信息
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
            // this.$store.commit('buyPayments/set_creditCardList', this.savedCard);
            this.$forceUpdate();
            this.$toast({
              duration: 3000,
              message: res.returnMsg,
            });
          }
        });
    },
  },
  deactivated() {
    this.editText = "edit";
    this.radioIndex = "";
  },
};
</script>

<style lang="scss" src="./index.scss" scoped></style>
