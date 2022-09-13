import { fetchOld, fetch } from '@/core/request';

export default {
  success({ params, data }) {
    return fetch({
      url: '/demo/success',
      method: 'get',
      data,
      params,
    });
  },

  fail({ params, data }) {
    return fetch({
      url: '/demo/fail',
      method: 'post',
      data,
      params,
    });
  },

  error() {
    return fetch({
      url: '/demo/error',
      method: 'get',
    });
  },

  oldSuccess(params) {
    return fetchOld({
      url: '/demo/old_success',
      method: 'get',
      params,
    });
  },

  oldFail(params) {
    console.log('====>> params', params);
    return fetchOld({
      url: '/demo/old_fail',
      method: 'get',
    });
  },

  successArray({ params = {}, data = {} }) {
    return fetch({
      url: '/demo/success_array',
      method: 'get',
      data,
      params,
    });
  },

  successBoolean({ params = {}, data = {} }) {
    return fetch({
      url: '/demo/success_boolean',
      method: 'get',
      data,
      params,
    });
  },

  successNumber({ params, data }) {
    return fetch({
      url: '/demo/success_number',
      method: 'get',
      data,
      params,
    });
  },

  successString({ params, data }) {
    return fetch({
      url: '/demo/success_string',
      method: 'get',
      data,
      params,
    });
  },

  getAppUserDetails({ params, data }) {
    return fetch({
      url: '/app/znds/user/getAppUserDetails.do',
      method: 'post',
      data,
      params,
    });
  },

  checkLogin({ params, data }) {
    return fetch({
      url: '/xxmh/portalSer/checkLogin.do',
      method: 'post',
      data,
      params,
    });
  },

  testMock({ params, data }) {
    return fetch({
      url: '/xxmh/portalSer/testMock',
      method: 'post',
      data,
      params,
    });
  },

  getUserInfo({ params, data }) {
    return fetch({
      url: '/xxmh/portalSer/userInfo',
      method: 'post',
      data,
      params,
    });
  },
};
