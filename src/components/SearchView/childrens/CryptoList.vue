<template>
  <!-- 买币加密货币列表 -->
  <div id="CryptoList" ref="ul_box">
    <ul v-if="viewName === 'currency'">
      <div v-if="searchText === ''">
        <!-- 交易过 -->
        <div class="screen_title" v-if="cryptoRecentList.length > 0">
          {{ $t("search_components.recent") }}
        </div>
        <li
          v-for="(item, index) in cryptoRecentList"
          :key="'cryptoRecentList' + index"
          @click="choiseItem('currency', item)"
          :class="{
            ac:
              cryptoInfo.crypto == item.crypto &&
              networkInfo.networkName == item.networkName,
          }"
        >
          <div class="seach_li_text">
            <img class="flag" :src="item.cryptoIcon" v-lazy="item.cryptoIcon" />
            <div class="col2">
              <div class="abbreviationName">{{ item.crypto }}</div>
              <span class="seach_li_allText allName" v-if="item.networkName">{{
                item.networkName
              }}</span>
            </div>
            <img src="@/assets/images/arrow-right1.svg" alt="" class="arrow" />
          </div>
        </li>
        <!-- 热门 -->
        <div class="screen_title" v-if="cryptoPopular.length > 0">
          {{ $t("nav.search_components_Popular") }}
        </div>
        <li
          v-for="(item, index) in cryptoPopular"
          :key="'cryptoPopular' + index"
          @click="choiseItem('currency', item)"
          :class="{
            ac:
              cryptoInfo.crypto == item.crypto &&
              networkInfo.networkName == item.networkName,
          }"
        >
          <div class="seach_li_text">
            <img class="flag" :src="item.cryptoIcon" v-lazy="item.cryptoIcon" />
            <div class="col2">
              <div class="abbreviationName">{{ item.crypto }}</div>
              <span class="seach_li_allText allName" v-if="item.networkName">{{
                item.networkName
              }}</span>
            </div>
            <img src="@/assets/images/arrow-right1.svg" alt="" class="arrow" />
          </div>
        </li>
        <!-- 全部 -->
        <div class="screen_title">{{ $t("nav.search_components_All") }}</div>
        <van-list
          :immediate-check="false"
          v-model="cryptoListLoading"
          :error.sync="cryptoListError"
          :finished="cryptoListFinished"
          :loading-text="$t('search_components.listLoading')"
          :error-text="$t('search_components.listErrorText')"
          :finished-text="$t('search_components.listFinishedText')"
          @load="onLoadCrypto"
        >
          <li
            :class="{
              allCurrencyLi: index === 0,
              ac:
                cryptoInfo.crypto == item.crypto &&
                networkInfo.networkName == item.networkName,
            }"
            v-for="(item, index) in cryptoList"
            :key="'cryptoList' + index"
            @click="choiseItem('currency', item)"
          >
            <div class="seach_li_text">
              <img
                class="flag"
                :src="item.cryptoIcon"
                v-lazy="item.cryptoIcon"
              />
              <div class="col2">
                <div class="abbreviationName">{{ item.crypto }}</div>
                <span
                  class="seach_li_allText allName"
                  v-if="item.networkName"
                  >{{ item.networkName }}</span
                >
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
          v-for="(item, index) in cryptoSearchList"
          :key="'cryptoSearchList' + index"
          @click="choiseItem('currency', item)"
          :class="{
            ac:
              cryptoInfo.crypto == item.crypto &&
              networkInfo.networkName == item.networkName,
          }"
        >
          <div class="seach_li_text">
            <img class="flag" :src="item.cryptoIcon" v-lazy="item.cryptoIcon" />
            <div class="col2">
              <div class="abbreviationName">{{ item.crypto }}</div>

              <span class="seach_li_allText allName" v-if="item.networkName">{{
                item.networkName
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
  name: "CryptoList",
  props: ["viewName", "searchText"],
  data() {
    return {
      //加密币请求参数
      cryptoParams: {
        pageIndex: 1,
        pageSize: 20,
        side: "buy",
        coin: "", //查询字段
        fiat: "", //法币信息
      },
      //上拉加载状态
      cryptoListLoading: false,
      cryptoListFinished: false,
      cryptoListError: false,
      //加密币列表
      cryptoList: [],
      //加密币搜索数据
      cryptoSearchList: [],
      //热门加密币列表
      cryptoPopular: [],
      //交易过加密币列表
      cryptoRecentList: [],
    };
  },
  computed: {
    ...mapState("cryptoBuyPage", {
      //法币信息
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
    }),
    // 商户信息
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),
  },
  mounted() {
    //买币加密币数据
    if (this.viewName === "currency") {
      this.queryCryptoList();
    }
  },
  methods: {
    //获取加密币数据
    queryCryptoList(val) {
      let _this = this;
      if (val === "search") {
        this.cryptoParams.pageIndex = 1;
        this.cryptoParams.coin = this.searchText;
        this.cryptoSearchList = [];
      } else {
        this.cryptoParams.coin = "";
      }
      //法币信息
      this.cryptoParams.fiat = this.fiatCurrencyInfo.fiat || "";
      // page商户参数
      if (
        this.merchantInfo.merchantStatus &&
        this.merchantInfo.merchantType === "page"
      ) {
        if (this.merchantInfo.merchantQueryInfo.network) {
          this.cryptoParams.network =
            this.merchantInfo.merchantQueryInfo.network;
        }
        if (this.merchantInfo.merchantQueryInfo.crypto) {
          this.cryptoParams.crypto = this.merchantInfo.merchantQueryInfo.crypto;
        }
      }
      this.$axios
        .get(this.$api.get_cryptoList, this.cryptoParams)
        .then((res) => {
          if (res && res.data) {
            //搜索数据
            if (val === "search") {
              _this.cryptoSearchList = res.data.pageData.result;
              return;
            }
            //热门数据
            _this.cryptoPopular = res.data.popularList;
            //使用过数据
            _this.cryptoRecentList = res.data.recentBuyList || [];
            //全部数据
            _this.cryptoListLoading = false;
            _this.cryptoList = [
              ..._this.cryptoList,
              ...res.data.pageData.result,
            ];
            //没有更多数据了
            if (
              res.data.pageData.total <
              this.cryptoParams.pageIndex * this.cryptoParams.pageSize
            ) {
              this.cryptoListFinished = true;
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
          this.cryptoListError = true;
        });
    },
    //加密币上拉加载
    onLoadCrypto() {
      this.cryptoParams.pageIndex += 1;
      this.queryCryptoList();
    },
    //选择加密币
    choiseItem(type, val) {
      if (type === "currency") {
        this.$nextTick(() => {
          this.$parent.$parent.$refs.buyCrypto_ref.modifyInfo(2, val);
        });
        this.$parent.$parent.searchState = true;
      }
    },
  },
};
</script>

<style lang="scss" src="../index.scss" scoped></style>
