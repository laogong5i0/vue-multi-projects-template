import Vue from 'vue';
import Vuex from 'vuex';
import { store } from '@wecity/tdesign-gov-vue';

const initStore = store.init(Vue, Vuex);

initStore.registerModule('index', {
  state: {
    user: 'index name',
    isOpenTabRoute: false,
    isOpenBreadCrumbLayout: false,
    userInfo: {},
    token: '1234567890',
  },
  mutations: {
    SET_OPEN_TABROUTE(state, isOpenTabRoute) {
      // eslint-disable-next-line no-param-reassign
      state.isOpenTabRoute = isOpenTabRoute;
    },
    SET_OPEN_BREADCRUMB_LAYOUT(state, isOpenBreadCrumbLayout) {
      // eslint-disable-next-line no-param-reassign
      state.isOpenBreadCrumbLayout = isOpenBreadCrumbLayout;
    },
    SET_USERINFO(state, userInfo) {
      // eslint-disable-next-line no-param-reassign
      state.userInfo = userInfo;
    },
    SET_TOKEN(state, token) {
      // eslint-disable-next-line no-param-reassign
      state.token = token;
    },
  },
});

export default initStore;
