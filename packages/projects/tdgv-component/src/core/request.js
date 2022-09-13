import { request } from '@wecity/tdesign-gov-vue';

/**
 * 基于request的实例进行拦截器的request自定义示例
 * 传参为onFulfilled、onRejected两个处理函数
 * 你可以在这里对预设配置对象进行进一步的加工，
 *  比如请求要带的header参数配置、请求Timeout的重设等
 */
request.interceptors.request.use(
  /**
   * onFulfilled钩子函数处理
   * @param conf {Object} 实例中request的配置函数
   * @returns {Object}  request配置函数
   */
  (conf) => {
    const newConf = conf;
    // 这里只是一个判断入口，可以根据实际情况调整判断式
    if (newConf.headers['x-api-version'] === 'old') {
      Object.assign(newConf, {
        timeout: 20000,
      });
      Object.assign(newConf.headers, {
        'x-api-version-demo': 'demo',
      });
      // 可以处理返回数据
      newConf.transformResponse = [
        (data) => {
          const newData = JSON.parse(data);
          newData.xApiVersion = 'old';
          return newData;
        },
      ];
      console.log('====>> 处理过的req conf', newConf);
    }

    return newConf;
  },
  /**
   * onRejected钩子函数处理
   * @param err {ErrorEvent}  前一个拦截器返回的request错误事件
   * @returns {Promise<never>}  必须reject对应的错误事件
   */
  (err) => {
    console.log('====>> req err', err);
    return Promise.reject(err);
  },
);

/**
 * 基于request的实例进行拦截器的response自定义示例，
 * 传参为onFulfilled、onRejected两个处理函数
 * 你可以在这里对预设返回的对象进行进一步的加工，比如key值的大小驼峰转换
 */
request.interceptors.response.use(
  /**
   * onFulfilled钩子函数处理
   * @param res {Object} 为前一个拦截器返回的结果
   * @returns {Object} 必须要return`结果对象`
   */
  (res) => {
    if (res && res.PageNumber) {
      Object.assign(res, {
        pageNumber: 1,
      });
    }
    console.log('====>> response自定义拦截器', res);

    return res;
  },
  /**
   * onRejected钩子函数处理
   * @param err {ErrorEvent} 前一个拦截器返回的错误结果
   * @returns {Promise<never>}
   */
  (err) => {
    console.warn('====>> response自定义拦截器 err', err);
    return Promise.reject(err);
  },
);

/**
 * 旧版Api统一请求入口
 * @param options
 * @param custom
 */
const fetchOld = (options, custom) =>
  request(
    {
      baseURL: window.STATIC_ENV_CONFIG.API_PREFIX,
      headers: {
        'x-api-version': 'old',
      },
      ...options,
    },
    custom,
  );

/**
 * 新版Api统一请求入口
 * @param options
 * @param custom
 */
const fetch = (options, custom) =>
  request(
    {
      baseURL: window.STATIC_ENV_CONFIG.API_PREFIX,
      ...options,
    },
    custom,
  );

export { fetchOld, fetch };
