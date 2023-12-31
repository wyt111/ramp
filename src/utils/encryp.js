/**
 * 加密解密工具
 * AES - CBC
 */

const CryptoJS = require("crypto-js");
var secretkey = "&ADrs&o5*K%tlxZe5$b3QkVqG!J8vqUS";
var key = CryptoJS.enc.Utf8.parse(secretkey);
var iv = CryptoJS.enc.Utf8.parse(secretkey.substring(0, 16));

/*-- 加密 --*/
export function AES_Encrypt(word = "") {
  return CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

/*-- 解密 --*/
export function AES_Decrypt(word = "") {
  return CryptoJS.AES.decrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
}
