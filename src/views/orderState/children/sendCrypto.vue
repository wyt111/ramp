<template>
  <div class="sendCrypto-container">
    <div class="sendCrypto_nav">
      <div class="sendCrypto_nav_left">
        <img
          v-if="source !== '3'"
          @click="buttonNext('goHome')"
          src="@/assets/images/goBack.svg"
          alt=""
        />
        <p>
          {{ $t("sellOrderFonts.sellTitle") }}
          {{ orderStateData.cryptocurrency }}
        </p>
      </div>
      <div class="sendCrypto_nav_right">
        <img
          class="menu"
          src="@/assets/images/meun-icon.svg"
          v-if="this.$parent.$parent.routerViewState && source !== '3'"
          @click="openMenu"
        />
      </div>
    </div>
    <div
      class="order-info"
      v-if="[0, 1].includes(orderStateData.orderStatus)"
      ref="padding_bottom_box"
    >
      <div class="order-detail">
        <div class="sendCrypto_title copy">
          <div class="sendCrypto_title_left">
            {{ $t("sellOrderFonts.Sellorder_Id") }}
          </div>
          <div class="sendCrypto_title_right order-con">
            <span>{{ orderStateData.orderId }}</span>
            <copy-img
              v-clipboard:copy="orderStateData.orderId"
              v-clipboard:success="copySuccess"
              v-clipboard:error="copyError"
            />
          </div>
        </div>
        <div class="pay-info-view">
          <p class="title">{{ $t("sellOrderFonts.pay_info.title") }}</p>
          <div class="sendCrypto_title first-child">
            <div class="sendCrypto_title_left">
              {{ $t("sellOrderFonts.pay_info.line1") }}
            </div>
            <div class="sendCrypto_title_right">
              {{ orderStateData.cryptoAmount }}
              {{ orderStateData.cryptocurrency }}
            </div>
          </div>
          <div class="sendCrypto_title">
            <div class="sendCrypto_title_left">
              {{ $t("sellOrderFonts.pay_info.line2") }}
            </div>
            <div class="sendCrypto_title_right">
              {{ orderStateData.fiatSymbol }} {{ orderStateData.rampFee }}
            </div>
          </div>
          <div class="sendCrypto_title">
            <div class="sendCrypto_title_left">
              {{ $t("sellOrderFonts.pay_info.line3") }}
            </div>
            <div class="sendCrypto_title_right">
              {{ orderStateData.fiatSymbol }} {{ orderStateData.fiatAmount }}
            </div>
          </div>
        </div>
        <!-- 订单倒计时 -->
        <div class="order-countdown">
          {{ $t("sellOrderFonts.Sellorder_transfer") }}
          {{ orderStateData.cryptocurrency }}
          {{ $t("sellOrderFonts.Sellorder_within") }}
          <span>{{ turnMinute(orderStateData.expirationTime) }}</span>
          {{ $t("sellOrderFonts.Sellorder_after") }}
        </div>
        <div>
          <!-- 商户配置showAddress展示内容不展示二维码 -->
          <div v-if="merchantView" class="merchant-view">
            <div class="address-network">
              <div class="line">
                <div class="title">
                  {{ $t("sellOrderFonts.Sellorder_Address") }} ({{
                    orderStateData.cryptocurrency
                  }})
                </div>
                <div class="text">
                  <p>{{ orderStateData.address }}</p>
                  <copy-img
                    v-clipboard:copy="orderStateData.address"
                    v-clipboard:success="copySuccess"
                    v-clipboard:error="copyError"
                  />
                </div>
              </div>
              <div class="line">
                <div class="title">
                  {{ $t("sellOrderFonts.Sellorder_Network_Text") }}
                </div>
                <div class="text">
                  {{ orderStateData.networkName }}
                </div>
              </div>
            </div>
          </div>
          <template v-else>
            <!-- ramp流程展示二维码 -->
            <div class="sendCrypto_content address">
              <div class="title">
                {{ $t("sellOrderFonts.Sellorder_Address") }} ({{
                  orderStateData.networkName
                }})
              </div>
              <div
                class="content order-con addressHover"
                @mouseleave="handlerMousele"
              >
                <p>{{ orderStateData.address }}</p>
                <copy-img
                  v-clipboard:copy="orderStateData.address"
                  v-clipboard:success="copySuccess"
                  v-clipboard:error="copyError"
                />
              </div>
            </div>
            <div class="sendCrypto_qrcode">
              <div ref="qrCodeUrl" class="qrCodeUrl"></div>
            </div>
          </template>
        </div>
        <!-- 提示信息 -->
        <div class="sendCrypto_bottom_title">
          {{ $t("sellOrderFonts.Sellorder_PleaseCorrect") }}
        </div>
      </div>
      <div class="footer" ref="footer_ref1">
        <!-- 按钮 商户卖币跳转到商户携带的地址 -->
        <button
          class="sendCrypto_button"
          v-if="
            (sell_merchantInfo.merchantQueryInfo.urlType &&
              sell_merchantInfo.merchantQueryInfo.withdrawUrl) ||
            source === '3'
          "
          @click="buttonNext('goMerchant')"
        >
          <template v-if="source === '3'">
            <span>
              {{ $t("sellOrderFonts.Sellorder_ButtonGoMerchant1") }}
              {{
                merchantInfo_AELF.merchantName
                  ? merchantInfo_AELF.merchantName
                  : "AELF"
              }}
              {{ $t("sellOrderFonts.Sellorder_ButtonGoMerchant2") }}
            </span>
          </template>
          <template v-else>
            <!-- 卖币商户携带withdrawalButton展示商户文案 -->
            <span
              v-if="this.sell_merchantInfo.merchantQueryInfo.withdrawalButton"
              >{{
                this.sell_merchantInfo.merchantQueryInfo.withdrawalButton
              }}</span
            >
            <span v-else>
              {{ $t("sellOrderFonts.Sellorder_ButtonGoMerchant1") }}
              {{ sell_merchantInfo.merchantQueryInfo.merchantName }}
              {{ $t("sellOrderFonts.Sellorder_ButtonGoMerchant2") }}
            </span>
          </template>

          <img
            class="rightIcon"
            src="@/assets/images/button-right-icon.svg"
            alt=""
          />
        </button>
        <!-- 按钮 非商户卖币 -->
        <button class="sendCrypto_button" v-else @click="buttonNext('button')">
          <!-- transferredShow=true -->
          {{ $t("sellOrderFonts.Sellorder_ButtonHaveSent") }}
          {{ orderStateData.cryptocurrency }}
          <img
            class="rightIcon"
            src="@/assets/images/button-right-icon.svg"
            alt=""
          />
        </button>

        <powered-by @setPaddingBottom="setPaddingBottomFun" />
      </div>
    </div>

    <div
      v-else-if="
        orderStateData.orderStatus == 7 || orderStateData.expirationTime == 0
      "
      class="sendCrypto_timeError"
    >
      <div class="sendCrypto_content1">
        <img src="@/assets/images/SellOrderTime.svg" alt="" />
        <div class="p1">
          {{ $t("paymentResult.paymentTimeout.order_timeout") }}
        </div>
        <p class="p2">{{ $t("sellOrderFonts.Sellorder_timeOutTitle") }}</p>
      </div>
      <div class="sendCrypto_title">
        <p>{{ $t("sellOrderFonts.Sellorder_Id") }}</p>
        <p class="order-con">
          <span>{{ orderStateData.orderId }}</span>
          <copy-img
            v-clipboard:copy="orderStateData.orderId"
            v-clipboard:success="copySuccess"
            v-clipboard:error="copyError"
          />
        </p>
      </div>
      <div class="sendCrypto_button" @click="$router.replace('/')">
        <button>
          {{ $t("sellOrderFonts.Sellorder_ButtongoHome") }}
          <img
            class="rightIcon"
            src="@/assets/images/button-right-icon.svg"
            alt=""
          />
        </button>
      </div>
    </div>
    <!-- 二次确认弹框-->
    <div v-else></div>
    <div class="sendCrypto_confing" v-show="transferredShow">
      <div class="content" key="next">
        <p class="tipsText">
          <span> {{ $t("sellOrderFonts.Sellorder_transferred") }}</span>
        </p>
        <footer class="footer_confirmOrder">
          <button @click.stop="transferredShow = false">
            {{ $t("sellOrderFonts.Sellorder_ButtonNot") }}
          </button>
          <button @click.stop="confirmSell">
            {{ $t("sellOrderFonts.Sellorder_ButtonConfirm") }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import { mapState } from "vuex";

export default {
  name: "sendCrypto",
  props: {
    orderStateData: {
      default: "",
    },
  },
  data() {
    return {
      transferredShow: false,
      timeText: "",
      feeInfo: "",
      //二次确认的显示隐藏
      confirmSecondary: true,
      resizeObserver: null,
    };
  },
  computed: {
    //卖币信息
    ...mapState("sellPayments", {
      sellPayType: (state) => state.sellPayType,
    }),
    ...mapState("cryptoSellPage", {
      cryptoInfo: (state) => state.cryptoInfo,
      cryptoAmount: (state) => state.cryptoAmount,
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      networkInfo: (state) => state.networkInfo,
    }),
    ...mapState("sellCryptoMerchantAELF", {
      source: (state) => state.merchantInfo.source,
      merchantInfo_AELF: (state) => state.merchantInfo,
    }),
    ...mapState("sellPayments", {
      history_cryptoInfo: (state) => state.cryptoInfo,
      history_cryptoAmount: (state) => state.cryptoAmount,
      history_fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      history_networkInfo: (state) => state.networkInfo,
    }),
    // 卖币商户信息
    ...mapState("buyCryptoMerchant", {
      sell_merchantInfo: (state) => state.merchantInfo,
    }),
    // 页面基本数据
    initData() {
      let data = {};
      if (!this.$route.query.sellOrderId) {
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
    merchantView() {
      if (
        (this.sell_merchantInfo.merchantQueryInfo.showAddress &&
          this.sell_merchantInfo.merchantQueryInfo.showAddress.toLowerCase() ===
            "n") ||
        this.source === "3"
      ) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    if (
      this.orderStateData.orderStatus == 7 ||
      this.orderStateData.expirationTime == 0
    ) {
      return false;
    }
    if (
      (this.orderStateData.orderStatus === 7 &&
        this.$store.state.nextOrderState == 1) ||
      (this.$store.state.nextOrderState == 1 &&
        this.orderStateData.expirationTime <= 0)
    ) {
      return;
    }
  },

  activated() {
    if (
      (this.orderStateData.orderStatus === 7 &&
        this.$store.state.nextOrderState == 1) ||
      (this.$store.state.nextOrderState == 1 &&
        this.orderStateData.expirationTime <= 0)
    ) {
      return;
    }
  },
  deactivated() {
    this.resizeObserver?.disconnect();
  },
  destroyed() {
    this.resizeObserver?.disconnect();
  },
  methods: {
    setPaddingBottomFun() {
      try {
        this.resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const target = entry.target;
            this.$refs.padding_bottom_box.style.paddingBottom =
              target.clientHeight + "px";
          }
        });
        this.resizeObserver.observe(this.$refs.footer_ref1);
      } catch (e) {
        console.log(e);
      }
    },
    //地址栏鼠标移开事件
    handlerMousele() {
      let address = document.querySelector(".addressHover p");
      address && address.scrollLeft ? (address.scrollLeft = 0) : "";
    },

    //确认切换
    confirmSell() {
      this.transferredShow = false;

      this.$store.state.nextOrderState = 2;
    },
    //复制
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
    //二维码
    generateQRcode() {
      // 商户携带showAddress不生成二维码
      if (
        (this.orderStateData.orderStatus == 1 ||
          this.orderStateData.orderStatus == 0) &&
        (!this.sell_merchantInfo.merchantQueryInfo.showAddress ||
          this.sell_merchantInfo.merchantQueryInfo.showAddress.toLowerCase() ===
            "y") &&
        this.source !== "3"
      ) {
        this.$refs.qrCodeUrl.innerHTML = "";
        new QRCode(this.$refs.qrCodeUrl, {
          text: this.orderStateData.address,
          width: "140",
          height: "140",
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
        return;
      }
    },
    //Calculate minutes and seconds
    turnMinute(value) {
      if (value >= 0) {
        var num = value;
        return (
          "0".repeat(2 - String(Math.floor(num / 3600)).length) +
          Math.floor(num / 3600) +
          ":" +
          "0".repeat(2 - String(Math.floor((num % 3600) / 60)).length) +
          Math.floor((num % 3600) / 60) +
          ":" +
          "0".repeat(2 - String(Math.floor((num % 3600) % 60)).length) +
          Math.floor((num % 3600) % 60)
        );
      }
    },
    //打开菜单栏
    openMenu() {
      this.$parent.$parent.routerViewState = false;
      this.$store.state.routerViewState = false;
    },
    //进行返回首页或者下一步的显示隐藏
    buttonNext(val) {
      if (val == "button") {
        this.transferredShow = true;
        this.confirmSecondary = false;
        return;
      }
      // 跳转到商户指定地址
      if (val === "goMerchant") {
        if (this.source === "3") {
          window.location = this.merchantInfo_AELF.withdrawUrl;
        } else {
          if (
            this.sell_merchantInfo.merchantQueryInfo?.withdrawUrl &&
            this.sell_merchantInfo.merchantQueryInfo?.urlType === "web"
          ) {
            // web：跳转网页，此时需要指定链接
            window.location =
              this.sell_merchantInfo.merchantQueryInfo.withdrawUrl;
            // window.location = 'https://www.baidu.com/';
          } else if (
            this.sell_merchantInfo.merchantQueryInfo?.urlType === "app"
          ) {
            // app：跳转回app，此时需要指定方法名
            // console.log('app:跳转回app,此时需要指定方法名');
            window.location =
              this.sell_merchantInfo.merchantQueryInfo.withdrawUrl;
          }
        }

        return;
      }
      if (val === "goHome") {
        if (!this.$store.state.routerViewState) {
          this.$router.go(-1);
          this.TimeOut = setTimeout(() => {
            this.$parent.routerViewState = false;
          });
        } else {
          this.$router.push("/");
          setTimeout(() => {
            this.$parent.$parent.$refs.routerView.menuState = false;
          });
          return;
        }
      }
    },
  },
  watch: {
    "orderStateData.address": {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$nextTick(() => {
            this.generateQRcode();
          });
        }
      },
    },
    orderStateData: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.$forceUpdate();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.sendCrypto-container {
  height: 100%;
  .sendCrypto_nav {
    padding-bottom: 0.16rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background-color: #fff;
    .sendCrypto_nav_left {
      display: flex;
      align-items: center;
      img {
        height: 0.24rem;
        cursor: pointer;
        margin-right: 0.12rem;
      }
      p {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 600;
        font-size: 0.18rem;
        line-height: 0.22rem;
        color: #252830;
      }
    }
    .sendCrypto_nav_right {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 0.24rem;
        cursor: pointer;
      }
    }
  }
  .order-info {
    padding-bottom: 0.89rem;
    .order-detail {
      .pay-info-view {
        border-bottom: 1px solid #dbdee3;
        padding-bottom: 0.21rem;
        margin-top: 0.18rem;
        .title {
          color: #252830;
          font-family: SF Pro Display;
          font-size: 0.16rem;
          font-style: normal;
          font-weight: 500;
          line-height: 0.2rem;
        }
      }

      .sendCrypto_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.1rem;

        .sendCrypto_title_left {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.12rem;
          line-height: 0.14rem;
          color: #252830;
        }
        .sendCrypto_title_right {
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 500;
          font-size: 0.12rem;
          line-height: 0.14rem;
          color: #252830;
        }

        &:nth-of-type(2) {
          margin-top: 0.16rem;
        }

        &.first-child {
          margin-top: 0.13rem;
          .sendCrypto_title_left {
            color: #252830;
            font-family: SF Pro Display;
            font-size: 0.14rem;
            font-style: normal;
            font-weight: 500;
            line-height: 0.18rem;
          }
          .sendCrypto_title_right {
            color: #252830;
            text-align: right;
            font-family: HarmonyOS Sans;
            font-size: 0.16rem;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }
        }
        &.copy {
          .sendCrypto_title_right {
            display: flex;
            align-items: center;
            word-break: break-all;
            max-width: 2.33rem;
            img {
              width: 0.16rem;
              margin-left: 0.08rem;
              cursor: pointer;
            }
          }
        }
      }

      .order-countdown {
        width: 100%;
        min-height: 0.62rem;
        border-radius: 0.06rem;
        border: 1px solid #2d7cef;
        background: rgba(45, 124, 239, 0.1);
        color: #252830;
        font-family: SF Pro Display;
        font-size: 0.14rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.2rem;
        padding: 0.11rem 0.15rem;
        margin-top: 0.2rem;
        span {
          color: #f45152;
          font-family: SF Pro Display;
          font-size: 0.14rem;
          font-style: normal;
          font-weight: 500;
          margin-left: 0.02rem;
        }
      }

      .sendCrypto_qrcode {
        background: #f4f8fb;
        border: 1px solid #e6e8eb;
        border-radius: 0.06rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.26rem;
        .qrCodeUrl {
        }
      }
      .sendCrypto_content {
        margin-top: 0.24rem;
        &.address {
          margin-bottom: 0.1rem;
          .title {
            font-family: "SF Pro Display";
            font-style: normal;
            font-weight: 500;
            font-size: 0.13rem;
            line-height: 0.18rem;
            color: #5d636d;
            margin-bottom: 0.02rem;
          }
          .content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.48rem;
            background: #f4f8fb;
            border: 1px solid #e6e8eb;
            border-radius: 0.06rem;
            padding: 0 0.12rem;
            p {
              width: 2.91rem;
              overflow: hidden;
              text-overflow: ellipsis;

              font-family: "SF Pro Display";
              font-style: normal;
              font-weight: 500;
              font-size: 0.14rem;
              line-height: 0.2rem;
              white-space: nowrap;
              word-break: keep-all;
              /* identical to box height, or 125% */

              /* 标题 */

              color: #252830;
            }
            img {
              cursor: pointer;
              width: 0.16rem;
            }
            &:hover {
              overflow: scroll;
              p {
                width: 3rem;
                padding: 0 0.05rem 0 0;
                text-overflow: inherit !important;
                overflow: auto !important;
              }
            }
          }
        }
      }
      .sendCrypto_bottom_title {
        margin-top: 0.09rem;
        padding: 0.08rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.11rem;
        line-height: 0.15rem;
        color: #252830;
        border-radius: 0.06rem;
        background: rgba(255, 125, 0, 0.05);
        margin-bottom: 0.16rem;
        border: 1px solid rgba(255, 125, 0, 0.15);
      }
    }
    .footer {
      width: 100%;
      position: absolute;
      bottom: 0.2rem;
      left: 0;
      background: #ffffff;
      padding: 0.08rem 0.16rem 0;
      z-index: 999;
      .sendCrypto_button {
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
  .sendCrypto_timeError {
    padding-top: 0.18rem;
    .sendCrypto_content1 {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 0.2rem;

      img {
        width: 1.6rem;
        margin-bottom: 0.12rem;
      }
      .p1 {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 700;
        font-size: 0.2rem;
        line-height: 0.24rem;
        text-align: center;
        color: #252830;
        margin-bottom: 0.08rem;
      }
      .p2 {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.14rem;
        line-height: 0.18rem;
        text-align: center;
        color: #252830;
      }
    }
    .sendCrypto_title {
      height: 0.4rem;
      background: #f4f8fb;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.12rem;
      p {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.12rem;
        line-height: 0.14rem;
        color: #5d636d;
        display: flex;
        align-items: center;
        span {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.12rem;
          line-height: 0.14rem;
          text-align: right;
          color: #252830;
        }
        img {
          width: 0.16rem;
          margin-left: 0.08rem;
        }
        &.order-con {
          cursor: pointer;
        }
      }
    }
    .sendCrypto_button {
      width: 100%;
      position: absolute;
      bottom: 0.2rem;
      left: 0;
      background: #ffffff;
      padding: 0.08rem 0.16rem 0;
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

  .merchant-view {
    .address-network {
      width: 100%;
      background: #f4f8fb;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      margin-top: 0.24rem;
      .line {
        padding: 0.12rem;
        &:last-child {
          border-top: 1px solid #e6e8eb;
        }
        .title {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.13rem;
          line-height: 0.18rem;
          color: #5d636d;
        }
        .text {
          margin-top: 0.04rem;
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.14rem;
          line-height: 0.2rem;
          // word-break: break-all;

          display: flex;
          align-items: center;
          justify-content: space-between;
          p {
            width: 2.91rem;
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: "SF Pro Display";
            font-style: normal;
            white-space: nowrap;
            word-break: keep-all;
            color: #252830;
          }
        }
      }
    }
  }

  .sendCrypto_confing {
    z-index: 9999;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.16rem;
    .content {
      background: #ffffff;
      border-radius: 0.08rem;
      overflow: hidden;
      padding: 0.24rem 0 0;
      .tipsText {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.16rem;
        line-height: 0.24rem;
        text-align: center;
        color: #252830;
        padding: 0 0.12rem;
        span {
        }
      }
      .footer_confirmOrder {
        display: flex;
        align-items: center;
        margin-top: 0.24rem;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
          box-shadow: 0 0 0 0.25px #e6e8eb;
        }
        &:after {
          content: "";
          position: absolute;
          height: 100%;
          left: 50%;
          top: 0;
          box-shadow: 0 0 0 0.25px #e6e8eb;
        }

        button {
          height: 0.48rem;
          width: 50%;
          border: 0;
          border-radius: 0;
          background: #fff;
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          color: #5d636d;
          cursor: pointer;
          &:hover {
            background: #f5f5f5;
          }
          &:active {
            background: #ededed;
          }
          & + button {
            color: #0059da;
            font-weight: 500;
          }
        }
      }
    }
  }
  ::v-deep .network-choose-list {
    width: 100%;
    background: #ffffff;
    padding: 0.24rem 0.08rem 0.32rem;
    border-radius: 0.24rem 0.24rem 0 0;
    position: absolute;
    .van-action-sheet__header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.18rem;
      line-height: 0.21rem;
      text-align: center;
      color: #252830;
      margin-bottom: 0.24rem;
      .van-action-sheet__close {
        img {
          position: absolute;
          display: block;
          top: 0.25rem;
          right: 0.16rem;
          width: 0.2rem;
          cursor: pointer;
        }
      }
    }

    .van-action-sheet__content {
      max-height: 3.36rem;
      overflow: auto;
      .Network-content {
        height: 0.56rem;
        padding: 0 0.08rem;
        border-radius: 0.06rem;
        display: flex;
        align-items: center;

        img {
          width: 0.32rem;
          height: 0.32rem;
          border-radius: 50%;
          margin-right: 0.16rem;
        }
        span {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.16rem;
          line-height: 0.2rem;
          color: #252830;
        }
        &.ac {
          span {
            color: #0059da;
          }
        }
        &:hover {
          background: #f5f5f5;
        }
        &:active {
          background: #ededed;
        }
      }
    }
  }
}
//
//
//
//
//
//
//
//
//
//
//
</style>
