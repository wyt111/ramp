<template>
  <div id="OPM" class="opm-container" v-if="payCode !== ''">
    <div
      class="opm-title"
      v-html="$t('mexPayment.tiemOut', ['<span>02:00</span>', 'h'])"
    ></div>
    <div class="opm-Payment-amount">
      <div class="title">{{ $t("mexPayment.PleasePay") }}</div>
      <div class="amount"><span>Mex$</span> {{ this.Paymentamount }}</div>
    </div>
    <div class="opm_top_title1">
      {{ $t("phpPayment.Incorrect") }}
    </div>
    <div class="opm-content">
      <div class="bottom_left"></div>
      <div class="line line1">
        <div class="number">1</div>
        <div class="con">
          {{ $t("mexPayment.title1") }} : <span>{{ payCode.reference }}</span>
        </div>
      </div>
      <div class="line line2">
        <div class="number">2</div>
        <div class="con">{{ $t("mexPayment.title2") }}</div>
      </div>
      <div class="content">
        <div class="line_content">
          <div class="title">{{ $t("mexPayment.CLABEinterbancaria") }}</div>
          <p class="code">
            {{ payCode.clabe }}

            <copy-img
              v-clipboard="payCode.clabe"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
        <div class="line_content">
          <div class="title">{{ $t("mexPayment.Destinationbank") }}</div>
          <p>
            <span class="text">{{ payCode.bank_name }} </span>
            <copy-img
              v-clipboard="payCode.bank_name"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
        <div class="line_content">
          <div class="title">{{ $t("mexPayment.Beneficiary") }}</div>
          <p>
            <span class="text">{{ payCode.beneficiary_name }} </span>
            <copy-img
              v-clipboard="payCode.beneficiary_name"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
        <div class="line_content">
          <div class="title">{{ $t("mexPayment.Payamount") }}</div>
          <p>
            <span class="text">Mex$ {{ Paymentamount }}</span>
            <copy-img
              v-clipboard="' Mex$ ' + placeOrderQuery.amount"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </p>
        </div>
      </div>
      <div class="line line3">
        <div class="number">!</div>
        <div class="con">{{ $t("mexPayment.title3") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { timeDown } from "@/utils";
import { mapState } from "vuex";
import moment from "moment-timezone";

export default {
  name: "OPM",
  data() {
    return {
      routerParams: {},
      Paymentamount: "",

      payExplain: {},

      paymentCountDown: null,
      paymentCountDownNum: 7200,
      paymentCountDownMinute: "00:00",
      paystateTimeOut: null,

      codeState: false,
      payCode: "",
    };
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      placeOrderQuery: (state) => state.placeOrderQuery,
    }),
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
    }),
  },
  mounted() {
    this.receiveinfo();
  },
  methods: {
    receiveinfo() {
      //Selected Receive local data
      if (sessionStorage.getItem("indonesiaPayment")) {
        //隐藏公司地址
        this.$parent.companyAddress = false;

        this.payExplain = JSON.parse(
          sessionStorage.getItem("indonesiaPayment")
        );
        this.payCode = this.payExplain.payCode;
        this.$parent.payCode = this.payExplain.payCode;
        this.$nextTick(() => {
          this.$store.commit("changeBuyPayProcessTab", false);
        });
        // this.codeState = true;
        //刷新倒计时
        this.paymentCountDownNum = this.payExplain.paymentCountDownNum;
        this.$parent.paymentCountDownMinute =
          this.payExplain.paymentCountDownMinute;
        setTimeout(() => {
          this.$parent.$parent.$refs.viewTab.routerName =
            "navTabTitle.Completepayment";
          //隐藏费率展示
          this.$parent.IncludedDetails = false;
        });
        //倒计时状态
        this.$parent.startPayment = true;
        //刷新订单状态
        this.refreshPaystate();
      }
      //存储地址栏信息
      // this.routerParams = this.$store.state.buyRouterParams;
    },

    OPMpay() {
      //place an order
      var params = {
        orderNo: this.orderNo,
        payWayCode: this.payMethodInfo.payWayCode,
      };
      //正常走从首页拿amount
      this.Paymentamount = this.placeOrderQuery.amount;
      //二次支付amount
      if (this.$route.query.pathHistry == "tradeHistory") {
        params.payWayCode = this.payMethodInfo.payWayCode;
        this.Paymentamount = this.buyPayment_secondPay.amount;
      }
      this.$axios
        .post(this.$api.post_alchemyPayPay, params, "submitToken")
        .then((res) => {
          if (res && res.data) {
            //隐藏公司地址
            this.$parent.companyAddress = false;
            this.$parent.buttonData = {
              loading: false,
              triggerNum: 1,
              customName: false,
            };
            this.$parent.startPayment = true;

            // //请求成功设置返回状态
            this.$store.state.ovo_va_mex_qrs_Status = true;
            setTimeout(() => {
              this.$store.state.toastStatus = true;
              this.$store.commit("changeBuyPayProcessTab", false);
              //改变导航文案
              this.$parent.$parent.$refs.viewTab.routerName =
                "navTabTitle.Completepayment";
            });
            //隐藏费率展示
            this.$parent.IncludedDetails = false;
            this.refreshPaystate();
            this.payCode = res.data;
            // this.$parent.payCode = res.data.vaNumber;
            // this.codeState = true;
            this.storeData();
          } else {
            this.$parent.buttonData = {
              loading: false,
              triggerNum: 0,
              customName: false,
            };
            this.$store.state.ovo_va_mex_qrs_Status = false;
          }
        })
        .catch(() => {
          this.$parent.buttonData = {
            loading: false,
            triggerNum: 0,
            customName: false,
          };
          this.$store.state.ovo_va_mex_qrs_Status = false;
        });
    },

    //查询订单状态
    refreshPaystate() {
      //15 minutes order countdown
      this.paymentCountDown = setInterval(() => {
        //order overtime
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
          let timeOut = Number(res.data.expire * (60 * 1000));
          //现在时间
          let newDate = new Date().getTime();
          this.paymentCountDownNum = Math.floor(
            (createdTime + timeOut - newDate) / 1000
          );
        }
        if (
          res &&
          res.data &&
          (res.data.orderStatus === 0 ||
            (res.data.orderStatus >= 2 && res.data.orderStatus <= 6))
        ) {
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
        "indonesiaPayment",
        JSON.stringify(this.payExplain)
      );
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
    this.$store.state.MEXPayStatus = false;
  },
};
</script>

<style lang="scss" scoped>
.opm-container {
  ::v-deep .opm-title {
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 0.16rem;
    line-height: 0.19rem;
    color: #252830;
    margin-bottom: 0.16rem;
    span {
      color: #f53f3f;
    }
  }
  .opm-Payment-amount {
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
  .opm_top_title1 {
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
  .opm-content {
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
        margin-bottom: 0.12rem;
      }
      &.line3 {
        .number {
          border: 1.5px solid #ff7d00;
          background: #fff;
          color: #ff7d00;
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
}
</style>
