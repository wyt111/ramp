import common from "./common.js";

/**
 * 项目工程rem自适应配置
 */
export default function remSize() {
  (function (doc, win) {
    const uiWidth = common.uiSize; // view width 375
    const docEl = doc.documentElement;
    const resizeEvt =
      "orientationchange" in window ? "orientationchange" : "resize";
    const recalc = function () {
      let clientWidth = docEl.clientWidth;
      if (!clientWidth) {
        return;
      }
      if (clientWidth < 791) {
        docEl.style.fontSize = 100 * (clientWidth / uiWidth) + "px";
      } else {
        docEl.style.fontSize = "100px";
      }
    };
    if (!doc.addEventListener) {
      return;
    }
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener("DOMContentLoaded", recalc, false);
    recalc();
  })(document, window);
}
