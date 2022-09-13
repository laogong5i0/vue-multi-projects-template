<template>
  <div class="card-list">
    <div class="g-main-header">
      <span class="title">页面标题</span>
      <span class="desc">描述文案等信息，可为空。</span>
    </div>

    <div class="page-content">
      <ul class="list">
        <li class="item" v-for="(item, idx) in list" :key="idx">
          <img :src="item.avatar" alt="" />
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.desc }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardList',
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const mockData = new Array(15);
        mockData.fill({
          avatar: 'https://tdesign.gtimg.com/list-icon.png',
          title: '卡片标题',
          desc: '卡片描述卡片描述卡片描述卡片描述述卡片描述',
        });

        this.list = await Promise.resolve(mockData);
      } catch (e) {
        this.$message.error(e.message || `初始化失败`);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.g-main-header {
  display: flex;
  align-items: center;

  .desc {
    margin-left: 24px;
    font-size: 12px;
    font-weight: normal;
    color: #999;
  }
}
.page-content {
  margin: 24px;
}

.list {
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
  flex-wrap: wrap;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 284px;
    height: 195px;
    padding: 24px 32px;
    margin: 0 16px 20px 0;
    cursor: pointer;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 4px 10px 0 rgba(17, 31, 138, 0.1);

    &:last-child {
      margin-right: 0;
    }

    > img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    .title {
      margin-top: 12px;
      font-size: 20px;
      line-height: 28px;
      color: #27282e;
    }

    .desc {
      margin-top: 8px;
      font-size: 14px;
      line-height: 22px;
      color: #999;
    }
  }
}
</style>
