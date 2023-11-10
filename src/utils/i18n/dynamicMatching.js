import i18n from "@/utils/i18n/index.js";

/**
 * 匹配对应的语言文案
 * @param objectName 对象名称
 * @param key 键值名称
 * @param code 需要匹配code
 * @returns {String}
 */
export function matchLanguage(objectName, key, code) {
  let filterVal = Object.values(i18n.messages["en-US"][objectName]).filter(
    () => {
      return key + code;
    }
  )[0];
  return filterVal !== null && filterVal !== undefined ? filterVal : "";
}
