<template>
  <!--  菲律宾支付-->
  <div
    class="phpPayment-container"
    id="phpPayment"
    @scroll="handleScroll"
    ref="box_ref"
  >
    <div class="buyPayWaitPage" v-if="webUrl !== ''" key="1">
      <BuyPayWaitPage :url="payUrl" />
    </div>
    <div
      id="phpPayment-content"
      ref="padding_bottom_box"
      v-if="webUrl === ''"
      key="2"
    >
      <div class="php_top" v-if="bankCode === ''">
        <!-- 支付方式信息模块 -->
        <PayMethodInfo class="spacingAdapting-padding" />
        <!-- 支付费用模块 -->
        <IncludedDetails
          class="spacingAdapting-padding"
          v-if="urlCode === ''"
          :type="2"
          :payWayCode="payMethodInfo.payWayCode"
        />
        <!-- qr code -->
        <div
          class="QRCodeView"
          v-if="payMethodInfo.payWayCode === '90007' && urlCode"
        >
          <QrCode ref="QRcode_ref" />
        </div>
      </div>
      <!--          单独支付配置  本地支付-->
      <div class="bankCodePage spacingAdapting-padding" v-if="bankCode !== ''">
        <div class="line">
          <div class="title">{{ $t("phpPayment.BillNumber") }}</div>
          <div class="con">
            <p>{{ bankCode }}</p>
            <copy-img
              v-clipboard:copy="bankCode"
              v-clipboard:success="firstCopySuccess"
              v-clipboard:error="firstCopyError"
            />
          </div>
        </div>
        <div class="content">
          <div class="title">{{ $t("phpPayment.PaymentGuide") }}</div>
          <div class="con">
            <div class="con-top">
              <img
                class="guide-img"
                src="@/assets/images/phpImg/paso1.png"
                alt=""
              />
              <img
                class="arrow-img"
                src="@/assets/images/phpImg/phpRightIcon.svg"
                alt=""
              />
              <img
                class="guide-img"
                src="@/assets/images/phpImg/paso2.png"
                alt=""
              />
              <img
                class="arrow-img"
                src="@/assets/images/phpImg/phpRightIcon.svg"
                alt=""
              />
              <img
                class="guide-img"
                src="@/assets/images/phpImg/paso3.png"
                alt=""
              />
            </div>
            <div class="con-bottom">
              <p>1.{{ $t("phpPayment.PAYSO1") }}</p>
              <p>2.{{ $t("phpPayment.PAYSO2") }}</p>
              <p>3.{{ $t("phpPayment.PAYSO3") }}</p>
            </div>
          </div>
        </div>
        <!--  <div class="bottom_title">
          {{ $t('phpPayment.Incorrect') }}
        </div> -->
      </div>

      <!-- tips icon -->
      <div style="display: flex; justify-content: center">
        <transition>
          <div class="downTips-icon" v-if="goDown_state" @click="goDown">
            <img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt="" />
          </div>
        </transition>
      </div>
      <footer class="footer" ref="footer_ref">
        <div class="errorTips" v-if="form_errorTips">
          Please fill in all fields with valid information.
        </div>
        <ConfirmPayMy
          :buttonData="buttonData"
          :countDown="urlCode || bankCode ? paymentCountDownMinute : ''"
          @click.native="buttonPayment"
          class="buttonConfirm button_ref"
        ></ConfirmPayMy>
        <bottom-bar
          @setPaddingBottom="
            $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`
          "
        />
      </footer>
    </div>
  </div>
</template>
<script>
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import ConfirmPayMy from "@/components/Button/confirm-pay-my";
import { timeDown } from "@/utils";
import BuyPayWaitPage from "@/components/PaymentWaitingPage/buyPayWaitPage";
import { mapState } from "vuex";
import PayMethodInfo from "@/components/PayMethodInfo/index";
import QrCode from "@/components/QrCode/index";
import moment from "moment-timezone";
import { AES_Decrypt } from "@/utils/encryp.js";
import { getUserIp } from "@/utils/publicRequest";

export default {
  name: "phpPayment",
  components: {
    IncludedDetails,
    ConfirmPayMy,
    BuyPayWaitPage,
    PayMethodInfo,
    QrCode,
  },
  data() {
    return {
      bankStatus: false,
      buttonData: {
        loading: false,
        confirmSuccess: false,
        countNum: 0,
      },
      buttonLoading: true,
      goDown_state: false,
      urlCode: "",
      webUrl: "",
      //单独支付code码
      bankCode: "",
      timeDownOut: null,
      paymentCountDownNum: 900,
      paymentCountDownMinute: "15:00",
      showTab: true,

      // 支付链接
      payUrl: "",

      // 表单错误信息
      form_errorTips: false,
    };
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
    }),

    buttonDisabled() {
      if (
        this.webUrl !== "" ||
        this.bankCode !== "" ||
        this.payMethodInfo.payWayCode === "80059"
      ) {
        return false;
      } else {
        return false;
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (
        to.name === "phpPayment" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        sessionStorage.removeItem("phpPayment");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.buttonLoading = true;
      }
    });
  },
  mounted() {
    //参数为空跳转到首页
    if (
      this.orderNo === "" ||
      this.orderNo === undefined ||
      this.orderNo === null
    ) {
      this.$router.replace("/");
      return;
    }

    //获取储存数据
    this.getpageData();
    //判断刚进入页面按钮是否在可视区域
    setTimeout(() => {
      if (this.$refs.box_ref && this.webUrl === "" && this.bankCode === "") {
        this.$parent.$refs.routerView_box.scrollTop = 0;
        let offset = document.querySelector(".button_ref");
        if (
          this.$parent.$refs.routerView_box.scrollTop +
            this.$parent.$refs.routerView_box.offsetHeight >=
          offset.offsetTop
        ) {
          this.goDown_state = false;
        } else {
          this.scrollTimeDown = setTimeout(() => {
            this.goDown_state = true;
          }, 1000);
        }
      }
      window.addEventListener("scroll", this.handleScroll, true);
    });
  },
  destroyed() {
    clearTimeout(this.timeDownOut);
    this.$store.commit("changeBuyPayProcessTab", true);
    this.$parent.confirmOrderStatus = false;
    window.removeEventListener("scroll", this.handleScroll, true);
    this.$store.dispatch("request/clearAllQuery");
  },
  methods: {
    //name名城市验证
    formatter(value) {
      return value.replace(/[^a-zA-Z]/g, "");
    },
    //州地址验证
    formatter1(value) {
      return value.replace(/[^a-zA-Z0-9 ]/g, "");
    },
    //读取数据
    getpageData() {
      if (sessionStorage.getItem("phpPayment")) {
        let data = JSON.parse(sessionStorage.getItem("phpPayment"));
        this.payUrl = data.payUrl;
        this.paymentCountDownNum = data.paymentCountDownNum;
        this.webUrl = data.webUrl;
        this.paymentCountDownMinute = data.paymentCountDownMinute;
        this.urlCode = data.qrUrl;
        this.bankCode = data.bankCode;
        this.timeoutDown = setTimeout(() => {
          this.buttonData = {
            loading: false,
            confirmSuccess: true,
            countNum: 1,
          };
          this.$parent.$refs.viewTab.routerName = "";
          this.$store.commit("changeBuyPayProcessTab", false);
        });
        if (["90007", "80059"].includes(this.payMethodInfo.payWayCode)) {
          setTimeout(() => {
            this.$parent.$refs.viewTab.routerName =
              "navTabTitle.Completepayment";
            this.$refs.QRcode_ref.generateQRcode(this.urlCode);
          });
        } else {
          this.$nextTick(() => {
            this.$parent.confirmOrderStatus = true;
          });
        }
        this.paymentCountStatus();
      }
    },
    //确认订单
    async buttonPayment() {
      if (this.buttonDisabled) {
        this.form_errorTips = true;
        this.buttonData = {
          loading: false,
          confirmSuccess: false,
          countNum: 0,
        };
        return;
      }
      this.form_errorTips = false;

      if (
        this.buttonLoading === true &&
        this.webUrl === "" &&
        this.bankCode === "" &&
        this.urlCode === ""
      ) {
        this.buttonLoading = false;
        let params = {
          orderNo: this.orderNo,
          payWayCode: this.payMethodInfo.payWayCode,
        };
        // Zen 通道方,支付方式;
        if (
          ["52001", "52002", "52003", "52004", "52005"].includes(
            this.payMethodInfo.payWayCode
          )
        ) {
          let ip;
          try {
            ip = await getUserIp();
          } catch (e) {
            console.error(e);
          }
          params = Object.assign(params, {
            customParam: {
              email: AES_Decrypt(localStorage.getItem("login_email")),
              ip,
              fingerPrintId: localStorage.getItem("deviceinf_fingerprint_id"),
            },
            businessParams: {}, // 内部扩展字段
          });
        }

        let windowOpen;
        if (
          this.payMethodInfo.payWayCode &&
          !["90007", "80059"].includes(this.payMethodInfo.payWayCode)
        ) {
          windowOpen = window.open("", "_blank");
        }
        let axiosUrl;
        axiosUrl = this.$api.post_alchemyPayPay;
        this.$axios
          .post(axiosUrl, params, "")
          .then((res) => {
            if (res) {
              //按钮条件
              this.buttonData.confirmSuccess = true;
              this.buttonData.loading = false;
              this.payUrl = res.data.webUrl;
              //弹出框条件
              this.$store.commit("set_ovo_va_mex_qrs_Status", true);
              this.$store.commit("changeBuyPayProcessTab", false);
              // 90007为二维码的本地支付  非90007的则为跳第三方
              if (!["90007", "80059"].includes(this.payMethodInfo.payWayCode)) {
                this.$parent.confirmOrderStatus = true;
                this.webUrl = res.data.webUrl;
                windowOpen.location = res.data.webUrl;
                setTimeout(() => {
                  this.$parent.$refs.viewTab.routerName =
                    "navTabTitle.Completepayment";
                });
              } else {
                // 扫码支付
                if (this.payMethodInfo.payWayCode === "90007") {
                  this.urlCode = res.data.webUrl;
                  setTimeout(() => {
                    this.$parent.$refs.viewTab.routerName =
                      "navTabTitle.Completepayment";
                    this.$refs.QRcode_ref.generateQRcode(this.urlCode);
                  });
                }
                //本地收银台
                if (this.payMethodInfo.payWayCode === "80059") {
                  this.bankCode = res.data.bankTradeNum;
                  setTimeout(() => {
                    //隐藏顶部状态栏
                    this.$parent.$refs.viewTab.routerName =
                      "navTabTitle.Completepayment";
                    //确认订单页面转回顶部
                    this.$parent.$refs.routerView_box.scrollTop = 0;
                  });
                }
              }
              this.paymentCountStatus();
            }
          })
          .catch((error) => {
            if (error && ["91003", "60007"].includes(error.returnCode)) {
              this.$parent.$parent.tipsState = false;
              this.$router.replace(
                `/paymentResult?customParam=${this.orderNo}`
              );
            }
            this.buttonData = {
              loading: false,
              triggerNum: 0,
              customName: false,
            };
            this.buttonLoading = true;
            this.payMethodInfo.payWayCode !== "90007" ? windowOpen.close() : "";
          });
      }
    },
    //刷新订单状态
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
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },
    //页面15分钟倒计时
    paymentCountStatus() {
      clearInterval(this.timeDownOut);
      this.timeDownOut = setInterval(() => {
        if (this.paymentCountDownNum > 0) {
          // this.paymentCountDownNum--
          this.paymentCountDownMinute = timeDown(this.paymentCountDownNum);
          let data = {
            webUrl: this.webUrl,
            paymentCountDownNum: this.paymentCountDownNum,
            paymentCountDownMinute: timeDown(this.paymentCountDownNum),
            qrUrl: this.urlCode,
            bankCode: this.bankCode,
            payUrl: this.payUrl,
          };
          sessionStorage.setItem("phpPayment", JSON.stringify(data));
        } else {
          if (this.paymentCountDownNum <= 0) {
            clearInterval(this.paystateTimeOut);
            clearInterval(this.paymentCountDown);
            this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
            return;
          }
          this.paymentCountDownMinute = "00:00";
          clearInterval(this.TimeDown);
        }
        this.requestStatus();
      }, 1000);
    },
    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll() {
      if (this.$refs.box_ref && this.webUrl === "") {
        window.clearTimeout(this.scrollTimeDown);
        this.scrollTimeDown = null;
        // let offset = this.$refs.button_ref.$refs.buttonChild_ref.getBoundingClientRect();
        //附加滚动按钮距离顶部距离
        let offset = document.querySelector(".button_ref");
        if (
          this.$parent.$refs.routerView_box.scrollTop +
            this.$parent.$refs.routerView_box.offsetHeight +
            50 >=
          offset.offsetTop
        ) {
          this.goDown_state = false;
        } else {
          this.scrollTimeDown = setTimeout(() => {
            this.goDown_state = true;
          }, 1000);
        }
      }
    },
    goDown() {
      setTimeout(() => {
        let offset = document.querySelector("#phpPayment-content");
        offset.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
        this.goDown_state = false;
      });
    },
    //复制
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
};
</script>

<style lang="scss" scoped>
.buyPayWaitPage,
.heightAuto {
  height: 100%;
}

.phpPayment-container {
  flex: 1;
  #phpPayment-content {
    height: 100%;
    .footer {
      width: 100%;
      position: sticky;
      left: 0;
      background: #ffffff;
      padding: 0.08rem 0 0;
      z-index: 999;
      .errorTips {
        margin-bottom: 0.05rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.18rem;
        color: #f53f3f;
      }
    }
  }
  .qrCode-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f4f5f7;
    padding: 0.2rem 0 0.2rem;
    margin-top: 0.24rem;
    border-radius: 0.06rem;
    .QRISText {
      font-family: Medium;
      font-size: 0.13rem;
      color: #252830;
      margin-top: 0.16rem;
    }
  }
  .downTips-icon {
    position: absolute;
    bottom: 0.5rem;
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
    animation: jumpBoxHandler 1.8s infinite; /* 1.8s 事件完成时间周期 infinite无限循环 */
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
      transform: translate(0px, 0.06rem); /* 可配置跳动方向 */
    }
    100% {
      transform: translate(0px, 0px);
    }
  }
}

.bankCodePage {
  .line {
    margin-bottom: 0.24rem;
    .title {
      margin-bottom: 0.08rem;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 700;
      font-size: 0.14rem;
      line-height: 0.22rem;
      color: #252830;
    }
    .con {
      height: 0.44rem;
      background: #f4f8fb;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.12rem;
      cursor: pointer;
      p {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.2rem;
        color: #252830;
      }
      img {
        width: 0.16rem;
      }
    }
  }
  .content {
    .title {
      margin-bottom: 0.08rem;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 700;
      font-size: 0.14rem;
      line-height: 0.22rem;
      color: #252830;
    }
    .con {
      .con-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.13rem;
        .guide-img {
          height: 1.23rem;
          width: auto;
        }
        .arrow-img {
          width: 0.16rem;
          height: auto;
        }
      }
      .con-bottom {
        background: rgba(2, 96, 231, 0.1);
        border: 1px solid rgba(2, 96, 231, 0.2);
        border-radius: 0.06rem;
        padding: 0.12rem;
        p {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.12rem;
          line-height: 0.14rem;
          /* identical to box height, or 117% */

          /* 标题 */

          color: #252830;

          &:not(:last-child) {
            margin-bottom: 0.04rem;
          }
        }
      }
    }
  }
}

//新增样式
.QRCodeView {
  width: 100%;
  margin-top: 0.24rem;
}
</style>
