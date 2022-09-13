export const topbarConfig = [
  {
    name: '首页',
    path: '/home',
    key: 'index', // 用于设置该导航高亮的key
  },
  {
    name: '无侧栏',
    path: '/detail-article', // 不设置key，则默认使用path/href
  },
  {
    key: 'qq',
    name: '顶级-外部链接',
    href: 'https://www.qq.com/', // 不设置key，则默认使用path/href
  },
  {
    // 有二级栏目的目录结构
    name: '顶部导航列表',
    key: 'list', // 用于设置该导航高亮的key
    children: [
      {
        key: 'mail',
        name: '外部链接',
        iconClassName: 'link',
        href: 'https://mail.qq.com/',
        target: '_blank',
      },
      {
        name: '配置变更',
        iconClassName: 'heart',
        path: '/',
      },
      {
        name: '扩容',
        iconClassName: 'add-circle',
        path: '/',
      },
      {
        name: 'Docker扩容',
        iconClassName: 'layers',
        path: '/',
      },
    ],
  },
];

export const sideBarConfig = [
  {
    name: '首页',
    imgUrl: require('@/pages/index/assets/menu-icon.svg'),
    path: '/home',
  },
  {
    name: '企业所得税月季度申报A类',
    iconClassName: 'view-module',
    children: [
      {
        name: '预缴纳税申报表（A类）',
        path: '/qysdsyjdsba/yjnssbba',
      },
      {
        name: '资产加速折旧、摊销（扣除）优惠明细表',
        path: '/qysdsyjdsba/zcjszjtxyhmxb',
      },
    ],
  },
  {
    name: '测试页面',
    iconClassName: 'view-module',
    children: [
      {
        name: 'CheckAuth',
        path: '/check-auth/test-check-auth',
      },
      {
        name: 'API接口调用',
        path: '/request',
      },
    ],
  },
  {
    name: 'FX组件库',
    iconClassName: 'view-module',
    children: [
      {
        name: 'Free Form',
        path: '/free-form',
      },
      {
        name: 'Iframe View',
        path: '/iframe-view',
      },
      {
        name: 'Crazy Form',
        path: '/crazy-form',
      },
    ],
  },
  {
    name: '行业业务组件',
    iconClassName: 'view-module',
    children: [
      // {
      //   name: 'tooltip-label',
      //   path: '/tooltip-label',
      // },
      {
        name: 'card-menu',
        path: '/card-menu',
      },
      {
        name: 'g-data-display',
        path: '/data-display',
      },
      {
        name: 'search-control-panel',
        path: '/search-control-panel',
      },
      {
        name: 'filter-wrapper',
        path: '/filter-wrapper',
      },
      {
        name: 'g-tab-route',
        path: '/tab-route',
      },
    ],
  },
  {
    name: '卡片列表',
    iconClassName: 'layers',
    children: [
      {
        name: '基础样式',
        path: '/test-check-auth',
      },
      {
        name: '折叠样式',
        path: '/card-group',
      },
      {
        name: '图片样式',
        path: '/card-img',
      },
      {
        name: '小卡片',
        path: '/card-small',
      },
    ],
  },
  {
    name: '表格页',
    iconClassName: 'root-list',
    children: [
      {
        name: '基础表格',
        path: '/table-base',
      },
      {
        name: '选项卡表格',
        path: '/table-tab',
      },
      {
        name: '数据展示',
        path: '/table-header',
      },
      {
        name: '树状菜单',
        path: '/table-tree',
      },
      {
        name: '多选表格',
        path: '/table-selected',
      },
      {
        name: '分组表格',
        path: '/table-group',
      },
      {
        name: '快捷筛选',
        path: '/table-filter',
      },
      {
        name: '数据标签',
        path: '/table-flag',
      },
    ],
  },
  {
    name: '详情页',
    iconClassName: 'edit',
    children: [
      {
        name: '文章样式',
        path: '/detail-article',
      },
      {
        name: '列表样式',
        path: '/detail-list',
      },
      {
        name: '流程表单',
        path: '/detail-flow',
      },
      {
        name: '数据列表',
        path: '/detail-datalist',
      },
    ],
  },
  {
    name: '业务组件',
    iconClassName: 'view-module',
    children: [
      {
        name: '选择器',
        path: '/components-list',
      },
    ],
  },
];
