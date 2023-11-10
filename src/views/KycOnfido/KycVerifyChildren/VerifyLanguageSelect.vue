<template>
  <div class="verify-language-select">
    <div class="select-label" @click.stop="onShowLanguageSelectDialog">
      <img class="img1" src="@/assets/images/kycOnfido/9.svg" alt="" />
      <span class="text">{{ currentLanguage }}</span>
      <img class="img2" src="@/assets/images/kycOnfido/10.svg" alt="" />
    </div>
    <div class="select-body" v-show="showLanguageSelectDialog">
      <div class="ul">
        <div
          class="li"
          :class="{ ac: item.val === onfidoLanguage }"
          v-for="item in languages"
          :key="item.val"
          @click="onLanguageSelected(item)"
        >
          <span class="text">{{ item.key }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "VerifyLanguageSelect",
  data() {
    return {
      languages: [
        { key: "Arabic", val: "ar" },
        { key: "Armenian", val: "hy" },
        { key: "Bulgarian", val: "bg" },
        { key: "Chinese (Simplified)", val: "zh_CN" },
        { key: "Chinese (Traditional)", val: "zh_TW" },
        { key: "Croatian", val: "hr" },
        { key: "Czech", val: "cs" },
        { key: "Danish", val: "da" },
        { key: "Dutch", val: "nl" },
        { key: "English (United Kingdom)", val: "en_GB" },
        { key: "English (United States)", val: "en_US" },
        { key: "Estonian", val: "et" },
        { key: "Finnish", val: "fi" },
        { key: "French", val: "fr" },
        { key: "French (Canadian)", val: "fr_CA" },
        { key: "German", val: "de" },
        { key: "Greek", val: "el" },
        { key: "Hebrew", val: "he" },
        { key: "Hindi", val: "hi" },
        { key: "Hungarian", val: "hu" },
        { key: "Indonesian", val: "id" },
        { key: "Italian", val: "it" },
        { key: "Japanese", val: "ja" },
        { key: "Korean", val: "ko" },
        { key: "Latvian", val: "lv" },
        { key: "Lithuanian", val: "lt" },
        { key: "Malay", val: "ms" },
        { key: "Norwegian", val: "nb" },
        { key: "Persian", val: "fa" },
        { key: "Polish", val: "pl" },
        { key: "Portuguese", val: "pt" },
        { key: "Portuguese (Brazil)", val: "pt_BR" },
        { key: "Romanian", val: "ro" },
        { key: "Russian", val: "ru" },
        { key: "Serbian", val: "sr" },
        { key: "Slovak", val: "sk" },
        { key: "Slovenian", val: "sl" },
        { key: "Spanish", val: "es" },
        { key: "Spanish (Latin America)", val: "es_419" },
        { key: "Swedish", val: "sv" },
        { key: "Thai", val: "th" },
        { key: "Turkish", val: "tr" },
        { key: "Ukrainian", val: "uk" },
        { key: "Vietnamese", val: "vi" },
      ],
      showLanguageSelectDialog: false,
    };
  },
  props: ["onfidoLanguage"],
  computed: {
    currentLanguage() {
      let currentLanguage = "";
      this.languages.some((item) => {
        if (item.val === this.onfidoLanguage) {
          currentLanguage = item.key;
          return true;
        }
      });
      return currentLanguage;
    },
  },
  watch: {
    showLanguageSelectDialog(flag) {
      if (flag) {
        document.addEventListener("click", this.hideLanguageSelectDialog);
      } else {
        document.removeEventListener("click", this.hideLanguageSelectDialog);
      }
    },
  },
  mounted() {},
  methods: {
    onLanguageSelected(languageObj) {
      if (languageObj.val !== this.onfidoLanguage) {
        this.$emit("onSetlanguage", languageObj.val);
      }
    },
    onShowLanguageSelectDialog() {
      this.showLanguageSelectDialog = !this.showLanguageSelectDialog;
    },
    hideLanguageSelectDialog() {
      this.showLanguageSelectDialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.verify-language-select {
  position: relative;
  z-index: 1;
  margin-bottom: 0.2rem;
  .select-label {
    display: flex;
    align-items: center;
    height: 0.2rem;
    width: fit-content;
    cursor: pointer;
    .img1 {
      width: 0.2rem;
      margin-right: 0.08rem;
    }
    .text {
      font-family: "Medium";
      font-style: normal;
      font-weight: 500;
      font-size: 0.14rem;
      line-height: 0.2rem;
      color: #bfbfbf;
      margin-right: 0.12rem;
    }
    .img2 {
      width: 0.08rem;
    }
  }
  .select-body {
    position: absolute;
    top: 0.28rem;
    left: 0.02rem;
    min-width: 1.88rem;
    width: fit-content;
    height: 3.68rem;
    background: #ffffff;
    box-shadow: 0px 0px 32px rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    padding: 0.04rem;
    .ul {
      height: 100%;
      overflow: auto;
      .li {
        height: 0.4rem;
        border-radius: 0.04rem;
        font-family: "Regular";
        font-style: normal;
        font-weight: 400;
        font-size: 0.14rem;
        line-height: 0.4rem;
        color: #252830;
        padding: 0 0.12rem;

        &.ac,
        &:hover {
          background: #f4f5f7;
        }
      }
    }
  }
}
</style>
