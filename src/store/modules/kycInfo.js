/**
 * kycInfo
 * kyc所需参数
 */

export default {
  namespaced: true,
  state: {
    // kyc验证成功｜失败
    kycCheck: false,
    // kyc结果信息
    kycResultInfo: {},
    legendTradingKycInfo: {},
  },
  mutations: {
    set_kycCheck(state, val) {
      state.kycCheck = val;
    },
    set_kycResultInfo(state, val) {
      state.kycResultInfo = val;
    },
    set_legendTradingKycInfo(state, val) {
      state.legendTradingKycInfo = val;
    },
  },
};
