function detailArticleIndex() {
  return import(/* webpackChunkName: "detail-article-index" */ '../views/detail-article/index.vue');
}
function filterWrapperIndex() {
  return import(/* webpackChunkName: "filter-wrapper-index" */ '../views/filter-wrapper/index.vue');
}
function tooltipLabel() {
  return import(/* webpackChunkName: "table-tree-detail" */ '../views/tooltip-label/index.vue');
}
function cardMenu() {
  return import(/* webpackChunkName: "table-tree-detail" */ '../views/card-menu/index.vue');
}
function dataDisplay() {
  return import(/* webpackChunkName: "data-display" */ '../views/data-display/index.vue');
}
function searchControlPanel() {
  return import(/* webpackChunkName: "data-display" */ '../views/search-control-panel/index.vue');
}
function tabRoute() {
  return import(/* webpackChunkName: "tab-route" */ '../views/tab-route/index.vue');
}

function componentsList() {
  return import(/* webpackChunkName: "components-list" */ '../views/components-list/index.vue');
}
function request() {
  return import(/* webpackChunkName: "request" */ '../views/request/index.vue');
}

function cardGroupIndex() {
  return import(/* webpackChunkName: "card-group-index" */ '../views/card-group/index.vue');
}
function cardImgIndex() {
  return import(/* webpackChunkName: "card-img-index" */ '../views/card-img/index.vue');
}
function cardListIndex() {
  return import(/* webpackChunkName: "card-list-index" */ '../views/card-list/index.vue');
}
function cardSmallIndex() {
  return import(/* webpackChunkName: "card-small-index" */ '../views/card-small/index.vue');
}
function componentsListIndex() {
  return import(/* webpackChunkName: "components-list-index" */ '../views/components-list/index.vue');
}
function detailDatalistIndex() {
  return import(/* webpackChunkName: "detail-datalist-index" */ '../views/detail-datalist/index.vue');
}
function detailFlowIndex() {
  return import(/* webpackChunkName: "detail-flow-index" */ '../views/detail-flow/index.vue');
}
function detailListIndex() {
  return import(/* webpackChunkName: "detail-list-index" */ '../views/detail-list/index.vue');
}
function requestIndex() {
  return import(/* webpackChunkName: "request-index" */ '../views/request/index.vue');
}
function tableBaseIndex() {
  return import(/* webpackChunkName: "table-base-index" */ '../views/table-base/index.vue');
}
function tableFilterIndex() {
  return import(/* webpackChunkName: "table-filter-index" */ '../views/table-filter/index.vue');
}
function tableFlagIndex() {
  return import(/* webpackChunkName: "table-flag-index" */ '../views/table-flag/index.vue');
}
function tableGroupIndex() {
  return import(/* webpackChunkName: "table-group-index" */ '../views/table-group/index.vue');
}
function tableHeaderIndex() {
  return import(/* webpackChunkName: "table-header-index" */ '../views/table-header/index.vue');
}
function tableSelectedIndex() {
  return import(/* webpackChunkName: "table-selected-index" */ '../views/table-selected/index.vue');
}
function tableTabIndex() {
  return import(/* webpackChunkName: "table-tab-index" */ '../views/table-tab/index.vue');
}
function tableTreeIndex() {
  return import(/* webpackChunkName: "table-tree-index" */ '../views/table-tree/index.vue');
}
function tableBaseDetail() {
  return import(/* webpackChunkName: "table-base-detail" */ '../views/table-base/_detail.vue');
}
function tableFilterDetail() {
  return import(/* webpackChunkName: "table-filter-detail" */ '../views/table-filter/_detail.vue');
}
function tableFlagDetail() {
  return import(/* webpackChunkName: "table-flag-detail" */ '../views/table-flag/_detail.vue');
}
function tableGroupDetail() {
  return import(/* webpackChunkName: "table-group-detail" */ '../views/table-group/_detail.vue');
}
function tableHeaderDetail() {
  return import(/* webpackChunkName: "table-header-detail" */ '../views/table-header/_detail.vue');
}
function tableSelectedDetail() {
  return import(/* webpackChunkName: "table-selected-detail" */ '../views/table-selected/_detail.vue');
}
function tableTabDetail() {
  return import(/* webpackChunkName: "table-tab-detail" */ '../views/table-tab/_detail.vue');
}
function tableTreeDetail() {
  return import(/* webpackChunkName: "table-tree-detail" */ '../views/table-tree/_detail.vue');
}
function freeForm() {
  return import(/* webpackChunkName: "free-form" */ '../views/free-form/index.vue');
}
function iframeView() {
  return import(/* webpackChunkName: "iframe-view" */ '../views/iframe-view/index.vue');
}
function crazyForm() {
  return import(/* webpackChunkName: "iframe-view" */ '../views/crazy-form-demo/index.vue');
}

export default [
  {
    name: 'free-form',
    path: '/free-form',
    component: freeForm,
    meta: {
      title: '自由表单',
      isShowSideBar: true,
      breadCrumbs: ['自由表单', '自由表单'],
    },
  },
  {
    name: 'iframe-view',
    path: '/iframe-view',
    component: iframeView,
    meta: {
      title: 'iframe表单容器',
      isShowSideBar: true,
      breadCrumbs: ['iframe表单', 'iframe views'],
    },
  },
  {
    name: 'crazy-form',
    path: '/crazy-form',
    component: crazyForm,
    meta: {
      title: '疯狂表单组件示例',
      isShowSideBar: true,
      breadCrumbs: ['疯狂表单组件示例', '疯狂表单组件示例'],
    },
  },
  {
    name: 'detail-article',
    path: '/detail-article',
    component: detailArticleIndex,
    meta: {
      title: '文章详情',
      isShowSideBar: false,
      breadCrumbs: ['详情页', '文章详情'],
    },
  },
  {
    name: 'filter-wrapper',
    path: '/filter-wrapper',
    component: filterWrapperIndex,
    meta: {
      title: '筛选条件布局',
      breadCrumbs: ['行业业务模版', '筛选条件布局'],
    },
  },
  {
    name: 'tooltip-label',
    path: '/tooltip-label',
    component: tooltipLabel,
  },
  {
    name: 'card-menu',
    path: '/card-menu',
    component: cardMenu,
    meta: {
      title: 'card-menu',
      breadCrumbs: ['行业业务组件', 'card-menu'],
    },
  },
  {
    name: 'data-display',
    path: '/data-display',
    component: dataDisplay,
    meta: {
      title: 'data-display',
      breadCrumbs: ['行业业务组件', 'data-display'],
    },
  },
  {
    name: 'search-control-panel',
    path: '/search-control-panel',
    component: searchControlPanel,
    meta: {
      title: 'search-control-panel',
      breadCrumbs: ['行业业务组件', 'search-control-panel'],
    },
  },
  {
    name: 'tab-route',
    path: '/tab-route',
    component: tabRoute,
    meta: {
      title: '页签组件模板',
      breadCrumbs: ['行业业务模版', '页签组件模板'],
    },
  },
  {
    name: 'components-list',
    path: '/components-list',
    component: componentsList,
    meta: {
      title: '组件列表',
      breadCrumbs: ['行业业务模版', '页签组件模板'],
    },
  },
  {
    name: 'request',
    path: '/request',
    component: request,
  },
  {
    name: 'card-group',
    path: '/card-group',
    component: cardGroupIndex,
  },
  {
    name: 'card-img',
    path: '/card-img',
    component: cardImgIndex,
  },
  {
    name: 'card-list',
    path: '/card-list',
    component: cardListIndex,
  },
  {
    name: 'card-small',
    path: '/card-small',
    component: cardSmallIndex,
  },
  {
    name: 'components-list',
    path: '/components-list',
    component: componentsListIndex,
  },
  {
    name: 'detail-article',
    path: '/detail-article',
    component: detailArticleIndex,
    meta: {
      title: '文章详情',
      isShowSideBar: false,
    },
  },
  {
    name: 'detail-datalist',
    path: '/detail-datalist',
    component: detailDatalistIndex,
    meta: {
      title: '数据列表详情',
      isShowSideBar: false,
    },
  },
  {
    name: 'detail-flow',
    path: '/detail-flow',
    component: detailFlowIndex,
    meta: {
      title: '业务配置',
      isShowSideBar: false,
    },
  },
  {
    name: 'detail-list',
    path: '/detail-list',
    component: detailListIndex,
    meta: {
      title: '详情列表',
      isShowSideBar: false,
    },
  },
  {
    name: 'request',
    path: '/request',
    component: requestIndex,
  },
  {
    name: 'table-base',
    path: '/table-base',
    component: tableBaseIndex,
  },
  {
    name: 'table-filter',
    path: '/table-filter',
    component: tableFilterIndex,
  },
  {
    name: 'table-flag',
    path: '/table-flag',
    component: tableFlagIndex,
  },
  {
    name: 'table-group',
    path: '/table-group',
    component: tableGroupIndex,
  },
  {
    name: 'table-header',
    path: '/table-header',
    component: tableHeaderIndex,
  },
  {
    name: 'table-selected',
    path: '/table-selected',
    component: tableSelectedIndex,
  },
  {
    name: 'table-tab',
    path: '/table-tab',
    component: tableTabIndex,
  },
  {
    name: 'table-tree',
    path: '/table-tree',
    component: tableTreeIndex,
  },
  {
    name: 'table-base-detail',
    path: '/table-base/:detail?',
    component: tableBaseDetail,
    meta: {
      title: '文章详情',
      isShowSideBar: false,
    },
  },
  {
    name: 'table-filter-detail',
    path: '/table-filter/:detail?',
    component: tableFilterDetail,
  },
  {
    name: 'table-flag-detail',
    path: '/table-flag/:detail?',
    component: tableFlagDetail,
  },
  {
    name: 'table-group-detail',
    path: '/table-group/:detail?',
    component: tableGroupDetail,
  },
  {
    name: 'table-header-detail',
    path: '/table-header/:detail?',
    component: tableHeaderDetail,
  },
  {
    name: 'table-selected-detail',
    path: '/table-selected/:detail?',
    component: tableSelectedDetail,
  },
  {
    name: 'table-tab-detail',
    path: '/table-tab/:detail?',
    component: tableTabDetail,
  },
  {
    name: 'table-tree-detail',
    path: '/table-tree/:detail?',
    component: tableTreeDetail,
  },
];
