/**
 * 项目工程多语言配置
 */
import Vue from "vue";
import VueI18n from "vue-i18n";
import { messages, defaultLang } from "./lang.config.js";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: sessionStorage.getItem("language") || defaultLang,
  //多语言默认值不可设置常量  否则刷新页面不保存状态
  fallbackLocale: sessionStorage.getItem("language")
    ? sessionStorage.getItem("language")
    : defaultLang,
  messages: messages,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  interpolate: false,
});
export default i18n;
