/** @license @fx/gt4-components (c) 2020-2022 laogong5i0 License: Apache-2.0 */
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: "FxCheckboxesWidget",
  props: {
    enumOptions: {
      default: () => [],
      type: [Array]
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function (context) {
      style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c("t-checkbox-group", _vm._g(_vm._b({}, "t-checkbox-group", _vm.$attrs, false), _vm.$listeners), _vm._l(_vm.enumOptions, function (item, index) {
    return _c("t-checkbox", {
      key: index,
      attrs: {
        label: item.value
      }
    }, [_vm._v("\n        " + _vm._s(item.label) + "\n    ")]);
  }), 1);
};

var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* istanbul ignore next */

__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
};

var index = {
  name: "FxDatePickerWidget",
  functional: true,

  render(h, context) {
    const {
      isNumberValue,
      isRange,
      ...otherProps
    } = context.data.attrs || {};
    context.data.attrs = {
      type: isRange ? "daterange" : "date",
      "value-format": isNumberValue ? "timestamp" : "yyyy-MM-dd",
      ...otherProps
    };
    const oldInputCall = context.data.on.input;
    context.data.on = { ...context.data.on,

      input(val) {
        // eslint-disable-next-line no-nested-ternary
        const trueVal = val === null ? isRange ? [] : undefined : val;
        oldInputCall.apply(context.data.on, [trueVal]);
      }

    };
    return h("t-date-picker", context.data, context.children);
  }

};

export { __vue_component__ as CheckboxesWidget, index as DatePickerWidget };
