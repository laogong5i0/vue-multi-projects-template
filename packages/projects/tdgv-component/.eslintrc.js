const eslintConfig = require('@wecity/tdesign-gov-vue/.eslintrc.js');

// 解决本地开发可能遇到的报错【Please verify that the package.json has a valid "main" entry】
// if (process.env.NODE_ENV === 'development') {
//   eslintConfig.settings['import/resolver'].alias.map.push([
//     '@wecity/tdesign-gov-vue',
//     '@wecity/tdesign-gov-vue/es/index.js',
//   ]);
// }

module.exports = eslintConfig;
