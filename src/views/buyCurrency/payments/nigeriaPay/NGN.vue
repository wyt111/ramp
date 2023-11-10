<template>
  <div id="NGN" class="ngn-container" v-if="nigeriaOrderData">
    <div class="ngn-Payment-amount">
      <div class="title">{{ $t("mexPayment.PleasePay") }}</div>
      <div class="amount">
        <span class="symbol_icon">{{ this.payMethodInfo.symbol }}</span>
        {{ this.paymentamount }}
      </div>
    </div>
    <div class="ngn_top_title1">
      {{ $t("phpPayment.Incorrect") }}
    </div>
    <div class="ngn-content">
      <div class="bottom_left"></div>
      <div class="line line1">
        <div class="number">1</div>
        <div class="con">{{ $t("ngnPayment.title2") }}</div>
        <!-- <div class="con">Leave ACH Ramp. Log in your bank APP and transfer the accurate amount to the account below.</div> -->
      </div>
      <div class="content">
        <div class="line_content">
          <div class="title">{{ $t("ngnPayment.accountNumber") }}</div>
          <p>
            <span class="text">{{ nigeriaOrderData.accountNumber }} </span>
            <copy-img
              v-clipboard="nigeriaOrderData.accountNumber"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
        <div class="line_content">
          <div class="title">{{ $t("ngnPayment.accountName") }}</div>
          <p>
            <span class="text">{{ nigeriaOrderData.accountName }} </span>
            <copy-img
              v-clipboard="nigeriaOrderData.accountName"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
        <div class="line_content">
          <div class="title">{{ $t("ngnPayment.bankName") }}</div>
          <p>
            <span class="text">{{ nigeriaOrderData.bankName }} </span>
            <copy-img
              v-clipboard="nigeriaOrderData.bankName"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
      </div>
      <div class="line line2">
        <div class="number">2</div>
        <div class="con">{{ $t("ngnPayment.title3") }}</div>
        <!-- <div class="con">After transfer, please return to RAMP and click the button below - I have completed the payment.</div> -->
      </div>
    </div>
    <footer class="footer">
      <CustomButton
        ref="buttonRef"
        :timeStatus="startPayment ? paymentCountDownMinute : ''"
        class="button_ref"
        :buttonData="buttonData"
        :disabled="disableStatus"
        @click.native="showPop"
      ></CustomButton>
    </footer>
  </div>
</template>

<script>
import { timeDown } from "@/utils";
import { mapState } from "vuex";
import moment from "moment-timezone";

export default {
  name: "NGN",
  data() {
    return {
      //按钮数据
      buttonData: {
        loading: false,
        triggerNum: 0,
        customName: false,
      },
      disableStatus: false, // 按钮状态
      paymentamount: "", // 将要支付金额
      payExplain: {}, // 存储的尼日利亚信息

      routerParams: {},

      paymentCountDown: null,
      paymentCountDownNum: 7200,
      //   paymentCountDownMinute: '00:00',
      paymentCountDownMinute: "120:00",
      paystateTimeOut: null,

      codeState: false,
      startPayment: true, // 是否开始倒计时
    };
  },
  components: {},
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      placeOrderQuery: (state) => state.placeOrderQuery,
      nigeriaOrderData: (state) => state.nigeriaOrderData,
    }),
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
    }),
  },
  mounted() {
    this.scrollToTop();

    this.receiveinfo();
    // console.log('45454', this.payMethodInfo);
    this.$refs.buttonRef.buttonName = "nav.queryOderState";
  },
  methods: {
    scrollToTop() {
      const contentView = document.querySelector(".contentView");
      const currentScroll = contentView.scrollTop;
      if (currentScroll > 0) {
        contentView.scrollTop = 0;
      }
    },

    // 订单是否已经存在了
    receiveinfo() {
      //Selected Receive local data
      if (sessionStorage.getItem("nigeriaPayState")) {
        this.payExplain = JSON.parse(sessionStorage.getItem("nigeriaPayState"));

        this.payCode = this.payExplain.payCode;

        // this.$parent.payCode = this.payExplain.payCode;
        this.$nextTick(() => {
          // 隐藏步骤条
          this.$store.commit("changeBuyPayProcessTab", false);
        });

        //刷新倒计时
        this.paymentCountDownNum = this.payExplain.paymentCountDownNum;
        // this.$parent.paymentCountDownMinute = this.payExplain.paymentCountDownMinute;
        setTimeout(() => {
          this.$parent.$parent.$refs.viewTab.routerName =
            "navTabTitle.Completepayment";
        });
        //倒计时状态
        this.startPayment = true;
        //刷新订单状态
        this.refreshPaystate();
      } else {
        this.NGNpay();
      }
      //存储地址栏信息
      // this.routerParams = this.$store.state.buyRouterParams;
    },

    NGNpay() {
      //place an order
      var params = {
        orderNo: this.orderNo,
        payWayCode: this.payMethodInfo.payWayCode,
      };

      //正常走从首页拿amount
      this.paymentamount = this.placeOrderQuery.amount;
      //二次支付amount
      if (this.$route.query.pathHistry == "tradeHistory") {
        params.payWayCode = this.payMethodInfo.payWayCode;
        this.paymentamount = this.buyPayment_secondPay.amount;
      }

      //   this.refreshPaystate();
      // console.log('this.$api.post_alchemyPayPay', this.$api.post_alchemyPayPay);
      this.refreshPaystate();
      this.storeData();
      // 查询订单状态
      //   this.$axios
      //     .post(this.$api.post_alchemyPayPay, params, 'submitToken')
      //     .then(res => {
      //       if (res && res.data) {
      //         // //请求成功设置返回状态
      //         // this.$store.commit('set_ovo_va_mex_qrs_Status', true);
      //         // setTimeout(() => {
      //         //   this.$store.state.toastStatus = true;
      //         //   this.$store.commit('changeBuyPayProcessTab', false);
      //         //   //改变导航文案
      //         //   this.$parent.$parent.$refs.viewTab.routerName = 'navTabTitle.Completepayment';
      //         // });
      //         //隐藏费率展示
      //         // this.$parent.IncludedDetails = false;
      //         this.refreshPaystate();
      //         // this.payCode = res.data;
      //         // this.$parent.payCode = res.data.vaNumber;
      //         // this.codeState = true;
      //         this.storeData();
      //       } else {
      //         this.$parent.buttonData = {
      //           loading: false,
      //           triggerNum: 0,
      //           customName: false
      //         };
      //         this.$store.commit('set_ovo_va_mex_qrs_Status', false);
      //       }
      //     })
      //     .catch(() => {
      //       this.$parent.buttonData = {
      //         loading: false,
      //         triggerNum: 0,
      //         customName: false
      //       };
      //       this.$store.commit('set_ovo_va_mex_qrs_Status', false);
      //     });
    },

    //查询订单状态
    refreshPaystate() {
      //15 minutes order countdown
      this.paymentCountDown = setInterval(() => {
        //order overtime
        this.paymentCountDownMinute = timeDown(this.paymentCountDownNum);
        //Real time storage countdown
        this.storeData();
      }, 1000);
      // 倒计时结束跳转页面
      // console.log('this.paymentCountDownNum564', this.paymentCountDownNum);
      if (this.paymentCountDownNum <= 0) {
        clearInterval(this.paystateTimeOut);
        clearInterval(this.paymentCountDown);
        this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        return;
      }
      // 刷新订单状态
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
        // console.log('res4534', JSON.stringify(res));
        if (res && res.data) {
          //订单创建时间 单位转换时间为毫秒
          const createdTime = moment(res.data.payOrderCreateTime).valueOf();
          //订单超时时间
          let timeOut = Number(res.data.expire * (60 * 1000));
          //现在时间
          let newDate = new Date().getTime();
          this.paymentCountDownNum = Math.floor(
            (createdTime + timeOut - newDate) / 1000
          );
        }
        // 支付结果页面
        if (
          res &&
          res.data &&
          (res.data.orderStatus === 0 ||
            (res.data.orderStatus >= 2 && res.data.orderStatus <= 6))
        ) {
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },

    //存储进行中的订单
    storeData() {
      this.payExplain.payCode = this.payCode;
      this.payExplain.paymentCountDownNum = this.paymentCountDownNum;
      this.payExplain.paymentCountDownMinute =
        this.$parent.paymentCountDownMinute;
      this.payExplain.AuthorizationInfo_state =
        this.$parent.AuthorizationInfo_state;
      sessionStorage.setItem(
        "nigeriaPayState",
        JSON.stringify(this.payExplain)
      );
    },

    // 显示提示框
    showPop() {
      this.$parent.$parent.BuyTimeOut = "";
      this.$parent.$parent.tipsState = true;
      this.buttonData = {
        loading: false,
        triggerNum: 1,
        customName: false,
      };
    },
    firstCopySuccess() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
    firstCopyError() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
  },
  destroyed() {
    window.clearInterval(this.paystateTimeOut);
    window.clearInterval(this.paymentCountDown);
    this.paystateTimeOut = null;
    this.paymentCountDown = null;
    sessionStorage.removeItem("indonesiaPayment");
    this.$parent.$parent.$refs.viewTab.isShowBackIcon = true;
    // this.$store.commit('set_ovo_va_mex_qrs_Status', false);
  },
};
</script>

<style lang="scss" scoped>
.ngn-container {
  padding-bottom: 0.56rem;
  .ngn-Payment-amount {
    padding-bottom: 0.24rem;
    margin-bottom: 0.16rem;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: 0 0 0 0.25px #dbdee3;
    }

    .title {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.17rem;
      color: #5d636d;
      margin-bottom: 0.06rem;
    }
    .amount {
      font-family: "HarmonyOS Sans";
      font-style: normal;
      font-weight: 700;
      font-size: 0.32rem;
      line-height: 0.38rem;
      color: #252830;
      span {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.2rem;
        line-height: 0.24rem;
        color: #252830;
      }
    }
  }
  .ngn_top_title1 {
    border: 1px solid rgba(255, 125, 0, 0.15);
    background: rgba(255, 125, 0, 0.05);
    border-radius: 0.06rem;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 0.11rem;
    line-height: 0.15rem;
    color: #252830;
    padding: 0.08rem;
    margin-bottom: 0.16rem;
  }
  .ngn-content {
    width: 100%;
    overflow: hidden;
    position: relative;
    //padding-left: .08rem;
    .bottom_left {
      height: 3.1rem;
      opacity: 0.4;
      border-left: 1px dashed #0059da;
      position: absolute;
      left: 0.08rem;
    }
    .line {
      display: flex;
      .number {
        min-width: 0.16rem;
        height: 0.16rem;
        border-radius: 50%;
        background: #0059da;
        font-family: "HarmonyOS Sans";
        font-style: normal;
        font-weight: 500;
        font-size: 0.1rem;
        line-height: 0.12rem;
        color: #ffffff;
        margin-right: 0.12rem;
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .con {
        max-width: 3rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.18rem;
        color: #252830;

        span {
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 700;
          color: #0059da;
        }
      }
      &.line1 {
        margin-bottom: 0.21rem;
      }

      &.line2 {
        .number {
          // border: 1.5px solid #ff7d00;
          // background: #fff;
          // color: #ff7d00;
        }
        .con {
          position: relative;
          &:before {
            content: "";
            position: absolute;
            left: -0.28rem;
            top: 0;
            bottom: 0;
            width: 0.28rem;
            background-color: #fff;
          }
        }
      }
    }
    .content {
      width: 3.15rem;
      background: #f4f8fb;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      margin-left: 0.28rem;
      padding: 0.2rem 0.12rem;
      margin-bottom: 0.2rem;

      .line_content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        margin-bottom: 0.16rem;
        .title {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.13rem;
          line-height: 0.14rem;
          color: #5d636d;
          display: flex;
          align-items: center;
        }
        p {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.14rem;
          line-height: 0.14rem;
          color: #252830;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 1.5rem;
          }
          img {
            height: 0.16rem;
            margin-left: 0.12rem;
            cursor: pointer;
          }
        }
        .code {
          width: 100% !important;
          margin-top: 0.08rem;
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 14px;
          color: #252830;
        }
      }
      .line_content:last-child {
        margin-bottom: 0;
      }
    }
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0.16rem 0rem;
    z-index: 999;
  }
}
</style>
