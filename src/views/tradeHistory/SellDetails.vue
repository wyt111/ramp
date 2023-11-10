<template>
  <div
    id="tradeHistory-details"
    :class="{
      orderStatus6: detailsData.orderStatus === 6,
      orderStatus8: detailsData.orderStatus === 8,
      orderStatus1:
        detailsData.orderStatus === 1 && detailsData.confirmBlock === 0,
    }"
    ref="padding_bottom_box"
  >
    <div
      class="content"
      :class="{
        sellOrderBlockConfirmed: [1, 2].includes(detailsData.orderStatus),
        sellConfirmOrder: detailsData.orderStatus === 3,
        sellInTransfer: detailsData.orderStatus === 4,
        sellCompleted: detailsData.orderStatus === 5,
        sellFailed: detailsData.orderStatus === 6,
        sellClosed: detailsData.orderStatus === 7,
        sellError: detailsData.orderStatus === 8,
        sellRefunding: detailsData.orderStatus === 9,
        sellRefund: detailsData.orderStatus === 10,
        pb0:
          ([1, 2].includes(detailsData.orderStatus) &&
            detailsData.confirmBlock === 0) ||
          detailsData.orderStatus === 6 ||
          detailsData.orderStatus === 8,
      }"
    >
      <div class="line-height1">
        <div class="left">
          <img :src="detailsData.cryptoIcon" alt="" />
          <span class="text"
            >{{ $t("sellHistory.sell") }} {{ detailsData.cryptocurrency }}</span
          >
        </div>
        <div class="right">
          <template v-if="[1, 2].includes(detailsData.orderStatus)">
            <img
              src="@/assets/images/tradeHistory/sellOrderBlockConfirmed.svg"
              alt=""
              class="img"
            />
            <div>
              {{ $t("sellHistory.sellOrderBlockConfirmed") }} ({{
                detailsData.confirmBlock
              }}/{{ detailsData.totalBlock }})
            </div>
          </template>
          <template v-else-if="detailsData.orderStatus === 3">
            <img
              src="@/assets/images/tradeHistory/sellOrderBlockConfirmed.svg"
              alt=""
              class="img"
            />
            <div>{{ $t("sellHistory.sellConfirmOrder") }}</div>
          </template>
          <template v-else-if="detailsData.orderStatus === 4">
            <img
              src="@/assets/images/tradeHistory/sellOrderBlockConfirmed.svg"
              alt=""
              class="img"
            />
            <div>{{ $t("sellHistory.sellInTransfer") }}</div>
          </template>
          <template v-else-if="detailsData.orderStatus === 5">
            <img
              src="@/assets/images/tradeHistory/sellCompleted.svg"
              alt=""
              class="img"
            />
            <div>{{ $t("sellHistory.sellCompleted") }}</div>
          </template>
          <template v-else-if="detailsData.orderStatus === 6">
            <img
              src="@/assets/images/tradeHistory/sellFailed.svg"
              alt=""
              class="img"
            />
            <div>{{ $t("sellHistory.sellFailed") }}</div>
          </template>
          <template v-else-if="detailsData.orderStatus === 7">
            <img
              src="@/assets/images/tradeHistory/sellClosed.svg"
              alt=""
              class="img"
            />
            <div>{{ $t("sellHistory.sellClosed") }}</div>
          </template>
          <template v-else-if="detailsData.orderStatus === 8">
            <img
              src="@/assets/images/tradeHistory/sellError.svg"
              alt=""
              class="img"
            />
            <div>{{ $t("sellHistory.sellFailed") }}</div>
          </template>
          <template v-else-if="detailsData.orderStatus === 9">
            <img
              src="@/assets/images/tradeHistory/sellOrderBlockConfirmed.svg"
              alt=""
              class="img"
            />
            <div>{{ $t("sellHistory.sellRefunding") }}</div>
          </template>
          <template v-else-if="detailsData.orderStatus === 10">
            <img
              src="@/assets/images/tradeHistory/sellCompleted.svg"
              alt=""
              class="img"
            />
            <div>{{ $t("sellHistory.sellRefund") }}</div>
          </template>
        </div>
      </div>
      <div class="amountInfo">
        <div class="amountInfo-line">
          <div class="left">
            {{ $t("sellHistory.sellOrderAmount") }} ({{
              detailsData.cryptocurrency
            }})
          </div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.orderAmount) === '--' }"
              >{{ noData(detailsData.orderAmount) }}</span
            >
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">
            {{ $t("sellHistory.sellOrderActualAmount") }} ({{
              detailsData.cryptocurrency
            }})
          </div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.actualAmount) === '--' }"
              >{{ noData(detailsData.actualAmount) }}</span
            >
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">
            {{ $t("sellHistory.sellPrice") }} ({{ detailsData.fiatName }})
          </div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.price) === '--' }"
              >{{ noData(detailsData.price) }}</span
            >
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">
            {{ $t("sellHistory.sellTotal") }} ({{ detailsData.fiatName }})
          </div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.total) === '--' }"
              >{{ noData(detailsData.total) }}</span
            >
          </div>
        </div>
        <div class="amountInfo-line" v-if="detailsData.failureNumber < 2">
          <div class="left">
            {{ $t("sellHistory.sellRampFee") }} ({{ detailsData.fiatName }})
          </div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.rampFee) === '--' }"
              >{{ noData(detailsData.rampFee) }}</span
            >
          </div>
        </div>
        <!--  <div class="amountInfo-line" v-if="detailsData.orderStatus === 6 || detailsData.orderStatus === 11 || detailsData.orderStatus === 8 || detailsData.orderStatus === 10">
          <div class="left">{{ $t('sellHistory.sellReturnfee') }} ({{ detailsData.fiatName }})</div>
          <div class="right">
            <span class="value" v-if="detailsData.returnFee !== '' && detailsData.returnFee !== null"
              >{{ noData(detailsData.returnFee) }}<span class="fee" v-if="detailsData.fiatName !== 'USD'">({{ noData(25 * detailsData.failureNumber) === '--' ? noData(25 * detailsData.failureNumber) : noData(25 * detailsData.failureNumber) + 'USD' }} )</span></span
            >
            <span class="empty" v-else>-- </span>
          </div>
        </div> -->
        <div class="amountInfo-line">
          <div class="left">
            {{ $t("sellHistory.sellFinalTotal") }} ({{ detailsData.fiatName }})
          </div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.finalTotal) === '--' }"
              >{{ noData(detailsData.finalTotal) }}</span
            >
          </div>
        </div>
      </div>
      <div class="orderStatus">
        <div class="title">
          <div class="left">{{ $t("sellHistory.sellStatus") }}</div>
          <div class="right">
            <span v-if="[1, 2].includes(detailsData.orderStatus)">{{
              $t("sellHistory.sellOrderBlockConfirmed")
            }}</span>
            <span v-else-if="detailsData.orderStatus === 3">{{
              $t("sellHistory.sellConfirmOrder")
            }}</span>
            <span v-else-if="detailsData.orderStatus === 4">{{
              $t("sellHistory.sellInTransfer")
            }}</span>
            <span class="completed" v-else-if="detailsData.orderStatus === 5">{{
              $t("sellHistory.sellCompleted")
            }}</span>
            <span
              class="failed1"
              v-else-if="
                detailsData.orderStatus === 6 || detailsData.orderStatus === 11
              "
              >{{ $t("sellHistory.sellFailed") }}</span
            >
            <span class="timeout" v-else-if="detailsData.orderStatus === 7">{{
              $t("sellHistory.sellClosed")
            }}</span>
            <span class="failed3" v-else-if="detailsData.orderStatus === 8">{{
              $t("sellHistory.sellFailed")
            }}</span>
            <span class="failed3" v-else-if="detailsData.orderStatus === 9">{{
              $t("sellHistory.sellRefunding")
            }}</span>
            <span class="failed3" v-else-if="detailsData.orderStatus === 10">{{
              $t("sellHistory.sellFailedState")
            }}</span>
          </div>
        </div>
        <div class="speed-progress">
          <div
            class="percentage"
            :style="{ width: percentage + '%' }"
            :class="{
              notCompleted:
                (detailsData.orderStatus === 2 &&
                  detailsData.confirmBlock !== 0) ||
                [3, 4].includes(detailsData.orderStatus),
              completed: [5].includes(detailsData.orderStatus),
              tempFailed: [6, 11].includes(detailsData.orderStatus),
              failed: [8, 9, 10].includes(detailsData.orderStatus),
              timeOut: [7].includes(detailsData.orderStatus),
            }"
          ></div>
          <div class="all"></div>
        </div>
      </div>
      <div class="orderInfo">
        <div class="amountInfo-line">
          <div class="left">{{ $t("sellHistory.sellOrderID") }}:</div>
          <div class="right">
            <div class="copyView">
              <div class="copyValue">{{ detailsData.orderId }}</div>
              <copy-img
                class="icon"
                v-clipboard:copy="detailsData.orderId"
                v-clipboard:success="copySuccess"
                v-clipboard:error="copyError"
              />
            </div>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">{{ $t("sellHistory.sellOrderTime") }}:</div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.orderTime) === '--' }"
              >{{ noData(detailsData.orderTime) }}</span
            >
          </div>
        </div>
        <div
          class="amountInfo-line"
          v-if="
            (detailsData.orderStatus >= 3 &&
              detailsData.orderStatus <= 9 &&
              detailsData.orderStatus !== 7) ||
            (detailsData.orderStatus === 2 && detailsData.confirmBlock !== 0)
          "
        >
          <div class="left">{{ $t("sellHistory.sellConfirmedTime") }}:</div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.confirmedTime) === '--' }"
              >{{ noData(detailsData.confirmedTime) }}</span
            >
          </div>
        </div>
        <!-- Completed -->
        <div
          class="amountInfo-line"
          v-if="
            detailsData.orderStatus >= 5 &&
            detailsData.orderStatus <= 9 &&
            detailsData.orderStatus !== 7
          "
        >
          <div class="left">{{ $t("sellHistory.sellTransferTime") }}:</div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.transferTime) === '--' }"
              >{{ noData(detailsData.transferTime) }}</span
            >
          </div>
        </div>
        <!-- Failed - 2 -->
        <div
          class="amountInfo-line"
          v-if="detailsData.orderStatus === 8 || detailsData.orderStatus === 10"
        >
          <div class="left">{{ $t("sellHistory.sellRefundTime") }}:</div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.refundTime) === '--' }"
              >{{ noData(detailsData.refundTime) }}</span
            >
          </div>
        </div>
      </div>
      <div
        class="orderInfo second"
        v-if="
          (detailsData.orderStatus >= 3 &&
            detailsData.orderStatus <= 9 &&
            detailsData.orderStatus !== 7) ||
          (detailsData.orderStatus === 2 && detailsData.confirmBlock !== 0)
        "
      >
        <div class="amountInfo-line">
          <div class="left">{{ $t("sellHistory.sellNetwork") }}:</div>
          <div class="right">
            <span
              class="value"
              :class="{ empty: noData(detailsData.network) === '--' }"
              >{{ noData(detailsData.network) }}</span
            >
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">{{ $t("sellHistory.sellAddress") }}:</div>
          <div class="right">
            <div class="copyView">
              <div class="copyValue">{{ detailsData.address }}</div>
              <copy-img
                class="icon"
                v-clipboard:copy="detailsData.address"
                v-clipboard:success="copySuccess"
                v-clipboard:error="copyError"
              />
            </div>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">{{ $t("sellHistory.sellTxID") }}:</div>
          <div class="right">
            <div class="copyView">
              <div class="copyValue">{{ detailsData.txID }}</div>
              <copy-img
                class="icon"
                v-clipboard:copy="detailsData.txID"
                v-clipboard:success="copySuccess"
                v-clipboard:error="copyError"
              />
            </div>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">{{ $t("sellHistory.sellRecipientAccount") }}:</div>
          <div class="right">
            <span class="cardType">{{ $t(`${cardType()}`) }}</span>
            <span class="value"
              >****
              {{
                detailsData.account
                  ? detailsData.account.substring(
                      detailsData.account.length - 4,
                      detailsData.account.length
                    )
                  : ""
              }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- failed - 1 -->
    <footer class="footer" ref="footer_ref">
      <template
        v-if="
          detailsData.orderStatus === 6 ||
          detailsData.orderStatus === 8 ||
          (detailsData.orderStatus === 1 && detailsData.confirmBlock === 0)
        "
      >
        <!-- 重新购买 -->
        <template v-if="detailsData.orderStatus === 6">
          <button class="btn-type-1" @click="updateCardInfo">
            {{ $t("sellHistory.sellUpdateInformation") }}
            <!--          <span class="witchBank">Mastercard</span>-->
            <span class="bankCard" v-if="detailsData.account"
              >****{{
                detailsData.account.substring(
                  detailsData.account.length - 4,
                  detailsData.account.length
                )
              }}</span
            >
            <img
              class="rightIcon"
              src="@/assets/images/button-right-icon.svg"
              alt=""
            />
          </button>
          <!-- 退款 -->
          <button class="btn-type-2" @click="refund">
            {{ $t("sellHistory.selltransRequestof") }}
          </button>
        </template>
        <button
          class="btn-type-1"
          @click="refund"
          v-else-if="detailsData.orderStatus === 8"
        >
          {{ $t("sellHistory.selltransRequestof") }}
          <img
            class="rightIcon"
            src="@/assets/images/button-right-icon.svg"
            alt=""
          />
        </button>
        <!-- 去付款 -->
        <button
          class="btn-type-1"
          @click="payNow"
          v-else-if="
            detailsData.orderStatus === 1 && detailsData.confirmBlock === 0
          "
        >
          {{ $t("sellHistory.sellOrderPayNow") }}
          <img
            class="rightIcon"
            src="@/assets/images/button-right-icon.svg"
            alt=""
          />
        </button>
      </template>
      <powered-by
        @setPaddingBottom="
          $refs.padding_bottom_box.style.paddingBottom =
            $refs.footer_ref.clientHeight + 'px'
        "
      />
    </footer>
  </div>
  <!-- buy details -->
  <!-- <buyDetails v-else :buyData="buyData"></buyDetails> -->
</template>

<script>
import Clipboard from "clipboard";
import valid from "card-validator";
import { mapState } from "vuex";
import { AES_Decrypt } from "@/utils/encryp";

//买币订单详情

/**
 * 邮件进入地址栏结构 - /tradeHistory-details?orderId=订单id&emailFromPath=tradeHistory-details
 */

export default {
  name: "tradeHistory-details",
  components: {},
  data() {
    return {
      detailsData: {},
      timeOut: null,
      buyData: {},
    };
  },
  activated() {
    this.orderId = this.$route.query.orderId;

    //存储邮件单页面跳传递的数据
    if (
      this.$route.query.emailFromPath !== undefined &&
      this.$route.query.emailFromPath
    ) {
      this.$store.state.emailFromPath = this.$route.query.emailFromPath;
      this.$store.state.emailFromquery_tradeHistoryDetails_view.orderId =
        this.$route.query.orderId;
    }
    //使用邮件单页面跳传递的数据
    if (this.$store.state.emailFromPath === "tradeHistory-details") {
      this.orderId =
        this.$store.state.emailFromquery_tradeHistoryDetails_view.orderId;
    }

    //卖币详情
    this.detailsInfo();
    clearInterval(this.timeOut);
    this.timeOut = setInterval(() => {
      setTimeout(() => {
        this.detailsInfo();
      }, 0);
    }, 3000);
    return;
  },
  computed: {
    percentage() {
      if (this.detailsData.orderStatus === 2) {
        return 25;
      } else if (this.detailsData.orderStatus === 3) {
        return 50;
      } else if (this.detailsData.orderStatus === 4) {
        return 75;
      } else {
        return 100;
      }
    },
  },
  methods: {
    cardType() {
      if (this.detailsData.payWayCode == "10010") {
        var validObject = valid.number(this.detailsData.account);
        if (
          validObject.isValid &&
          ["mastercard"].includes(validObject.card.type)
        ) {
          return "sellPayType.master_card";
        }
        if (validObject.isValid && ["visa"].includes(validObject.card.type)) {
          return "sellPayType.visa_card";
        }
      }
      return "sellPayType.bank_account";
    },

    detailsInfo() {
      let params = {
        orderId: this.orderId,
      };
      this.$axios.get(this.$api.get_sellOrderDetails, params).then((res) => {
        if (res && res.data) {
          // res.data.orderStatus = 8
          if ([5, 6, 7, 10, 11].includes(res.data.orderStatus)) {
            window.clearInterval(this.timeOut);
            this.timeOut = null;
          }
          this.detailsData = res.data;
        }
      });
    },

    updateCardInfo() {
      this.$store.state.cardInfoFromPath = "sellOrder";
      // 存储数据
      this.$store.commit("sellPayments/set_fiatCurrencyInfo", {
        alpha2: this.detailsData.alpha2,
        fiat: this.detailsData.fiatName,
      });
      this.$router.push(
        `/sell-formUserInfo?orderId=${this.orderId}&payWayCode=${
          this.detailsData.payWayCode
        }&userAccountId=${this.detailsData.userAccountId || ""}`
      );
    },
    refund() {
      this.$router.push(
        `/Refund?orderId=${this.orderId}&cryptocurrency=${this.detailsData.cryptocurrency}&fiatCode=${this.detailsData.fiatName}`
      );
    },
    payNow() {
      let _this = this;
      let params = {
        orderId: this.detailsData.orderId,
      };
      this.$axios.get(this.$api.get_PlayCurrencyStatus, params).then((res) => {
        if (res && res.data) {
          _this.$store.state.sellOrderId = this.detailsData.orderId;
          _this.$store.state.nextOrderState = 1;
          // 支付方式信息
          let sellPayType = {
            accountType: this.detailsData.payWayCode === "10010" ? "2" : "1", // 1-Bank Account、2-Credit Card
            payWayCode: this.detailsData.payWayCode, // 19000-Bank Account、10010-Credit Card
          };
          this.$store.commit("sellPayments/set_sellPayType", sellPayType);
          //费用接口所需参数
          this.$store.commit(
            "sellPayments/set_cryptoAmount",
            Number(this.detailsData.orderAmount)
          );
          //法币信息
          this.$store.commit("sellPayments/set_fiatCurrencyInfo", {
            alpha2: this.detailsData.alpha2,
            fiat: this.detailsData.fiatName,
          });
          //网络信息
          this.$store.commit("sellPayments/set_networkInfo", {
            network: this.detailsData.cryptoNetwork, //网络
            networkName: "", //网络全称
            networkIcon: "", //网络图标
            addressRegex: "", //地址正则
            memoRegex: "", //memo正则
          });
          //获取网络接口所需加密货币
          this.$store.commit("sellPayments/set_cryptoInfo", {
            crypto: this.detailsData.cryptocurrency, //数字货币
          });
          _this.$router.push(`/sellOrder`);
        }
      });
    },

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

    //数据判空 - null、""、不存在这个字段
    noData(val) {
      if (val !== null && val !== "" && val !== undefined && val !== 0) {
        return val;
      }
      return "--";
    },
  },
  deactivated() {
    window.clearInterval(this.timeOut);
    this.timeOut = null;
  },
};
</script>

<style lang="scss" scoped>
#tradeHistory-details {
  height: 100%;
  overflow: auto;
  &.orderStatus6 {
    padding-bottom: 1.44rem !important;
  }
  &.orderStatus8,
  &.orderStatus1 {
    padding-bottom: 0.88rem !important;
  }

  .content {
    .line-height1 {
      padding-bottom: 0.16rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.2rem;

      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        box-shadow: 0 0 0 0.25px #e6e8eb;
      }
      .left {
        display: flex;
        align-items: center;
        img {
          width: 0.24rem;
          margin-right: 0.08rem;
        }
        .text {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 700;
          font-size: 0.16rem;
          line-height: 0.18rem;
          color: #252830;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .img {
          width: 0.16rem;
          margin-right: 0.04rem;
        }
        div {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.16rem;
          line-height: 0.16rem;
          text-align: right;
        }
      }
    }
    .amountInfo {
      margin-bottom: 0.2rem;

      .amountInfo-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:not(:last-child) {
          margin-bottom: 0.2rem;
        }
        .left {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.14rem;
          line-height: 0.14rem;
          color: #252830;
        }
        .right {
          .value {
            font-family: "HarmonyOS Sans";
            font-style: normal;
            font-weight: 500;
            font-size: 0.14rem;
            line-height: 0.14rem;
            text-align: right;
            color: #252830;
          }
          .empty {
            font-weight: 400;
          }
        }
      }
    }
    .orderStatus {
      margin-bottom: 0.2rem;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.08rem;
        .left {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.14rem;
          line-height: 0.14rem;
          color: #252830;
        }
        .right {
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 14px;
          text-align: right;
          span {
            color: #0260e7;
            &.completed {
              color: #00b42a;
            }
            &.failed1 {
              color: #ff7d00;
            }
            &.timeout {
              color: #5d636d;
            }
            &.failed3 {
              color: #f53f3f;
            }
          }
        }
      }
      .speed-progress {
        position: relative;
        height: 0.04rem;
        border-radius: 0.01rem;
        overflow: hidden;

        .percentage {
          position: absolute;
          height: 100%;
          left: 0;
          top: 0;
          z-index: 1;
          background: transparent;
          &.notCompleted {
            background: #0260e7;
          }
          &.completed {
            background: #00b42a;
          }
          &.tempFailed {
            background: #ff7d00;
          }
          &.failed {
            background: #f53f3f;
          }
          &.timeOut {
            background: #5d636d;
          }
        }
        .all {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background: #f5f5f5;
        }
      }
    }

    .orderInfo {
      padding: 0.2rem 0.12rem;
      background: #f4f8fb;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      overflow: hidden;
      .amountInfo-line {
        display: flex;
        justify-content: space-between;
        &:not(:last-child) {
          margin-bottom: 0.16rem;
        }
        .left {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.13rem;
          line-height: 0.14rem;
          color: #5d636d;
        }
        .right {
          font-family: "HarmonyOS Sans";
          font-style: normal;
          font-weight: 500;
          font-size: 0.14rem;
          line-height: 0.14rem;
          text-align: right;
          color: #252830;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 1;
          word-break: break-all;
          padding-left: 0.16rem;
          .empty {
            font-weight: 400;
          }
          .copyView {
            display: flex;
            align-items: center;
            cursor: pointer;
            .copyValue {
              font-family: "HarmonyOS Sans";
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 14px;
              text-align: right;
              color: #5d636d;
            }
            .icon {
              margin-left: 0.12rem;
              width: 0.16rem;
            }
          }
        }
      }
      &.second {
        margin-top: 0.08rem;
      }
    }

    &.sellOrderBlockConfirmed {
      .line-height1 {
        .right {
          div {
            color: #0260e7;
          }
        }
      }
    }
    &.sellConfirmOrder {
      .line-height1 {
        .right {
          div {
            color: #0260e7;
          }
        }
      }
    }
    &.sellInTransfer {
      .line-height1 {
        .right {
          div {
            color: #0260e7;
          }
        }
      }
    }
    &.sellCompleted {
      .line-height1 {
        .right {
          div {
            color: #00b42a;
          }
        }
      }
    }
    &.sellFailed {
      .line-height1 {
        .right {
          div {
            color: #ff7d00;
          }
        }
      }
    }
    &.sellClosed {
      .line-height1 {
        .right {
          div {
            color: #5d636d;
          }
        }
      }
    }
    &.sellError {
      .line-height1 {
        .right {
          div {
            color: #f53f3f;
          }
        }
      }
    }
    &.sellRefunding {
      .line-height1 {
        .right {
          div {
            color: #0260e7;
          }
        }
      }
    }
    &.sellRefund {
      .line-height1 {
        .right {
          div {
            color: #00b42a;
          }
        }
      }
    }
    &.pb0 {
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
      & > span {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 11px;
        line-height: 13px;
        text-align: center;
        color: #ffffff;
        margin-left: 0.08rem;
      }
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
    }
    .btn-type-2 {
      margin-top: 0.08rem;
      color: #252830;
      border: 1px solid #e6e8eb;
      background: transparent !important;
      &:hover {
        border-color: #cbcfd6;
      }
      &:active {
        border-color: #babfc8;
      }
    }
  }
}
</style>
