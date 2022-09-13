const path = require('path');
const fs = require('fs');
const glob = require('glob');
// const webpack = require('webpack');
const devServerPort = process.env.VUE_APP_DEV_SERVER_PORT || 8090;
const PAGE_PATH = path.resolve(__dirname, './src/pages');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const StaticEnvConfigPlugin = require('@wecity/static-env-config').default;
const TIconReplaceWebpackPlugin = require('@wecity/tdesign-gov-vue/icon/plugin');
const AutoRouterPlugin = require('@wecity/tdesign-gov-vue/plugins/auto-router');
const mock = require('./mock');
const packageName = require('./package.json').name;

const LOCAL_DEV = process.env.VUE_APP_MODEL === 'local';

// 根据启动的模式使用不同的template
const template = LOCAL_DEV ? 'public/local.html' : 'public/index.html';

/**
 * 获取页面入口集合 for devServer
 */
function getPagesEntities(pagePath) {
  const entities = {};
  glob.sync(pagePath).forEach((entity) => {
    const moduleName = entity.split('/').slice(-1);
    entities[moduleName] = entity;
  });
  // eg:
  // {
  //  apply_admin: './src/pages/admin_manage/index',
  //  test: './src/pages/test/index'
  // }
  return entities;
}

const pages = getPagesEntities(`${PAGE_PATH}/*`);

const multiPage = {};

Object.keys(pages).forEach((page) => {
  if (!Object.prototype.hasOwnProperty.call(pages, page)) {
    return;
  }
  const configFile = `${PAGE_PATH}/${page}/config.js`;
  const config = fs.existsSync(configFile) ? require(configFile) : {};
  multiPage[page] = {
    // page 的入口
    entry: `src/pages/${page}/main.js`,
    // 模板来源
    template,
    // 在 dist/index.html 的输出
    filename: page === 'index' ? `${page}.html` : `${page}/index.html`,
    // 当使用 title 选项时，
    // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: process.env.VUE_APP_NAME || '行业业务前端组件',
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', page],
    ...config,
  };
});

/**
 * 将对应环境的env的环境变量处理成常量，等待注入到static-env-config插件配置中去
 * 只注入VUE_APP_开头的环境变量
 */
const STATIC_ENV_CONFIG = {};
Object.keys(process.env).forEach((key) => {
  if (/^VUE_APP_/.test(key)) {
    Object.assign(STATIC_ENV_CONFIG, {
      [key]: process.env[key],
    });
  }
});

delete STATIC_ENV_CONFIG.VUE_APP_API_BASE_URL;
delete STATIC_ENV_CONFIG.VUE_APP_CDN_PATH;
delete STATIC_ENV_CONFIG.VUE_APP_ROUTER_BASE;

/**
 * 修复生产模式build出来的css background image url(~@)路径不符合预期的问题
 * @type {string[]}
 */
const styles = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
const modules = ['vue-modules', 'vue', 'normal-modules', 'normal'];

const configureWebpackPlugin = [];

/**
 * 本地开发启用hard-source-webpack-plugin
 */
if (LOCAL_DEV) {
  console.log('====>> 启动本地开发缓存');
  configureWebpackPlugin.push(
    new HardSourceWebpackPlugin({
      // 缓存目录，支持相对目录或绝对目录
      // 如果有设置VUE_APP_HARD_SOURCE_FOLDER目录则使用设置值
      // 一般在coding流水线编译使用，把缓存设置到`/data/npm/`中，不会丢失
      cacheDirectory: `${
        (process.env.VUE_APP_HARD_SOURCE_FOLDER && path.join(process.env.VUE_APP_HARD_SOURCE_FOLDER, '/')) ||
        path.join(process.cwd(), 'node_modules', '/')
      }.cache/hard-source/[confighash]`,
      // 基于package.json中的name来生成不同的hash串用于cacheDirectory的目录
      // @param webpackConfig
      configHash(webpackConfig) {
        return require('node-object-hash')({ sort: false }).hash({ packageName, ...webpackConfig });
      },
      // 根据目录中的lock文件来决定是否重设缓存，如果设置false则需要手动删除
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock'],
      },
      info: {
        // 'none' or 'test'.
        mode: 'none',
        // 'debug', 'log', 'info', 'warn', or 'error'.
        level: 'debug',
      },
      // 自动清除过期、过大缓存
      cachePrune: {
        // 缓存时间：默认7天
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // 超过该处设置的阈值（默认500MB），则自动删除缓存
        sizeThreshold: 500 * 1024 * 1024,
      },
    }),
    new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        // HardSource works with mini-css-extract-plugin but due to how
        // mini-css emits assets, assets are not emitted on repeated builds with
        // mini-css and hard-source together. Ignoring the mini-css loader
        // modules, but not the other css loader modules, excludes the modules
        // that mini-css needs rebuilt to output assets every time.
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
      },
    ]),
  );
}

if (process.env.VUE_APP_AUTO_ROUTER === 'true') {
  console.log('====>> 启动自动路由，若不需要请在.env.development文件把[VUE_APP_AUTO_ROUTER]变量删除或者设置为false');
  configureWebpackPlugin.push(new AutoRouterPlugin({ pages: './src/pages/*/views' }));
}

module.exports = {
  lintOnSave: LOCAL_DEV,
  transpileDependencies: ['tdesign-icons-vue'],
  publicPath: process.env.NODE_ENV === 'production' ? '/' : process.env.VUE_APP_CDN_PATH,
  assetsDir: 'assets_res',
  // 生产模式生成sourcemap
  productionSourceMap: false,
  css: {
    sourceMap: false,
  },
  chainWebpack: (config) => {
    config.module
      .rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
      });

    // alias注册
    // eg:
    // config.resolve.alias.set('@src', path.resolve(process.cwd(), 'src'));

    /**
     * 修复生产模式build出来的css background-image: url(~@)路径不符合预期的问题
     *  eg: alias to pages/index => ~@/pages/index
     */
    if (process.env.NODE_ENV === 'production') {
      styles.forEach((s) => {
        modules.forEach((m) =>
          config.module
            .rule(s)
            .oneOf(m)
            .use('extract-css-loader')
            .tap((options) => {
              // Set whatever you want as publicPath
              // options.publicPath = process.env.VUE_APP_CDN_PATH;
              Object.assign(options, {
                publicPath: './',
              });
              return options;
            }),
        );
      });
    }

    config.plugin('static-env-config').use(
      new StaticEnvConfigPlugin({
        url: './env.config.js',
        headResourceTags: [
          {
            tagName: 'link',
            attributes: {
              href: '/favicon.ico',
              rel: 'icon',
            },
          },
        ],
        config: {
          // 这三个必须配置，默认从.env文件中来
          ROUTER_PREFIX: process.env.VUE_APP_ROUTER_BASE,
          API_PREFIX: process.env.VUE_APP_API_BASE_URL,
          RESOURCE_PREFIX: process.env.VUE_APP_CDN_PATH,
          // 把config里面的配置注入到最终的env.config.js中
          ...STATIC_ENV_CONFIG,
        },
      }),
    );
  },

  configureWebpack: {
    // 以下规则用于微前端
    // 让主应用能正确识别微应用暴露出来的一些信息
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`,
    },
    plugins: [
      ...configureWebpackPlugin,
      // t-icon替换插件
      ...new TIconReplaceWebpackPlugin({
        staticPath: 'static_res',
      }),
    ],
  },

  /**
   * 本地开发服务配置
   */
  devServer: {
    port: devServerPort,
    host: '0.0.0.0',
    contentBase: './dist',
    publicPath: process.env.VUE_APP_ROUTER_BASE,
    https: process.env.VUE_APP_PROTOCOL_HTTPS === 'true',
    compress: false,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'X-Custom-Foo': 'bar',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    before(app) {
      if (process.env.VUE_APP_MOCK === 'true') {
        // 是否开启MOCK，默认开启，检查项目根目录下是否存在.env.development文件 内容为VUE_APP_MOCK=true
        // 设置mock数据路由, 创建get或者post目录，该目录下的文件则为url请求地址
        // app对象、请求方法、url前缀
        mock.setMock(app, 'get', process.env.VUE_APP_API_BASE_URL);
        // app对象、请求方法、url前缀 eg: user_bulk__delete.json => /api/user/bulk_delete
        mock.setMock(app, 'post', process.env.VUE_APP_API_BASE_URL);
        // mock.mockSubDirs(app, ['post'], '/abc') // 增加子目录，mock/xxx/post 目录下的文件为url请求地址  eg: user_bulk__delete.json => /xxx/abc/user/bulk_delete
      }
    },
    proxy: {
      '/app': {
        target: 'http://fujian.wintax.cn',
        changeOrigin: true,
      },
      '/xxmh': {
        target: 'https://etaxtest.guangdong.chinatax.gov.cn',
        changeOrigin: true,
      },
    },
  },
  /**
   * 插件配置
   */
  pluginOptions: {
    // 添加了插件(@samhammer/vue-cli-plugin-stylelint), 所以需要配置
    lintStyleOnBuild: true,
    stylelint: {
      fix: true, // boolean (default: true)
      files: ['src/**/*.{vue,htm,html,css,sss,less,scss}'], // string | [string]
    },
    // 注入less全局变量
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/styles/variables/*.less')],
    },
  },
  /**
   * 多页应用配置
   */
  pages: multiPage,
};
