<template>
  <div>
    <div class="g-main-header">g-tab-route组件</div>
    <div class="page-content">
      <div class="block">
        <h4>介绍</h4>
        <p>
          g-tab-route
          页签组件，用于记录路由切换，默认最多可打开20个选项卡，可灵活配置个数，默认开启页面缓存功能，可自行关闭；<br />
        </p>
      </div>

      <div class="block">
        <h4>示例</h4>
        <p>注意观察顶部菜单下，tab选项卡变化</p>
        <t-switch
          size="large"
          :value="isOpenTabRoute"
          :label="['关闭页签', '开启页签']"
          @change="handleChange"
        ></t-switch>
      </div>

      <div class="block">
        <h4>Props</h4>
        <p>
          <t-table :data="listData" :columns="columns" rowKey="name" />
        </p>
      </div>

      <div class="block">
        <h4>Slot</h4>
        <p>默认为route-view, 如果需要自定义route-view外层的样式，可自定义slot配置，可参考app.vue</p>
      </div>

      <div class="block">
        <h4>使用组件</h4>
        <div class="block-content">
          1. 第一步：引入组件 <br /><br />
          <div class="block-sep">
            components: { GTabRoute, }, <br />
            替换app.vue中 router-view 组件为 GTabRoute 组件 <br /><br />
          </div>

          2. 第二步：配置routes路由表信息<br /><br />
          <div class="block-sep">
            添加meta对象，设置title属性；<br />
            GTabRoute组件默认读取title属性作为页签名，如未配置title则以path属性为页签默认名称<br />
            <pre>{{ JSON.stringify(this.config, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardList',
  data() {
    return {
      switchConfig: {
        checked: true,
      },
      config: {
        name: 'tab-route',
        path: '/tab-route',
        meta: {
          title: '页签组件模板',
        },
      },
      listData: [
        {
          name: 'isOpen',
          type: 'Boolean',
          defaultValue: 'true',
          required: 'false',
          desc: '是否开启页签功能',
        },
        {
          name: 'isCacheMode',
          type: 'Boolean',
          defaultValue: 'true',
          required: 'false',
          desc: '是否开启页签缓存',
        },
        {
          name: 'maxTabCount',
          type: 'Number',
          defaultValue: '20',
          required: 'false',
          desc: '可开启页签的最大值',
        },
      ],
      columns: [
        {
          width: '100',
          colKey: 'name',
          title: '名称',
        },
        {
          width: '100',
          colKey: 'type',
          title: '类型',
        },
        {
          width: '100',
          colKey: 'defaultValue',
          title: '默认值',
        },
        {
          width: '100',
          colKey: 'required',
          title: '必传',
        },
        {
          width: '300',
          colKey: 'desc',
          title: '简介',
        },
      ],
    };
  },
  computed: {
    isOpenTabRoute() {
      return this.$store.state.index.isOpenTabRoute;
    },
  },
  methods: {
    handleChange(value) {
      this.$store.commit('SET_OPEN_BREADCRUMB_LAYOUT', false);
      this.$store.commit('SET_OPEN_TABROUTE', !!value);
    },
  },
};
</script>

<style lang="less" scoped>
.page-content {
  padding: 24px;
  margin: 24px;
  background: #fff;
  border-radius: 2px;
  .block + .block {
    margin-top: 36px;
  }

  p,
  .block-content {
    margin: 16px 0;
    font-size: 14px;
    line-height: 21px;
  }

  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  .block-sep {
    margin-left: 15px;
    font-size: 14px;
    line-height: 25px;
  }
}
</style>
