import Vue from 'vue';
import TDesign from 'tdesign-vue';
import { upperFirst, camelCase } from 'lodash-es';
// import { registerIEPolyfill, isMSIE } from '@wecity/tdesign-vue-ie';
import '@wecity/tdesign-gov-vue/dist/theme/normal/index.css';

// if (isMSIE()) {
//   require('@wecity/tdesign-vue-ie/dist/theme/ie.css');
// }

Vue.config.productionTip = false;

Vue.use(TDesign);

// 全局mixin
Vue.mixin({
  // 路由根路径。默认develop环境是"/dev", product环境是"/"
  computed: {
    routerBase: () => process.env.VUE_APP_ROUTER_BASE,
  },
});

// 加载组件
const loadComponent = (requireComponent) => {
  requireComponent.keys().forEach((fileName) => {
    // Get the component config
    const componentConfig = requireComponent(fileName);
    // Get the PascalCase version of the component name
    try {
      const componentName = upperFirst(camelCase(componentConfig.default.name));
      // Globally register the component
      Vue.component(componentName, componentConfig.default || componentConfig);
    } catch (e) {
      console.error(e);
    }
  });
};
// 加载全局组件
const globalComponent = require.context(
  // 其组件目录的相对路径
  '../components/',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /_base\.vue$/,
);

loadComponent(globalComponent);

// registerIEPolyfill();
