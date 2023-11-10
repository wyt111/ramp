/**
 * 数据请求处理
 */

const state = {
  //ajax请求队列
  cancelTokenArr: [],
};

const mutations = {
  pushToken(state, payload) {
    state.cancelTokenArr.push(payload.cancelToken);
  },
  clearToken({ cancelTokenArr }) {
    cancelTokenArr.forEach((item) => {
      if (item) {
        item("路由跳转取消请求");
      }
    });
    cancelTokenArr = [];
  },
  emptyToken(state) {
    state.cancelTokenArr = [];
  },
};

const actions = {
  //结束所有请求进程
  //rootState - 修改其他modules的state
  clearAllQuery({ commit }) {
    commit("clearToken");
    commit("emptyToken");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
