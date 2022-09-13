<template>
  <section class="data-header">
    <ul class="list">
      <li class="item" v-for="v in data" :key="v.id">
        <span class="left">
          <div class="head">
            <span class="title">{{ v.title }} </span><t-icon name="chevron-right" />
          </div>
          <div class="count">{{ v.count }}</div>
        </span>

        <img class="img-flag" src="https://tdesign.gtimg.com/list-icon.png" alt="" />
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'DataHeader',
  data() {
    return {
      data: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const mockData = [];
        for (let i = 1; i < 5; i++) {
          mockData.push({
            id: i,
            title: '新接收',
            count: '325',
            num: '325',
            status: i % 2,
          });
        }

        this.data = await Promise.resolve(mockData);
      } catch (e) {
        this.$message.error(e.message || `初始化失败`);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
  flex-wrap: wrap;
  .item {
    display: flex;
    width: 222px;
    height: 110px;
    padding: 24px;
    margin: 0 16px 16px 0;
    cursor: pointer;
    background: #f7f8fa;
    border-radius: 2px;
    align-items: center;

    &:last-child {
      margin-right: 0;
    }

    .left {
      flex: 1;
    }

    .head {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 22px;
      color: #62667a;

      .t-icon {
        margin-left: 8px;
      }
    }

    .count {
      padding: 8px 0;
      font-size: 36px;
      font-weight: bold;
      color: #27282e;
    }

    .img-flag {
      width: 44px;
      height: 44px;
      border-radius: 50%;
    }
  }
}
</style>
