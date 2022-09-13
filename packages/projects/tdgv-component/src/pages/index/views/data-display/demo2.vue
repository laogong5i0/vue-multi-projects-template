<template>
  <div>
    <t-divider>demo2：二列辅助数据内容</t-divider>
    <data-display :data="data" />
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
          content: '3,000',
          contentColor: '#fc5541',
          operation: {
            text: '去调增',
            onClick: this.clickfn,
          },
          subContent: ['月可用总额度： 2,000,000元'],
        },
        {
          title: '当前可用纸票数量（张）',
          explain: '当前可用纸票数量（张）说明',
          content: '56',
          subContent: ['当月最高持票： 200张', '当月剩余可领用纸票：160张'],
        },
        {
          title: '蓝票开具金额（元）',
          content: '2,097,000',
          subContent: ['发票税额： 62,910元', '发票数量：3,800张'],
        },
        {
          title: '红票开具金额（元）',
          content: '100,000',
          subContent: ['发票税额： 3,000元', '发票数量：560张'],
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
