function checkAuth() {
  return import(/* webpackChunkName: "check-auth" */ '../../views/check-auth/index.vue');
}
function testcheckAuth() {
  return import(/* webpackChunkName: "test-pages" */ '../../views/test-pages/test-check-auth/index.vue');
}
function qysdsyjdsba() {
  return import(/* webpackChunkName: "test-pages" */ '../../views/test-pages/qysdsyjdsba/index.vue');
}
function yjnssbba() {
  return import(/* webpackChunkName: "test-pages" */ '../../views/test-pages/qysdsyjdsba/yjnssbba/index.vue');
}
function zcjszjtxyhmxb() {
  return import(/* webpackChunkName: "test-pages" */ '../../views/test-pages/qysdsyjdsba/zcjszjtxyhmxb/index.vue');
}
const checkAuthChildren = [
  {
    name: 'test-check-auth',
    path: 'test-check-auth',
    component: testcheckAuth,
  },
];
const qysdsyjdsbaChildren = [
  {
    name: 'yjnssbba',
    path: 'yjnssbba',
    component: yjnssbba,
    meta: {
      title: '预缴纳税申报表（A类）',
    },
  },
  {
    name: 'zcjszjtxyhmxb',
    path: 'zcjszjtxyhmxb',
    component: zcjszjtxyhmxb,
    meta: {
      title: '资产加速折旧、摊销（扣除）优惠明细表',
    },
  },
];

export default [
  {
    name: 'check-auth',
    path: '/check-auth-layout',
    component: checkAuth,
    children: checkAuthChildren,
  },
  {
    name: 'check-auth',
    path: '/check-auth',
    component: checkAuth,
    children: checkAuthChildren,
  },
  {
    name: 'qysdsyjdsba',
    path: '/qysdsyjdsba',
    component: qysdsyjdsba,
    children: qysdsyjdsbaChildren,
    meta: {
      title: '企业所得税月季度申报A类',
    },
  },
];
