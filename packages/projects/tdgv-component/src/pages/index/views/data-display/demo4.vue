<template>
  <div>
    <t-divider>demo4：没有辅助数据内容</t-divider>
    <data-display :formater="2" :data="data" />
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
          content: 3000,
          contentColor: '#fc5541',
          operation: {
            text: '去调增',
            onClick: this.clickfn,
          },
        },
        {
          title: '当前可用纸票数量（张）',
          explain: '当前可用纸票数量（张）说明',
          content: '56',
        },
        {
          title: '蓝票开具金额（元）',
          content: '2097000',
        },
        {
          title: '红票开具金额（元）',
          content: '100,000',
        },
        {
          title: '当前可用额度（元）',
          explain: '当前可用额度（元）说明',
          content: '3,000',
          contentColor: '#fc5541',
          operation: {
            text: '去调增',
            onClick: this.clickfn,
          },
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
