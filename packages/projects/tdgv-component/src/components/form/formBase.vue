<!--CSS-->
<style scoped>
form .fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
form .fade-enter,
.fade-leave-to {
  opacity: 0;
}
form .error {
  font-size: 0.9rem;
  color: red;
}
</style>

<!--HTML-->
<template>
  <!-- 增加输入事件控制 JamsonWu -->
  <div
    id="fxapp"
    class="fxapp"
    v-vue-jprefix="{
      changeMethod: setValue,
      getMethod: getValue,
      toPageMethod: toPage,
      toBackMethod: back,
      toTabMethod: toTab,
      keydownMethod: setKeydown,
      changeFn: changeFn,
      keydownFn: keydownFn,
    }"
  >
    <slot>default</slot>
  </div>
</template>

<!--Script-->
<script>
/**
   *  1、完善表单功能 JamsonWu 2018-07-02
   *     1.1. 百分比显示，vue-type配置为percent(N)
   *     1.2. 增加对数值型输入控制
   *     1.3. 数字千分位格式化显示，vue-type配置为number,type配置为text
   *     1.4. 校验规则增加target属性，指定异常时高亮显示位置
   *  2、完善表单控制 JamsonWu 2018-07-09
   *     2.1. 在公式规则中支持调用普通JS中的方法
         2.2. 增加控制公式类型13，支持设置控件的效果
   */
import { isString, isPlainObject, isFunction, isUndefined, clone, cloneDeep, orderBy, isNumber } from 'lodash';
import { MessageBox, Indicator, Toast } from 'mint-ui';
import { mapState, mapMutations } from 'vuex';
import NP from 'number-precision';
import {
  ABS,
  MIN,
  MAX,
  SUM,
  SUMIF,
  ROUND,
  TRUNC,
  IF,
  len,
  AND,
  OR,
  MID,
  LEFT,
  SUBSTITUTE,
  isNull,
  TOINT,
  MONTHOFBETWEEN,
  TOSTR,
  STRSPLIT,
  tipsMsg,
  startWidthStr,
} from './formulaFunction.js';
import { FormulaEngine } from './formulaEngine.js';

const pathDelimiter = '.';
const customeFunctionList = [
  'ABS',
  'MIN',
  'MAX',
  'SUM',
  'SUMIF',
  'ROUND',
  'TRUNC',
  'IF',
  'len',
  'AND',
  'OR',
  'MID',
  'LEFT',
  'SUBSTITUTE',
  'TOINT',
  'MONTHOFBETWEEN',
  'TOSTR',
  'STRSPLIT',
  'tipsMsg',
  'startWidthStr',
];
const fixedValueList = ['N', 'Y', 'ZX', 'LX'];

export default {
  name: 'vue-form-base',

  props: {
    data: {
      type: Object,
      required: true,
    },
    rule: {
      type: Array,
      required: true,
    },
    dataStateName: {
      type: String,
      required: true,
    },
    ruleStateName: {
      type: String,
      required: false,
    },
    oKbackgroundColor: {
      type: String,
      required: false,
    },
    /**
     *
     容器ID
     */
    containerId: {
      type: String,
      required: false,
      default: '',
    },
    /**
     * 是否有视图，默认有
     */
    hasView: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  directives: {
    vueJprefix: {
      bind(el, binding, vnode) {
        const { value } = binding;
        const arr = [];
        arr.forEach.call(el.querySelectorAll('input[vue-path]'), (p, ix) => {
          const vuePath = p.attributes['vue-path'];
          if (vuePath) {
            p.addEventListener('change', value.changeFn);
            p.addEventListener('keydown', value.keydownFn);
          }
        });

        // el.querySelectorAll("input[vue-path]").forEach((p,ix)=>{
        //
        // })
        arr.forEach.call(el.querySelectorAll('a'), (p, ix) => {
          const { href } = p.attributes;
          if (href && href.value && href.value !== '#') {
            // tab-link, 如果是Tab,则不处理
            if (!p.classList.contains('tab-link')) {
              p.addEventListener('click', function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                value.toPageMethod.call(this, href.value);
              });
            } else {
              p.addEventListener('click', function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                value.toTabMethod.call(this, href.value);
              });
            }
          }
        });
        //   el.querySelectorAll("a").forEach((p,ix)=>{
        //
        //
        // })
      },
      update(el, binding, vnode) {
        // debugger
        const { value } = binding;
        const arr = [];
        arr.forEach.call(el.querySelectorAll('input'), (p, ix) => {
          const vuePath = p.attributes['vue-path'];
          if (vuePath) {
          }
        });
        // el.querySelectorAll("input").forEach((p,ix)=>{
        //
        // })
      },
    },
  },
  // datas() 为什么用datas  todo...
  data() {
    return {
      noDataStateName: {},
      noSchemaStateName: {},
      noRuleStateName: {},
      formulaEngine: {},
      innerPages: {},
      currentPageId: null,
      currentTabId: null,
      plugins: {},
      strFieldList: [],
      // 调用sbCheck方法时异常vue-path列表
      sbCheckErrorArr: [],
      editBackgroundColor: '', // this.backgroundColor
    };
  },

  computed: {
    ...mapState(['nsr', 'sbInfo']),
  },
  methods: {
    ...mapMutations(['RECORD_SB_INFO']),
    /**
     * change事件
     */
    changeFn(e) {
      this.setValue.call(this, e);
    },
    /**
     * keydown事件
     */
    keydownFn(e) {
      this.setKeydown.call(this, e, e.currentTarget);
    },
    // 如果页面组件用到v-if,涉及到移除DOM元素，那么会导致初始绑定的事件会丢失，所以要手动调用则重新绑定组件事件 JamsonWu
    // 建议用v-show
    reBindEvent(id) {
      const that = this;
      const nodeId = id || 'fxapp';
      const el = document.getElementById(nodeId);
      // 绑定change事件
      [].forEach.call(el.querySelectorAll('input[vue-path]'), (p, ix) => {
        const vuePath = p.attributes['vue-path'];
        if (vuePath) {
          p.addEventListener('change', this.changeFn);
        }
      });

      // 绑定输入控制
      [].forEach.call(el.querySelectorAll('input'), (p, ix) => {
        p.addEventListener('keydown', this.keydownFn);
        p.addEventListener('focus', function (e) {
          // 获取焦点时处理0.00
          if (e.target && e.target.value && !e.target.readOnly) {
            const val = e.target.value.trim();
            if (val == '0.00' || val == '0') {
              e.target.alt = val;
              e.target.value = '';
            }
          }
        });
        p.addEventListener('blur', function (e) {
          // 失去焦点时还原0.00
          if (e.target && !e.target.value) {
            if (e.target.alt == '0.00') {
              e.target.alt = '';
              e.target.value = '0.00';
            } else if (e.target.alt == '0') {
              e.target.alt = '';
              e.target.value = '0';
            }
          }
        });
      });
    },

    applyAddElement() {
      this.reBindEvent();
      this.initVuePathData();
    },
    /**
     * 模型更新
     */
    applyUpdate() {
      this.initVuePathData();
    },
    getValue(target) {
      return this.getObjectValueByPath(this.sbInfo[this.dataStateName], path);
    },

    smallKeyBoard(event) {
      const { which } = event;
      return which >= 96 && which <= 105;
    },

    englishKeyBoard(event) {
      const { key } = event;
      return (key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z');
    },

    numberKeyBpoard(event) {
      // var which = event.which;
      const which = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
      return (
        ((which >= 48 && which <= 57) || which == 45 || which == 229 || which == 189 || which == 173 || which == 46) &&
        !event.shiftKey
      );
    },

    functionKeyBoard(event) {
      // var which = event.which;
      const which = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
      return (
        which <= 40 ||
        (navigator.platform.indexOf('Mac') > -1 && event.metaKey) ||
        (navigator.platform.indexOf('Win') > -1 && event.ctrlKey)
      );
    },
    currencyKeyBoard(event, viewValue) {
      // var which = event.which;
      const which = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
      return viewValue.toString().indexOf('$') === -1 && which === 52 && event.shiftKey;
    },

    floatKeyBoard(event, viewValue) {
      // var which = event.which;
      const which = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
      return which === 188 || ((which === 190 || which === 110) && viewValue.toString().indexOf('.') === -1);
      // Change for compatible to IE8
      // return [188].indexOf(which) != -1 || (which === 190 || which === 110) && viewValue.toString().indexOf('.') === -1;
    },

    keyHelper() {
      return {
        smallKeyBoard: this.smallKeyBoard,
        numberKeyBpoard: this.numberKeyBpoard,
        functionKeyBoard: this.functionKeyBoard,
        currencyKeyBoard: this.currencyKeyBoard,
        floatKeyBoard: this.floatKeyBoard,
        englishKeyBoard: this.englishKeyBoard,
      };
    },

    setKeydown(event, target) {
      const vueType = target ? target.attributes['vue-type'] : '';
      const viewValue = target ? target.value : null;
      if (vueType && vueType.value) {
        if (vueType.value == 'number') {
          const keyHelper = this.keyHelper();
          if (
            !(
              keyHelper.smallKeyBoard(event) ||
              keyHelper.numberKeyBpoard(event) ||
              keyHelper.functionKeyBoard(event) ||
              keyHelper.currencyKeyBoard(event, viewValue) ||
              keyHelper.floatKeyBoard(event, viewValue)
            )
          ) {
            event.stopPropagation();
            event.preventDefault();
          }
        } else if (vueType.value == 'number(0)') {
          // 正整数支持
          const keyHelper = this.keyHelper();
          if (
            !(keyHelper.smallKeyBoard(event) || keyHelper.numberKeyBpoard(event) || keyHelper.functionKeyBoard(event))
          ) {
            event.stopPropagation();
            event.preventDefault();
          }
        }
      }
    },
    getNumberValue(v) {
      return v.replace(/,/g, '');
    },
    /**
     * 增加千分位格式化数值 JamsonWu
     */
    formatNumber(target, value) {
      if (isNaN(value) || !value || value === '') {
        value = 0.0;
      }
      const inputType = target.attributes.type;
      const vueType = target.attributes['vue-type'];
      if (inputType && inputType.value == 'text' && vueType && vueType.value == 'number') {
        if (typeof value === 'string') {
          value = this.getNumberValue(value);
        }
        if (value >= 0) {
          return parseFloat(value)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
        let tmp = -value;
        tmp = parseFloat(tmp)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        return `-${tmp}`;
      }
      let digits = 2;
      if (vueType && vueType.value && vueType.value.indexOf('number') >= 0) {
        digits = this.getNumberDigits(vueType.value) * 1;
      }
      return parseFloat(value).toFixed(digits);
    },

    /**
     * 由于未明确数据类型的字段全部会被转为数字型，为此添加此方法作为特殊处理 JamsonWu 2018-08-22
     */
    addStrField(vuePath) {
      if (!this.strFieldList[vuePath]) {
        this.strFieldList.push(vuePath);
      }
    },

    /**
     * 判断是否字符类型  JamsonWu 2018-08-22
     */
    isStringEx(vuePath) {
      if (this.checkIsStringField(vuePath)) {
        return true;
      }
      return this.strFieldList.indexOf(vuePath) >= 0;
    },

    /**
     * 给输入框添加回调方法  JamsonWu 2018-08-22
     */
    addSub(name, callback) {
      const fn = this.plugins[name];
      if (!fn) {
        this.plugins[name] = callback;
      }
    },
    /**
     * 判断当前vue-type是否为要显示百分比类型
     */
    isPercent(vueType) {
      let result = false;
      const reg = /percent\(([\d]+)\)/;
      if (vueType) {
        const arr = reg.exec(vueType);
        if (arr) {
          if (arr[1] > 0) {
            result = true;
          }
        }
      }
      return result;
    },
    /**
     * 获取小数位长度
     */
    getPercentDecimalNum(vueType) {
      let num = 2;
      const reg = /percent\(([\d]+)\)/;
      if (vueType) {
        const arr = reg.exec(vueType);
        if (arr) {
          if (arr[1] > 0) {
            num = arr[1];
          }
        }
      }
      return num;
    },

    // errorInfoNotification
    async setValue({ target }) {
      // Indicator.open({
      //   text: '计算中...',
      //   spinnerType: 'triple-bounce'
      // });
      // let begin = Date.parse(new Date())
      // console.log("start="+Date.parse(new Date()))
      const mm = this.sbInfo[this.dataStateName];
      // console.log("-------->>"+JSON.stringify(this.sbInfo[this.dataStateName]));
      const vueType = target.attributes['vue-type'];
      const inputType = target.attributes.type;
      const vuePath = target.attributes['vue-path'];

      // 判断输入框是否有回调，如果有，则执行 JamsonWu 2018-08-22
      if (vuePath && this.plugins[vuePath.nodeValue]) {
        await this.plugins[vuePath.nodeValue](target);
      }

      let value = target ? target.value : null;
      if (vueType && vueType.value && vueType.value == 'string') {
        // update State with value
        this.setObjectByTarget(this.sbInfo[this.dataStateName], target, value.trim());
      } else {
        // 如果是数值型，则要先替换格式化产生的逗号分隔型（,）
        if (inputType && inputType.value == 'text' && vueType && vueType.value == 'number') {
          value = value ? this.getNumberValue(value.trim()) : '';
        }
        let formattedValue =
          value.trim().indexOf('.') > -1 ? value.trim().slice(0, value.indexOf('.') + 3) : value.trim();
        if (formattedValue == '') {
          formattedValue = '0.00';
        }

        let v = 0.0;
        if (inputType && inputType.value == 'text' && vueType && this.isPercent(vueType.value)) {
          let tmpValue = value.trim();
          tmpValue = tmpValue.replace('%', '');
          if (!tmpValue || isNaN(tmpValue) || tmpValue === '') {
            tmpValue = 0;
          }
          v = parseFloat(tmpValue);
          v = v.toFixed(this.getPercentDecimalNum(vueType.value));
          target.value = `${v.toString()}%`;
          v *= 0.01;
        } else if (inputType && inputType.value == 'text' && vueType && vueType.value == 'number(0)') {
          // 增加对输入正整数的支持
          let tmpValue1 = value.trim();
          if (tmpValue1 == null || isNaN(tmpValue1) || tmpValue1 === '') {
            tmpValue1 = 0;
          }

          if (typeof tmpValue1 === 'string') {
            tmpValue1 = this.getNumberValue(tmpValue1);
          }
          // 注意，如果tmpValue为空，parseInt(tmpValue)则为NaN
          v = parseInt(tmpValue1);
          if (v < 0) {
            v = 0;
          }

          target.value = parseFloat(v)
            .toFixed(0)
            .replace(/(?=(?!(\b))(\d{3})+$)/g, '$1,');
        } else {
          // target.value = parseFloat(formattedValue).toFixed(2)
          target.value = this.formatNumber(target, formattedValue);
          // target.value = NP.round(parseFloat(formattedValue),2).toString()
          // update State with value
          v = NP.round(parseFloat(formattedValue), 2).toString();
        }

        this.setObjectByTarget(this.sbInfo[this.dataStateName], target, v);
      }

      // 更新公式
      const _TEST_TIMES_ = 1;
      let _ms_ = new Date().getTime();
      for (let i = 0; i < _TEST_TIMES_; i++) {
        this.cascadeUpdateFormulaByTarget(target);
        // 执行控制公式
        this.cascadeVerifyControlFormulaByTarget(target);
        const errorInfo = this.cascadeVerifyFormulaByTarget(target);
        // console.log(errorInfo)
        this.tipErrorInfo(errorInfo, target);
        // document.querySelector("input[vue-path='jexx.0.yshwjlwbqs']")
      }
      _ms_ = new Date().getTime() - _ms_;
      // console.log("end="+Date.parse(new Date()))
      // let end = Date.parse(new Date())
      // setTimeout(()=>{
      //   Indicator.close();
      // },end-begin)
      // log("Calculate " + _TEST_TIMES_ + " in " + _ms_ + "ms, per: "+ ( _ms_/_TEST_TIMES_ ))
    },

    hasClass(elements, cName) {
      return !!elements.className.match(new RegExp(`(\\s|^)${cName}(\\s|$)`)); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    },

    removeClass(elements, cName) {
      if (this.hasClass(elements, cName)) {
        elements.className = elements.className.replace(new RegExp(`(\\s|^)${cName}(\\s|$)`), ' '); // replace方法是替换
      }
    },

    addClass(elements, cName) {
      if (!this.hasClass(elements, cName)) {
        elements.className += ` ${cName}`;
      }
    },
    /**
     * 禁止UI输入
     */
    doDisabledInputEx(target, isDisabled) {
      if (!target) return;
      const disabledPath = target.getAttribute('disabled-path');
      if (disabledPath) {
        [].forEach.call(document.querySelectorAll(disabledPath), (p, ix) => {
          if (isDisabled) {
            p.setAttribute('disabled', 'disabled');
          } else {
            p.removeAttribute('disabled');
          }
        });
      }
    },
    // 增加UI控件的设置，主要包括只读，读写，不可用及Style JamsonWu
    updateUIControl(target, controls, flag) {
      for (const ctl in controls) {
        // var flag = controls[ctl];
        if (ctl === 'readonly') {
          if (flag) {
            if (typeof target.$OLD_RW$ === 'undefined') {
              target.$OLD_RW$ = target.getAttribute('readOnly') || false;
            }
            target.setAttribute('readOnly', 'true');
            // 注意这个只读样式的类名必须为read，除非原样式没有这个设置
            this.removeClass(target, 'edit');
            this.addClass(target, 'read');
          } else if (!target.$OLD_RW$) {
            target.removeAttribute('readOnly');
            this.removeClass(target, 'read');
            this.addClass(target, 'edit');
          }
        } else if (ctl === 'readwrite') {
          if (flag) {
            if (typeof target.$OLD_RW$ === 'undefined') {
              target.$OLD_RW$ = target.getAttribute('readOnly') || false;
            }
            target.removeAttribute('readOnly');
            this.removeClass(target, 'read');
            // 如果允许读写，则关联组件取消disabled设置
            this.doDisabledInputEx(target, false);
            this.addClass(target, 'edit');
          } else if (target.$OLD_RW$) {
            target.setAttribute('readOnly', 'true');
            this.addClass(target, 'read');
            // 如果不允许读写，则关联组件设置为Disabled
            this.doDisabledInputEx(target, true);
            this.addClass(target, 'dairu');
          }
        } else if (ctl === 'disabled') {
          if (flag) {
            if (typeof target.$OLD_RW$ === 'undefined') {
              target.$OLD_RW$ = target.getAttribute('disabled') || false;
            }
            target.setAttribute('disabled', 'disabled');
            // 处理关联组件是否禁止操作
            this.doDisabledInputEx(target, flag);
          } else if (!target.$OLD_RW$) {
            target.removeAttribute('disabled');
            this.doDisabledInputEx(target, flag);
          }
        } else {
          // 动态添加style部分暂时不用
          // let tmp = ctl.split("=");
          // if (tmp.length > 1) {
          //     if (flag) {
          //         if (typeof target["$OLD_CSS$" + tmp[0]] == "undefined") {
          //             target["$OLD_CSS$" + tmp[0]] = target.style.getPropertyValue(tmp[0]) || false;
          //         }
          //         target.style.setProperty(tmp[0], tmp[1], 'important');
          //     } else {
          //         var oldcss = target["$OLD_CSS$" + tmp[0]];
          //         if (oldcss) {
          //             target.style.setProperty(tmp[0], tmp[1]);
          //         } else {
          //             target.style.setProperty(tmp[0],'');
          //         }
          //     }
          // }
        }
      }
    },

    tipErrorInfo(errorInfo, target) {
      if (!errorInfo) {
        return;
      }
      // console.log(errorInfo.path+":"+errorInfo.verfifyResult+" -- " +errorInfo.p.tips)
      let errorTarget = null;
      const { vueIndexValue } = errorInfo;

      if (errorInfo.p && errorInfo.p.target) {
        // 当列表.[#].形式，需要判断vueIndex，否则直接根据vuepath，每次拿到列表第一项
        if (vueIndexValue && vueIndexValue >= 0) {
          errorTarget = document.querySelector(`input[vue-path='${errorInfo.p.target}'][vue-index='${vueIndexValue}']`);
        } else {
          errorTarget = document.querySelector(`input[vue-path='${errorInfo.p.target}']`);
        }

        if (!errorTarget) {
          errorTarget = document.getElementById(errorInfo.p.target);
        }

        if (!errorTarget) {
          if (vueIndexValue && vueIndexValue >= 0) {
            errorTarget = document.querySelector(`div[vue-path='${errorInfo.p.target}'][vue-index='${vueIndexValue}']`);
          } else {
            errorTarget = document.querySelector(`div[vue-path='${errorInfo.p.target}']`);
          }
        }
      }

      if (!errorTarget) {
        if (vueIndexValue) {
          errorTarget = document.querySelector(`input[vue-path='${errorInfo.path}'][vue-index='${vueIndexValue}']`);
        } else if (errorInfo.p && errorInfo.p.target) {
          // 当校验存在异常时，可指定在哪个控件上焦点展现 JamsonWu
          const targetArr = errorInfo.p.target.split(';');
          if (targetArr && targetArr.length >= 1) {
            errorTarget = document.querySelector(`input[vue-path='${targetArr[0]}']`);
          }
        } else {
          errorTarget = document.querySelector(`input[vue-path='${errorInfo.path}']`);
        }
      }

      if (errorTarget) {
        errorTarget.attributes.verfifyResult = errorInfo.verfifyResult;
        if (!errorInfo.verfifyResult) {
          // 原先的背景色
          if (errorTarget.$OLD_BGCOLOR == null || errorTarget.$OLD_BGCOLOR == undefined) {
            errorTarget.$OLD_BGCOLOR = `${errorTarget.style.backgroundColor}`;
          }
          errorTarget.style.backgroundColor = '#ffd21d';
          this.addErrorStyle(errorTarget);
          const _this = this;
          if (errorTarget.disabled) {
            errorTarget.addEventListener('touchstart', function (e) {
              const _verfifyResult = this.attributes.verfifyResult;
              if (_verfifyResult == false) {
                _this.errorInfoNotification(errorInfo);
              }
            });
          } else {
            errorTarget.addEventListener('click', function (e) {
              const _verfifyResult = this.attributes.verfifyResult;
              if (_verfifyResult == false) {
                // _this.errorInfoNotification(errorInfo)
              }
            });
          }

          if (!errorTarget.verfifyResult) {
            this.errorInfoNotification(errorInfo);
          }
        } else if (errorTarget.disabled) {
          errorTarget.style.backgroundColor = '#eeeeee';
        } else if (this.oKbackgroundColor) {
          errorTarget.style.backgroundColor = this.oKbackgroundColor;
          this.removeErrorStyle(errorTarget);
        } else if (this.hasClass(errorTarget, 'read')) {
        } else {
          errorTarget.style.backgroundColor = this.editBackgroundColor;
        }
      }
      if (errorInfo.relation) {
        this.tipErrorInfo(errorInfo.relation[0]);
      }
    },
    /**
     * 添加异常样式
     */
    addErrorStyle(target) {
      if (!this.hasClass(target, 'error')) {
        this.addClass(target, 'error');
      }
    },
    /** *
     * 清除异常样式
     */
    removeErrorStyle(target) {
      if (this.hasClass(target, 'error')) {
        this.removeClass(target, 'error');
      }
    },
    errorInfoNotification(errorInfo) {
      // debugger
      // var sbInfoData=this.sbInfo[this.dataStateName];
      // var   rt= (new Function('with(this){return ' + strExpression + '}')).call(sbInfoData);
      // let tipMsg="";
      const that = this;
      if (errorInfo.p.tips.indexOf('--') > 0) {
        const end = errorInfo.p.tips.indexOf('*');
        const path = errorInfo.p.tips.substring(errorInfo.p.tips.indexOf('--') + 2, end);
        const num = errorInfo.p.tips.substring(end + 1);
        const express = this.getObjectValueByPath(this.sbInfo[this.dataStateName], path);
        const head = errorInfo.p.tips.substring(0, errorInfo.p.tips.indexOf('--'));
        const msg = num * express;
        MessageBox.alert(head + msg);
      } else {
        let tmpTips = errorInfo.p.tips;

        // 1.增加网报包含计算公式的提示信息处理 JamsonWu 2018-08-24
        let regEx = /{{(.+?)}}/g;
        let isDone = false;
        if (tmpTips) {
          const regEx = /{{(.+?)}}/g;
          tmpTips = tmpTips.replace(regEx, function (str) {
            isDone = true;
            if (!str) {
              return '';
            }
            const tmpStr = str.substr(2, str.length - 4);
            // 由于提示中可能需要计算节点之和，需要先转换为数值型
            that.toStringValue(that.sbInfo[that.dataStateName], '');
            let rt = null;
            try {
              rt = new Function(`with(this){return ${tmpStr}}`).call(that.sbInfo[that.dataStateName]);
              that.toStringEx();
              return rt;
            } catch (err) {
              that.toStringEx();
              console.log(`公式提示信息异常，id=${errorInfo.p.id},错误信息：${err.message}`);
            }
          });
        }
        if (isDone) {
          MessageBox.alert(tmpTips);
          return;
        }
        // 2.判断是否存在{}表达式
        let isCalc = false;
        regEx = /{[^{}]+}(?!\})/g;
        if (tmpTips) {
          const tmpArr = regEx.exec(tmpTips);
          if (tmpArr && tmpArr.length > 0) {
            isCalc = true;
          }
        }

        // if(errorInfo.p.type==="02_01"){
        // 3.改为判断是否存在计算表达式，兼容旧版本
        if (isCalc) {
          // 校验动态提示信息
          const arr = tmpTips.split('&');
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].indexOf('{') >= 0) {
              arr[i] = arr[i].replace('{', '');
              arr[i] = arr[i].replace('}', '');
            } else {
              // alert(123);
              try {
                arr[i] = new Function(`with(this){return ${arr[i]}}`).call(this.sbInfo[this.dataStateName]);
                // var rt=100;
              } catch (e) {
                console.log(`异常:${e.message}`);
              }
            }
          }
          tmpTips = arr.join('');
        }
        // MessageBox.alert(errorInfo.p.tips)
        MessageBox.alert(tmpTips);
      }
      /* Indicator.open({
                      text: errorInfo.p.tips,
                    spinnerType: 'triple-bounce'
                }); */

      // debugger
      /* $.notification({
    title: "Baby",
    text: errorInfo.p.tips,
    media: "<img src='src/assets/images/i-wechat.png'>",
    data: "",
    onClick: function(data) {
      //$.alert("Click" + data);
    },
    onClose: function(data) {
      //$.alert("Close "+data);
    }
  }); */
    },
    cascadeUpdateFormulaByTarget(target) {
      const vuePath = target.attributes['vue-path'];
      if (vuePath && vuePath.value) {
        this.cascadeUpdateFormula(vuePath.value, target);
        console.log('-------------执行第2遍公式');
        this.cascadeUpdateFormula(vuePath.value, target);
      } else {
        throw Error('not setting vue-path');
      }
    },
    isDynamicAssignment(strAssignment) {
      return strAssignment ? strAssignment.indexOf('[#]') > -1 : false;
    },
    /**
     * 获取公式与参数
     */
    getFormulaAndParamsEx(path) {
      let tmp = this.formulaEngine.idxVariable2Formula[this.getDynamicPath(path)];
      if (!tmp && path.indexOf('.[#]') >= 0) {
        tmp = this.formulaEngine.idxVariable2Formula[path];
      }

      if (!tmp) {
        // 如果是数字索引，则替换#号再查找一次
        console.log('getFormulaAndParamsEx');
        const reg = /\[(\d+)\]/;
        if (reg.exec(path)) {
          path = path.replace(reg, '[#]');
          return this.getFormulaAndParamsEx(path);
        }
      }

      return tmp;
    },
    /*
     * 获取与当前路径相关联的公式列表
     */
    getRelationFormulaList(path) {
      const lstFormulaAndParams = this.getFormulaAndParamsEx(path);

      // 1、基于所有关联公式；
      // var queue = lstFormulaAndParams; //待处理公式队列：[[FormulaObj, params], [FormulaObj, params], ...]

      let queue = [];
      if (lstFormulaAndParams && lstFormulaAndParams.length > 0) {
        for (var j = 0; j < lstFormulaAndParams.length; j++) {
          queue.push([lstFormulaAndParams[j], null]);
        }
      }

      // debugger;
      const idxPlan = {}; // 已索引公式：{formulaId1:{obj:FormulaObj, ref:0, params:[]}, formulaId2:{}}
      const lstResult = []; // 排序后公式列表；
      // 2、对公式进行依次扫描，并将级联公式一并获取，同步进行引用计数；
      while (queue.length > 0) {
        const objFormulaAndParams = queue.shift();
        const objFormula = objFormulaAndParams[0];
        const formulaParams = objFormulaAndParams[1];
        if (!idxPlan[objFormula.id]) {
          idxPlan[objFormula.id] = {
            obj: objFormula,
            ref: 1,
            params: formulaParams,
          };
        } else {
          // return;
          // continue;
        }
        // if(objFormula.excelRef=="F11"){
        //   alert(999);
        //   debugger;
        // }
        if (objFormula.flagCompiled) {
          const strNodepath = objFormula.strAssResolved;
          if (strNodepath) {
            // strNodepath = strNodepath.substr(2);
            // 获取与当前赋值部分存在引用关系的公式
            // var lstRefFormulaAndParams = this.formulaEngine.idxVariable2Formula[strNodepath]||[];
            // var lstRefFormulaAndParams = this.formulaEngine.getInvolvedFormulas(strNodepath)||[];
            const lstRefFormulaAndParams = this.formulaEngine.getInvolvedFormulas(strNodepath);
            for (var i = 0; i < lstRefFormulaAndParams.length; i++) {
              const obj = lstRefFormulaAndParams[i][0];
              if (!idxPlan[obj.id]) {
                queue = queue.concat([lstRefFormulaAndParams[i]]);
                // alert(7);
                // debugger;
              }
            }

            // 对所引用公式进行引用值（ref）的增加运算
            for (var i = 0; i < lstRefFormulaAndParams.length; i++) {
              const objRef = lstRefFormulaAndParams[i][0];
              if (objRef) {
                if (!idxPlan[objRef.id]) {
                  idxPlan[objRef.id] = {
                    obj: objRef,
                    ref: 1,
                    params: lstRefFormulaAndParams[i][1],
                  };
                } else if (!lstRefFormulaAndParams[i][1]) {
                  // 如果被引用公式需要做全下标计算（即下标参数为空）
                  // 新关联引用出来的公式，存在非动态行公式需要全覆盖计算的情况，典型情况是：
                  // =>  动态行的分配比例  = 动态行的金额  / 合计金额
                  // 上述情况会因为合金金额发生变动而执行全覆盖计算，那么此时动态行的行标是有害的，需要被剔除。
                  idxPlan[objRef.id].params = null;
                }
                // 注意到是引用了变量的公式才需要增加引用值（ref）
                // debugger;
                idxPlan[objRef.id].ref += idxPlan[objFormula.id].ref;
              }
            }
            for (var j = 0; j < lstRefFormulaAndParams.length; j++) {
              // queue.push([lstRefFormulaAndParams[j],null]);
            }

            // if (!idxPlan[objFormula.id]) {

            // }
            // queue = queue.concat(lstRefFormulaAndParams);
          }
        }
      }
      // debugger;
      // 3、根据引用计数进行升序排列；
      for (const id in idxPlan) {
        lstResult.push(idxPlan[id]);
      }
      lstResult.sort(function (a, b) {
        return a.ref - b.ref; // 降序排列
      });

      // this.getFormulaAndParamsEx(path)
      const aaa = [];
      for (var j = 0; j < lstResult.length; j++) {
        aaa.push(lstResult[j].obj);
      }
      return aaa;
    },
    /**
     * 获取动态行对应的Path
     */
    getDynamicPath(path) {
      return path ? path.replace('.[#]', '[#]') : '';
    },
    // 级联更新计算公式
    cascadeUpdateFormula(path, target) {
      if (!this.getFormulaAndParamsEx(path)) {
        return;
      }
      ///
      ///
      // var sfas=aaa.filter((p,ix)=>{
      //     return p.type==="01"//计算公式
      // });
      // debugger;
      const tmpCalcArr = [];
      const aaa = this.getRelationFormulaList(path);
      aaa
        .filter((p, ix) => {
          return p.type === '01' || p.type == '11'; // 计算公式
        })
        .forEach((p, ix) => {
          tmpCalcArr.push(p.id);
          if (p.id == '061001010133010168') {
            console.log('cascadeUpdateFormula');
          }
          const ss = path;
          if (ss == p.strAssResolved) {
            return;
          }
          const _array_p = this.getFinallyPath4Formula(p, target);
          const vueIndex = target.attributes['vue-index'];

          let findTarget = null;
          if (this.isDynamicAssignment(p.strAssignment)) {
            if (vueIndex && vueIndex.value) {
              findTarget = document.querySelectorAll(
                `input[vue-path='${p.strAssignment}'][vue-index='${vueIndex.value}']`,
              );
            }
          } else {
            findTarget = document.querySelectorAll(`input[vue-path='${p.strAssignment}']`);
          }

          let strExpressionValue = this.calcFormula(_array_p);
          const dat1 = this.sbInfo[this.dataStateName];
          this.setObjectByPath(this.sbInfo[this.dataStateName], _array_p.strAssignment, strExpressionValue);
          // 同时更新元素
          if (findTarget) {
            const arr = [];
            arr.forEach.call(findTarget, (pp, ixp) => {
              try {
                if (isNaN(strExpressionValue)) {
                  // console.log(
                  //     "*******" + JSON.stringify(dat1)
                  // );
                  console.log(`异常：_array_p:${JSON.stringify(_array_p)}`);
                }
                // pp.value = parseFloat(strExpressionValue).toFixed(2)
                const vueType = pp.attributes['vue-type'];

                if (vueType && vueType.value && this.isPercent(vueType.value)) {
                  if (!strExpressionValue || isNaN(strExpressionValue) || strExpressionValue === '') {
                    strExpressionValue = 0.0;
                  }
                  strExpressionValue = parseFloat(strExpressionValue * 100).toFixed(
                    this.getPercentDecimalNum(vueType.value),
                  );
                  strExpressionValue += '%';
                  pp.value = strExpressionValue;
                } else {
                  pp.value = this.formatNumber(pp, strExpressionValue);
                }
              } catch (e) {
                console.log(e);
                pp.value = '-1';
              }
            });
            // findTarget.forEach()
          }
          // this.cascadeUpdateFormula(p.strAssignment,target)
        });

      console.log(`关联计算公式：${JSON.stringify(tmpCalcArr)}`);
    },
    cascadeVerifyFormulaByTarget(target) {
      const vuePath = target.attributes['vue-path'];
      if (vuePath && vuePath.value) {
        return this.cascadeVerifyFormula(vuePath.value, target);
      }
      throw Error('not setting vue-path');
    },
    cascadeVerifyControlFormulaByTarget(target) {
      const vuePath = target.attributes['vue-path'];
      if (vuePath && vuePath.value) {
        this.cascadeVerifyControlFormula(vuePath.value, target);
      } else {
        throw Error('not setting vue-path');
      }
    },
    /**
     * 还原目标原始背景色状态
     */
    restoreInputBackgroundColor(target, vueIndex) {
      let destTarget = null;
      if (typeof target === 'string') {
        // 当列表.[#].形式，需要判断vueIndex，否则直接根据vuepath，每次拿到列表第一项
        if (vueIndex && vueIndex >= 0) {
          destTarget = document.querySelector(`input[vue-path='${target}'][vue-index='${vueIndex}']`);
        } else {
          destTarget = document.querySelector(`input[vue-path='${target}']`);
        }

        if (!destTarget) {
          destTarget = document.getElementById(target);
        }
        if (!destTarget) {
          if (vueIndex && vueIndex >= 0) {
            destTarget = document.querySelector(`div[vue-path='${target}'][vue-index='${vueIndex}']`);
          } else {
            destTarget = document.querySelector(`div[vue-path='${target}']`);
          }
        }
      } else {
        destTarget = target;
      }

      if (!destTarget) {
        return;
      }

      if (destTarget.disabled) {
        destTarget.style.backgroundColor = '#eeeeee';
      } else if (destTarget.$OLD_BGCOLOR != undefined && destTarget.$OLD_BGCOLOR != null) {
        destTarget.style.backgroundColor = destTarget.$OLD_BGCOLOR;
        this.removeErrorStyle(destTarget);
      } else if (this.oKbackgroundColor) {
        destTarget.style.backgroundColor = this.oKbackgroundColor;
        this.removeErrorStyle(destTarget);
      } else if (this.hasClass(destTarget, 'read')) {
      } else {
        destTarget.style.backgroundColor = this.editBackgroundColor;
        this.removeErrorStyle(destTarget);
      }
    },

    cascadeVerifyFormula(path, target) {
      const tmpPath = this.formulaEngine.getPathEx(path);
      // 01计算公式；02校验公式
      let errorInfo = {};
      let hasError = false; // 是否检测到错误
      const that = this;
      this.formulaEngine.lstVerifyFormulas
        .filter((p, ix) => {
          return p.strFormula.indexOf(tmpPath) > -1 && (p.type === '02' || p.type === '02_01');
        })
        .forEach((p, ix) => {
          if (hasError) {
            return;
          }
          if (p.id == '06100101020802003') {
            console.log('06100101020802003');
          }
          // 仅处理编译通过的公式
          if (p.flagCompiled) {
            const _array_p = this.getFinallyPath4Formula(p, target);
            let vueIndexValue = null;
            const vueIndex = target.attributes['vue-index'];
            if (vueIndex && vueIndex.value) {
              vueIndexValue = vueIndex.value;
            }

            const verfifyResult = this.calcFormula(_array_p);
            if (!verfifyResult) {
              p.tips = _array_p.tips;
              errorInfo = { path, verfifyResult, p, vueIndexValue, relation: [] };
              hasError = true;
            } else {
              // 还原上次的异常状态
              that.restoreInputBackgroundColor(p.target ? p.target : _array_p.target, vueIndexValue);
            }

            if (!verfifyResult && !errorInfo.hasOwnProperty('path')) {
              errorInfo = { path, verfifyResult, p, vueIndexValue, relation: [] };
            } else {
              // 如果当前计算结果和之前的计算结果合并，如果为false保存
              if (verfifyResult || errorInfo.verfifyResult) {
              } else {
                errorInfo = { path, verfifyResult, p, vueIndexValue, relation: [] };
              }
            }
          }
        });

      /* if(this.getFormulaAndParamsEx(path)){
      this.getFormulaAndParamsEx(path)
      .filter((p,ix)=>{
          return p.type==="01"//所影响的计算公式
      })
      .forEach((p,ix)=>{
          let relationErrorInfo = this.cascadeVerifyFormula(p.strAssignment,target)

          if(relationErrorInfo.hasOwnProperty("path")){
            if(errorInfo.hasOwnProperty("path")){
              errorInfo.relation.push(relationErrorInfo)
            }
            else{
              errorInfo=relationErrorInfo
            }
          }
      })
  } */
      return errorInfo;
    },
    /**
    增加针对控制公式type=13,级联更新校验 JamsonWu
   */
    cascadeVerifyControlFormula(path, target) {
      // 13 控制公式要级联更新
      if (!this.getFormulaAndParamsEx(path)) {
        return;
      }
      const tmpVerifyArr = [];
      const aaa = this.getRelationFormulaList(path);
      aaa
        .filter((p, ix) => {
          return p.type === '13'; // 计算公式
        })
        .forEach((p, ix) => {
          if (p.id == '06100101020103010') {
          }
          tmpVerifyArr.push(p.id);
          const _array_p = this.getFinallyPath4Formula(p, target);
          const verfifyResult = this.calcFormula(_array_p);
          if (p.lstTargetResolved && p.lstTargetResolved.length > 0) {
            const targets = p.lstTargetResolved;
            targets.forEach((t, jx) => {
              const controls = this.formulaEngine.idxVariable2Control[t.jpath];
              if (controls) {
                // let findTarget = document.querySelector("input[vue-path='" + t.jpath + "']");
                // if (findTarget) {
                //   this.updateUIControl(findTarget, controls, verfifyResult);
                // }
                [].forEach.call(document.querySelectorAll(`input[vue-path='${t.jpath}']`), (p, ix) => {
                  this.updateUIControl(p, controls, verfifyResult);
                });
              }
            });
          }
        });

      console.log(`关联控制公式：${JSON.stringify(tmpVerifyArr)}`);
    },

    getObjectValueByPath(object, path) {
      /*        if(path==="cjrvoList.cjrvoListlb.0.jmxzMc"){
        debugger
        console.log(path)
        return ""
      } */
      // resolves chained keys (like 'user.adress.street') on an object and returns the value
      // let pathArray=path.split(pathDelimiter)
      // let value
      // pathArray.forEach((p, ix) => {
      //   if(ix === pathArray.length -1 ) value = object[p]
      //   if ( isUndefined(object[p]) ) return
      //   object = object[p]
      // })
      // return value
      let result = null;
      try {
        result = eval(`object.${path}`);
      } catch (e) {
        console.log('error');
      }
      return result;
    },
    setObjectByTarget(object, target, _value) {
      const path = this.getFinallyPath(target);
      // debugger;
      this.setObjectByPath(object, path, _value);
    },
    setObjectByPath(object, path, _value) {
      // 如果不存在赋值表达式，则退出
      if (!path) {
        return;
      }
      let _path = path;
      const target = document.querySelector(`input[vue-path='${path}']`);
      if (target) {
        const vueIndex = target.attributes['vue-index'];
        if (vueIndex && vueIndex.value) {
          _path = this.replaceDynamicLine(_path, vueIndex.value);
        }
      }

      // _path=this.handleDynamicSubscript(_path);    view->model 此处不需要动态处理下标

      let value = `${_value}`;
      if (_value == null) {
        value = null;
      }
      // resolves chained keys (like 'user.adress.street') on an object and set the value
      const pathArray = _path.split(pathDelimiter);

      pathArray.forEach((p, ix) => {
        if (ix === pathArray.length - 1) {
          object[p] = value;
        }
        const tmpArr = p.match(/\[\d+\]/);
        if (tmpArr && tmpArr.length > 0) {
          // 处理公式规则中使用具体的数组下标的情况，如：gdzcjszjkcmxbGridlb[1].zcyz
          const aIndex = tmpArr[0].substr(1, tmpArr[0].length - 2);
          const k = p.indexOf(tmpArr[0]);
          const pp = p.substr(0, k);
          object = object[pp][aIndex];
        } else {
          object = object[p];
        }

        // console.log("finished")

        // Indicator.close()
        // console.log(object)
      });
    },
    handleDynamicSubscript(strExpression, id = '') {
      // 处理动态动态数字的下标，
      // a.b.c.20.d.f.11.f.a---->a.b.c[0].d.f[11].f.a
      // console.log("ID=" + id + ",源-->" + strExpression);
      const patt = /[.]\d+[.]/g;
      let result;

      while ((result = patt.exec(strExpression)) != null) {
        strExpression = strExpression.replace(
          new RegExp(result[0].replace(/\./g, '\\.'), 'gm'),
          `[${result[0].replace(/\./g, '')}].`,
        );
      }
      // console.log("结果-->" + strExpression);
      // "formula": "IF(OR('ZX'==\"LX\", ,MID(initData.nsrjbxx.swjgDm,1,3)==\"163\",ROUND(jexx.22.yshwbqs,2)<=ROUND(initData.zzsxgmsbInitData.ysfwYjye+initData.zzsxgmsbInitData.ysfwydbyhyyjse,2)),1,0)==1",
      strExpression = strExpression.replace(/, ,/g, ',');
      return strExpression;
    },
    getFinallyPath4Formula(p, target) {
      const _array_p = { ...p };
      const that = this;
      // 对于级联公式，允许配置对应的target（可配置数据类型，避免字符类型转数值），否则计算会遇到问题
      let tmpTarget = null;
      if (p.target) {
        tmpTarget = document.querySelector(`input[vue-path='${p.target}']`);
      }
      _array_p.target = tmpTarget || target;
      // 触发的元素的vueIndex
      const vueIndex = target.attributes['vue-index'];
      // 如果是动行(包含[#])
      if (p.flagDynamicParam) {
        let __isSum = false;
        let arraySumExpression = null;
        let arrayExpression = null;
        p.lstVariables.forEach((p2, ix2) => {
          if (this.isCustomeFunction(p2) && p2 === 'SUM') {
            __isSum = true;
            arraySumExpression = p.lstVariables[ix2 + 1];
            arrayExpression = that.getDynamicLineArrayObj(arraySumExpression);
          }
        });
        // 如果是合计,则生成实际的行相加
        if (__isSum && arraySumExpression && arrayExpression) {
          const sbInfoData = this.sbInfo[this.dataStateName];
          const arrayDatas = this.getObjectValueByPath(sbInfoData, arrayExpression);
          if (arrayDatas) {
            let _arraySumExpression = '';
            for (let jj = 0; jj < arrayDatas.length; jj++) {
              if (_arraySumExpression.length > 0) {
                _arraySumExpression += '+';
              }
              _arraySumExpression += this.replaceDynamicLine(arraySumExpression, jj);
            }

            _array_p.strFormula = _array_p.strFormula.replace(arraySumExpression, _arraySumExpression);
            if (_array_p.strAssignment) {
              _array_p.strAssignment = _array_p.strAssignment.replace(arraySumExpression, _arraySumExpression);
            }
            if (_array_p.strAssResolved) {
              _array_p.strAssResolved = _array_p.strAssResolved.replace(arraySumExpression, _arraySumExpression);
            }
            _array_p.strExpResolved = _array_p.strExpResolved.replace(arraySumExpression, _arraySumExpression);
            _array_p.strExpression = _array_p.strExpression.replace(arraySumExpression, _arraySumExpression);
            if (_array_p.tips) {
              _array_p.tips = _array_p.tips.replace(arraySumExpression, _arraySumExpression);
            }
          }
        } else {
          // 如果存在，就替换为当前行
          if (vueIndex && vueIndex.value) {
            const jj = vueIndex.value;
            _array_p.strFormula = this.replaceDynamicLine(_array_p.strFormula, jj);
            _array_p.strAssignment = this.replaceDynamicLine(_array_p.strAssignment, jj);
            _array_p.strAssResolved = this.replaceDynamicLine(_array_p.strAssResolved, jj);
            _array_p.strExpResolved = this.replaceDynamicLine(_array_p.strExpResolved, jj);
            _array_p.strExpression = this.replaceDynamicLine(_array_p.strExpression, jj);

            if (_array_p.tips) {
              if (_array_p.tips.indexOf('.[#]') >= 0) {
                _array_p.tips = _array_p.tips.replace(/\.\[#\]/g, '[#]');
              }
            }
            _array_p.tips = this.replaceDynamicLine(_array_p.tips, jj);
          }
        }
      }

      return _array_p;
    },
    getFinallyPath(target) {
      const vuePath = target.attributes['vue-path'];
      const vueIndex = target.attributes['vue-index'];
      if (vuePath && vuePath.value) {
        if (vuePath.value == 'fjmqysdsjdnssbbsyyhdzsqy2015Gridlb.[#].asrzehdynssde') {
          // debugger
        }
        let _vuePathValue = vuePath.value;
        if (vueIndex && vueIndex.value) {
          _vuePathValue = this.replaceDynamicLine(_vuePathValue, vueIndex.value);

          // _vuePathValue = _vuePathValue.replace(/\.\[#\]/g,"["+vueIndex.value+"]");
        }
        return _vuePathValue;
      }
      throw Error('not setting vue-path');
    },
    /**
     * 动态行替换[#]字符
     */
    replaceDynamicLine(vExpression, k) {
      if (!vExpression) return '';
      let result = '';
      if (vExpression.indexOf('.[#]') >= 0) {
        result = vExpression.replace(/\[#\]/g, k);
      } else {
        result = vExpression.replace(/\[#\]/g, `[${k}]`);
      }
      return result;
    },
    /**
     * 获取动态行数组对象
     */
    getDynamicLineArrayObj(vExpression) {
      let result = null;
      const k = vExpression.indexOf('.[#]');
      const arrayTokenIndex = vExpression.indexOf('[#]');
      if (k >= 0) {
        if (arrayTokenIndex > -1) {
          result = vExpression.slice(0, arrayTokenIndex - 1);
        }
      } else if (arrayTokenIndex > -1) {
        result = vExpression.slice(0, arrayTokenIndex);
      }
      return result;
    },
    initData4Formulas(p) {
      if (p.id == localStorage.getItem('formulaId')) {
        console.log('initData4Formulas');
      }
      if (!p.flagCompiled) {
        return;
      }

      const _array_p = { ...p };
      // 如果是动行(包含[#])
      if (p.flagDynamicParam) {
        let __isSum = false;
        let arraySumExpression = null;
        let arrayExpression = null;
        p.lstVariables.forEach((p2, ix2) => {
          if (this.isCustomeFunction(p2) && p2 === 'SUM') {
            __isSum = true;
            arraySumExpression = p.lstVariables[ix2 + 1];
            const tmpObj = this.getDynamicLineArrayObj(arraySumExpression);
            if (tmpObj) {
              arrayExpression = tmpObj;
            }
          }
        });

        // 如果是合计,则生成实际的行相加
        if (__isSum && arraySumExpression && arrayExpression) {
          const sbInfoData = this.sbInfo[this.dataStateName];
          const arrayDatas = this.getObjectValueByPath(sbInfoData, arrayExpression);
          if (arrayDatas) {
            let _arraySumExpression = '';
            for (let jj = 0; jj < arrayDatas.length; jj++) {
              if (_arraySumExpression.length > 0) {
                _arraySumExpression += ',';
              }
              _arraySumExpression += this.replaceDynamicLine(arraySumExpression, jj);
              _arraySumExpression = this.handleDynamicSubscript(_arraySumExpression);
            }

            _array_p.strFormula = _array_p.strFormula.replace(arraySumExpression, _arraySumExpression);
            if (_array_p.strAssignment) {
              _array_p.strAssignment = _array_p.strAssignment.replace(arraySumExpression, _arraySumExpression);
            }
            if (_array_p.strAssResolved) {
              _array_p.strAssResolved = _array_p.strAssResolved.replace(arraySumExpression, _arraySumExpression);
            }
            _array_p.strExpResolved = _array_p.strExpResolved.replace(arraySumExpression, _arraySumExpression);
            _array_p.strExpression = _array_p.strExpression.replace(arraySumExpression, _arraySumExpression);
            if (_array_p.tips) {
              _array_p.tips = _array_p.tips.replace(arraySumExpression, _arraySumExpression);
            }
            const strExpressionValue = this.calcFormula(_array_p);
            if (_array_p.type == '13') {
              this.UpdateControlUI(_array_p, strExpressionValue);
              return;
            }
            this.setObjectByPath(this.sbInfo[this.dataStateName], _array_p.strAssignment, strExpressionValue);
          }
        } else {
          // 右边表达式查找
          p.lstVariables.forEach((p2, ix2) => {
            const tmpObj = this.getDynamicLineArrayObj(p2);
            if (tmpObj) {
              arrayExpression = tmpObj;
            }
            // let arrayTokenIndex = p2.indexOf("[#]");
            // if (arrayTokenIndex > -1) {
            //   arrayExpression = p2.slice(0, arrayTokenIndex - 1);
            // }
          });
          // 在右边表达式中未找到，从左边表达式查找
          if (!arrayExpression) {
            const tmpObj = this.getDynamicLineArrayObj(p.strAssignment);
            if (tmpObj) {
              arrayExpression = tmpObj;
            }
            // let arrayTokenIndex = p.strAssignment.indexOf("[#]");
            // if (arrayTokenIndex > -1) {
            //   debugger
            //   arrayExpression = p.strAssignment.slice(0, arrayTokenIndex - 1);
            // }
          }
          const arrayDatas = this.getObjectValueByPath(this.sbInfo[this.dataStateName], arrayExpression);
          if (arrayDatas) {
            for (let jj = 0; jj < arrayDatas.length; jj++) {
              const _array_p = { ...p };
              _array_p.strFormula = this.replaceDynamicLine(_array_p.strFormula, jj);
              _array_p.strAssignment = this.replaceDynamicLine(_array_p.strAssignment, jj);
              _array_p.strAssResolved = this.replaceDynamicLine(_array_p.strAssResolved, jj);
              _array_p.strExpResolved = this.replaceDynamicLine(_array_p.strExpResolved, jj);
              _array_p.strExpression = this.replaceDynamicLine(_array_p.strExpression, jj);
              _array_p.tips = this.replaceDynamicLine(_array_p.tips, jj);

              const strExpressionValue = this.calcFormula(_array_p);
              if (_array_p.type == '13') {
                this.UpdateControlUI(_array_p, strExpressionValue);
                return;
              }
              try {
                this.setObjectByPath(this.sbInfo[this.dataStateName], _array_p.strAssignment, strExpressionValue);
              } catch (ex) {
                console.log(`setObjectByPath:${_array_p.id}`);
              }
            }
          }
        }
      } else {
        const strExpressionValue = this.calcFormula(_array_p);

        if (_array_p.type == '13') {
          this.UpdateControlUI(_array_p, strExpressionValue);
          return;
        }
        try {
          this.setObjectByPath(this.sbInfo[this.dataStateName], _array_p.strAssignment, strExpressionValue);
        } catch (ex) {
          console.log(`error:${_array_p.id}`);
        }
      }
    },

    UpdateControlUI(p, value) {
      if (p.lstTargetResolved && p.lstTargetResolved.length > 0) {
        const targets = p.lstTargetResolved;
        targets.forEach((t, jx) => {
          const controls = this.formulaEngine.idxVariable2Control[t.jpath];
          if (controls) {
            // let findTarget = document.querySelector("input[vue-path='" + t.jpath + "']");
            // if (findTarget) {
            //   this.updateUIControl(findTarget, controls, value);
            // }
            [].forEach.call(document.querySelectorAll(`input[vue-path='${t.jpath}']`), (p, ix) => {
              this.updateUIControl(p, controls, value);
            });
          }
        });
      }
    },

    /**
     * isRebindEvent： 是否重新绑定事件，当组件存在使用v-if时，则这个参数应为true,否则不要带参数，同时要求延时调用
     */
    initData(elementId) {
      // if (isRebindEvent) {
      //     this.reBindEvent();
      // }
      this.reBindEvent(elementId);

      // 设置期初报文全局参数，用于校验公式用到变量是否存在期初报文相关节点中
      // added by JamsonWu 2018-08-13
      const sbInfoData = this.sbInfo[this.dataStateName];
      window.formData = sbInfoData;
      console.log('formBase-InitData');
      this.formulaEngine = new FormulaEngine();
      this.formulaEngine.loadFormulas(this.sbInfo[this.ruleStateName]);
      this.formulaEngine.initialize('dataState');

      // 10 初始化公式
      this.formulaEngine.getOrderFormulaList(this.formulaEngine.lstInitialFormulas).forEach((p, ix) => {
        this.initData4Formulas(p.obj);
      });

      // 01 计算公式
      this.formulaEngine.getOrderFormulaList(this.formulaEngine.lstCalculateFormulas).forEach((p, ix) => {
        this.initData4Formulas(p.obj);
      });

      // 13控制公式初始化处理
      this.formulaEngine.lstControlFormulas.forEach((p, ix) => {
        this.initData4Formulas(p);
      });

      this.initVuePathData();

      /*        this.formulaEngine.lstControlFormulas
  .filter((p,ix)=>{
      return p.type==="03"
  })
  .forEach((p,ix)=>{

    let index = p.strFormula.indexOf("$")
    let path = p.strFormula.slice(0,index)
    let controlKV = p.strFormula.slice(index+1)
    console.log(path+' - '+controlKV)

    let controlKVs = controlKV.split("|")
    if(controlKVs.length>0){
      let target = document.querySelector("input[vue-path='"+path+"']")
      if(target){
        target[controlKVs[0]]=controlKVs[1]
      }
    }

  }) */
      // console.log("finsied:==>"+JSON.stringify(this.sbInfo[this.dataStateName]));
    },

    initVuePathData() {
      const that = this;
      const arr = [];
      // 赋值
      arr.forEach.call(document.querySelectorAll('input[vue-path]'), (p, ix) => {
        const vuePath = p.attributes['vue-path'];
        const vueIndex = p.attributes['vue-index'];
        const vueType = p.attributes['vue-type'];
        const inputType = p.attributes.type;

        if (vuePath && vuePath.value) {
          let _vuePathValue = vuePath.value;
          if (_vuePathValue == 'formContent.syjkbxmxlb.syjkbxmx.[#].bdsxrq') {
            //  debugger
          }
          if (vueType && vueType.value == 'string') {
            that.addStrField(_vuePathValue);
          }

          if (vueIndex && vueIndex.value) {
            // debugger;
            _vuePathValue = this.replaceDynamicLine(_vuePathValue, vueIndex.value);
          }

          _vuePathValue = this.handleDynamicSubscript(_vuePathValue);
          let rt = null;

          // 增加判断当前节点路径在期初报文中是否已存在 JamsonWu 2018-08-14
          if (that.formulaEngine.hasNodeInFormData(_vuePathValue)) {
            rt = this.getObjectValueByPath(this.sbInfo[this.dataStateName], _vuePathValue);
            let vueTypeValue = null;
            if (vueType && vueType.value) {
              vueTypeValue = vueType.value;
            }

            if (vueTypeValue) {
              if (vueTypeValue.indexOf('number') >= 0) {
                console.log('debug');
              }
            }

            // 增加支持百分比显示 JamsonWu
            // if(vueTypeValue=="percent(2)"){
            if (that.isPercent(vueTypeValue)) {
              if (isNaN(rt) || !rt || rt === '') {
                rt = 0.0;
              }
              rt = parseFloat(rt * 100).toFixed(that.getPercentDecimalNum(vueTypeValue));
              rt += '%';
            } else if (vueTypeValue == 'number(0)') {
              // 整数支持
              if (isNaN(rt) || !rt || rt === '') {
                rt = 0;
              }
              rt = parseInt(rt);
              if (rt < 0) {
                rt = 0;
              }
              rt = parseFloat(rt)
                .toFixed(0)
                .replace(/(?=(?!(\b))(\d{3})+$)/g, '$1,');
            } else if (vueTypeValue == 'string') {
            } else {
              let illegalNum = false;
              if (isNaN(rt) || !rt || rt === '') {
                rt = 0.0;
                illegalNum = true;
              }
              let digits = 2;
              if (vueTypeValue) {
                digits = this.getNumberDigits(vueTypeValue) * 1;
              }
              rt = parseFloat(rt).toFixed(digits);
              // 由于期初数中某些number类型的节点值为"",需要处理下，否则参与公式计算时当成字符串相加
              if (illegalNum && inputType && inputType.value == 'number') {
                this.setObjectByPath(this.sbInfo[this.dataStateName], _vuePathValue, rt);
              }
              rt = this.formatNumber(p, rt);
            }
            p.value = rt;
          } else {
            // console.log("节点不存在：" + _vuePathValue);
          }
        }
      });
      // document.querySelectorAll("input[vue-path]").forEach((p,ix)=>{
      //
      // })
    },
    /* toStringValue(obj) {

    if (obj instanceof Array) {
        var arr = [];
        for (var i = 0; i < obj.length; i++) {
            arr[i] = this.toStringValue(obj[i]);
        }
        return arr;
    } else if (typeof obj == 'object') {
        for (var p in obj) {
            obj[p] = this.toStringValue(obj[p]);
        }
    } else if (typeof obj == 'string') {
        // if(parseFloat(obj)){
        //   obj = parseFloat(obj);
        // }
           if(/^[0-9]+.?[0-9]*$/.test(obj)){
         obj = parseFloat(obj);
        }
    }
    return obj;
     } */

    /**
     * 判断是否为字符串字段
     * 还存在未知情况问题 todo--1
     */
    checkIsStringField(p) {
      if (
        !p ||
        p.endsWith('jhsx') ||
        p.endsWith('sjly') ||
        p.endsWith('Dm') ||
        p.endsWith('Dm2') ||
        p.endsWith('djxh') ||
        p.endsWith('Djxh') ||
        p.endsWith('dm') ||
        p.endsWith('mc') ||
        p.endsWith('Mc') ||
        p.endsWith('zjhm') ||
        p.endsWith('sjgsdq') ||
        p.endsWith('nsrsbh') ||
        p.endsWith('sbh') ||
        p.endsWith('zsfsdm')
      ) {
        return true;
      }
      return false;
    },

    /**
     * 增加基于页面配置输入框数据类型的校验，如果是字符类型，则不进行转换  JamsonWu 2018-09-10
     */
    toStringValue(obj, path) {
      // console.log("toStringValue");
      // 如果公式变量中不存在，则不处理
      if (obj instanceof Array) {
        if (path == 'zzsxgmYbjcFpVo.fphzGrid' || path == 'zzsxgmYbjcFpVo.ysdjfphzGrid') {
          // 发票汇总节点明确是数字
          // console.log("fphzGrid")
        } else {
          // var arr = [];
          for (let i = 0; i < obj.length; i++) {
            this.toStringValue(obj[i], path);
          }
        }
      } else if (typeof obj === 'object') {
        for (const p in obj) {
          if (typeof obj[p] === 'string') {
            if (this.checkIsStringField(p)) {
            } else {
              obj[p] = this.toStringValue(obj[p], path ? `${path}.${p}` : p);
            }
          } else {
            obj[p] = this.toStringValue(obj[p], path ? `${path}.${p}` : p);
          }

          // obj[p]=	this.toStringValue(obj[p]);
        }
      } else if (typeof obj === 'string') {
        // 增加\.进行转义，避免匹配数字加非数字字符串
        if (!this.isStringEx(path)) {
          if (/^(-)?[0-9]+\.?[0-9]*$/.test(obj)) {
            obj = parseFloat(obj);
          }
        }
      }
      return obj;
    },

    doStringEx(obj, path) {
      if (!path) {
        path = '';
      }
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          if (path == 'zzsxgmYbjcFpVo.fphzGrid' || path == 'zzsxgmYbjcFpVo.ysdjfphzGrid') {
            // 发票汇总节点明确是数字
            // console.log("fphzGrid")
          } else {
            this.doStringEx(obj[i], path);
          }
        }
      } else if (typeof obj === 'object') {
        for (const p in obj) {
          obj[p] = this.doStringEx(obj[p], path ? `${path}.${p}` : p);
        }
      } else {
        path = '';
        if (obj == null) {
        } else {
          obj += '';
        }
      }

      return obj;
    },
    /**
     * 将所有值全部转为字符格式
     */
    toStringEx() {
      this.doStringEx(this.sbInfo[this.dataStateName]);
    },
    /**
     * 数据模型转为数值
     */
    dataModelToFloat() {
      this.toStringValue(this.sbInfo[this.dataStateName], '');
    },
    /**
     * 数据模型转为字符
     */
    dataModelToStr() {
      this.toStringEx();
    },
    calcFormula(formula) {
      // console.log("calcFormula:" + formula.id)
      const sbInfoData = this.sbInfo[this.dataStateName];
      // 当前状态数据添加到window对象中,提供外部方法访问
      window.formData = sbInfoData;
      // debugger;
      //  console.log(JSON.stringify(sss));
      // FIXED yuewei 待处理,需要明确数据类型

      this.toStringValue(sbInfoData, '');
      // console.log(JSON.stringify(sss));
      // debugger;
      // console.log("==>formula.excelRef:" + formula.excelRef, "formula.validSheetName" + formula.validSheetName);

      if (formula.excelRef == 'F7' || formula.excelRef == 'E7' || formula.excelRef == 'F29') {
        //   alert(1234);
        //  debugger;
      }
      if (formula.excelRef == 'G8') {
      }
      if (formula.id == localStorage.getItem('formulaId')) {
        console.log('calcFormula');
      }
      let { strExpression } = formula;
      strExpression = this.handleDynamicSubscript(strExpression, formula.id);
      const regDynamic = /([\w\\.]+)+/g;
      const containsCustomeFunction = false;

      // debugger
      let rt = null;
      try {
        // 对于编译不通过的公式不执行计算,应调用这方法之前进行判断 JamsonWu 2018-08-14
        if (formula.id == localStorage.getItem('formulaId')) {
          console.log(`TTT${strExpression}`);
        }
        if (formula.flagCompiled) {
          rt = new Function(`with(this){return ${strExpression}}`).call(sbInfoData);
          if (formula.dataType == 'function') {
            console.log('update ui');
            this.initVuePathData();
            return rt;
          }
          // 因在公式计算之前对数据进行一次转换，此处进行还原 JamsonWu 2018-10-02
          this.toStringEx();
        }
      } catch (err) {
        this.toStringEx();
        if (formula.id == localStorage.getItem('formulaId')) {
          console.log(formula.id);
        }
        console.log(`公式异常，id=${formula.id}|${strExpression},错误信息：${err.message}`);
      }

      // return res;

      try {
        //   // console.log(strExpression)
        //   // let exp = this.encodeFormulas(strExpression)
        //   // let rt = this.encodeFormulas2Array(exp)
        //   // console.log("rt=>"+rt)
        //   // debugger
        //   let rt = this.newEval(strExpression)
        if (formula.type === '02' || formula.type === '02_01' || formula.type === '13') {
        } else if (this.isString(formula)) {
        } else {
          // 增加rt===""，处理空值问题，避免计算结果为NaN
          if (isNaN(rt) || rt === '') {
          } else {
            // rt = parseFloat(rt).toFixed(2)
            if (rt == null) {
              rt = 0;
            }
            const digits = this.getDigits(formula) * 1;
            rt = NP.round(parseFloat(rt), digits).toString();
          }
        }
        // let end = Date.parse(new Date())
        // console.log(end-start)
        return rt;
      } catch (e) {
        console.log('====error start=====');
        console.log(strExpression);
        console.log(this.sbInfo);
        console.log(e);
        console.log('====error end=====');
      }
    },

    /**
     * 获取保留小数点位数，默认为2
     */
    getDigits(formula) {
      let result = 2;
      let { target } = formula;
      if (typeof target === 'string' && target != '') {
        target = document.querySelector(`input[vue-path='${target}']`);
      }
      if (!target) {
        // 避免字符类型进行数字转换
        target = document.querySelector(`input[vue-path='${formula.strAssignment}']`);
      }
      if (target) {
        const vueType = target.attributes['vue-type'];
        if (vueType && vueType.value && vueType.value.indexOf('number') >= 0) {
          result = this.getNumberDigits(vueType.value);
        }
      }
      return result;
    },
    /**
     * 通过正则获取小数位数
     */
    getNumberDigits(val) {
      let num = 2;
      const reg = /number\(([\d]+)\)/;
      const arr = reg.exec(val);
      if (arr) {
        if (arr[1] > 0) {
          num = arr[1];
        }
      }
      return num;
    },

    encodeFormulas(strExpression) {
      // console.log(strExpression)
      const exp = strExpression.replace(/[IF|AND|OR|SUM|\(|\)]/g, '');
      // console.log(exp)
      return exp;
    },
    newEval(fn) {
      fn = fn.replace(/,==/g, ',""==');
      const Fn = Function; // 一个变量指向Function，防止有些前端编译工具报错
      return new Fn(`return ${fn}`)();
    },
    encodeFormulas2Array(exp) {
      if (typeof exp === 'string') {
        exp = exp.split(',');
        if (exp.length % 2 === 1 && exp.length > 1) {
          for (const i in exp) {
            if (isNaN(exp[i]) && !isNaN(this.newEval(exp[parseInt(i) + 1]))) {
              if (this.newEval(exp[i]) && this.compareSymbol(exp[i])) {
                // console.log("----->"+exp[parseInt(i)+1])
                return this.newEval(exp[parseInt(i) + 1]);
              }
              if (typeof this.newEval(exp[i]) === 'number') {
                if (this.newEval(exp[i]) < 0) {
                  // console.log("zero---"+this.newEval(exp[i]))
                  return '0.00';
                }
                // console.log("--------"+this.newEval(exp[i]))
                return this.newEval(exp[i]);
              }
              continue;
            } else if (parseInt(i) === exp.length - 2) {
              // continue
              // console.log("----->"+exp[exp.length-1])
              return exp[exp.length - 1];
            }
          }
        } else {
          exp = exp.join();
          return this.newEval(exp);
        }
      }
    },
    compareSymbol(exp) {
      const reg = new RegExp(/(\>|\=)|(\<|\=)/);
      return reg.test(exp);
    },
    isString(formula) {
      let { target } = formula;
      if (typeof target === 'string' && target != '') {
        target = document.querySelector(`input[vue-path='${target}']`);
      }
      if (!target) {
        // 避免字符类型进行数字转换
        target = document.querySelector(`input[vue-path='${formula.strAssignment}']`);
      }
      if (target) {
        const vueType = target.attributes['vue-type'];
        if (vueType && vueType.value) {
          return vueType.value == 'string';
        }
      }

      if (this.isStringEx(formula.strAssignment)) {
        return true;
      }

      return false;
    },
    /**
     * 是否固定值
     * @return {Boolean} [description]
     */
    isFixedValue(strVariable) {
      let i = fixedValueList.length;
      while (i--) {
        if (fixedValueList[i] === strVariable) {
          return true;
        }
      }
      return false;
    },
    isCustomeFunction(functionName) {
      let i = customeFunctionList.length;
      while (i--) {
        if (customeFunctionList[i] === functionName) {
          return true;
        }
      }
      return false;
    },
    /*      setVuePathStringType(key){
    if(!this.vuePathTypes){
      this.vuePathTypes = {}
    }

    this.vuePathTypes[key]='string'
  }, */
    sbCheck(fn) {
      // Indicator.open({
      //     text: '检查数据中...',
      //     spinnerType: 'triple-bounce'
      // });
      const that = this;
      let finalVerfifyResult = true;
      const arr = [];

      this.sbCheckErrorArr = [];
      const inputVuePathArr = document.querySelectorAll('input[vue-path]');
      const divVuePathArr = document.querySelectorAll('div[vue-path]');
      const vuePathArr = [...inputVuePathArr, ...divVuePathArr];
      let firstVueIndex = -1;
      let isShowErrorMsg = false;
      // setTimeout(()=> {
      arr.forEach.call(vuePathArr, (p, ix) => {
        if (!p.disabled) {
          const vuePath = p.attributes['vue-path'];
          if (vuePath && vuePath.value) {
            const errorInfo = this.cascadeVerifyFormula(vuePath.value, p);
            if (errorInfo.hasOwnProperty('path')) {
              finalVerfifyResult = finalVerfifyResult && errorInfo.verfifyResult;
              if (!finalVerfifyResult) {
                if (!isShowErrorMsg) {
                  isShowErrorMsg = true;
                  this.tipErrorInfo(errorInfo, vuePath);
                }
              } else {
                this.tipErrorInfo(errorInfo, vuePath);
              }

              // 记录本地校验异常列表
              if (!finalVerfifyResult) {
                that.sbCheckErrorArr.push({
                  vuePath: vuePath.value,
                  target: p,
                });
              }

              if (!finalVerfifyResult && errorInfo.vueIndexValue && firstVueIndex == -1) {
                firstVueIndex = errorInfo.vueIndexValue * 1;
              }

              // console.log(vuePath)
            }
          }
        }
      });
      Indicator.close();
      fn && fn(firstVueIndex);
      return finalVerfifyResult;
      // },20)

      // document.querySelectorAll("input[vue-path]").forEach((p,ix)=>{
      //
      // })
      // console.log('finalVerfifyResult:'+finalVerfifyResult)
    },

    back() {
      this.$router.go(-1);
      // this.toPage(this.backPageId,true)
    },
    toPage(_id) {
      let id = _id;
      if (!id) {
        return;
      }
      if (id.indexOf('#') > -1) {
        id = id.slice(1);
      }
      this.currentPageId = id;
      Object.keys(this.innerPages).forEach((p, ix) => {
        if (p === id) {
          this.innerPages[id].style.display = 'block';
        } else {
          this.innerPages[p].style.display = 'none';
        }
      });

      // this.reBindEvent();
    },
    toTab(id) {
      if (id.indexOf('#') > -1) {
        id = id.slice(1);
        this.currentTabId = id;
      }
      const { tabs } = this.innerPages[this.currentPageId];
      Object.keys(tabs).forEach((p, ix) => {
        if (tabs[p].id === id) {
          tabs[p].classList.add('active');
        } else {
          tabs[p].classList.remove('active');
        }
      });

      const { tabs_links } = this.innerPages[this.currentPageId];
      Object.keys(tabs_links).forEach((p, ix) => {
        if (tabs_links[p].attributes.href.value === `#${id}`) {
          tabs_links[p].classList.add('active');
        } else {
          tabs_links[p].classList.remove('active');
        }
      });
    },
    /**
     * 1.1指定节点值更新，触发关联节点重新计算，并应用UI更新 JamsonWu 2019-02-25
     */
    setValue2(path, vueIndex) {
      console.log('setValue2');
      if (!vueIndex) {
        vueIndex = 0;
      }
      const reg = /\[(\d+)\]/;
      const result = reg.exec(path);
      if (result) {
        vueIndex = result[1] * 1;
      }
      this.cascadeUpdateFormula2(path, vueIndex);
      this.cascadeVerifyControlFormula2(path, vueIndex);
      const errorInfo = this.cascadeVerifyFormula2(path, vueIndex);

      this.tipErrorInfo2(errorInfo, vueIndex);
      // UI更新
      this.initVuePathData();
    },

    // 级联更新计算公式
    // 1.2模型字段变更，触发重新计算  JamsonWu 2019-02-25
    cascadeUpdateFormula2(path, vueIndex) {
      if (!this.getFormulaAndParamsEx(path)) {
        return;
      }
      const tmpCalcArr = [];
      const aaa = this.getRelationFormulaList(path);
      aaa
        .filter((p, ix) => {
          return p.type === '01' || p.type == '11'; // 计算公式
        })
        .forEach((p, ix) => {
          tmpCalcArr.push(p.id);
          const ss = path;
          if (ss == p.strAssResolved) {
            return;
          }
          if (p.id == localStorage.getItem('formulaId')) {
            console.log('cascadeUpdateFormula2');
          }
          const _array_p = this.getFinallyPath4Formula2(p, vueIndex);

          const strExpressionValue = this.calcFormula(_array_p);
          this.setObjectByPath(this.sbInfo[this.dataStateName], _array_p.strAssignment, strExpressionValue);

          // this.cascadeUpdateFormula2(p.strAssignment,vueIndex)
        });

      console.log(`关联计算公式：${JSON.stringify(tmpCalcArr)}`);
    },
    // 1.3基于页索引获取公式全路径  JamsonWu 2019-02-21
    getFinallyPath4Formula2(p, vueIndex) {
      const that = this;
      const _array_p = { ...p };
      // 如果是动行(包含[#])
      if (p.flagDynamicParam) {
        let __isSum = false;
        let arraySumExpression = null;
        let arrayExpression = null;
        p.lstVariables.forEach((p2, ix2) => {
          if (this.isCustomeFunction(p2) && p2 === 'SUM') {
            __isSum = true;
            arraySumExpression = p.lstVariables[ix2 + 1];
            arrayExpression = that.getDynamicLineArrayObj(arraySumExpression);
          }
        });
        // 如果是合计,则生成实际的行相加
        if (__isSum && arraySumExpression && arrayExpression) {
          const sbInfoData = this.sbInfo[this.dataStateName];
          const arrayDatas = this.getObjectValueByPath(sbInfoData, arrayExpression);
          if (arrayDatas) {
            let _arraySumExpression = '';
            for (let jj = 0; jj < arrayDatas.length; jj++) {
              if (_arraySumExpression.length > 0) {
                _arraySumExpression += '+';
              }
              _arraySumExpression += this.replaceDynamicLine(arraySumExpression, jj);
            }

            _array_p.strFormula = _array_p.strFormula.replace(arraySumExpression, _arraySumExpression);
            if (_array_p.strAssignment) {
              _array_p.strAssignment = _array_p.strAssignment.replace(arraySumExpression, _arraySumExpression);
            }
            if (_array_p.strAssResolved) {
              _array_p.strAssResolved = _array_p.strAssResolved.replace(arraySumExpression, _arraySumExpression);
            }
            _array_p.strExpResolved = _array_p.strExpResolved.replace(arraySumExpression, _arraySumExpression);
            _array_p.strExpression = _array_p.strExpression.replace(arraySumExpression, _arraySumExpression);
          }
        } else {
          // 如果存在，就替换为当前行
          if (vueIndex >= 0) {
            const jj = vueIndex;
            _array_p.strFormula = this.replaceDynamicLine(_array_p.strFormula, jj);
            _array_p.strAssignment = this.replaceDynamicLine(_array_p.strAssignment, jj);
            _array_p.strAssResolved = this.replaceDynamicLine(_array_p.strAssResolved, jj);
            _array_p.strExpResolved = this.replaceDynamicLine(_array_p.strExpResolved, jj);
            _array_p.strExpression = this.replaceDynamicLine(_array_p.strExpression, jj);

            if (_array_p.tips) {
              if (_array_p.tips.indexOf('.[#]') >= 0) {
                _array_p.tips = _array_p.tips.replace(/\.\[#\]/g, '[#]');
              }
            }
            _array_p.tips = this.replaceDynamicLine(_array_p.tips, jj);
          }
        }
      }

      return _array_p;
    },
    /**
     * 1.4 模型变更时，基于Path触发关联公式重新校验   JamsonWu 2019-02-25
     */
    cascadeVerifyFormula2(path, vueIndex) {
      const tmpPath = this.formulaEngine.getPathEx(path);
      // 01计算公式；02校验公式
      let errorInfo = {};
      let hasError = false; // 是否检测到错误
      const that = this;
      this.formulaEngine.lstVerifyFormulas
        .filter((p, ix) => {
          return p.strFormula.indexOf(tmpPath) > -1 && (p.type === '02' || p.type === '02_01');
        })
        .forEach((p, ix) => {
          if (hasError) {
            return;
          }
          // 仅处理编译通过的公式
          if (p.flagCompiled) {
            const _array_p = this.getFinallyPath4Formula2(p, vueIndex);

            const verfifyResult = this.calcFormula(_array_p);
            if (!verfifyResult) {
              p.tips = _array_p.tips;
              errorInfo = { path, verfifyResult, p, vueIndex, relation: [] };
              hasError = true;
            } else {
              // 还原上次的异常状态
              that.restoreInputBackgroundColor(p.target ? p.target : _array_p.target, vueIndex);
            }

            if (!verfifyResult && !errorInfo.hasOwnProperty('path')) {
              errorInfo = { path, verfifyResult, p, vueIndex, relation: [] };
            } else {
              // 如果当前计算结果和之前的计算结果合并，如果为false保存
              if (verfifyResult || errorInfo.verfifyResult) {
              } else {
                errorInfo = { path, verfifyResult, p, vueIndex, relation: [] };
              }
            }
          }
        });

      return errorInfo;
    },
    /**
     * 1.5 模型变更时，触发校验，错误信息提示 JamsonWu 2019-02-25
     */
    tipErrorInfo2(errorInfo, vueIndex) {
      if (!errorInfo) {
        return;
      }
      // console.log(errorInfo.path+":"+errorInfo.verfifyResult+" -- " +errorInfo.p.tips)
      let errorTarget = null;

      if (errorInfo.p && errorInfo.p.target) {
        // 当列表.[#].形式，需要判断vueIndex，否则直接根据vuepath，每次拿到列表第一项
        if (vueIndex && vueIndex >= 0) {
          errorTarget = document.querySelector(`input[vue-path='${errorInfo.p.target}'][vue-index='${vueIndex}']`);
        } else {
          errorTarget = document.querySelector(`input[vue-path='${errorInfo.p.target}']`);
        }

        if (!errorTarget) {
          errorTarget = document.getElementById(errorInfo.p.target);
        }
        if (!errorTarget) {
          if (vueIndex && vueIndex >= 0) {
            errorTarget = document.querySelector(`div[vue-path='${errorInfo.p.target}'][vue-index='${vueIndex}']`);
          } else {
            errorTarget = document.querySelector(`div[vue-path='${errorInfo.p.target}']`);
          }
        }
      }

      if (!errorTarget) {
        if (vueIndex >= 0) {
          errorTarget = document.querySelector(`input[vue-path='${errorInfo.path}'][vue-index='${vueIndex}']`);
        } else if (errorInfo.p && errorInfo.p.target) {
          // 当校验存在异常时，可指定在哪个控件上焦点展现 JamsonWu
          const targetArr = errorInfo.p.target.split(';');
          if (targetArr && targetArr.length >= 1) {
            errorTarget = document.querySelector(`input[vue-path='${targetArr[0]}']`);
          }
        } else {
          errorTarget = document.querySelector(`input[vue-path='${errorInfo.path}']`);
        }
      }

      if (errorTarget) {
        errorTarget.attributes.verfifyResult = errorInfo.verfifyResult;
        if (!errorInfo.verfifyResult) {
          if (errorTarget.$OLD_BGCOLOR == null || errorTarget.$OLD_BGCOLOR == undefined) {
            errorTarget.$OLD_BGCOLOR = `${errorTarget.style.backgroundColor}`;
          }
          errorTarget.style.backgroundColor = '#ffd21d';
          this.addErrorStyle(errorTarget);

          const _this = this;
          if (errorTarget.disabled) {
            errorTarget.addEventListener('touchstart', function (e) {
              const _verfifyResult = this.attributes.verfifyResult;
              if (_verfifyResult == false) {
                _this.errorInfoNotification(errorInfo);
              }
            });
          } else {
            errorTarget.addEventListener('click', function (e) {
              const _verfifyResult = this.attributes.verfifyResult;
              if (_verfifyResult == false) {
                // _this.errorInfoNotification(errorInfo)
              }
            });
          }

          if (!errorTarget.verfifyResult) {
            this.errorInfoNotification(errorInfo);
          }
        } else if (errorTarget.disabled) {
          errorTarget.style.backgroundColor = '#eeeeee';
        } else if (this.oKbackgroundColor) {
          errorTarget.style.backgroundColor = this.oKbackgroundColor;
          this.removeErrorStyle(errorTarget);
        } else if (this.hasClass(errorTarget, 'read')) {
        } else {
          errorTarget.style.backgroundColor = this.editBackgroundColor;
        }
      }
      if (errorInfo.relation) {
        this.tipErrorInfo2(errorInfo.relation[0], vueIndex);
      }
    },

    /**
    增加针对控制公式type=13,级联更新校验 JamsonWu
   */
    cascadeVerifyControlFormula2(path, vueIndex) {
      // 13 控制公式要级联更新
      if (!this.getFormulaAndParamsEx(path)) {
        return;
      }
      const tmpVerifyArr = [];
      const aaa = this.getRelationFormulaList(path);
      aaa
        .filter((p, ix) => {
          return p.type === '13'; // 计算公式
        })
        .forEach((p, ix) => {
          if (p.id == '06100003010400002') {
            // debugger
          }
          tmpVerifyArr.push(p.id);
          const _array_p = this.getFinallyPath4Formula2(p, vueIndex);
          const verfifyResult = this.calcFormula(_array_p);
          if (p.lstTargetResolved && p.lstTargetResolved.length > 0) {
            const targets = p.lstTargetResolved;
            targets.forEach((t, jx) => {
              const controls = this.formulaEngine.idxVariable2Control[t.jpath];
              if (controls) {
                [].forEach.call(document.querySelectorAll(`input[vue-path='${t.jpath}']`), (p, ix) => {
                  this.updateUIControl(p, controls, verfifyResult);
                });
              }
            });
          }
        });

      console.log(`关联控制公式：${JSON.stringify(tmpVerifyArr)}`);
    },
  },
  mounted() {
    if (!this.hasView) {
      return;
    }
    const _innerPages = {};
    let _currentPageId = null;
    let pCount = 0;
    const arr = [];
    console.log(`containerId:${this.containerId}`);

    let vuePageArr = [];
    if (this.containerId) {
      const curEl = document.getElementById(this.containerId);
      if (curEl) {
        vuePageArr = curEl.querySelectorAll('.vuePage');
      }
    } else {
      vuePageArr = document.querySelectorAll('.fxapp .vuePage');
    }

    arr.forEach.call(vuePageArr, (p, ix) => {
      console.log(`innerPages containerId:${this.containerId}`);
      pCount += 1;
      let _id = p.id;
      if (!_id) {
        _id = `page${pCount}`;
      }

      _innerPages[_id] = p;
      if (p.classList.contains('currentVuePage')) {
        _currentPageId = _id;
      }

      const tabs = p.querySelector('.tabs');
      if (tabs) {
        _innerPages[_id].tabs = tabs.children;
        _innerPages[_id].tabs_links = p.querySelectorAll('.tab-link');
      }
    });

    this.innerPages = _innerPages;
    if (!_currentPageId && !this.containerId) {
      MessageBox.alert('请设置currentPage');
    } else {
      this.toPage(_currentPageId);
    }
  },
  created() {},
};
</script>
