<template>
  <div id="VABox">
    <!-- Display data after selecting bank card -->
    <div class="code-view" v-if="codeState">
      <div class="title">Virtual Account</div>
      <div class="code-value">
        <span class="text"> {{ payCodeShow }}</span>
        <copy-img
          class="copy-icon"
          v-clipboard:copy="payCode"
          v-clipboard:success="copySuccess"
          v-clipboard:error="copyError"
        />
      </div>
    </div>
    <div
      class="helpView"
      v-for="(value, key) in payExplain.allHelpTips"
      :key="key"
    >
      <div class="helpView-title" @click.stop="lookMore(value, key)">
        <span class="text">How to pay at the {{ value.helpTitle }}</span>
        <img
          src="@/assets/images/imageTop1.svg"
          :class="value.openState ? 'transfromOrigin1' : 'transfromOrigin'"
        />
      </div>
      <div
        class="helpView-line"
        v-for="(item, index) in value.helpInfo"
        :key="index"
        v-show="value.openState"
      >
        <div class="headline">
          <div class="serialNumber"></div>
          <div>{{ item.text }}</div>
        </div>
        <div
          class="subtitle"
          v-for="(itemChild, indexChild) in item.children"
          :key="indexChild"
        >
          {{ itemChild.number }} {{ itemChild.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timeDown } from "@/utils";
import { mapState } from "vuex";
import moment from "moment-timezone";
export default {
  name: "VA",
  data() {
    return {
      // routerParams: {},

      payExplain: [],

      paymentCountDown: null,
      paymentCountDownNum: 900,
      paymentCountDownMinute: "00:00",
      paystateTimeOut: null,

      payCode: "",

      codeState: false,
    };
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
    }),
    //code展示添加空格 - 每4位添加一个空格
    payCodeShow() {
      return this.payCode.replace(/(.{4})/g, "$1 ");
    },
  },
  mounted() {
    this.receiveinfo();
  },
  methods: {
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

    receiveinfo() {
      // this.routerParams = this.$store.state.buyRouterParams
      //Selected Receive local data
      if (sessionStorage.getItem("indonesiaPayment")) {
        //隐藏公司地址
        this.$parent.companyAddress = false;

        this.payExplain = JSON.parse(
          sessionStorage.getItem("indonesiaPayment")
        );
        this.payCode = this.payExplain.payCode;
        this.$parent.payCode = this.payExplain.payCode;
        this.codeState = true;
        this.paymentCountDownNum = this.payExplain.paymentCountDownNum;
        this.$parent.paymentCountDownMinute =
          this.payExplain.paymentCountDownMinute;
        this.$parent.startPayment = true;
        setTimeout(() => {
          this.$parent.$parent.$refs.viewTab.routerName =
            "navTabTitle.Completepayment";
          this.$parent.IncludedDetails = false;
        });
        this.refreshPaystate();
        return;
      }
      //No choice Initialization data
      this.initializationData();
    },

    //Help information add drop-down status add Fetch data
    initializationData() {
      this.choiseBankCard(this.payMethodInfo);
    },

    //赋值银行信息
    choiseBankCard(item) {
      this.payExplain = item;
      this.payExplain = item;
      //修改父组件数据
      this.$parent.payExplain = item;
    },

    //Store data to prevent page refresh
    storeData() {
      this.payExplain.payCode = this.payCode;
      this.payExplain.paymentCountDownNum = this.paymentCountDownNum;
      this.payExplain.paymentCountDownMinute =
        this.$parent.paymentCountDownMinute;
      sessionStorage.setItem(
        "indonesiaPayment",
        JSON.stringify(this.payExplain)
      );
    },
    refreshPaystate() {
      //15 minutes order countdown
      this.$parent.$parent.BuyTimeOut = "";
      this.paymentCountDown = setInterval(() => {
        this.$parent.paymentCountDownMinute = timeDown(
          this.paymentCountDownNum
        );
        // this.paymentCountDownNum -= 1;
        //Real time storage countdown
        this.storeData();
      }, 1000);
      if (this.paymentCountDownNum <= 0) {
        clearInterval(this.paystateTimeOut);
        clearInterval(this.paymentCountDown);
        this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        return;
      }
      //Refresh payment status
      this.requestStatus();
      this.paystateTimeOut = setInterval(() => {
        this.requestStatus();
      }, 1000);
    },

    //order status
    requestStatus() {
      let params = {
        orderNo: this.orderNo,
      };
      this.$axios.get(this.$api.get_payResult, params).then((res) => {
        if (res && res.data) {
          //订单创建时间 单位转换时间为毫秒
          const createdTime = moment(res.data.payOrderCreateTime).valueOf();
          //订单超时时间
          const timeOut = Number(res.data.expire * (60 * 1000));
          //现在时间
          const newDate = new Date().getTime();
          this.paymentCountDownNum = Math.floor(
            (createdTime + timeOut - newDate) / 1000
          );
        }
        if (
          res &&
          (res.data.orderStatus === 0 ||
            (res.data.orderStatus >= 2 && res.data.orderStatus <= 6))
        ) {
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },

    //Expand data
    lookMore(value, key) {
      if (this.payExplain.allHelpTips[key].openState === false) {
        this.payExplain.allHelpTips[key].openState = true;
        return;
      }
      if (this.payExplain.allHelpTips[key].openState === true) {
        this.payExplain.allHelpTips[key].openState = false;
      }
    },

    VAPay() {
      //place an order
      var params = {
        orderNo: this.orderNo,
        payBankCode: this.payExplain.bankCode,
        lastname: "11111",
      };
      this.$axios
        .post(this.$api.post_indonesiaBuy, params, "submitToken")
        .then((res) => {
          if (res) {
            //隐藏公司地址
            this.$parent.companyAddress = false;

            this.$parent.buttonData = {
              triggerNum: 1,
              customName: false,
              loading: false,
            };
            // //请求成功设置返回状态
            this.$store.commit("set_ovo_va_mex_qrs_Status", true);
            this.$parent.startPayment = true;

            //改变导航文案
            setTimeout(() => {
              this.$parent.$parent.$refs.viewTab.routerName =
                "navTabTitle.Completepayment";
            });
            //隐藏费率展示
            this.$parent.IncludedDetails = false;
            this.refreshPaystate();
            this.codeState = true;
            this.payCode = res.data.webUrl;
            this.$parent.payCode = res.data.webUrl;
            this.storeData();
          }
        })
        .catch(() => {
          this.$parent.buttonData = {
            loading: false,
            triggerNum: 0,
          };
          this.$store.commit("set_ovo_va_mex_qrs_Status", false);
        });
    },
  },
  destroyed() {
    window.clearInterval(this.paystateTimeOut);
    window.clearInterval(this.paymentCountDown);
    this.paystateTimeOut = null;
    this.paymentCountDown = null;
    sessionStorage.removeItem("indonesiaPayment");
    // this.$store.state.buyRouterParams.payMethod.bankInfo = {};
    // this.$store.commit("buyPayments/set_payMethodInfo",{})
  },
};
</script>

<style lang="scss" scoped>
#VABox {
  height: auto;

  .code-view {
    background: #f4f8fb;
    border: 1px solid #e6e8eb;
    border-top: 0 solid #000;
    border-radius: 0 0 0.06rem 0.06rem;
    padding: 0.16rem 0.12rem;
    margin-bottom: 0.24rem;
    .title {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.18rem;
      color: #5d636d;
      margin-bottom: 0.08rem;
    }
    .code-value {
      display: flex;
      justify-content: center;
      justify-content: space-between;
      .text {
        font-family: "HarmonyOS Sans";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.2rem;
        color: #252830;
      }
      .copy-icon {
        width: 0.16rem;
        cursor: pointer;
      }
    }
  }

  .helpView {
    cursor: pointer;
    // min-height: 0.64rem;
    // background: #ffffff;
    // border-radius: 0.16rem;
    // font-family: Regular;
    // font-weight: 400;
    // font-size: 0.16rem;
    // color: #949eb5;
    // padding: 0 0.16rem;

    margin-bottom: 0.12rem;
    .helpView-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .text {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.18rem;
        color: #252830;
      }
      img {
        width: 0.08rem;
      }
    }
    .helpView-line {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.11rem;
      line-height: 0.17rem;
      color: #5d636d;
      margin-top: 0.08rem;

      .headline {
        display: flex;
        align-items: flex-start;
        position: relative;
        .serialNumber::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0.07rem;
          width: 0.02rem;
          height: 0.02rem;
          background: #949eb5;
          border-radius: 50%;
          margin-right: 0.1rem;
          margin-top: 0.06rem;
        }
        div:last-child {
          max-width: 3rem;
          padding-left: 0.15rem;
        }
      }
      .subtitle {
        margin-left: 0.15rem;
        margin-top: 0.07rem;
      }
    }
    .transfromOrigin {
      transform: rotate(-180deg);
      transition: 0.35s;
    }
    .transfromOrigin1 {
      transform: rotate(0deg);
      transition: 0.35s;
    }
  }
}
</style>
