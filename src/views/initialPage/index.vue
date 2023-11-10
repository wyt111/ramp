<template>
  <div id="homePage">
    <div class="homePage_content">
      <div class="homePage_view">
        <merchant-logo path="index" />

        <div class="home-header">
          <div class="home-tab">
            <template v-if="tableState === false">
              <div
                ref="buy_crypto_tab"
                :class="{
                  tabClass: tabstate === 'buyCrypto',
                  opacity0: lineAvailable,
                }"
                @click="switchTab('buyCrypto')"
              >
                <span class="span_normal">
                  {{ $t("homePage.tab_buy") }}
                </span>
                <span class="span_bold">
                  {{ $t("homePage.tab_buy") }}
                </span>
              </div>
              <div
                ref="sell_crypto_tab"
                :class="{
                  tabClass: tabstate === 'sellCrypto',
                  opacity0: lineAvailable,
                }"
                @click="switchTab('sellCrypto')"
              >
                <span class="span_normal">
                  {{ $t("homePage.tab_sell") }}
                </span>
                <span class="span_bold">
                  {{ $t("homePage.tab_sell") }}
                </span>
              </div>

              <div
                class="line"
                :class="{ 'line-available': lineAvailable }"
                :style="lineStyle"
              ></div>
            </template>

            <!-- 商户配置菜单栏 -->
            <template v-else-if="tableState === true">
              <div
                :class="{ 'tabClass bb': tabstate === 'buyCrypto' }"
                @click="switchTab('buyCrypto')"
                v-if="tabstate === 'buyCrypto'"
              >
                {{ $t("homePage.tab_buy") }}
              </div>

              <div
                :class="{ 'tabClass bb': tabstate === 'sellCrypto' }"
                @click="switchTab('sellCrypto')"
                v-else-if="tabstate === 'sellCrypto'"
              >
                {{ $t("homePage.tab_sell") }}
              </div>
            </template>
          </div>
          <div class="allPage-icon">
            <img
              v-if="isMenuBarVisible"
              src="@/assets/images/meun-icon.svg"
              @click="openMenu"
            />
          </div>
        </div>
        <div class="home-children">
          <buyCrypto
            v-show="$store.state.homeTabstate === 'buyCrypto'"
            ref="buyCrypto_ref"
          />
          <sellCrypto
            v-show="$store.state.homeTabstate === 'sellCrypto'"
            ref="sellCrypto_ref"
          />
        </div>
      </div>
    </div>
    <!-- search Public organization -->
    <search
      v-if="!searchState"
      ref="search_ref"
      :viewName="viewName"
      routerFrom="home"
    />
  </div>
</template>

<script>
import sellCrypto from "@/views/initialPage/childrens/sellCrypto";
import buyCrypto from "@/views/initialPage/childrens/buyCrypto";
import search from "@/components/SearchView/search";
import { hashQuery, merchantInfo } from "@/utils/publicRequest";
import { mapState } from "vuex";

export default {
  name: "index",
  components: { buyCrypto, sellCrypto, search },
  data() {
    return {
      menuState: false,
      searchState: true,
      viewName: "",
      lineStyle: {},
      lineAvailable: false,
    };
  },
  mounted() {
    console.log("home data mounted");
    this.$store.commit("cryptoSellPage/set_cryptoAmount", "");
    this.merchantDocking();
  },
  watch: {
    "$store.state.homeTabstate": {
      immediate: true,
      handler(val) {
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
    isShowImportantUpdates: {
      immediate: true,
      handler(val) {
        if (
          val &&
          !this.$store.state.isShowImportantUpdates &&
          localStorage.getItem("token") &&
          new Date().getTime() -
            this.$store.state.showImportantUpdatesTimeStamp >=
            30 * 60 * 1000 &&
          new Date().getTime() < 1693929600000
        ) {
          this.$store.commit("changeisShowImportantUpdates", {
            flag: true,
          });
        }
      },
    },
  },
  computed: {
    isShowImportantUpdates() {
      const SellPageFiat =
        this.$store?.state?.cryptoSellPage?.fiatCurrencyInfo?.fiat?.toUpperCase();
      const BuyPageFiat =
        this.$store?.state?.cryptoBuyPage?.fiatCurrencyInfo?.fiat?.toUpperCase();
      const homeTabstate = this.$store?.state?.homeTabstate;

      if (homeTabstate === "buyCrypto" && BuyPageFiat === "USD") {
        return 1;
      } else if (homeTabstate === "buyCrypto" && BuyPageFiat === "SGD") {
        return 2;
      } else if (homeTabstate === "sellCrypto" && SellPageFiat === "USD") {
        return 3;
      } else if (homeTabstate === "sellCrypto" && SellPageFiat === "SGD") {
        return 4;
      } else {
        return 0;
      }
    },
    // 商户信息
    ...mapState("buyCryptoMerchant", {
      buyMerchantInfo: (state) => state.merchantInfo,
    }),

    //商户对接tab状态
    tableState() {
      return this.$store.state.tableState;
    },
    tabstate() {
      const { appId, showTable, type } = hashQuery().query;
      if (appId) {
        if (showTable === "buy") {
          this.$store.state.tableState = true;
          this.$store.state.homeTabstate = "buyCrypto";
        } else if (showTable === "sell") {
          this.$store.state.tableState = true;
          this.$store.state.homeTabstate = "sellCrypto";
        } else if (!showTable && type === "buy") {
          this.$store.state.tableState = true;
          this.$store.state.homeTabstate = "buyCrypto";
        } else if (!showTable && type === "sell") {
          this.$store.state.tableState = true;
          this.$store.state.homeTabstate = "sellCrypto";
        }
      } else {
        if (showTable === "buy") {
          this.$store.state.tableState = true;
          this.$store.state.homeTabstate = "buyCrypto";
        } else if (showTable === "sell") {
          this.$store.state.tableState = true;
          this.$store.state.homeTabstate = "sellCrypto";
        }
      }
      return this.$store.state.homeTabstate;
    },
    // 商户自定义样式
    isMenuBarVisible() {
      return this.$store.state.merchantConfig.menuBarVisible;
    },
  },
  deactivated() {
    window.removeEventListener("resize", this.lineAnimation);
  },
  activated() {
    this.lineAnimation();
    window.addEventListener("resize", this.lineAnimation);

    // // 挡 showTable 参数不存在时，判断是买币还是买币
    // if (!hashQuery().query.showTable && hashQuery().query.type === 'buy') {
    //   this.$store.state.tableState = true;
    //   this.$store.state.homeTabstate = 'buyCrypto';
    // } else if (!hashQuery().query.showTable && hashQuery().query.type === 'sell') {
    //   this.$store.state.tableState = true;
    //   this.$store.state.homeTabstate = 'sellCrypto';
    // }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 返回后刷新数据,避免确认订单页返回数据错乱问题
      if (
        vm.$store.state.homeTabstate === "buyCrypto" &&
        vm.$store.state.buyPayments.payMethodInfo.payWayCode !== "" &&
        !["/", "/emailCode", "/verifyCode"].includes(from.path)
      ) {
        vm.$refs.buyCrypto_ref.basicsInfo(2);
      }
      //登陆后刷新首页基本数据
      if (to.name === "home" && from.name === "verifyCode") {
        vm.merchantDocking();
      }
      if (to.name === "home" && from.name === "sellOrder") {
        // 卖币时添加的 —— 防止商户创建订单后，不退出，再次返回创建订单，会导致一个merchantOrderNo对应多个订单
        vm.merchantDocking();
      }
      // 初始化清空数据，返回不清空数据
      if (to.name === "home" && from.name !== null) return;
      vm.$refs.buyCrypto_ref.set_basicsInfo({ data: {} });
    });
  },
  methods: {
    lineAnimation() {
      if (!this.tableState) {
        this.$nextTick(() => {
          setTimeout(
            () => {
              const ref =
                this.$store.state.homeTabstate === "buyCrypto"
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
        });
      }
    },
    openSearch(view) {
      this.searchState = false;
      this.viewName = view;
    },
    openMenu() {
      this.$parent.routerViewState = false;
      this.$store.state.routerViewState = false;
    },

    switchTab(tab) {
      this.$store.state.homeTabstate = tab;
    },

    //获取基本数据 - 国家、法币、加密币、网络
    async queryInfo() {
      //带入商户信息 过滤商户加密货币
      const { tableState, homeTabstate } = this.$store.state;
      const { buyCrypto_ref, sellCrypto_ref } = this.$refs;
      if (tableState && homeTabstate === "sellCrypto") {
        sellCrypto_ref.basicsInfo(1);
      } else if (tableState && homeTabstate === "buyCrypto") {
        buyCrypto_ref.basicsInfo(1);
      } else {
        buyCrypto_ref.basicsInfo(1);
        sellCrypto_ref.basicsInfo(1);
      }
    },

    //对接商户参数 - 语言、tab状态、商户token
    async merchantDocking() {
      merchantInfo();
      let orderNo = hashQuery().query.orderNo ? hashQuery().query.orderNo : "";
      if (orderNo === "") await this.queryInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
html,
body,
#homePage,
.homePage_view,
.homePage_content {
  width: 100%;
  height: 100%;
}
.homePage_view {
  display: flex;
  flex-direction: column;
  .home-children {
    flex: 1;
    // overflow: auto;
  }
  .home-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 0.36rem;
    padding-bottom: 0.12rem;
    margin-bottom: 0.32rem;

    .home-tab {
      display: flex;
      align-items: center;
      position: relative;
      div {
        font-family: "SF Pro Display";
        // font-weight: 600;
        font-size: 0.18rem;
        color: #848b96;
        line-height: 0.21rem;
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          color: #626c7d;
        }
        &:nth-of-type(2) {
          margin-left: 0.32rem;
        }
        white-space: nowrap;
        text-align: center;
        .span_normal {
          position: absolute;
        }
        .span_bold {
          opacity: 0;
          font-weight: 600;
        }
        // transition: all 0.1s;
        &:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 0.03rem;
          background: transparent;
          border-radius: 0.02rem;
          left: 50%;
          transform: translateX(-50%);
          bottom: -0.14rem;
        }
        &.tabClass {
          position: relative;
          color: #0059da;
          cursor: default;
          font-weight: 600;

          &:after {
            background: #0059da;
          }

          &.opacity0 {
            &:after {
              opacity: 0;
            }
          }

          &.bb {
            &:before {
              content: "";
              position: absolute;
              width: 100%;
              height: 0.03rem;
              background: #0059da;
              border-radius: 0.02rem;
              left: 50%;
              transform: translateX(-50%);
              bottom: -0.14rem;
            }
          }
        }
      }
      .line {
        position: absolute;
        width: 0;
        height: 0.03rem;
        background: #0059da;
        border-radius: 0.02rem;
        bottom: -0.14rem;
        left: 0;
        &.line-available {
          transition: all 0.3s;
        }
      }
    }
    .allPage-icon {
      width: 0.24rem;
      height: 0.24rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.navigationBar_view {
  display: flex;
  align-items: center;
  padding-bottom: 0.2rem;
  .navigationBar_view_left {
    display: flex;
    align-items: center;
    font-size: 0.18rem;
    font-family: Semibold;
    font-weight: 600;
    // font-weight: bold;
    color: #252830;
  }
  .navigationBar_view_right {
    padding: 0.06rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.1rem 0 0.1rem 0.1rem;
    margin-left: auto;
    cursor: pointer;
    img {
      width: 0.22rem;
      cursor: pointer;
      margin-right: -0.2rem;
    }
  }
}
</style>
