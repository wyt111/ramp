/**
 * 数据判空 - null、""、不存在这个字段
 */
//
export function noData(val) {
  if (val !== null && val !== "" && val !== undefined) {
    return val;
  }
  return "";
}

/**
 * 初始化表单
 * @param form 需要初始化表单
 * @param aloneData 需要单独处理的对象键值
 * @param init 初始化表单格式
 * @returns {{}}
 */
export function initForm(form = {}, aloneData, init = { num: 0, str: "" }) {
  const newForm = {};
  const toString = Object.prototype.toString;
  init = JSON.stringify(init) === "{}" ? { num: 0, str: "" } : init;
  for (const [key, value] of Object.entries(form)) {
    //基本数据处理
    if (toString.call(value) === "[object String]") {
      newForm[key] = init.str;
    } else if (toString.call(value) === "[object Number]") {
      newForm[key] = init.num;
    } else if (toString.call(value) === "[object Array]") {
      newForm[key] = [];
    } else if (toString.call(value) === "[object Object]") {
      newForm[key] = {};
    } else if (
      toString.call(value) === "[object Null]" ||
      toString.call(value) === "[object Undefined]"
    ) {
      newForm[key] = "";
    } else if (toString.call(value) === "[object Boolean]") {
      newForm[key] = false;
    }
    //需要单独处理的默认数据
    if (aloneData !== undefined && JSON.stringify(aloneData) !== "{}") {
      for (const [aloneKey, aloneValue] of Object.entries(aloneData)) {
        if (aloneKey === key) {
          newForm[key] = aloneValue;
        }
      }
    }
  }
  return newForm;
}

/**
 * 树结构转为一维数组
 * @param nodes
 * @returns {*[]}
 */
export function getFlattenDeepList(nodes = []) {
  let list = [];
  nodes.forEach((item) => {
    list.push(item);
    if (item.children && item.children.length) {
      const tempList = getFlattenDeepList(item.children);
      list = [...list, ...tempList];
    }
  });
  return list;
}

/**
 * 一维数组转树状结构
 * @param nodes
 * eg: let arr = [
 *   { id: 1, pid: '', name: '1AA' },
 *   { id: 2, pid: '', name: '2AA' },
 *   { id: 3, pid: '', name: '3AA' },
 *   { id: 4, pid: 1, name: '4AA' },
 *   { id: 5, pid: 2, name: '5AA' },
 *   { id: 6, pid: 3, name: '6AA' },
 *   { id: 7, pid: 4, name: '7AA' },
 *   { id: 8, pid: 1, name: '8AA' },
 *   { id: 9, pid: 5, name: '9AA' }
 * ]
 * @param queryName1 1维数组键值
 * @param queryName2 需要归类树状结构键值
 * @returns {*[]}
 */
export function get(nodes = [], queryName1, queryName2) {
  const newArr = [];
  nodes.forEach((el) => {
    el.children = [];
    if (!el.pid) {
      newArr.push(el);
    } else {
      const parent = nodes.find(
        (_) => _[`${queryName1}`] === el[`${queryName2}`]
      );
      parent.children.push(el);
    }
  });
  return newArr;
}

/**
 * 自定义指令避免重复点击
 */
import Vue from "vue";
// 在vue上挂载一个指量 preventReClick
const preventReClick = Vue.directive("preventReClick", {
  inserted: function (el, binding) {
    console.log(el.disabled);
    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 3000);
        //binding.value可以自行设置。如果设置了则跟着设置的时间走
        //例如：v-preventReClick='500'
      }
    });
  },
});
export { preventReClick };
