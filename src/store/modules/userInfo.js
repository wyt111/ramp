/**
 * userInfo
 * 用户信息
 */

export default {
  namespaced: true,
  state: {
    // 验签通过，商户进来是否已经携带网络
    isCarryNetwork: true,
    //用户kyc信息
    kyc_info: {
      levelIndex: "",
      kycTips: "",
      appleUrl: "",
    },
    //用户是否有折扣
    isDiscount: false,
    //用户token
    token: localStorage.getItem("token"),
    //活动状态
    activityStatus: false,
  },
  mutations: {
    // 修改用户是否携带网络的状态
    set_carry_network(state, val) {
      state.isCarryNetwork = val;
    },
    //存储kyc需要进行的步骤
    set_kycInfo_levelIndex(state, val) {
      state.kyc_info.levelIndex = val;
    },
    //修改kyc在执行步骤
    set_kycInfo_kycTips(state, val) {
      state.kyc_info.kycTips = val;
    },
    set_isDiscount(state, val) {
      state.isDiscount = val;
    },
    set_token(state, val) {
      state.token = val;
    },
    set_activityStatus(state, val) {
      state.activityStatus = val;
    },
    set_appleUrl(state, val) {
      state.appleUrl = val;
    },
  },
};
