let $math = require("mathjs"); // 引入依赖

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
 * 处理js计算不精准问题
 * @param _func
 * @param chain
 * @param args
 * @returns {*}
 */
// function operation(_func, chain, args) {
//   for (let i = 0, len = args.length; i < len; i++) {
//     chain = chain[_func]($math.bignumber(args[i]));
//   }
//   return chain;
// }
// // 构建对象
// function BigNumber(number) {
//   this.chain = $math.chain($math.bignumber(number));
// }
// // 加减乘除中间操作
// BigNumber.prototype.add = function(...rest) {
//   this.chain = operation('add', this.chain, rest);
//   return this;
// };
// // 输出函数
// BigNumber.prototype.done = function() {
//   return parseFloat(this.chain.done());
// };
// export const mathJs = number => new BigNumber(number);

function operation(_func, chain, args) {
  for (let i = 0, len = args.length; i < len; i++) {
    chain = chain[_func]($math.bignumber(args[i]));
  }
  return chain;
}
// 构建对象
function BigNumber(number) {
  this.chain = $math.chain($math.bignumber(number));
}
// 加减乘除中间操作
BigNumber.prototype.add = function (...rest) {
  this.chain = operation("add", this.chain, rest);
  return this;
};
BigNumber.prototype.subtract = function (...rest) {
  this.chain = operation("subtract", this.chain, rest);
  return this;
};
BigNumber.prototype.multiply = function (...rest) {
  this.chain = operation("multiply", this.chain, rest);
  return this;
};
BigNumber.prototype.divide = function (...rest) {
  this.chain = operation("divide", this.chain, rest);
  return this;
};
// 输出函数
BigNumber.prototype.done = function () {
  return parseFloat(this.chain.done());
};
// 四舍五入输出函数
BigNumber.prototype.toFixed = function (fractionDigits) {
  return parseFloat(this.chain.done()).toFixed(fractionDigits);
};
export const mathJs = (number) => new BigNumber(number);

/**
 * 判断是否在可视范围内
 * @param viewId 可滑动容器id
 * @param footerEl 按钮dom
 * @returns {boolean}
 */
export function isElementNotInViewport(viewId, footerEl) {
  if (
    !document.getElementsByClassName("routerView")[0] ||
    !document.getElementById("buyNavTab-container") ||
    !document.getElementById(viewId).offsetHeight ||
    !footerEl
  ) {
    return;
  }
  let visualHeight =
    document.getElementsByClassName("routerView")[0].offsetHeight || 0;
  let buyNavHeight =
    document.getElementById("buyNavTab-container").offsetHeight || 0;
  let viewHeight = document.getElementById(viewId).offsetHeight || 0;
  let footerHeight = footerEl.offsetHeight || 0;
  return buyNavHeight + viewHeight - footerHeight + 5 > visualHeight;
}

/**
 * 解决window.open不能打开新页面方法
 * @param url
 */
export function windowOpen(url) {
  const a = document.createElement("div");
  a.onclick = window.open(url, "_blank");
  a.remove();
}

/**
 * 保留小数位规则
 * 个位数大于1保留2位小数
 * 个位数小于1保留6为小数
 * @param {string | number | null | undefined} val
 * @returns { string | number } 转换后的数值
 */
export function numberHandle(val) {
  if (val !== "" && val !== undefined && val != null) {
    let returnNumber =
      val >= 1
        ? Math.floor(val * 100) / 100
        : Math.floor(val * 1000000) / 1000000;
    isNaN(val) || returnNumber <= 0 ? (returnNumber = 0) : "";
    return returnNumber;
  }
  return 0;
}

/**
 * Created by PanJiaChen on 16/11/18.
 */
export function timeDown(time) {
  if (time >= 0) {
    var second = time;
    var minute = 0;
    minute = parseInt(second / 60);
    second %= 60;
    // if(minute>60) {
    //   minute%=60;
    // }
    second = second > 9 ? second : "0" + second;
    minute = minute > 9 ? minute : "0" + minute;
    return minute + ":" + second;
  }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunda
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

// export function getUTCTime() {
//   let d1 = new Date();
//   let d2 = new Date( d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds() );
//   return Date.parse(d2);
// }
//获取utc时间
export function getUTCTime(data) {
  var time = new Date(); //获取时间
  // 获取时间偏移量 getTimezoneOffset 获取格林威治时间   *60000是到毫秒
  var dataOffset = new Date().getTimezoneOffset() * 60000;
  // 获取格林威治时间
  var utc = time.getTime() + dataOffset; // 两个时间戳
  // 拿格林威治时间去反推指定地区时间
  var newTime = utc + 3600000 * data; //
  var times = new Date(newTime);
  return times;
}
/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + "";
  const randomNum = parseInt((1 + Math.random()) * 65536) + "";
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === "string" || str instanceof String) {
    return true;
  }
  return false;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
  return Array.isArray(arg);
}

export function digitalInputFormatter(str) {
  str += "";
  // 替换所有的非数字和小数点为空字符串
  let replacedStr = str.replace(/[^\d.]/g, "");

  // 确保最多只有一个小数点
  const dotIndex = replacedStr.indexOf(".");
  if (dotIndex !== -1) {
    replacedStr =
      replacedStr.slice(0, dotIndex + 1) +
      replacedStr.slice(dotIndex + 1).replace(/\./g, "");
  }
  // 不能以数字0为开头
  if (/^0\d/.test(replacedStr)) {
    if (/^00+$/.test(replacedStr)) {
      replacedStr = "0";
    } else {
      replacedStr = replacedStr.replace(/^0+/, ""); // 去除数字0开头
    }
  }
  // 如果以.开头添加0前缀
  if (replacedStr.startsWith(".")) {
    replacedStr = "0" + replacedStr;
  }

  return replacedStr;
}

/**
 * 校验对象长度
 * @param {Object}
 * @return {boolean} >0 - true、===0 - false
 */

export function ObjectLength(obj = {}) {
  return !(Object.keys(obj).length === 0);
}
/**
 * [parseQueryParams description]
 * @param  {[type]} queryStr [description]
 * @return {[type]}          [description]
 */
export function parseQueryParams(queryStr) {
  const searchParams = new URLSearchParams(queryStr);
  const paramsObject = {};

  for (const [key, value] of searchParams.entries()) {
    paramsObject[key] = value;
  }

  return paramsObject;
}

/**
 * 在指定位置插入分隔符，格式化数字字符串
 * @param {string} input - 输入的数字字符串
 * @param {number[]} separatorPositions - 要插入分隔符的位置数组
 * @param {string} [separator='-'] - 分隔符，默认为横线
 * @returns {string} 格式化后的带有分隔符的数字字符串
 */
export function formatNumberWithSeparator(
  input,
  separatorPositions,
  separator = "-"
) {
  // 去除非数字字符
  const number = input.replace(/\D/g, "");
  // 插入分隔符
  let numberWithSeparator = "";
  let currentPosition = 0;
  for (let i = 0; i < number.length; i++) {
    // 在指定位置插入分隔符
    if (currentPosition > 0 && separatorPositions.includes(currentPosition)) {
      numberWithSeparator += separator;
    }
    numberWithSeparator += number[i];
    currentPosition++;
  }

  return numberWithSeparator;
}

/**
 * 通过正则表达式过滤字符串中不符合要求的字符。
 *
 * @param {string} str - 要过滤的字符串。
 * @param {string} regex - 正则表达式模式，用于匹配符合要求的字符。
 * @returns {string} - 过滤后的字符串。
 */
export function filterStringByRegExp(str, regex) {
  if (regex) {
    var filteredStr = "";
    regex = new RegExp(regex);
    for (var i = 0; i < str.length; i++) {
      var char = str[i];
      if (regex.test(char)) {
        filteredStr += char;
      }
    }
    return filteredStr;
  } else {
    return str;
  }
}
