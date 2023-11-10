<template>
  <div id="tradeHistory">
    <template v-if="tableState === false">
      <div class="tabView" v-if="merchantInfo.merchantType !== 'api'">
        <div
          class="tab"
          ref="buy_crypto_tab"
          :class="{ active: tabViewName === 'buy', opacity0: lineAvailable }"
          @click="changeTab('buy')"
        >
          <span class="span_normal">
            {{ $t("buyHistory.buyCrypto") }}
          </span>
          <span class="span_bold">
            {{ $t("buyHistory.buyCrypto") }}
          </span>
        </div>
        <div
          class="tab"
          ref="sell_crypto_tab"
          :class="{ active: tabViewName === 'sell', opacity0: lineAvailable }"
          @click="changeTab('sell')"
        >
          <span class="span_normal">
            {{ $t("sellHistory.sellOrderSellCrypto") }}
          </span>
          <span class="span_bold">
            {{ $t("sellHistory.sellOrderSellCrypto") }}
          </span>
        </div>
        <div
          class="line"
          :class="{ 'line-available': lineAvailable }"
          :style="lineStyle"
        ></div>
      </div>
    </template>
    <!-- 商户配置菜单栏 -->

    <template v-else-if="tableState === true">
      <div class="tabView">
        <div class="tab bb" v-if="tabstate === 'buyCrypto'">
          <span>
            {{ $t("buyHistory.buyCrypto") }}
          </span>
        </div>
        <div class="tab bb" v-else-if="tabstate === 'sellCrypto'">
          <span>
            {{ $t("sellHistory.sellOrderSellCrypto") }}
          </span>
        </div>
      </div>
    </template>

    <template v-if="tabViewName === 'buy'">
      <!-- 过滤掉空数据 -->
      <div
        class="filterTab"
        v-show="filterTabStatus && merchantInfo.merchantType !== 'api'"
      >
        <span>{{ $t("buyHistory.buyCryptoHideClosed") }}</span>
        <van-checkbox v-model="selectKey" shape="square" @click="filterData">
          <template #icon="props">
            <img
              v-show="props.checked"
              class="img-icon"
              src="@/assets/images/check-true.svg"
            />
            <img
              v-show="!props.checked"
              class="img-icon1"
              src="@/assets/images/check-false.svg"
            />
          </template>
        </van-checkbox>
      </div>
    </template>
    <template v-if="tabViewName === 'sell' && !hideCheckbox">
      <!-- 过滤掉空数据 -->
      <div
        class="filterTab"
        v-show="filterTabStatus && merchantInfo.merchantType !== 'api'"
      >
        <span>{{ $t("buyHistory.buyCryptoHideClosed") }}</span>
        <van-checkbox v-model="selectKey" shape="square" @click="filterData">
          <template #icon="props">
            <img
              v-show="props.checked"
              class="img-icon"
              src="@/assets/images/check-true.svg"
            />
            <img
              v-show="!props.checked"
              class="img-icon1"
              src="@/assets/images/check-false.svg"
            />
          </template>
        </van-checkbox>
      </div>
    </template>

    <!-- 买币历史 -->
    <div
      class="historyList-box historyList-box-buy"
      v-show="tabViewName === 'buy'"
    >
      <div class="noData" v-if="buy_historyList.length === 0">
        <div class="noDataImg">
          <img src="../../assets/images/noData.svg" />
        </div>
        <div class="noDataText">{{ $t("buyHistory.history_noListText") }}</div>
        <template v-if="!merchantInfo.merchantStatus">
          <p>{{ $t("buyHistory.history_noListText2") }}</p>
          <button class="continue" @click="goHome('buyCrypto')">
            {{ $t("buyHistory.history_noListButton") }}
            <img
              class="rightIcon"
              src="@/assets/images/button-right-icon.svg"
              alt=""
            />
          </button>
        </template>
      </div>

      <div class="historyList" v-else>
        <van-list
          v-model="buyLoading"
          :finished="buyFinished"
          :finished-text="$t('buyHistory.history_noMore')"
          @load="buyOnLoad"
          loading-text="Loading"
          error-text="Loading failed"
        >
          <div class="van-clearfix">
            <div
              class="float-item curror"
              v-for="(item, index) in buy_historyList"
              :key="index"
              @click="goBuyOrderDetails(item)"
              :class="{
                buyUnpaid: item.orderState == 1,
                buyProcessing: [2, 3, 4].includes(item.orderState),
                buyCompleted: item.orderState == 5,
                buyFailed: [0, 7, 11].includes(item.orderState),
                buyClosed: item.orderState == 6,
              }"
            >
              <div class="historyLi_header">
                <div class="historyLi_header_left">
                  <div class="cryptoCurrencyIcon">
                    <img :src="item.cryptoCurrencyIcon" />
                  </div>
                  <div class="cryptoCurrencyName">
                    {{ item.cryptoCurrency }}
                  </div>
                </div>

                <div class="historyLi_header_right">
                  <p class="time">{{ item.createdTime }}</p>
                  <p class="righticon">
                    <img src="@/assets/images/slices/right_icon1.svg" alt="" />
                  </p>
                </div>
              </div>
              <div class="details_line">
                <div class="details_line_title">
                  {{ $t("buyHistory.buyOrderAmount") }} ({{
                    item.fiatCurrency
                  }})
                </div>
                <div class="details_line_value">
                  <span class="value">{{ item.amount }}</span>
                </div>
              </div>
              <div class="details_line">
                <div class="details_line_title">
                  {{ $t("buyHistory.buyPrice") }} ({{ item.fiatCurrency }})
                </div>
                <div class="details_line_value">
                  <span :class="item.orderState == 5 ? 'value' : 'noValue'">{{
                    item.orderState == 5 ? item.cryptoCurrencyPrice : "--"
                  }}</span>
                </div>
              </div>
              <div class="details_line">
                <div class="details_line_title">
                  {{ $t("buyHistory.buyTotal") }} ({{ item.cryptoCurrency }})
                </div>
                <div class="details_line_value">
                  <span :class="item.orderState == 5 ? 'value' : 'noValue'">{{
                    item.orderState == 5 ? item.cryptoCurrencyVolume : "--"
                  }}</span>
                </div>
              </div>
              <!-- 订单状态 -->
              <!-- 未支付订单 -->
              <div class="orderState">
                <div class="state state_Unpaid" v-if="item.orderState == 1">
                  <img
                    src="@/assets/images/tradeHistory/buyUnpaid.svg"
                    alt=""
                  />
                  <div class="state_name">{{ $t("buyHistory.buyUnpaid") }}</div>
                </div>
                <!-- 等待完成支付过程 -->
                <div
                  class="state state_loading"
                  v-else-if="[2, 3, 4].includes(item.orderState)"
                >
                  <img
                    src="@/assets/images/tradeHistory/buyProcessing.svg"
                    alt=""
                  />
                  <div class="state_name">
                    {{ $t("buyHistory.buyProcessing") }}
                  </div>
                </div>
                <!-- 成功 -->
                <div
                  class="state state_success"
                  v-else-if="item.orderState == 5"
                >
                  <img
                    src="@/assets/images/tradeHistory/buyCompleted.svg"
                    alt=""
                  />
                  <div class="state_name">
                    {{ $t("buyHistory.buyCompleted") }}
                  </div>
                </div>
                <!-- 失败 -->
                <div
                  class="state state_failed"
                  v-else-if="[0, 7, 11].includes(item.orderState)"
                >
                  <img
                    src="@/assets/images/tradeHistory/buyFailed.svg"
                    alt=""
                  />
                  <div
                    class="state_name"
                    v-if="[0, 7].includes(item.orderState)"
                  >
                    {{ $t("buyHistory.buyFailed") }}
                  </div>
                  <div class="state_name" v-else>
                    {{ $t("buyHistory.buyFailed_11") }}
                  </div>
                </div>
                <!-- 超时 -->
                <div
                  class="state state_timeOut"
                  v-else-if="item.orderState == 6"
                >
                  <img
                    src="@/assets/images/tradeHistory/buyClosed.svg"
                    alt=""
                  />
                  <div class="state_name">{{ $t("buyHistory.buyClosed") }}</div>
                </div>
              </div>

              <!--触发二次支付的条件是订单必须失败 并且 twicePayType有支持二次支付的数值     -->
              <div
                class="tryagail-title"
                v-if="[0, 7, 11].includes(item.orderState)"
              >
                {{ item.failReason }}
              </div>

              <!--  支付支持二次支付;-->
              <template
                v-if="
                  item.orderState === 7 &&
                  item.twicePayType &&
                  item.twicePayType.length > 0
                "
              >
                <div
                  class="buyorder_button"
                  :class="{
                    two: buy_historyList_buyPaymentShow[index].length > 1,
                  }"
                >
                  <div
                    v-for="Buttonitem in buy_historyList_buyPaymentShow[index]"
                    :key="Buttonitem.id"
                    @click.stop="goBuyPayment(Buttonitem, item)"
                    class="buyorder"
                  >
                    {{ $t(`buyHistory.${Buttonitem.name2}`) }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </van-list>
      </div>
    </div>

    <!-- 卖币历史 -->
    <div
      class="historyList-box historyList-box-sell"
      v-show="tabViewName === 'sell'"
    >
      <div class="noData" v-if="sell_historyList.length === 0">
        <div class="noDataImg">
          <img src="../../assets/images/noData.svg" />
        </div>
        <div class="noDataText">{{ $t("buyHistory.history_noListText") }}</div>

        <template v-if="!merchantInfo.merchantStatus">
          <p>{{ $t("sellHistory.sellstarted") }}</p>
          <button class="continue" @click="goHome('sellCrypto')">
            {{ $t("sellHistory.sellSellcryptonow") }}
            <img
              class="rightIcon"
              src="@/assets/images/button-right-icon.svg"
              alt=""
            />
          </button>
        </template>
      </div>
      <div class="historyList" v-else>
        <van-list
          v-model="sellLoading"
          :finished="sellFinished"
          :finished-text="$t('buyHistory.history_noMore')"
          @load="sellOnLoad"
          loading-text="Loading"
          error-text="Loading failed"
        >
          <div class="van-clearfix">
            <div
              class="float-item curror"
              v-for="(item, index) in sell_historyList"
              :key="index"
              @click="goOrderDetails(item)"
              :class="{
                sellOrderBlockConfirmed: [1, 2].includes(item.orderStatus),
                sellConfirmOrder: item.orderStatus === 3,
                sellInTransfer: item.orderStatus === 4,
                sellCompleted: item.orderStatus === 5,
                sellFailed: item.orderStatus === 6,
                sellClosed: item.orderStatus === 7,
                sellError: item.orderStatus === 8,
                sellRefunding: item.orderStatus === 9,
                sellRefund: item.orderStatus === 10,
                pb0:
                  ([1, 2].includes(item.orderStatus) &&
                    item.confirmBlock === 0) ||
                  item.orderStatus === 6 ||
                  item.orderStatus === 8,
              }"
            >
              <div class="historyLi_header">
                <div class="historyLi_header_left">
                  <div class="cryptoCurrencyIcon">
                    <img :src="item.cryptocurrencyCoin" />
                  </div>
                  <div class="cryptoCurrencyName">
                    {{ item.cryptocurrency }}
                  </div>
                </div>
                <div class="historyLi_header_right">
                  <p class="time">{{ item.orderDate }}</p>
                  <p class="righticon">
                    <img src="@/assets/images/slices/right_icon1.svg" alt="" />
                  </p>
                </div>
              </div>
              <div class="details_line">
                <div class="details_line_title">
                  {{ $t("sellHistory.sellOrderAmount") }} ({{
                    item.cryptocurrency
                  }})
                </div>
                <div class="details_line_value">
                  <span
                    class="value"
                    :class="{ noValue: noData(item.orderAmount) === '--' }"
                    >{{ noData(item.orderAmount) }}</span
                  >
                </div>
              </div>
              <div class="details_line">
                <div class="details_line_title">
                  {{ $t("sellHistory.sellOrderActualAmount") }} ({{
                    item.cryptocurrency
                  }})
                </div>
                <div class="details_line_value">
                  <span
                    class="value"
                    :class="{ noValue: noData(item.actualAmount) === '--' }"
                    >{{ noData(item.actualAmount) }}</span
                  >
                </div>
              </div>
              <div class="details_line">
                <div class="details_line_title">
                  {{ $t("sellHistory.sellOrderFinalTotal") }} ({{
                    item.fiatName
                  }})
                </div>
                <div class="details_line_value">
                  <span
                    class="value"
                    :class="{ noValue: noData(item.finalTotal) === '--' }"
                    >{{ noData(item.finalTotal) }}</span
                  >
                </div>
              </div>

              <!-- 订单状态 -->
              <div class="orderState">
                <template v-if="[1, 2].includes(item.orderStatus)">
                  <div class="orderState-line">
                    <img
                      src="@/assets/images/tradeHistory/sellOrderBlockConfirmed.svg"
                      alt=""
                      class="img"
                    />
                    <div class="state_name">
                      {{ $t("sellHistory.sellOrderBlockConfirmed") }} ({{
                        item.confirmBlock
                      }}/{{ item.totalBlock }})
                    </div>
                  </div>
                  <div class="options" v-if="item.confirmBlock === 0">
                    <div
                      class="optionsView state_loading_payNow curror"
                      @click.stop="optionsPath(item, 'payNow')"
                    >
                      {{ $t("sellHistory.sellOrderPayNow") }}
                    </div>
                  </div>
                </template>
                <template v-else-if="item.orderStatus === 3">
                  <div class="orderState-line">
                    <img
                      src="@/assets/images/tradeHistory/sellOrderBlockConfirmed.svg"
                      alt=""
                      class="img"
                    />
                    <div class="state_name">
                      {{ $t("sellHistory.sellConfirmOrder") }}
                    </div>
                  </div>
                </template>
                <template v-else-if="item.orderStatus === 4">
                  <div class="orderState-line">
                    <img
                      src="@/assets/images/tradeHistory/sellOrderBlockConfirmed.svg"
                      alt=""
                      class="img"
                    />
                    <div class="state_name">
                      {{ $t("sellHistory.sellInTransfer") }}
                    </div>
                  </div>
                </template>
                <template v-else-if="item.orderStatus === 5">
                  <div class="orderState-line">
                    <img
                      src="@/assets/images/tradeHistory/sellCompleted.svg"
                      alt=""
                      class="img"
                    />
                    <div class="state_name">
                      {{ $t("sellHistory.sellCompleted") }}
                    </div>
                  </div>
                </template>
                <template v-else-if="item.orderStatus === 6">
                  <div class="orderState-line">
                    <img
                      src="@/assets/images/tradeHistory/sellFailed.svg"
                      alt=""
                      class="img"
                    />
                    <div class="state_name">
                      {{ $t("sellHistory.sellFailed") }}
                    </div>
                  </div>
                  <p class="state_failed_tips">
                    {{ $t("sellHistory.selltransferrejected") }}
                  </p>
                  <div class="options two">
                    <div
                      class="optionsView state_failed_refund curror"
                      @click.stop="optionsPath(item, 'refund')"
                    >
                      {{ $t("sellHistory.selltransRequest") }}
                    </div>
                    <div
                      class="optionsView state_failed_Update curror"
                      @click.stop="optionsPath(item, 'bankInfo')"
                    >
                      {{ $t("sellHistory.selltransUpdate") }}
                    </div>
                  </div>
                </template>

                <template v-else-if="item.orderStatus === 7">
                  <div class="orderState-line">
                    <img
                      src="@/assets/images/tradeHistory/sellClosed.svg"
                      alt=""
                      class="img"
                    />
                    <div class="state_name">
                      {{ $t("sellHistory.sellClosed") }}
                    </div>
                  </div>
                </template>
                <template v-else-if="item.orderStatus === 8">
                  <!--  && item.failureNumber >= 2 -->
                  <div class="orderState-line">
                    <img
                      src="@/assets/images/tradeHistory/sellError.svg"
                      alt=""
                      class="img"
                    />
                    <div class="state_name">
                      {{ $t("sellHistory.sellFailed") }}
                    </div>
                  </div>
                  <div class="options">
                    <div
                      class="optionsView state_error_refund curror"
                      @click.stop="optionsPath(item, 'refund')"
                    >
                      {{ $t("sellHistory.selltransRequest") }}
                    </div>
                  </div>
                </template>
                <template v-else-if="item.orderStatus === 9">
                  <!--  && item.failureNumber >= 2 -->
                  <div class="orderState-line">
                    <img
                      src="@/assets/images/tradeHistory/sellOrderBlockConfirmed.svg"
                      alt=""
                      class="img"
                    />
                    <div class="state_name">
                      {{ $t("sellHistory.sellRefunding") }}
                    </div>
                  </div>
                </template>
                <template v-else-if="item.orderStatus === 10">
                  <div class="orderState-line">
                    <img
                      src="@/assets/images/tradeHistory/sellCompleted.svg"
                      alt=""
                      class="img"
                    />
                    <div class="state_name">
                      {{ $t("sellHistory.sellRefund") }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import { AES_Decrypt } from "@/utils/encryp";
import { mapState } from "vuex";

import {
  checkPixKycIsRequired,
  requestPayFormInfo,
} from "@/utils/publicRequest";
import { allPayType } from "@/assets/json/paymentMethods.js";
import paymentMethods from "@/assets/json/paymentMethods.json";

export default {
  name: "TradeHistory",
  data() {
    return {
      hideCheckbox: false,
      lineAvailable: false,
      lineStyle: {},
      selectKey: false,

      //买币
      buyQuery: {
        orderState: 1,
        orderType: 1,
        pageIndex: 1,
        pageSize: 5,
        showAll: true,
      },
      buy_historyList: [],

      buyLoading: false,
      buyFinished: false,

      //卖币
      sellQuery: {
        pageIndex: 1,
        pageSize: 5,
        showAll: true,
      },
      sell_historyList: [],

      sellLoading: false,
      sellFinished: false,
      allPayType,
    };
  },
  watch: {
    "$store.state.historyTab": {
      immediate: true,
      handler() {
        this.lineAnimation();
      },
    },
    "$store.state.languageValue": {
      immediate: true,
      handler() {
        this.lineAnimation();
      },
    },
    "$store.state.menuState": {
      immediate: true,
      handler() {
        this.lineAnimation();
      },
    },
  },
  deactivated() {
    this.buy_historyList = [];
    this.sell_historyList = [];
    this.selectKey = false;
    sessionStorage.removeItem("buyShowAll");
    sessionStorage.removeItem("sellShowAll");
    window.removeEventListener("resize", this.lineAnimation);
  },
  activated() {
    this.lineAnimation();
    window.addEventListener("resize", this.lineAnimation);

    if (this.tableState) {
      if (this.tabstate === "buyCrypto") {
        this.$store.state.historyTab = "buy";
      } else if (this.tabstate === "sellCrypto") {
        this.$store.state.historyTab = "sell";
      }
    }

    if (this.$store.state.historyTab === "buy") {
      this.buyQuery = {
        orderState: 1,
        orderType: 1,
        pageIndex: 1,
        pageSize: 5,
        showAll: sessionStorage.getItem("buyShowAll")
          ? sessionStorage.getItem("buyShowAll")
          : true,
      };
      this.selectKey =
        this.buyQuery.showAll == "true" || this.buyQuery.showAll == true
          ? false
          : true;

      this.buyFinished = false;
      this.buyLoading = false;
      this.buy_historyList = [];
      this.buyTransactionHistory();
    } else {
      this.sellQuery = {
        pageIndex: 1,
        pageSize: 5,
        showAll: sessionStorage.getItem("sellShowAll")
          ? sessionStorage.getItem("sellShowAll")
          : true,
      };
      this.selectKey =
        this.sellQuery.showAll == "true" || this.sellQuery.showAll == true
          ? false
          : true;

      this.sellFinished = false;
      this.sellLoading = false;
      this.sell_historyList = [];
      this.sellTransactionHistory();
    }
  },
  computed: {
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
      buyAgainFromData: (state) => state.buyForm,
    }),

    //商户信息
    ...mapState("buyCryptoMerchant", ["merchantInfo"]),

    tabViewName() {
      return this.$store.state.historyTab;
    },
    filterTabStatus() {
      if (this.tabViewName === "buy") {
        return this.buy_historyList.length > 0
          ? true
          : this.selectKey === false
          ? false
          : true;
      }
      if (this.tabViewName === "sell") {
        return this.sell_historyList.length > 0
          ? true
          : this.sellFinished === false
          ? false
          : true;
        // todo
      }
      return false;
    },
    buy_historyList_buyPaymentShow() {
      let result = this.buy_historyList.map((item) => {
        return this.buyPaymentShow(item);
      });
      return result;
    },
    //商户对接tab状态
    tableState() {
      return this.$store.state.tableState;
    },
    tabstate() {
      return this.$store.state.homeTabstate;
    },
  },
  methods: {
    lineAnimation() {
      const { merchantType } = this.merchantInfo;
      if (merchantType !== "api") {
        setTimeout(
          () => {
            const ref =
              this.$store.state.historyTab === "buy"
                ? "buy_crypto_tab"
                : "sell_crypto_tab";
            const element = this.$refs[ref];
            if (element) {
              const { offsetWidth, offsetLeft } = element;
              this.lineStyle = {
                width: `${offsetWidth}px`,
                left: `${offsetLeft}px`,
              };
              setTimeout(() => {
                this.lineAvailable = true;
              }, 50);
            }
          },
          this.lineAvailable ? 0 : 200
        );
      }
    },
    goHome(homeTab) {
      //点击返回首页关闭菜单
      this.$store.state.homeTabstate = homeTab;
      this.$router.push("/");
      setTimeout(() => {
        this.$parent.$refs.routerView.menuState = false;
      });
    },
    //渲染二次支付按钮方法
    buyPaymentShow(val) {
      if (
        val &&
        val.twicePayType &&
        val.twicePayType.length > 0 &&
        val.orderState === 7
      ) {
        let returnData = [];
        let buttonData = JSON.parse(JSON.stringify(this.allPayType));
        let status = val.twicePayType.split(",");
        // console.log('val', val);
        // console.log('status', status);
        //二次支付类型
        if (
          (val.twicePayType.includes("3") || val.twicePayType.includes("4")) &&
          val.payWayCodeList
        ) {
          let allPayType = buttonData;
          let filterPayType = [];
          allPayType.forEach((item) => {
            val.payWayCodeList.forEach((_item) => {
              if (item.allpayWayCode) {
                item.allpayWayCode.forEach((data) => {
                  _item == data ? filterPayType.push(item.isShow) : "";
                });
              }
            });
          });
          filterPayType = [...new Set(filterPayType)];
          if (val.payWayCodeList.includes("20001")) {
            filterPayType.push("20001");
          }
          if (
            val.payWayCodeList.includes("501") ||
            val.payWayCodeList.includes("502")
          ) {
            try {
              if (
                window.ApplePaySession &&
                window.ApplePaySession.canMakePayments()
              ) {
                if (val.payWayCodeList.includes("501")) {
                  filterPayType.push("501");
                } else if (val.payWayCodeList.includes("502")) {
                  filterPayType.push("502");
                }
              }
            } catch (e) {
              console.log(e);
            }
          }
          if (
            val.payWayCodeList.includes("701") ||
            val.payWayCodeList.includes("702")
          ) {
            // 需要判断环境支持GooglePay
            try {
              const paymentsClient =
                new window.google.payments.api.PaymentsClient({
                  environment: process.env.VUE_APP_googlePay_environment,
                });
              paymentsClient
                .isReadyToPay({
                  apiVersion: 2,
                  apiVersionMinor: 0,
                  allowedPaymentMethods: [
                    {
                      type: "CARD",
                      parameters: {
                        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                        allowedCardNetworks: ["MASTERCARD", "VISA"],
                      },
                    },
                  ],
                })
                .then(function (response) {
                  if (response.result) {
                    if (val.payWayCodeList.includes("701")) {
                      filterPayType.push("701");
                    } else if (val.payWayCodeList.includes("702")) {
                      filterPayType.push("702");
                    }
                  }
                });
            } catch (e) {
              console.error(e);
            }
          }

          // console.log('filterPayType', filterPayType);
          //支付类型大于等于1小于2展示本地支付入口 否则展示选择全部本地支付
          if (filterPayType.length >= 1 && filterPayType.length < 2) {
            returnData = buttonData.filter((item) => {
              return filterPayType.includes(item.isShow);
            });
            let matchingPayWayCode = [];
            val.payWayCodeList.forEach((item) => {
              if (returnData[0].allpayWayCode) {
                returnData[0].allpayWayCode.forEach((_item) => {
                  item == _item ? matchingPayWayCode.push(item) : "";
                });
              }
            });
            returnData[0].matchingPayWayCode = matchingPayWayCode;
            //twicePayType为4 展示修改卡、1种本地支付
            if (status.includes("4")) {
              returnData.push(
                buttonData.filter((item) => {
                  return item.isShow === "2";
                })[0]
              );
            }
            return returnData;
          }

          returnData = buttonData.filter((item) => {
            //选择支付方式和修改卡信息 并且本地支付数量为0
            if (status.includes("4") && filterPayType.length < 1) {
              return "2".includes(item.isShow);
            }
            //选择支付方式和修改卡信息 并且本地支付数量大于等于2
            if (status.includes("4")) {
              return status.includes(item.isShow) || "2".includes(item.isShow);
            }
            //选择支付方式 并且本地支付数量为0
            if (status.includes("3") && filterPayType.length < 1) {
              return;
            }
            //选择支付方式 并且本地支付数量大于等于2
            return ["3"].includes(item.isShow);
          });
          // console.log('returnData1', returnData);
          return returnData;
        }
        return buttonData.filter((item) => {
          //选择支付方式和修改卡信息
          if (status.includes("4")) {
            return status.includes(item.isShow) || "2".includes(item.isShow);
          }
          return status.includes(item.isShow);
        });
      }
      return [];
    },

    //二次支付跳转页面
    async goBuyPayment(val, data) {
      //isTwice 为0时是不支持二次支付
      if (data.isTwice === "0") {
        return;
      }

      //存储二次支付数据
      this.storePaymentAgainData(data);

      //选择支付方式页、选择支付方式页 不包含信用卡支付、更改卡、本地支付类型中存在多种 - eWallet类型、Philippines类型、qrCode类型
      if (
        ["Method", "ChangeMethod", "ChangeCard"].includes(val.classData) ||
        (val.classData === "localPayment" &&
          ["eWallet", "Philippines", "qrCode"].includes(val.name2) &&
          val.matchingPayWayCode.length > 1)
      ) {
        this.paymentAgainPath(val, data);
        return;
      }

      //跳转到确认订单页前修改订单支付方式
      let params = {
        orderNo: data.orderNo,
        payWayCode: ["0", "1"].includes(val.isShow) ? "10001" : val.isShow,
      };
      //只存在一种本地支付类型并且只有一个支付方式 - eWallet类型、Philippines类型、qrCode类型
      if (
        val.classData === "localPayment" &&
        ["eWallet", "Philippines", "qrCode"].includes(val.name2) &&
        val.matchingPayWayCode.length === 1
      ) {
        params.payWayCode = val.matchingPayWayCode[0];
        // 查询用户支付表单数据
        await requestPayFormInfo(params.payWayCode);
      }
      this.$axios
        .post(this.$api.post_updateOrderInfo, params, "")
        .then((_res) => {
          if (_res) {
            //卡信息错误修改卡信息、确认订单页
            if (["Information", "TryAgain"].includes(val.classData)) {
              this.paymentAgainPath(val, data);
              return;
            }
            //本地支付类型中只有一种 - eWallet类型、Philippines类型、qrCode类型
            if (
              val.classData === "localPayment" &&
              ["eWallet", "Philippines", "qrCode"].includes(val.name2) &&
              val.matchingPayWayCode.length === 1
            ) {
              let payMethodInfo = {
                payWayCode: val.matchingPayWayCode[0], //支付方式code
                payWayName: val.payWayName, //支付方式名称
              };
              this.$store.commit(
                "buyPayments/set_payMethodInfo",
                payMethodInfo
              );
              this.paymentAgainPath(val, data);
              return;
            }
            //指定支付需要的页面展示参数
            let payMethodInfo = {
              payWayCode: val.isShow, //支付方式code
              payWayName: val.payWayName, //支付方式名称
            };
            this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
            this.paymentAgainPath(val, data);
          }
        });
    },

    //二次支付跳转地址
    async paymentAgainPath(val, data) {
      //--------------- 不需要更改订单支付方式 跳转支付方式页 ---------------
      //选择支付方式页
      if (val.classData === "Method") {
        this.$router.push(
          `/paymentMethod?pathHistry=tradeHistory&ChangeCard=Method`
        );
        return;
      }
      //选择支付方式页 不包含信用卡支付
      if (val.classData === "ChangeMethod") {
        this.$router.push(
          `/paymentMethod?pathHistry=tradeHistory&ChangeCard=changeMethod`
        );
        return;
      }
      //本地支付类型中存在多种 - eWallet类型、Philippines类型、qrCode类型
      if (
        val.classData === "localPayment" &&
        ["eWallet", "Philippines", "qrCode"].includes(val.name2) &&
        val.matchingPayWayCode.length > 1
      ) {
        this.$router.push(
          `/paymentMethod?pathHistry=tradeHistory&ChangeCard=Method`
        );
        return;
      }

      //--------------- 需要更改订单支付方式 跳转修改信用卡页、重新支付信用卡 ---------------
      //更改卡
      if (val.classData === "ChangeCard") {
        //请求支付方式获取历史卡信息
        let params = {
          alpha2: this.buyPayment_secondPay?.alpha2,
          fiat: this.buyPayment_secondPay?.currency,
          amount: this.buyPayment_secondPay?.amount,
          orderNo: this.buyPayment_secondPay?.orderNo,
          crypto: this.buyPayment_secondPay?.cryptoCurrency,
          network: this.buyPayment_secondPay?.network,
        };
        this.$axios.get(this.$api.get_payMethods, params).then((res) => {
          if (res && res.data) {
            //存储货币支持的支付方式
            this.$nextTick(() => {
              //历史信用卡信息
              let savedCard = [];
              if (
                res &&
                res.data &&
                res.data.userCardList !== null &&
                res.data.userCardList &&
                res.data.userCardList.length > 0
              ) {
                res.data.userCardList.forEach((item2, index2) => {
                  res.data.userCardList[index2].payWayCode = "10001";
                  res.data.userCardList[index2].payWayName = "Credit Card";
                  savedCard.push(item2);
                });
              }
              this.$store.commit("buyPayments/set_creditCardList", savedCard);
              this.$router.push(
                `/errorFormInfo?pathHistry=tradeHistory&ChangeCard=ChangeCard&orderNo=${data.orderNo}&Symbol=${data.fiatCurrencySymbol}`
              );
            });
          }
        });
        return;
      }
      //卡信息错误修改卡信息
      if (["Information"].includes(val.classData)) {
        this.buyAgainFromData.email = localStorage.getItem("email");
        let submitForm = JSON.stringify(this.buyAgainFromData);
        //alpha2=${data.alpha2}&currency=${data.cryptocurrency}&
        this.$router.push(
          `/errorFormInfo?pathHistry=tradeHistory&ChangeCard=CardInformation&submitForm=${submitForm}&orderNo=${data.orderNo}&Symbol=${data.fiatCurrencySymbol}`
        );
        return;
      }
      //确认订单页
      if (val.classData === "TryAgain") {
        let payMethodInfo = {
          payWayCode: "10001", //支付方式code
          payWayName: "card", //支付方式名称
          cardNumber: data.cardNo,
        };
        this.$store.commit("buyPayments/set_payMethodInfo", payMethodInfo);
        let cardInfo = JSON.parse(JSON.stringify(data));
        cardInfo.cardNumber = cardInfo.cardNo;
        cardInfo.cardExpireYear = cardInfo.cardExpireYear
          ? AES_Decrypt(cardInfo.cardExpireYear)
          : "";
        cardInfo.cardExpireMonth = cardInfo.cardExpireMonth
          ? AES_Decrypt(cardInfo.cardExpireMonth)
          : "";
        this.$store.commit("buyPayments/set_creditCardInfo", cardInfo);
        this.$store.commit("buyPayments/set_userCardId", cardInfo.userCardId);
        this.$router.push(
          "/creditCardConfig?configPaymentFrom=userPayment&pathHistry=tradeHistory"
        );
        return;
      }

      //--------------- 需要修改订单支付方式 只存在一种本地支付类型并且只有一个支付方式 跳转到确认订单页 ---------------
      let ParamsData1 = "pathHistry=tradeHistory";

      if (val.matchingPayWayCode && val.matchingPayWayCode.length === 1) {
        if (val.matchingPayWayCode[0] === "30001") {
          let { kycIsRequired, path } = await checkPixKycIsRequired(data);
          if (kycIsRequired) {
            this.$router.push(
              `${path}?${ParamsData1}&isTwice=1&type=brazilPay`
            );
          } else {
            this.$router.push(`${path}?${ParamsData1}&isTwice=1`);
          }
          return;
        } else {
          paymentMethods.some((item) => {
            if (item.payWayCode == val.matchingPayWayCode[0]) {
              this.$router.push(`${item.routerPath}?${ParamsData1}&isTwice=1`);
              return true;
            }
          });
        }
        return;
      }

      //--------------- 需要修改订单支付方式 本地支付方式不存在子级 ---------------
      //币安支付、苹果支付 googlepay
      if (["20001"].includes(val.isShow)) {
        this.$router.push(`/binancePay?${ParamsData1}&isTwice=1`);
      } else if (["501", "502"].includes(val.isShow)) {
        this.$router.push(`/applePay?${ParamsData1}&isTwice=1`);
      } else if (["701", "702"].includes(val.isShow)) {
        this.$router.push(`/googlePay?${ParamsData1}&isTwice=1`);
      }
    },

    //存储二次支付所需参数
    storePaymentAgainData(data) {
      //二次确认订单时修改倒计时费率
      let dataVal = {
        cryptoCurrency: data.cryptoCurrency,
        amount: data.amount,
        netWorkFee: data.netWorkFee,
        payCommission: {
          symbol: data.fiatCurrencySymbol,
          symbolNative: data.fiatCurrencySymbol,
          code: data.fiatCurrency,
          rampFee: data.rampFee,
          getAmount: data.cryptoCurrencyVolume,
        },
        depositType: data.depositType,
        network: data.network,
        cardNumber: data.cardNo,
        email: localStorage.getItem("email"),
        userCardId: data.userCardId,
        orderNo: data.orderNo,
        alpha2: data.alpha2,
        currency: data.fiatCurrency,
      };
      //存储法币国家信息
      let fiatCurrencyInfo = {
        fiat: data.fiatCurrency, //法币
        fiatSymbol: data.fiatCurrencySymbol, //法币符号
        flag: "", //国旗
        alpha2: data.alpha2, //国家code
      };
      this.$store.commit(
        "secondaryBuyPayments/set_fiatCurrencyInfo",
        fiatCurrencyInfo
      );
      //数字货币信息
      let cryptoInfo = {
        crypto: data.cryptoCurrency, //数字货币
        cryptoIcon: "", //数字货币图标
        cryptoToFiatPrice: "", //数字货币兑法币单价 - 1crypto 约等于 多少 fiat
      };
      this.$store.commit("secondaryBuyPayments/set_cryptoInfo", cryptoInfo);
      //网络信息
      let networkInfo = {
        network: data.network, //网络
        networkName: "", //网络全称
        networkIcon: "", //网络图标
        addressRegex: "", //地址正则
        memoRegex: "", //memo正则
      };
      this.$store.commit("secondaryBuyPayments/set_networkInfo", networkInfo);
      //法币金额
      let fiatCurrencyAmount = data.amount;
      this.$store.commit(
        "secondaryBuyPayments/set_fiatCurrencyAmount",
        fiatCurrencyAmount
      );

      //确认订单卡号和地址的参数设置需要参数
      let networkInfo_2 = {
        network: data.networkName ? data.networkName : data.network,
        address: data.address,
      };
      this.$store.commit(
        "buyPayments/set_placeOrderQuery_addressNetwork",
        networkInfo_2
      );
      this.$store.commit("buyPayments/set_placeOrderQuery_amount", data.amount);
      let fiatInfo = {
        alpha2: data.alpha2,
        fiatCurrency: data.fiatCurrency,
      };
      this.$store.commit("buyPayments/set_placeOrderQuery_fiatInfo", fiatInfo);
      this.$store.commit("buyPayments/set_orderNo", data.orderNo);
      //卡的一些参数
      let buyfrom = {
        cardNumber: data.cardNo,
        cardExpireYear: data.cardExpireYear
          ? AES_Decrypt(data.cardExpireYear)
          : "",
        cardExpireMonth: data.cardExpireMonth
          ? AES_Decrypt(data.cardExpireMonth)
          : "",
        firstname: data.firstName,
        lastname: data.lastName,
        userCardId: data.userCardId,
        failCode: data.failCode,
      };
      this.$store.commit(
        "secondaryBuyPayments/set_buyPayment_secondPay",
        dataVal
      );
      this.$store.commit("secondaryBuyPayments/setBuyFromData", buyfrom);
    },

    changeTab(val) {
      this.$store.state.historyTab = val;
      this.selectKey = false;
      if (this.tabViewName === "buy") {
        this.buyFinished = false;
        this.buyQuery = {
          orderState: 1,
          orderType: 1,
          pageIndex: 1,
          pageSize: 5,
          showAll: true,
        };
        sessionStorage.removeItem("buyShowAll");
        this.buyTransactionHistory("clear");
      } else {
        this.sellFinished = false;
        this.sellQuery = {
          pageIndex: 1,
          pageSize: 5,
          showAll: true,
        };
        sessionStorage.removeItem("sellShowAll");
        this.sellTransactionHistory("clear");
      }
    },

    //筛选全部和已关闭订单数据
    filterData() {
      //买币
      if (this.tabViewName === "buy") {
        this.buyQuery = {
          orderState: 1,
          orderType: 1,
          pageIndex: 1,
          pageSize: 5,
          showAll: !this.selectKey,
        };
        sessionStorage.setItem("buyShowAll", this.buyQuery.showAll);
        this.buyTransactionHistory("clear");
        return;
      }
      //卖币
      if (this.tabViewName === "sell") {
        this.sellQuery = {
          pageIndex: 1,
          pageSize: 5,
          showAll: !this.selectKey,
        };
        sessionStorage.setItem("sellShowAll", this.sellQuery.showAll);
        this.sellTransactionHistory("clear");
      }
    },

    //买币历史订单页
    buyTransactionHistory(status) {
      let _this = this;
      this.$axios
        .get(this.$api.get_transactionHistory, this.buyQuery)
        .then((res) => {
          if (res.data) {
            if (status !== undefined && status === "clear") {
              _this.buy_historyList = [];
            }
            let newArray = res.data.result;
            _this.buy_historyList = _this.buy_historyList.concat(newArray);
            _this.buyLoading = false;
            if (
              _this.buyQuery.pageIndex * _this.buyQuery.pageSize >
                res.data.total ||
              _this.buy_historyList.length === res.data.total
            ) {
              _this.buyFinished = true;
            }
          }
        });
    },

    //跳转买币订单详情页
    goBuyOrderDetails(val) {
      this.$router.push(
        `/tradeHistory-BuyDetails?orderId=${val.orderNo}&networkName=${val.network}&Symbol=${val.fiatCurrencySymbol}&depositType=${val.depositType}`
      );
    },
    buyOnLoad() {
      setTimeout(() => {
        this.buyQuery.pageIndex += 1;
        this.buyTransactionHistory();
      }, 1000);
    },

    //卖币
    sellTransactionHistory(status) {
      let _this = this;
      this.$axios.get(this.$api.get_sellHistory, this.sellQuery).then((res) => {
        if (res.data) {
          if (status !== undefined && status === "clear") {
            _this.sell_historyList = [];
          }
          let newArray = JSON.parse(JSON.stringify(res.data.result));
          _this.sell_historyList = _this.sell_historyList.concat(newArray);

          /*try {
            // todo delete
            for (let i = 1; i < 11; i++) {
              _this.sell_historyList.push(
                Object.assign({}, _this.sell_historyList[0], {
                  orderStatus: i,
                  confirmBlock: 0
                })
              );
            }
            _this.sell_historyList.shift();
          } catch (e) {
            console.log(`%c${'e'}`, 'font-size:30px;color:#aa5ff0');
          }*/

          _this.sellLoading = false;
          if (
            _this.sellQuery.pageIndex * _this.sellQuery.pageSize >
              res.data.total ||
            _this.sell_historyList.length === res.data.total
          ) {
            _this.sellFinished = true;
          }

          if (!_this.selectKey) {
            if (_this.sell_historyList.length == 0) {
              _this.hideCheckbox = true;
            } else {
              _this.hideCheckbox = false;
            }
          }
        }
      });
    },
    sellOnLoad() {
      setTimeout(() => {
        this.sellQuery.pageIndex += 1;
        this.sellTransactionHistory();
      }, 1000);
    },

    //跳转详情
    goOrderDetails(val) {
      this.$router.push(`/tradeHistory-details?orderId=${val.orderId}`);
    },

    //退款、修改银行卡信息
    optionsPath(val, state) {
      let _this = this;
      //修改银行卡信息
      if (state === "bankInfo") {
        this.$store.commit("sellPayments/set_fiatCurrencyInfo", {
          fiat: val.fiatName,
          alpha2: val.alpha2, //国家code
        });
        this.$store.state.cardInfoFromPath = "sellOrder";
        this.$router.push(
          `/sell-formUserInfo?orderId=${val.orderId}&payWayCode=${
            val.payWayCode
          }&userAccountId=${val.userAccountId || ""}`
        );
        return;
      }
      //状态为2 - 区块链确认中、确认数量为0
      if (state === "payNow") {
        let params = {
          orderId: val.orderId,
        };
        this.$axios
          .get(this.$api.get_PlayCurrencyStatus, params)
          .then((res) => {
            if (res && res.data) {
              _this.$store.state.sellOrderId = val.orderId;
              _this.$store.state.nextOrderState = 1;
              // 支付方式信息
              let sellPayType = {
                accountType: val.payWayCode === "10010" ? "2" : "1", // 1-Bank Account、2-Credit Card
                payWayCode: val.payWayCode, // 19000-Bank Account、10010-Credit Card
              };
              this.$store.commit("sellPayments/set_sellPayType", sellPayType);
              //费用接口所需参数
              this.$store.commit(
                "sellPayments/set_cryptoAmount",
                Number(val.orderAmount)
              );
              //法币信息
              this.$store.commit("sellPayments/set_fiatCurrencyInfo", {
                alpha2: val.alpha2,
                fiatSymbol: val.fiatSymbol,
                fiat: val.fiatName,
                flag: val.flag,
              });
              //网络信息
              this.$store.commit("sellPayments/set_networkInfo", {
                network: val.cryptoNetwork, //网络
                networkName: "", //网络全称
                networkIcon: "", //网络图标
                addressRegex: "", //地址正则
                memoRegex: "", //memo正则
              });
              //获取网络接口所需加密货币
              this.$store.commit("sellPayments/set_cryptoInfo", {
                crypto: val.cryptocurrency, //数字货币
              });
              _this.$router.push(`/sellOrder`);
            }
          });
        return;
      }
      //退款
      this.$router.push(
        `/Refund?orderId=${val.orderId}&cryptocurrency=${val.cryptocurrency}&fiatCode=${val.fiatName}`
      );
    },

    //数据判空 - null、""、不存在这个字段
    noData(val) {
      if (val !== null && val !== "" && val !== undefined) {
        return val;
      }
      return "--";
    },
  },
};
</script>
<style lang="scss" src="./index.scss" scoped></style>
