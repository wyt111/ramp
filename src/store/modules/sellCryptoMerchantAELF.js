/**
 * sellCryptoMerchantAELF
 * AELF卖币商户
 */

export default {
  namespaced: true,
  state: {
    //全部商户信息
    merchantInfo: {},
    merchantFullPath: "",
  },
  mutations: {
    //存储商户信息
    set_merchantInfo(state, val) {
      state.merchantInfo = val;
    },
    set_merchantFullPath(state, val) {
      state.merchantFullPath = val;
    },
  },
  actions: {
    //清空商户数据
    /*clearMerchantInfo({ commit }) {
      let merchantInfo = {
        //商户类型
        merchantType: '', //api、page
        //商户状态
        merchantStatus: false,
        //api商户信息｜page商户信息
        merchantQueryInfo: {
          appId: ''
        },
        //商户地址栏信息
        merchantFullPath: ''
      };
      commit('set_merchantInfo', merchantInfo);
      window.sessionStorage.removeItem('buyMerchantInfo');
    }*/
  },
};
