<template>
  <div class="order-container">
    <sendCrypto
      v-if="
        [0, 1, 7].includes(orderStateData.orderStatus) &&
        $store.state.nextOrderState === 1
      "
      :orderStateData="orderStateData"
      :key="orderStateData.networkName"
    />
    <div v-else-if="!orderStateData.orderStatus"></div>
    <sellState v-else :orderStateData="orderStateData" />
  </div>
</template>
<script>
import { AES_Decrypt } from "@/utils/encryp";
import sendCrypto from "./children/sendCrypto.vue";
import sellState from "./children/sellState";
import { merchantInfo } from "@/utils/publicRequest";
export default {
  name: "orderState",
  components: {
    sendCrypto,
    sellState,
  },
  data() {
    return {
      NetworkCheck: require("../../assets/images/cardCheckIcon.png"),
      playMoneyState: 0,
      show: false,
      orderStateData: {},
      timer: null,
      timeText: "",
      cardUserName: "",
      accountNumberCode: "",
      nextOrderState: 1,
      feeInfo: "",
      setTime: null,
    };
  },
  methods: {
    // 根据路由设置商户信息
    setMerchantInfo() {
      if (this.$route.query?.sellOrderId) {
        this.$store.state.emailFromPath = "sellOrder";
        this.$store.state.sellOrderId = this.$route.query.sellOrderId;
        this.$store.state.emailFromquery_sellCardInfo_view.orderId =
          this.$route.query.sellOrderId;
      }
    },

    //获取买币状态
    getCurrencyStatus() {
      let parmas = {
        orderId: this.$store.state.sellOrderId || this.$route.query.sellOrderId,
      };
      this.$axios.get(this.$api.get_PlayCurrencyStatus, parmas).then((res) => {
        if (res && res.data) {
          this.orderStateData = res.data;
          this.$store.state.orderStatus = res.data;
          this.playMoneyState = res.data.orderStatus;
          // 跳转后的商户订单 查询，如何返回有商户信息，使用返回的
          let buyMerchantInfo =
            JSON.parse(sessionStorage.getItem("buyMerchantInfo")) || {};
          if (res.data) {
            buyMerchantInfo.urlType = res.data?.urlType;
            buyMerchantInfo.withdrawUrl = res.data?.withdrawUrl;
            buyMerchantInfo.merchantName = res.data?.merchantName;
            sessionStorage.setItem(
              "buyMerchantInfo",
              JSON.stringify(buyMerchantInfo)
            );
          }

          if (
            this.orderStateData.orderStatus == 2 &&
            this.$store.state.nextOrderState == 1 &&
            res.data.expirationTime > 0 &&
            res.data.confirmBlock > 0
          ) {
            this.$store.state.nextOrderState = 2;
          }
          if (this.playMoneyState == 7) {
            window.clearInterval(this.timer);
            this.timer = null;
            return;
          }
          if (this.playMoneyState == 5) {
            window.clearInterval(this.timer);
            this.timer = null;
          }
          if (res.data.expirationTime <= 0 && this.playMoneyState === 7) {
            this.orderStateData.orderStatus = 7;
            this.$store.state.nextOrderState = 1;
            window.clearInterval(this.timer);
            this.timer = null;
            return;
          }
        }
      });
    },

    //解密了一些数据
    AES(value) {
      if (value) {
        return AES_Decrypt(value);
      } else {
        return value;
      }
    },
  },
  activated() {
    merchantInfo();
    // 如果是商户进来查询订单
    this.setMerchantInfo();
    this.getCurrencyStatus();
    this.timer = setInterval(() => {
      clearTimeout(this.setTime);
      this.setTime = setTimeout(() => {
        this.getCurrencyStatus();
      });
    }, 1000);
  },
  deactivated() {
    this.orderStateData = {};
    window.clearInterval(this.timer);
    clearTimeout(this.setTime);
    this.timer = null;
  },
};
</script>
<style lang="scss" scoped>
.order-container {
  height: 100%;
  ::v-deep .van-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 0;
    background: rgb(0, 0, 0, 0.6) !important;
    z-index: 9999;
  }
}
@media (min-width: 791px) {
  .order-container {
    ::v-deep .van-overlay {
      border-radius: 0.15rem 0.15rem 0 0;
    }
  }
}
</style>
