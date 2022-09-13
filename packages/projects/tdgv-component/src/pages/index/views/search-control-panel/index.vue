<template>
  <div>
    <div class="g-main-header">search-control-panel组件</div>
    <div class="page-content">
      <div class="block">
        <h4>介绍</h4>
        <p>可配置的表单组件。</p>
      </div>

      <div class="block">
        <h4>示例</h4>
        <demo1></demo1>
        <demo2></demo2>
      </div>
      <div class="block"></div>
      <article class="markdown-body">
        <readme-optimized />
      </article>
    </div>
  </div>
</template>

<script>
import demo1 from './demo1.vue';
import demo2 from './demo2.vue';
import ReadmeOptimized from './readmeOptimized.md';

export default {
  components: {
    demo1,
    demo2,
    ReadmeOptimized,
  },
  data() {
    return {
      listData: [],
      listData2: [],
      columns: [
        {
          width: '150',
          colKey: 'name',
          title: '名称',
        },
        {
          width: '150',
          colKey: 'type',
          title: '类型',
        },
        {
          width: '200',
          colKey: 'defaultValue',
          title: '默认值',
        },
        {
          colKey: 'desc',
          title: '说明',
        },
        {
          width: '100',
          colKey: 'required',
          title: '必传',
        },
      ],
    };
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

  p {
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
}
</style>
