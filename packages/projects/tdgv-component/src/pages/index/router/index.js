import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import testRoutes from './testRoutes/index';

Vue.use(VueRouter);

const baseRoutes = [
  {
    path: '*',
    redirect: '/card-menu',
  },
];

const allRoutes = [...routes, ...baseRoutes, ...testRoutes];

const router = new VueRouter({
  mode: 'history',
  base: `${window.STATIC_ENV_CONFIG.ROUTER_PREFIX}/`,
  routes: allRoutes,
});

export default router;
