<template>
  <div>
    <t-divider>demo3：一列辅助数据内容</t-divider>
    <t-row>
      <t-col :span="12">
        <data-display :data="data" />
      </t-col>
      <t-col :span="6"> </t-col>
    </t-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          title: '当前可用额度（元）',
          explain: '当前可用额度（元）说明',
          content: '3000',
          contentColor: '#fc5541',
          operation: {
            text: '去调增',
            onClick: this.clickfn,
          },
          subContent: ['月可用总额度： 2000000元'],
        },
        {
          title: '当前可用纸票数量（张）',
          explain: '当前可用纸票数量（张）说明',
          content: '56',
          subContent: ['当月最高持票： 200张'],
        },
        {
          title: '蓝票开具金额（元）',
          content: '2097000',
        },
        {
          title: '红票开具金额（元）',
          content: '100000',
          subContent: ['发票税额： 3000元'],
        },
        {
          title: '当前可用额度（元）',
          explain: '当前可用额度（元）说明',
          content: '3000',
          contentColor: '#fc5541',
          operation: {
            text: '去调增',
            onClick: this.clickfn,
          },
          subContent: ['月可用总额度： 2000000元'],
        },
      ],
    };
  },
  methods: {
    clickfn() {
      console.log('调用了clickfn方法！');
    },
  },
};
</script>
