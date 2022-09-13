import { MessageBox } from 'mint-ui'
(() => {
    var defining = {
        /**
         * Absolute value.<BR>
         * 取绝对值.
         * @param number Number: Number for absoluting. 数字：需要求绝对值的数值.
         * @returns Number: Value of absolute. 传入参的绝对值（非负数）
         */
        ABS: function ABS(number) {
            if (!isNaN(number)) {
                return (number > 0) ? (number) : (-number);
            }
        },

        /**
         * Minimum value.<BR>
         * 求多个数值的最小值.
         * @param Multiple. Numbers, array of number or multiple array. 多个数值或数组.
         * @returns Number: Minimum value. 最小值
         */
        MIN: function MIN() {
            var ps;
            if (arguments.length <= 0) {
                return null;
            } else if (arguments.length == 1) {
                ps = arguments[0];
            } else {
                ps = arguments;
            }
            if (ps.length) {
                var min = ps[0];
                for (var i = 0; i < ps.length; i++) {
                    if (ps[i] instanceof Array) {
                        var tmp = MAX(ps[i]);
                        min = (min < tmp) ? (min) : (tmp);
                    } else {
                        min = (min < ps[i]) ? (min) : (ps[i]);
                    }
                }
                return min;
            } else if (!isNaN(ps)) {
                return ps;
            }
        },

        MAX: function MAX() {
            var ps;
            if (arguments.length <= 0) {
                return null;
            } else if (arguments.length == 1) {
                ps = arguments[0];
            } else {
                ps = arguments;
            }
            if (ps.length) {
                var max = ps[0];
                for (var i = 0; i < ps.length; i++) {
                    if (ps[i] instanceof Array) {
                        var tmp = MAX(ps[i]);
                        max = (max > tmp) ? (max) : (tmp);
                    } else {
                        max = (max > ps[i]) ? (max) : (ps[i]);
                    }
                }
                return max;
            } else if (!isNaN(ps)) {
                return ps;
            }
        },
        /*SUM: function SUM() {
            var ps;
            if (arguments.length <= 0) {
                return null;
            } else if (arguments.length == 1) {
                ps = arguments[0];
            } else {
                ps = arguments;
            }
            if (ps.length) {
                var ret = 0;
                for (var i = 0; i < ps.length; i++) {
                    if (ps[i] instanceof Array) {
                        ret += SUM(ps[i]);
                    } else {
                        ret += ps[i];
                    }
                }
                return ret;
            } else if (!isNaN(ps)) {
                return ps;
            }
        },*/

        SUM: function SUM() {
            var result = 0;
            var argsKeys = Object.keys(arguments);
            for (var i = 0; i < argsKeys.length; ++i) {
                var elt = arguments[argsKeys[i]];
                if (typeof elt === 'number') {
                    result += elt;
                } else if (typeof elt === 'string') {
                    var parsed = parseFloat(elt);
                    !isNaN(parsed) && (result += parsed);
                } else if (Array.isArray(elt)) {
                    result += SUM.apply(null, elt);
                }
            }
            return result;
        },

        /**
         *matching:匹配区
         *conditions:条件区
         *sum:聚合区
         *
         *<pre>
         *SUMIF('$..dkqdGridlbVO[*].fpzlDm',[condition1,condition2...],'$..dkqdGridlbVO[*].yfje').条件聚合
         *</pre>
         */
        // SUMIF: function SUMIF() {
        //     var matching, con, ps;
        //     if (arguments.length > 0 && arguments.length <= 2) {
        //         return SUM(arguments[arguments.length - 1]);
        //     } else if (arguments.length == 3) {
        //         matching = arguments[0];
        //         con = arguments[1];
        //         ps = arguments[2];
        //     } else {
        //         return null;
        //     }

        //     if (matching.length) {
        //         var ret = 0;
        //         for (var i = 0; i < matching.length; i++) {
        //             //if(con.length)
        //             if (con.indexOf(matching[i]) != -1) {
        //                 if (matching[i] instanceof Array) {
        //                     ret += SUM(ps[i]);
        //                 } else {
        //                     ret += ps[i];
        //                 }
        //             }
        //         }
        //         return ret;
        //     } else if (!isNaN(ps)) {
        //         return ps;
        //     }
        // },
        SUMIF: function () {
            var matching, con, ps;
            if (arguments.length > 0 && arguments.length <= 2) {
                return SUM(arguments[arguments.length - 1]);
            } else if (arguments.length === 3) {
                matching = arguments[0];
                con = arguments[1];
                ps = arguments[2];
                if (!(matching instanceof Array) && !(ps instanceof Array)) {
                    matching = [matching];
                    ps = [ps];
                }
            } else {
                return null;
            }

            if (matching.length) {
                //定义返回值
                var ret = 0;
                //定义整数部分
                var intNum = 0;
                //定义小数部分的数组容器
                var decimalPart = new Array();
                //遍历数据，把整数部分求和结果放在intNum，小数部分放入数组decimalPart
                for (var i = 0; i < matching.length; i++) {
                var index=false;
                    if (con instanceof Array) {
                        index=$.inArray(matching[i], con)!=-1?true:false;
                    }else{
                            index=con===matching[i]?true:false;
                    }
                    if (index) {
                        var tmp = 0;
                        if (matching[i] instanceof Array) {
                            tmp = SUM(ps[i]);
                        } else {
                            tmp = ps[i];
                        }

                        if(typeof(tmp) !== "number") {
                            //转数字
                            tmp = Number(tmp);
                            if (isNaN(tmp)) {
                                throw "调用SUMIF方法，传入非数字类型参数：[" + ps[i] + "]";
                                return;
                            }
                        }
                        //调用整数部分与小数部分分离的方法
                        intNum += DEPARTNUM(tmp).intNum;
                        if (DEPARTNUM(tmp).decimal) {
                            decimalPart.push(DEPARTNUM(tmp).decimal);
                        }
                    }
                }
                //调用小数部分求和的方法
                ret = DECIMALSUM(decimalPart);
                //整数部分与小数部分相加
                ret = ret + intNum;
                return ret;
            } else if (!isNaN(ps)) {
                return ps;
            }
        },
        /**
         * Rounding the fractional part.<BR>
         * 将数字的小数部分进行四舍五入, 缺省保留两位精度.
         * @param number Number: Number for rounding. 数字：需要做四舍五入的数值.
         * @param precision Number: Precision. 数字：精度，默认为2.
         * @returns Number: Rounding result.
         */
        ROUND: function ROUND(number, precision) {
            if (isNaN(number)) {
                return 0;
            }
            if (number == Infinity || number == -Infinity) {
                return 0;
            }
            /* 默认精度为2位 */
            if (precision == undefined)
                precision = 2;
            var t = 1;
            for (; precision > 0; t *= 10, precision--)
                ;
            for (; precision < 0; t /= 10, precision++)
                ;
            return Math.round(mul(number, t) + 1e-9) / t;
        },
        mul: function () {
            if (arguments.length < 2) {
                throw "Wrong parameter Number!"
            } else if (arguments.length == 2) {
                var a = arguments[0];
                var b = arguments[1];
                var c = 0, d = a.toString(), e = b.toString();

                /**
                 * 增加科学计数法的处理，对于科学计数法（含E或e）
                 * ^(-?\d+.?\d*)[Ee]{1}(-?\d+)$ 科学计数法正则
                 * var result = d.match(reg) 返回一个数组
                 * result[0] 整个科学计数法表达式
                 * result[1] 是科学计数法的尾数（即e前面的表达式）
                 * result[2] 是科学计数法的阶码（即e后面10的幂）
                 * 尾数按照原来的逻辑处理（按小数点的位置移位）
                 * 阶码用c减阶码（最后计算会除以Math.pow(10, c)，相对于把阶码乘回来）
                 */
                var reg = new RegExp("^(-?\\d+.?\\d*)[Ee]{1}(-?\\d+)$");
                if (d.indexOf('E') > -1 || d.indexOf('e') > -1) {
                    var result = d.match(reg);
                    d = result[1];
                    c -= Number(result[2]);
                }

                if (e.indexOf('E') > -1 || e.indexOf('e') > -1) {
                    var result = e.match(reg);
                    e = result[1];
                    c -= Number(result[2]);
                }

                try {
                    c += d.split(".")[1].length;
                } catch (f) {
                }
                try {
                    c += e.split(".")[1].length;
                } catch (f) {
                }
                return Number(d.replace(".", "")) * Number(e.replace(".", ""))
                    / Math.pow(10, c);
            } else {
                var a = arguments[0];
                var b = arguments[1];
                var rtn_left = mul(a, b);
                var i = 2;
                var param = [];
                param[0] = rtn_left;
                while (i < arguments.length) {
                    param[i - 1] = arguments[i];
                    i++;
                }
                return mul.apply(this, param);
            }
        },
        /**
         * Truncate the fractional part.<BR>
         * 将数字的小数部分截去, 返回整数.
         * @param number Number: Number for truncate. 数字：需要做截断的数值.
         * @param precision Number: Precision. 数字：精度，默认为0.
         * @returns Number: Truncated result.
         */
        TRUNC: function TRUNC(number, precision) {
            if (isNaN(number)) {
                return 0
            }
            if (number > number.MAX_VALUE) {
                throw "number stackOverflow!"
            }
            if (number % 1 !== 0) {
                number = number | 0
            }
            return number
        },

        /*
        整数部分小数部分分离的方法
        */
        DEPARTNUM: function DEPARTNUM(num) {
            //定义整数部分
            var intNum = 0;
            //定义小数部分
            var decimal = 0;
            //将得到的小数拆分成整数部分和小数部分，整数部分为intNum，小数部分为decimal
            //由于浏览器会把0.000000001这类的小数自动换成科学计数法，也不带小数点，所以要加以判断
            if (num.toString().indexOf(".") === -1 && num.toString().indexOf('E') === -1 && num.toString().indexOf('e') === -1) {
                //只包含整数
                intNum = num;
                decimal = null;
            } else if (num.toString().indexOf('E') > -1 || num.toString().indexOf('e') > -1) {
                if (num > 1) {
                    //若传入为整数的科学记数法
                    intNum = num;
                    decimal = null;
                } else {
                    //将小于1的小数放入小数部分
                    decimal = num;
                }
            } else {
                //带小数的先取出整数
                intNum = parseInt(num);
                //判断是否执行小数拆分
                if (num.toString().indexOf(".") > -1) {
                    //原始值减整数位即得到小数位
                    decimal = num - intNum;
                }
            }
            return {"intNum":intNum,"decimal":decimal};
        },

        /*
        小数部分求和的方法
        */
        DECIMALSUM: function DECIMALSUM(decimalPart) {
            var ret = 0;
            //定义存放所有小数部分的小数位数的数组
            var decimalBits = new Array();
            //科学计数法正则
            var reg = new RegExp("^(-?\\d+.?\\d*)[Ee]{1}([-+]?\\d+)$");
            if (decimalPart.length) {
                for (var k = 0; k < decimalPart.length; k++) {
                    if (decimalPart[k].toString().indexOf('E') > -1 || decimalPart[k].toString().indexOf('e') > -1) {
                        //取科学计数法的位数
                        var result = decimalPart[k].toString().match(reg);
                        //把科学计数法的位数放入数组
                        decimalBits.push(0 - Number(result[2]));
                    }
                    if (decimalPart[k].toString().indexOf(".") > -1) {
                        //把正常带小数点的小数位数放入数组
                        decimalBits.push(decimalPart[k].toString().split(".")[1].length);
                    }
                }
                //取最大的小数位数
                var bits = MAX(decimalBits);
                for (var j = 0; j < decimalPart.length; j++) {
                    //扩大小数至最大小数位数的倍数进行相加，避免小数相加有误差
                    ret = Math.round((ret * Math.pow(10, bits)) + ((decimalPart[j]) * Math.pow(10, bits))) / Math.pow(10, bits);
                }
            }
            return ret;
        },

        IF: function IF(condition, retYes, retNo) {
            return (condition) ? retYes : retNo;
        },
        /**
         * 获取字符串的长度
         *
         */
        len: function len(stringVar) {
            // TO-DO  需要考虑中文
            stringVar = stringVar + "";
            return stringVar.length;
        },
        AND: function AND() {
            //debugger;
            if (arguments.length < 1) {
                return null
            }
            let rt = true;
            for (let i = 0; i < arguments.length; i++) {
                rt = rt && arguments[i]
            }
            return rt
        },
        OR: function OR() {
            if (arguments.length < 1) {
                return null
            }
            let rt = false
            for (let i = 0; i < arguments.length; i++) {
                rt = rt || arguments[i]
            }
            return rt
        },
        //起始下标为1,非数组起始下标
        MID: function MID(str, start, length) {
            str = str + "";
            let s = str.substr(start - 1, length)
            if (s.charAt(0) === '0') {
                s = s.substr(1)
            }
            return s
        },
        LEFT: function LEFT(text, num_chars) {
            if (!text) {
                return ''
            }
            if (!num_chars && num_chars != 0) {
                return text
            }
            return new String(text).slice(0, Number.parseInt(num_chars))
        },
        RIGHT: function LEFT(text, num_chars) {
            text = text + "";
            if (!text || text == "''") {
                return '';
            }
            if (!text) {
                return ''
            }
            if (!num_chars) {
                return text
            }
            return text ? text.substring(text.length - Number.parseInt(num_chars)) : null;
        },
        SUBSTITUTE: function (origin, oldStr, newStr, count) {
            origin = typeof origin === 'string' ? origin : origin.toString()
            oldStr = typeof oldStr === 'string' ? oldStr : oldStr.toString()
            // debugger
            if (count || count === 'undefined') {
                let reg = new RegExp(oldStr, "g")
                return origin.replace(reg, newStr)
            } else {
                let reg = new RegExp(oldStr)
                return origin.replace(reg, newStr)
            }
        },
        isNull: function (param) {
            if (param === null || param === "null" || param === undefined
                || param === "undefined" || '' === param) {
                return true;
            }
            else if (param == 0.00 || param == "''") {
                return true;
            }
            return false;
        },
        /**
         * 转为整数
         * @param {} str 
         */
        TOINT: function TOINT(str) {
            if (!str) {
                return 0;
            }
            return parseInt(str);
        },
        /**
         * 转为字符
         * @param {} str 
         */
        TOSTR: function TOSTR(str) {
            if (!str) {
                return "";
            }
            return str + "";
        },
        /**
         * 计算两个日期之前的月份数，目前仅适用于同一年
         * @param {*} startDate 
         * @param {*} endDate 
         */
        MONTHOFBETWEEN: function (startDate, endDate) {
            if (!startDate || !endDate) {
                return 0;
            }
            let y1 = parseInt(startDate.split('-')[0]);
            let y2 = parseInt(endDate.split('-')[0]);
            let m1 = parseInt(startDate.split('-')[1]);
            let m2 = parseInt(endDate.split('-')[1]);
            return Math.abs(y2 * 12 + m2 - y1 * 12 - m1 + 1);
        },

        /**
        * Split函数
        * @param {*} str 
        * @param {*} separatorChar 
        * @param {*} index 
        */
        STRSPLIT: function (str, separatorChar, index) {
            if (!str) return "";
            return str.split(separatorChar)[index];
        },

        /**
         * 
         * @param {*} arr 
         */
        generMsgArray: function (arr) {
            var titleSet = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
            var ret = "";
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].indexOf("class=\"red\"") > -1) {
                    ret += "<span class=\"red\">" + titleSet[i + 1] + "、    </span>";
                } else {
                    ret += titleSet[i + 1] + "、    ";
                }
                ret += arr[i];
                if (i != arr.length - 1) {
                    ret += "<br>";
                }
            }
            return ret;
        },

        /**
         * 根据判断条件，弹出对话框提示信息，提示之后不影响后续的操作 flag 判断条件的结果 tipsMsg 提示的信息 tipsType
         * =error：失败的提示，=success：成功的提示，否则普通的提示, 作者 xuyaosen
         */
        tipsMsg: function (flag, tipsMsg, tipsType, _width, _height, _merge) {
            console.log("tipsMsg")
            var msgArr = [];
            var merge = false;
            if (flag == null || flag == "") {
                return;
            }

            if (tipsMsg) {
                tipsMsg = tipsMsg.replace(/class-/, "class=");
            }
            if (flag) {
                msgArr.push(tipsMsg);
                merge |= _merge;
                if (merge) {
                    tipsMsg = generMsgArray(msgArr);
                }
                //todo...
                MessageBox.alert(tipsMsg)
            }
        },

        /**
         * 判断某个字符串开头是否包含某个字符串 currStr 需要判断的字符串 containStr 是否被包含的字符串
         * 说明，由于子公式中不知道怎么使用节点的方式使用indexOf，所以直接写一个自定义函数 作者 xuyaosen
         */
        startWidthStr: function (currStr, containStr) {
            if (currStr == null || currStr == "") {
                return false;
            }
            if (containStr == null || containStr == "") {
                return false;
            }
            if (currStr.indexOf(containStr) == 0) {
                return true;
            }
            return false;
        },

        /**
        * 比较两个时间的大小，可以相等 str1<=str2 str1 yyyy-mm-dd str2 yyyy-mm-dd return boolean
        */
        DATE_CHECK_TIME_SIZE: (str1, str2) => {
            if (str1 && str2 && str1.length == 10 && str2.length == 10) {
                var start = parseDate(str1);
                var end = parseDate(str2);
                return start <= end;
            } else {
                return false;
            }
        },

        /**
         * 比较两个时间的大小，不可以相等 str1<str2 str1 yyyy-mm-dd str2 yyyy-mm-dd return boolean
         */
        DATE_CHECK_TIME: (str1, str2) => {
            if (str1 && str2 && str1.length == 10 && str2.length == 10) {
                var start = parseDate(str1);
                var end = parseDate(str2);
                return start < end;
            } else {
                return false;
            }
        },
        parseDate: (dateStringInRange) => {
            var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/, date = new Date(NaN), month, parts = isoExp
                .exec(dateStringInRange);
            if (parts) {
                month = +parts[2];
                date.setFullYear(parts[1], month - 1, parts[3]);
                if (month != date.getMonth() + 1) {
                    date.setTime(NaN);
                }
            }
            return date;
        },

        DateToString: () => {
            var date = new Date();
            var year = date.getFullYear();
            var month1 = date.getMonth() + 1;
            var month = month1 < 10 ? "0" + month1 : month1.toString();
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
            return year + '-' + month + '-' + day;
        },

        indexOf: (s,r) => {
            r = r.replace('==','=');
            return s.indexOf(r);
        },

    };
    Object.keys(defining).forEach(key => {
        window[key] = defining[key];
    })
})()
