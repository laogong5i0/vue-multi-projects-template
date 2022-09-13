/*
 * @Description: mock数据方法
 * @Author: smileswlin
 * @LastEditor: smileswlin
 * @Date: 020-05-24 21:16:49
 * @LastEditTime: 2020-06-17 17:30:21
 */
const path = require('path');
const fs = require('fs'); // 引入文件系统模块
const Mock = require('mockjs'); // mockjs 导入依赖模块

/**
 * 读取json文件
 * @param filePath
 * @returns {any}
 */
function getMockFile(filePath) {
  // 读取指定json文件
  const json = fs.readFileSync(filePath, 'utf-8');
  // 解析并返回
  return JSON.parse(json);
}

/**
 * 读取文件夹下所有文件名并替换为路由模式字符串 eg: user_bulk__delete.json => /user/bulk_delete
 * @param jsonPath
 * @returns {{}}
 */
function getMockRouter(jsonPath) {
  const jsonFiles = [];
  try {
    // 检查传入目录是否存在
    fs.accessSync(jsonPath);

    const files = fs.readdirSync(jsonPath);

    files.forEach((item) => {
      let fileName = item;
      fileName = `/${item.replace(/_/g, '/').replace('.json', '')}`;
      fileName = fileName.replace(/\/\//g, '_'); // 若出现‘//’ ， 则改为_
      jsonFiles.push(fileName);
    });
  } catch (e) {
    console.log('error', e);
  }
  return jsonFiles;
}

/**
 * @description: 设置mock数据路由, 对应目录下，创建get或者post目录，该目录下的文件则为url请求地址 eg: user_bulk__delete.json => /user/bulk_delete
 * @param app {Object} app对象
 * @param method {String} 请求方式，get或者post
 * @param urlPrefix {String} url的前缀
 * @param dirPath {String} 对应的目录
 * @return: undefined
 */
exports.setMock = function (app, method, urlPrefix, dirPath) {
  const newDirPath = dirPath || path.join(process.cwd(), 'mock', method);
  getMockRouter(newDirPath).forEach((item) => {
    app[method](`${urlPrefix}${item}`, (req, res) => {
      // 每次响应请求时读取mock data的json文件
      // util.getMockFile方法定义了如何读取json文件并解析成数据对象
      const jsonPath = path.resolve(newDirPath, `${item.substr(1).replace(/_/g, '__').replace(/\//g, '_')}.json`);
      const json = getMockFile(jsonPath);
      res[method === 'get' ? 'json' : 'send'](Mock.mock(json)); // 将json传入 Mock.mock 方法中，生成的数据返回给浏览器
    });
  });
};

/**
 * @description: 设置mock数据路由, 增加子目录，mock/xxx/post 目录下的文件为url请求地址  eg: user_bulk__delete.json => /xxx/abc/user/bulk_delete
 * @param app {Object} app对象
 * @param methods {Array} 请求方式，,eg: ['get', 'post']
 * @param urlPrefix {String} url的前缀
 * @return: undefined
 */
exports.mockSubDirs = function (app, methods, urlPrefix) {
  const rootDirPath = path.join(process.cwd(), 'mock');

  const files = fs.readdirSync(rootDirPath);
  const dirs = files.filter((item) => fs.lstatSync(path.resolve(rootDirPath, item)).isDirectory());

  dirs.forEach((dir) => {
    const subUrlPrefix = dir.replace(/(?:[^_])_(?:[^_])/g, '/').replace(/__/g, '_');

    const dirPath = path.join(process.cwd(), 'mock', dir);
    methods.forEach((method) => {
      const rootUrlPrefix = urlPrefix[urlPrefix.length] === '/' ? urlPrefix.slice(0, -1) : urlPrefix;
      const urlPrefixResult = `${rootUrlPrefix}${subUrlPrefix}`;
      const dirPathResult = `${dirPath}/${method}`;
      console.log('mock with method:', method, ' urlPrefix:', urlPrefixResult, ' dir:', dirPathResult);
      exports.setMock(app, method, urlPrefixResult, dirPathResult);
    });
  });
};
