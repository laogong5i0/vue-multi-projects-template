<template>
  <div>
    <check-auth v-if="isGLayout">
      <g-layout>
        <!-- <template slot="header">自定义顶栏(headLogo、headOptions插槽将失效)</template> -->
        <a :href="publicPath" class="g-logo" slot="headLogo"
          ><div class="g-logo__img" :style="`background-image:url('${publicPath}/static_res/images/logo.svg');`">
            腾讯城市技术平台
          </div>
        </a>
        <span slot="headOptions">
          <t-icon name="notification-filled" />
          <t-icon name="home" />
        </span>

        <!-- <template slot="sidebar">自定义侧栏(sidebarTop插槽将失效)</template> -->
        <template slot="sidebarTop">
          <div class="sidebar-top-slot">侧边栏顶部插槽示例</div>
        </template>

        <!-- <div slot="contentHeader" class="g-main-header">内容标题</div> -->

        <div v-if="isOpenBreadCrumbLayout">
          <div class="content-header">
            <t-breadcrumb maxItemWidth="200" v-if="breadCrumbs && breadCrumbs.length">
              <t-breadcrumbItem v-for="(name, index) in breadCrumbs" :key="index">
                {{ name }}
              </t-breadcrumbItem>
            </t-breadcrumb>
          </div>

          <g-tab-route :isOpen="true" class="g-tab-route" :isCacheMode="true" :maxTabCount="20">
            <div class="tab-route-class">
              <router-view :isCacheMode="true" :maxTabCount="20" />
            </div>
          </g-tab-route>
        </div>

        <div v-else>
          <g-tab-route :isOpen="isOpenTabRoute" :isCacheMode="true" :maxTabCount="20" />
        </div>
      </g-layout>
    </check-auth>
    <check-auth v-else>
      <router-view />
    </check-auth>
  </div>
</template>

<script>
import { GLayout } from '@wecity/tdesign-gov-vue';
import CheckAuth from './components/check-auth/index';

export default {
  components: {
    GLayout,
    CheckAuth,
  },
  data() {
    return {
      publicPath: window.STATIC_ENV_CONFIG.RESOURCE_PREFIX,
    };
  },
  computed: {
    isGLayout() {
      let isGlayout = true;
      if (window.location.href.includes('/check-auth')) {
        if (!window.location.href.includes('/check-auth-layout/')) {
          isGlayout = false;
        }
      }
      return isGlayout;
    },
    isOpenTabRoute() {
      return this.$store.state.index.isOpenTabRoute;
    },
    isOpenBreadCrumbLayout() {
      return this.$store.state.index.isOpenBreadCrumbLayout;
    },
    meta() {
      return this.$route.meta || {};
    },
    breadCrumbs() {
      return this.meta.breadCrumbs || [this.meta.title];
    },
  },
  watch: {
    $route: 'changeRoute',
  },
  mounted() {
    // this.$store.commit(`global/${this.$storeGlobalTypes.SET_SIDEBAR_EXPANDED}`, ['详情页']);
    this.setTopbarActive();

    // 配置sidebar层级最多两层
    this.$store.commit(`global/${this.$storeGlobalTypes.SET_SIDEBAR_EXPAND_LEVEL}`, 2);
  },
  methods: {
    changeRoute(route) {
      const isShowSideBar = typeof route.meta.isShowSideBar === 'undefined' ? true : route.meta.isShowSideBar;
      this.$store.commit(`global/${this.$storeGlobalTypes.SET_SIDEBAR_STATUS}`, isShowSideBar);
      this.setTopbarActive();
    },
    setTopbarActive() {
      this.$store.commit(
        `global/${this.$storeGlobalTypes.SET_TOPBAR_ACTIVE_KEY}`,
        this.$route.meta.topbarKey || this.$route.path,
      );
    },
  },
};
</script>

<style lang="less" src="./styles/index.less"></style>
<style lang="less" src="./styles/demo.less"></style>
<style lang="less" src="../../styles/index.less"></style>

<style lang="less" scoped>
.content-header {
  height: 40px;
  padding: 0 24px;
  background: #fff;

  .t-breadcrumb {
    float: left;
    padding-top: 10px;
  }
}

.g-tab-route {
  /deep/.tab-route-class {
    margin: 24px;
    background-color: #fff;
    border-radius: 0 0 2px 2px;
  }
}
</style>
