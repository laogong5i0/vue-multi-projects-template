import 'babel-polyfill';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@/core';
import Vue from 'vue';
import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/github.css';
import app from './app.vue';
import router from './router';
import store from './store';
import { topbarConfig, sideBarConfig } from './config';

const storeGlobalTypes = Vue.prototype.$storeGlobalTypes;
router.afterEach((to) => {
  const isShowSideBar = typeof to.meta.isShowSideBar === 'undefined' ? true : to.meta.isShowSideBar;
  store.commit(`global/${storeGlobalTypes.SET_SIDEBAR_STATUS}`, isShowSideBar);
});

const setUserInfo = (userInfo) => {
  store.commit(`global/${storeGlobalTypes.SET_USER_INFO}`, userInfo);
};

const initRender = (props = {}) => {
  const { userInfo } = props;
  new Vue({
    router,
    store,
    render: (h) => h(app),
  }).$mount('#app');
  setUserInfo(userInfo);
  store.commit(`global/${storeGlobalTypes.SET_TOPBAR_CONFIG}`, topbarConfig);
  store.commit(`global/${storeGlobalTypes.SET_SIDEBAR_CONFIG}`, sideBarConfig);

  store.commit(`global/${storeGlobalTypes.REGISTER_EVENT}`, {
    handleLogin() {
      // TODO: 统一添加登录函数
      console.log('去登录');
      setUserInfo({
        isLogin: true,
        info: { name: 'nickname' },
        menu: [],
      });
      return false;
    },
    handleLogout() {
      // TODO: 统一添加退出登录函数
      console.log('退出登录');
      setUserInfo({
        isLogin: false,
        info: {},
        menu: [],
      });
      return false;
    },
  });
};

/**
 * 初始化前先确认能获取用户登录态
 */
const promise = [];
// TODO: 请求用户权限信息
Promise.all(promise)
  .then(() => {
    initRender({
      userInfo: {
        isLogin: true,
        info: {
          name: 'nickname',
        },
        // 用户中心可操作列表
        menu: [],
      },
      // menu: res[1]
    });
  })
  .catch((err) => {
    console.error(err);
  });
