<template>
  <!-- 买币加密货币列表 -->
  <div id="CryptoList" ref="ul_box">
    <ul v-if="['payCurrency', 'payCurrency-sell'].includes(viewName)">
      <div v-if="searchText === ''">
        <!-- 交易过 -->
        <div class="screen_title" v-if="fiatRecentList.length > 0">
          {{ $t("search_components.recent") }}
        </div>
        <li
          v-for="(item, index) in fiatRecentList"
          :key="'fiatRecentList' + index"
          @click="choiseItem(viewName, item)"
          :class="{
            ac:
              (viewName === 'payCurrency' &&
                fiatCurrencyInfo.alpha2 == item.alpha2 &&
                fiatCurrencyInfo.fiat == item.fiat &&
                fiatCurrencyInfo.fiatSymbol == item.symbol) ||
              (viewName === 'payCurrency-sell' &&
                sell_fiatCurrencyInfo.fiat == item.fiat &&
                sell_fiatCurrencyInfo.alpha2 == item.alpha2),
          }"
        >
          <div class="seach_li_text">
            <img class="flag" :src="item.flag" v-lazy="item.flag" />
            <div class="col2">
              <span v-if="viewName === 'payCurrency'" class="abbreviationName">
                {{ item.fiatName }}</span
              >
              <span
                v-else-if="viewName === 'payCurrency-sell'"
                class="abbreviationName"
              >
                {{ item.enCommonName }}</span
              >
              <span class="seach_li_allText allName" v-if="item.fiat">{{
                item.fiat
              }}</span>
            </div>
            <img src="@/assets/images/arrow-right1.svg" alt="" class="arrow" />
          </div>
        </li>
        <!-- 全部 -->
        <div class="screen_title">
          {{ $t("search_components.availableNow") }}
        </div>
        <van-list
          :immediate-check="false"
          v-model="listLoading"
          :error.sync="listError"
          :finished="listFinished"
          :loading-text="$t('search_components.listLoading')"
          :error-text="$t('search_components.listErrorText')"
          :finished-text="$t('search_components.listFinishedText')"
          @load="onLoadCrypto"
        >
          <li
            :class="{
              allCurrencyLi: index === 0,
              ac:
                (viewName === 'payCurrency' &&
                  fiatCurrencyInfo.alpha2 == item.alpha2 &&
                  fiatCurrencyInfo.fiat == item.fiat &&
                  fiatCurrencyInfo.fiatSymbol == item.symbol) ||
                (viewName === 'payCurrency-sell' &&
                  sell_fiatCurrencyInfo.fiat == item.fiat &&
                  sell_fiatCurrencyInfo.alpha2 == item.alpha2),
            }"
            v-for="(item, index) in fiatList"
            :key="'fiatList' + index"
            @click="choiseItem(viewName, item)"
          >
            <div class="seach_li_text">
              <img class="flag" :src="item.flag" v-lazy="item.flag" />
              <div class="col2">
                <span
                  v-if="viewName === 'payCurrency'"
                  class="abbreviationName"
                >
                  {{ item.fiatName }}</span
                >
                <span
                  v-else-if="viewName === 'payCurrency-sell'"
                  class="abbreviationName"
                >
                  {{ item.enCommonName }}</span
                >
                <span class="seach_li_allText allName" v-if="item.fiat">{{
                  item.fiat
                }}</span>
              </div>
              <img
                src="@/assets/images/arrow-right1.svg"
                alt=""
                class="arrow"
              />
            </div>
          </li>
        </van-list>
      </div>
      <div v-else>
        <li
          v-for="(item, index) in fiatSearchList"
          :key="'fiatSearchList' + index"
          @click="choiseItem(viewName, item)"
          :class="{
            ac:
              (viewName === 'payCurrency' &&
                fiatCurrencyInfo.alpha2 == item.alpha2 &&
                fiatCurrencyInfo.fiat == item.fiat &&
                fiatCurrencyInfo.fiatSymbol == item.symbol) ||
              (viewName === 'payCurrency-sell' &&
                sell_fiatCurrencyInfo.fiat == item.fiat &&
                sell_fiatCurrencyInfo.alpha2 == item.alpha2),
          }"
        >
          <div class="seach_li_text">
            <img class="flag" :src="item.flag" v-lazy="item.flag" />
            <div class="col2">
              <span v-if="viewName === 'payCurrency'" class="abbreviationName">
                {{ item.fiatName }}</span
              >
              <span
                v-else-if="viewName === 'payCurrency-sell'"
                class="abbreviationName"
              >
                {{ item.enCommonName }}</span
              >
              <span class="seach_li_allText allName" v-if="item.fiat">{{
                item.fiat
              }}</span>
            </div>
            <img src="@/assets/images/arrow-right1.svg" alt="" class="arrow" />
          </div>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "FiatList",
  props: ["viewName", "searchText"],
  data() {
    return {
      //法币请求参数
      fiatParams: {
        pageIndex: 1,
        pageSize: 999,
        side: "buy", // 'sell'
        name: this.searchText,
      },
      //上拉加载状态
      listLoading: false,
      listFinished: false,
      listError: false,
      //法币列表
      fiatList: [],
      //法币搜索数据
      fiatSearchList: [],
      //交易过法币列表
      fiatRecentList: [],
    };
  },
  computed: {
    //法币信息
    ...mapState("cryptoSellPage", {
      sell_fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
    }),
    ...mapState("cryptoBuyPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
    }),
  },
  mounted() {
    //买币法币数据
    if (["payCurrency", "payCurrency-sell"].includes(this.viewName)) {
      this.queryFiatList();
    }
  },
  methods: {
    //获取法币数据
    queryFiatList(val) {
      let _this = this;
      if (val === "search") {
        this.fiatParams.pageIndex = 1;
        this.fiatParams.name = this.searchText;
        this.fiatSearchList = [];
      } else {
        this.fiatParams.name = "";
      }
      if (this.viewName === "payCurrency") {
        this.fiatParams.side = "buy";
      } else if (this.viewName === "payCurrency-sell") {
        this.fiatParams.side = "sell";
      }
      this.$axios
        .get(this.$api.get_worldFiatList, this.fiatParams)
        .then((res) => {
          if (res && res.data) {
            // 列表数据
            this.$nextTick(() => {
              //搜索数据
              if (val === "search") {
                _this.fiatSearchList = res.data.pageData.result;
                return;
              }
              //全部数据
              _this.fiatList = res.data.pageData.result;
              //使用过数据
              if (this.viewName === "payCurrency") {
                _this.fiatRecentList = res.data.buyRecentFiatList || [];
              } else if (this.viewName === "payCurrency-sell") {
                _this.fiatRecentList = res.data.sellRecentFiatList || [];
              }
            });
            _this.listLoading = false;
            //没有更多数据了
            if (
              res.data.pageData.total <
              this.fiatParams.pageIndex * this.fiatParams.pageSize
            ) {
              this.listFinished = true;
            }
            this.$nextTick(() => {
              let removeClassName = () => {
                if (this.searchText === "") {
                  let dom_lis = this.$refs.ul_box.querySelectorAll("li.ac");
                  if (dom_lis.length > 1) {
                    dom_lis.forEach((item, index) => {
                      if (index > 0) {
                        item.classList.remove("ac");
                      }
                    });
                  }
                }
              };
              setTimeout(removeClassName, 5);
              setTimeout(removeClassName, 30);
              setTimeout(removeClassName, 100);
              setTimeout(removeClassName, 300);
            });
          }
        })
        .catch(() => {
          this.listError = true;
        });
    },
    //法币上拉加载
    onLoadCrypto() {
      this.fiatParams.pageIndex += 1;
      this.queryFiatList();
    },
    //选择法币
    choiseItem(type, val) {
      if (type === "payCurrency") {
        this.$nextTick(() => {
          this.$parent.$parent.$refs.buyCrypto_ref.modifyInfo(1, val);
          this.$parent.$parent.searchState = true;
        });
        return;
      }
      if (type === "payCurrency-sell") {
        this.$nextTick(() => {
          this.$parent.$parent.$refs.sellCrypto_ref.modifyInfo(1, val);
          this.$parent.$parent.searchState = true;
        });
      }
    },
  },
};
</script>

<style lang="scss" src="../index.scss" scoped></style>
