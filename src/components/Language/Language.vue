<template>
  <div class="Language-container">
    <div class="Language_title" @click="$parent.LanguageShow = false">
      <img src="@/assets/images/goBack.png" alt="" />{{ $t("menu.language") }}
    </div>

    <div class="Language_list">
      <div
        class="Language_line"
        :class="{ active: item.value == locale }"
        v-for="item in languageList"
        :key="item.name"
        @click="choiseItem(item)"
      >
        <div class="Language_line_left">
          <img :src="item.icon" alt="" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <footer>
      <powered-by />
    </footer>
  </div>
</template>

<script>
/**
 * 选择语言组件
 */

import i18n from "@/utils/i18n";
import { languageList } from "@/utils/i18n/lang.config.js";
export default {
  name: "CustomLanguage",
  data() {
    return {
      languageList,
      locale: "",
    };
  },
  methods: {
    choiseItem(item) {
      this.$store.state.languageValue = item.value;
      sessionStorage.setItem("language", item.value);
      i18n.locale = item.value;
      this.locale = item.value;
      this.$parent.LanguageShow = false;
      //买币结果页支付错误提示
      if (this.$route.name === "paymentResult") {
        this.$parent.$refs.routerView.i18nLocale = item.value;
      }
    },
  },
  mounted() {
    this.locale = i18n.locale;
  },
};
</script>
<style lang="scss" scoped>
.Language-container {
  width: 100%;
  height: calc(100%);
  // height: 100%;
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0.26rem 0 0.2rem;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  .Language_title {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 0.32rem;
    padding: 0 0.16rem;
    img {
      height: 0.2rem;
      margin-right: 0.05rem;
    }
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 600;
    font-size: 0.18rem;
    line-height: 0.22rem;
    color: #252830;
  }
  .Language_list {
    padding: 0 0.08rem;
    .Language_line {
      display: flex;
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
      height: 0.62rem;
      padding: 0 0.16rem 0 0.08rem;
      border-radius: 0.06rem;
      cursor: pointer;

      .Language_line_left {
        display: flex;
        align-items: center;
        img {
          width: 0.32rem;
          height: 0.32rem;
          margin-right: 0.16rem;
          border-radius: 50%;
        }
        p {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 600;
          font-size: 0.16rem;
          line-height: 0.2rem;
          color: #252830;
        }
      }
      &:hover {
        background: #f5f5f5;
      }
      &.active {
        .Language_line_left {
          p {
            color: #0059da;
          }
        }
      }
    }
  }
  footer {
    margin-top: auto;
  }
}
</style>
