<template>
  <section class="data-header">
    <ul class="list">
      <li class="item" v-for="v in data" :key="v.id">
        <div class="head">{{ v.title }}</div>
        <div class="content">
          <span class="count">{{ v.count }}</span>
        </div>
        <div class="foot">
          <span class="label">同比上周</span>
          <span class="num" :class="{ up: v.status == 1, down: v.status == 0 }"
            >{{ v.num }}<t-icon name="arrow-up"
          /></span>
        </div>
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
        for (let i = 1; i <= 5; i++) {
          mockData.push({
            id: i,
            title: '标题内容',
            count: '1862,876.00',
            num: '1862,876.00',
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
    width: 284px;
    height: 139px;
    padding: 16px 24px;
    margin: 0 16px 16px 0;
    cursor: pointer;
    background: #fff;
    border-radius: 2px;

    &:last-child {
      margin-right: 0;
    }
  }

  .head {
    font-size: 14px;
    line-height: 22px;
    color: #62667a;
  }

  .content {
    padding: 8px 0;
    .count {
      font-size: 32px;
      color: #26282e;
    }
  }

  .foot {
    padding-top: 8px;
    line-height: 20px;
    border-top: 1px solid rgba(39, 40, 46, 0.08);

    .label {
      margin-right: 16px;
      font-size: 12px;
      color: #999;
    }

    .num {
      display: inline-flex;
      font-size: 12px;
      align-items: center;

      &.up {
        color: #32c275;
      }

      &.down {
        color: #ed5353;
      }
    }
  }
}
</style>
