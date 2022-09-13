<template>
  <div>
    <t-divider>demo1：文字过长，修改主要数据颜色，添加按钮</t-divider>
    <data-display :data="data" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: this.fetchData(),
    };
  },
  mounted() {
    setTimeout(() => {
      this.data = this.fetchData({
        total: 100000000000000,
        subContent: [
          '很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多字',
          '很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多字',
        ],
      });
    }, 2000);
  },
  methods: {
    fetchData(data = {}) {
      return [
        {
          title: '当前可用额度（元）',
          explain: '当前可用额度（元）说明',
          content: '0',
          contentColor: '#fc5541',
          operation: {
            text: '去调增',
            onClick: this.clickfn,
          },
          subContent: [`月可用总额度： ${data.total || 0}元`],
        },
        {
          title: '很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多字',
          explain: '1',
          content: '56',
          subContent: data.subContent || [],
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
      ];
    },
    clickfn() {
      console.log('调用了clickfn方法！');
    },
  },
};
</script>
