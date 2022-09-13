<template>
  <div>
    <div class="g-main-header">g-data-display组件</div>
    <div class="page-content">
      <div class="block">
        <h4>介绍</h4>
        <p>数据展示组件，使用统一的样式展示数据。</p>
      </div>

      <div class="block">
        <h4>示例</h4>
        <demo1></demo1>
        <demo2></demo2>
        <demo3></demo3>
        <demo4></demo4>
        <demo5></demo5>
      </div>
      <div class="block">
        <h4>Props</h4>
        <p>
          <t-table :data="listData" :columns="columns" rowKey="name" />
        </p>
        <h4>data数组对象的结构</h4>
        <p>
          <t-table :data="listData2" :columns="columns" rowKey="name" />
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

export default {
  components: {
    demo1,
    demo2,
    demo3,
    demo4,
    demo5,
  },
  data() {
    return {
      listData: [
        {
          name: 'data',
          type: 'Array',
          defaultValue: '',
          required: 'false',
          desc: '卡片组内各卡片项数据，Objec结构如下',
        },
        {
          name: 'formater',
          type: 'Number',
          defaultValue: -1,
          required: 'false',
          desc: '数字格式化、小数点位数。如： 3,000.00',
        },
      ],
      listData2: [
        {
          name: 'title',
          type: 'String',
          defaultValue: '',
          required: 'true',
          desc: '标题',
        },
        {
          name: 'explain',
          type: 'String',
          defaultValue: '',
          required: 'false',
          desc: '标题说明，配置后会显示icon',
        },
        {
          name: 'content',
          type: 'String | Number',
          defaultValue: '',
          required: 'true',
          desc: '主要数据',
        },
        {
          name: 'contentColor',
          type: 'String',
          defaultValue: '',
          required: 'false',
          desc: '设置主要数据的颜色',
        },
        {
          name: 'operation',
          type: 'Object',
          defaultValue: '',
          required: 'false',
          desc: `主要数据右侧的操作按钮,示例：operation: {text: '去调增',onClick: this.clickfn }`,
        },
        {
          name: 'subContent',
          type: 'Array<string>',
          defaultValue: '',
          required: 'false',
          desc: `辅助数据内容,示例:subContent: ['当月最高持票： 200张', '当月剩余可领用纸票：160张']。请注意demo效果，当卡片缺少数据时，会自动添加“-”`,
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
