import $api from "@/axios/api";
import store from "@/store";
import BigNumber from "bignumber.js";

const $axios = require("../../axios/axios");
const DefaultDecimalDigits = 0;
// 获取世界法币列表
const get_worldFiatList = async function () {
  let worldFiatList = [];
  const NowTime = Date.now();
  const { updateTime, fiatList } = store.state.cryptoBuyPage.worldFiatInfo;
  const NeedUpdate =
    !updateTime ||
    Math.abs(NowTime - updateTime) > 1000 * 60 * 1 ||
    fiatList.length === 0;
  if (NeedUpdate) {
    try {
      const params = {
        pageIndex: 1,
        pageSize: 99999,
        side: "buy",
        name: "",
      };
      const { returnCode, data } = await $axios.default.get(
        $api.get_worldFiatList,
        params
      );
      if (returnCode === "0000") {
        const { result } = data.pageData;
        store.commit("cryptoBuyPage/set_worldFiatInfo", result);
        worldFiatList = result;
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    worldFiatList = fiatList;
  }
  return worldFiatList;
};
// 获取法币小数位数
const getDecimalDigits = async function (fiat) {
  const worldFiatList = await get_worldFiatList();
  const worldFiatListItem = worldFiatList.find(
    (item) => item.fiat.toUpperCase() === fiat.toUpperCase()
  );
  const decimalDigits =
    worldFiatListItem?.decimalDigits || DefaultDecimalDigits;
  return decimalDigits;
};
// 获取 OnRamp 法币金额
export const getOnRampFiatAmount = async function (amount, fiat) {
  let _amount;
  const amount_BigNumber = new BigNumber(amount);
  if (amount_BigNumber.isInteger()) {
    // 如果输入的金额是整数，则将其转换为 JavaScript 原生的数字
    _amount = amount_BigNumber.toNumber();
  } else {
    // 如果输入的金额包含小数，根据法币的小数位数进行处理
    const NumberOfDecimalPlacesAllowed = await getDecimalDigits(fiat);
    const OwnDecimalPlaces = amount_BigNumber.decimalPlaces();
    const MinNum = BigNumber.min(
      NumberOfDecimalPlacesAllowed,
      OwnDecimalPlaces
    ).toNumber();
    _amount = amount_BigNumber
      .decimalPlaces(MinNum, BigNumber.ROUND_DOWN)
      .toNumber();
  }
  return _amount;
};
