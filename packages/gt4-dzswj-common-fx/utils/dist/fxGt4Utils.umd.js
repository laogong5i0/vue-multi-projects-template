/** @license @fx/gt4-utils (c) 2020-2022 laogong5i0 License: Apache-2.0 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fxGt4Utils = {}));
})(this, (function (exports) { 'use strict';

    // 通过 index 上移
    function moveUpAt(target, index) {
      if (index === 0) return false;
      const item = target[index];
      const newItems = [item, target[index - 1]];
      return target.splice(index - 1, 2, ...newItems);
    } // 通过 index 下移动

    function moveDownAt(target, index) {
      if (index === target.length - 1) return false;
      const item = target[index];
      const newItems = [target[index + 1], item];
      return target.splice(index, 2, ...newItems);
    } // 移除

    function removeAt(target, index) {
      // 移除数组中指定位置的元素，返回布尔表示成功与否
      return !!target.splice(index, 1).length;
    } // 数组填充对象

    function fillObj(target, data) {
      // 简单复制 异常直接抛错
      try {
        if (typeof data === "object") {
          return target.fill(null).map(() => JSON.parse(JSON.stringify(data)));
        }
      } catch (e) {// nothing ...
      } // 默认返回一个 undefined


      return undefined;
    } // 切割分为多个数组

    function cutOff(target, cutOffPointIndex) {
      return target.reduce((preVal, curVal, curIndex) => {
        preVal[curIndex > cutOffPointIndex ? 1 : 0].push(curVal);
        return preVal;
      }, [[], []]);
    } // 数组交集

    function intersection(arr1, arr2) {
      return arr1.filter(item => arr2.includes(item));
    }

    /**
     * Created by Liu.Jun on 2020/4/17 17:05.
     */
    // is object
    function isObject(object) {
      return Object.prototype.toString.call(object) === "[object Object]";
    } // is arguments

    function isArguments(object) {
      return Object.prototype.toString.call(object) === "[object Arguments]";
    }

    function union(arr1, arr2) {
      return [...new Set([...arr1, ...arr2])];
    }
    function hasKey(obj, key) {
      if (obj === null || obj === undefined) return false;
      const keys = obj.keys() || [];
      return keys.indexOf(key) > -1;
    } // 合并对象数据

    function mergeObjects(obj1, obj2, concatArrays = false) {
      // Recursively merge deeply nested objects.
      const preAcc = { ...obj1
      }; // Prevent mutation of source object.

      if (!isObject(obj2)) return preAcc;
      return Object.keys(obj2).reduce((acc, key) => {
        const left = obj1 ? obj1[key] : {};
        const right = obj2[key];

        if (obj1 && hasKey(obj1, key) && isObject(right)) {
          acc[key] = mergeObjects(left, right, concatArrays);
        } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
          acc[key] = left.concat(right);
        } else {
          acc[key] = right;
        }

        return acc;
      }, preAcc);
    } // 深度相等对比

    function deepEquals(a, b, ca = [], cb = []) {
      // Partially extracted from node-deeper and adapted to exclude comparison
      // checks for functions.
      // https://github.com/othiym23/node-deeper
      if (a === b) {
        return true;
      }

      if (typeof a === "function" || typeof b === "function") {
        // Assume all functions are equivalent
        // see https://github.com/mozilla-services/react-jsonschema-form/issues/255
        return true;
      }

      if (typeof a !== "object" || typeof b !== "object") {
        return false;
      }

      if (a === null || b === null) {
        return false;
      }

      if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      }

      if (a instanceof RegExp && b instanceof RegExp) {
        return a.source === b.source && a.global === b.global && a.multiline === b.multiline && a.lastIndex === b.lastIndex && a.ignoreCase === b.ignoreCase;
      }

      if (isArguments(a) || isArguments(b)) {
        if (!(isArguments(a) && isArguments(b))) {
          return false;
        }

        const {
          slice
        } = Array.prototype;
        return deepEquals(slice.call(a), slice.call(b), ca, cb);
      }

      if (a.constructor !== b.constructor) {
        return false;
      }

      const ka = Object.keys(a);
      const kb = Object.keys(b); // don't bother with stack acrobatics if there's nothing there

      if (ka.length === 0 && kb.length === 0) {
        return true;
      }

      if (ka.length !== kb.length) {
        return false;
      }

      let cal = ca.length; // eslint-disable-next-line no-plusplus

      while (cal--) {
        if (ca[cal] === a) {
          return cb[cal] === b;
        }
      }

      ca.push(a);
      cb.push(b);
      ka.sort();
      kb.sort();

      for (let j = ka.length - 1; j >= 0; j--) {
        if (ka[j] !== kb[j]) {
          return false;
        }
      }

      let key;

      for (let k = ka.length - 1; k >= 0; k--) {
        key = ka[k];

        if (!deepEquals(a[key], b[key], ca, cb)) {
          return false;
        }
      }

      ca.pop();
      cb.pop();
      return true;
    } // 只保证同时生成不重复

    const genId = function genIdFn() {
      let preKey = `${+new Date()}`;
      let key = 0;
      return () => {
        const curTimestamp = `${+new Date()}`;

        if (curTimestamp === preKey) {
          key += 1;
        } else {
          // 重置 key
          key = 0;
        }

        preKey = curTimestamp;
        return `${preKey}x${key}`;
      };
    }(); // 空对象

    function isEmptyObject(obj) {
      if (!obj) return true;

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          return false;
        }
      }

      return true;
    } // 过滤和转换对象的key

    function filterObject(obj, filterFn) {
      return Object.entries(obj).reduce((preVal, [key, value]) => {
        const newKey = filterFn(key, value);

        if (undefined !== newKey) {
          preVal[newKey] = value;
        }

        return preVal;
      }, {});
    }

    const f = s => `0${s}`.substr(-2);

    function parseDateString(dateString, includeTime = true) {
      if (!dateString) {
        return {
          year: -1,
          month: -1,
          day: -1,
          hour: includeTime ? -1 : 0,
          minute: includeTime ? -1 : 0,
          second: includeTime ? -1 : 0
        };
      }

      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        throw new Error(`Unable to parse date ${dateString}`);
      }

      return {
        year: date.getFullYear(),
        month: f(date.getMonth() + 1),
        // oh you, javascript.
        day: f(date.getDate()),
        hour: f(includeTime ? date.getHours() : 0),
        minute: f(includeTime ? date.getMinutes() : 0),
        second: f(includeTime ? date.getSeconds() : 0)
      };
    }
    function toDateString({
      year,
      month,
      day,
      hour = 0,
      minute = 0,
      second = 0
    }, time = true) {
      const utcTime = Date.UTC(year, month - 1, day, hour, minute, second);
      const datetime = new Date(utcTime).toJSON();
      return time ? datetime : datetime.slice(0, 10);
    }
    function pad(num, size) {
      let s = String(num);

      while (s.length < size) {
        s = `0${s}`;
      }

      return s;
    } // dataUrl 转 Blob文件对象

    function dataURItoBlob(dataURI) {
      // Split metadata from data
      const splitted = dataURI.split(","); // Split params

      const params = splitted[0].split(";"); // Get mime-type from params

      const type = params[0].replace("data:", ""); // Filter the name property from params

      const properties = params.filter(param => param.split("=")[0] === "name"); // Look for the name and use unknown if no name property.

      let name;

      if (properties.length !== 1) {
        name = "unknown";
      } else {
        // Because we filtered out the other property,
        // we only have the name case here.
        name = properties[0].split("=")[1];
      } // Built the Uint8Array Blob parameter from the base64 string.


      const binary = atob(splitted[1]);
      const array = []; // eslint-disable-next-line no-plusplus

      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      } // Create the blob object


      const blob = new window.Blob([new Uint8Array(array)], {
        type
      });
      return {
        blob,
        name
      };
    } // 字符串首字母小写

    function lowerCase(str) {
      if (undefined === str) return str;
      return String(str).replace(/^./, s => s.toLocaleLowerCase());
    } // 最大公约数

    function gcd(a, b) {
      if (b === 0) return a;
      return gcd(b, a % b);
    } // 最小公倍数

    function scm(a, b) {
      return a * b / gcd(a, b);
    } // 打开新页面

    function openNewPage(url, target = "_blank") {
      const a = document.createElement("a");
      a.style.display = "none";
      a.target = target;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    exports.cutOff = cutOff;
    exports.dataURItoBlob = dataURItoBlob;
    exports.deepEquals = deepEquals;
    exports.fillObj = fillObj;
    exports.filterObject = filterObject;
    exports.gcd = gcd;
    exports.genId = genId;
    exports.hasKey = hasKey;
    exports.intersection = intersection;
    exports.isEmptyObject = isEmptyObject;
    exports.isObject = isObject;
    exports.lowerCase = lowerCase;
    exports.mergeObjects = mergeObjects;
    exports.moveDownAt = moveDownAt;
    exports.moveUpAt = moveUpAt;
    exports.openNewPage = openNewPage;
    exports.pad = pad;
    exports.parseDateString = parseDateString;
    exports.removeAt = removeAt;
    exports.scm = scm;
    exports.toDateString = toDateString;
    exports.union = union;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
