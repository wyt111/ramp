/**
 * buyCryptoMerchant
 * 买币商户
 */

export default {
  namespaced: true,
  state: {
    //全部商户信息
    merchantInfo: {
      //商户类型
      merchantType: "", //api、page、sell
      //商户状态
      merchantStatus: false,
      //api商户信息｜page商户信息
      merchantQueryInfo: {
        appId: "",
      },
      //商户地址栏信息
      merchantFullPath: "",
    },
    merchantLogo: "",
  },
  mutations: {
    //存储商户信息
    set_merchantInfo(state, val) {
      state.merchantInfo = {
        //商户类型 api商户信息｜page商户信息
        merchantType: val.merchantType, //api、page
        //商户状态
        merchantStatus: val.merchantStatus,
        //商户query信息 api商户信息｜page商户信息
        merchantQueryInfo: val.merchantQueryInfo,
        //商户地址栏url信息
        merchantFullPath: val.merchantFullPath,
      };
    },
    set_merchantLogo(state, val) {
      state.merchantLogo = val || "";
    },
  },
  actions: {
    //清空商户数据
    clearMerchantInfo({ commit, rootState }) {
      let merchantInfo = {
        //商户类型
        merchantType: "", //api、page
        //商户状态
        merchantStatus: false,
        //api商户信息｜page商户信息
        merchantQueryInfo: {
          appId: "",
        },
        //商户地址栏信息
        merchantFullPath: "",
      };
      commit("set_merchantInfo", merchantInfo);
      rootState.tableState = false;
      window.sessionStorage.removeItem("buyMerchantInfo");
    },
  },
};
