<template>
  <div>
    <div class="g-main-header">g-filter-wrapper组件</div>
    <div class="page-content">
      <div class="block">
        <h4>介绍</h4>
        <p>通用筛选条件布局组件，将传入的表单项使用栅格布局排列，展开和收起表单项时满足设计的排列要求。</p>
      </div>
      <div class="block">
        <h4>UI与使用说明</h4>
        <p>一、labelWidth固定设置120px，内容超出时需要自行设置tooltip。</p>
        <p>二、&lt;g-filter-wrapper&gt;默认每行展示4列</p>
        <p>
          三、当包裹的form-item数量多于colNum设置的数字时，需要自行添加展开按钮，并向组件传入 expand
          控制表单的展开与收起。
        </p>
        <p>四、当包裹的form-item数量多于colNum设置的数字时，最后一个form-item中的按钮需要向右对齐。</p>
      </div>

      <div class="block">
        <h4>示例</h4>
        <demo1></demo1>
        <demo2></demo2>
        <demo3></demo3>
        <demo4></demo4>
        <demo5></demo5>
        <demo6></demo6>
      </div>

      <div class="block">
        <h4>Props</h4>
        <p>
          <t-table :data="listData" :columns="columns" rowKey="name" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import demo1 from './demo1.vue';
import demo2 from './demo2.vue';
import demo3 from './demo3.vue';
import demo4 from './demo4.vue';
import demo5 from './demo5.vue';
import demo6 from './demo6.vue';

export default {
  components: {
    demo1,
    demo2,
    demo3,
    demo4,
    demo5,
    demo6,
  },
  data() {
    return {
      listData: [
        {
          name: 'expand',
          type: 'Boolean',
          defaultValue: 'false',
          required: 'false',
          desc: '控制包裹的内容是否展开',
        },
        {
          name: 'colNum',
          type: 'Number',
          defaultValue: '4',
          required: 'false',
          desc: '每一行展示的列数，只可传入 1, 2, 3, 4, 6, 12 这 6 个数字中的一个',
        },
        {
          name: 'rowProps',
          type: 'Object',
          defaultValue: '{gutter: [16, 24]}',
          required: 'false',
          desc: '与栅格组件中的 row props 参数一致，使用时请注意某些属性不支持 IE',
        },
      ],
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
