<!-- search Public organization -->
<template>
  <div id="search" class="search">
    <transition name="slide-up">
      <div class="search-inner" v-show="show">
        <div class="searchHeader">
          <div class="searchHeader_view1">
            <div class="text">{{ viewTitle }}</div>
            <div class="icon">
              <img src="../../assets/images/ShutDown.svg" @click="closeView" />
            </div>
          </div>
          <div class="searchHeader_view2">
            <input
              ref="input_focus"
              type="text"
              :placeholder="$t('nav.search_components_placeHolder')"
              v-model="searchText"
              @keyup="searchTextInput"
            />
            <div class="searchIcon">
              <img src="@/assets/images/searchIcon1.svg" />
            </div>
          </div>
        </div>
        <div class="search_core" ref="search_core">
          <!--          <lazy-component>-->
          <!---------------------------- 国家和法币列表 ---------------------------->
          <Fiat-list
            v-if="['payCurrency', 'payCurrency-sell'].includes(viewName)"
            :viewName="viewName"
            :searchText="searchText"
            ref="fiatList_ref"
          />
          <!---------------------------- 买币加密币列表 ---------------------------->
          <Crypto-list
            v-else-if="viewName === 'currency'"
            :viewName="viewName"
            :searchText="searchText"
            ref="CryptoList_ref"
          />
          <!---------------------------- 卖币加密币列表 ---------------------------->
          <Crypto-list-sell
            v-else-if="viewName === 'currency-sell'"
            :viewName="viewName"
            :searchText="searchText"
            ref="CryptoList_sell_ref"
          />
          <!--          </lazy-component>-->
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { debounce } from "@/utils";
import CryptoList from "@/components/SearchView/childrens/CryptoList";
import CryptoListSell from "@/components/SearchView/childrens/CryptoListSell";
import FiatList from "@/components/SearchView/childrens/FiatList";
/**
 * 搜索、选择列表组件
 * viewName - 组件名称
 */

export default {
  name: "CustomSearch",
  components: {
    // CryptoList: () => import('@/components/SearchView/childrens/CryptoList'),
    // CryptoListSell: () => import('@/components/SearchView/childrens/CryptoListSell'),
    // FiatList: () => import('@/components/SearchView/childrens/FiatList'),
    CryptoList: CryptoList,
    CryptoListSell: CryptoListSell,
    FiatList: FiatList,
  },
  props: ["viewName"],
  data() {
    return {
      show: false,
      viewTitle: "",
      //Search for data
      searchText: "",
    };
  },
  mounted() {
    this.show = true;
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.input_focus.focus();
      }, 300);
    });
    this.customComponentTitle();
  },
  methods: {
    //Judge title name
    customComponentTitle() {
      if (this.viewName === "payCurrency") {
        this.viewTitle = this.$t("nav.search_components_currencyTitle");
        return;
      }
      if (this.viewName === "payCurrency-sell") {
        this.viewTitle = this.$t("nav.search_components_countryTitle");
        return;
      }
      if (this.viewName === "currency" || this.viewName === "currency-sell") {
        this.viewTitle = this.$t("nav.search_components_cryptoTitle");
        return;
      }
    },

    //close component
    closeView() {
      this.show = false;
      setTimeout(() => {
        if (
          this.viewName === "currency" ||
          this.viewName === "currency-sell" ||
          this.viewName === "payCurrency-sell" ||
          this.viewName === "payCurrency"
        ) {
          this.$parent.searchState = true;
        }
      }, 300);
    },

    searchTextInput: debounce(function () {
      // 买币加密币数据
      if (this.viewName === "currency") {
        try {
          this.$refs.CryptoList_ref &&
            this.$refs.CryptoList_ref.queryCryptoList("search");
        } catch (e) {
          console.log(e);
        }
        return;
      }
      // 卖币加密币数据
      if (this.viewName === "currency-sell") {
        try {
          this.$refs.CryptoList_sell_ref &&
            this.$refs.CryptoList_sell_ref.queryCryptoList("search");
        } catch (e) {
          console.log(e);
        }
      }
      // 国家和法币
      if (
        this.viewName === "payCurrency" ||
        this.viewName === "payCurrency-sell"
      ) {
        try {
          this.$refs.fiatList_ref &&
            this.$refs.fiatList_ref.queryFiatList("search");
        } catch (e) {
          console.log(e);
        }
      }
    }, 500),
  },
};
</script>

<style lang="scss" src="./index.scss" scoped></style>
