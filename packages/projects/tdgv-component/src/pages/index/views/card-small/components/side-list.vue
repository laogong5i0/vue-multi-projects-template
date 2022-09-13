<template>
  <section class="side-list">
    <ul class="list-items">
      <li class="list-item" v-for="(item, idx) in listData" :key="idx">
        <div class="list-item__avatar">
          <img :src="item.avatar" alt="" />
        </div>
        <div class="list-item__content">
          <h3 class="list-item__title" :title="item.title">{{ item.title }}</h3>
          <p class="list-item__desc" :title="item.desc">{{ item.desc }}</p>
        </div>
        <span class="list-item__action">
          <t-icon name="more" />
        </span>
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  name: 'SideList',
  data() {
    return {
      listData: this.data || [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const mockData = new Array(30);
        mockData.fill({
          avatar: 'https://tdesign.gtimg.com/list-icon.png',
          title: '卡片标题',
          desc: '卡片描述卡片描述卡片描述卡片描述述卡片描述',
        });

        this.listData = await Promise.resolve(mockData);
      } catch (e) {
        this.$message.error(e.message || `查询失败`);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.side-list {
  display: flex;
  width: 100%;
  height: 100%;
  max-height: 728px;
  overflow-y: auto;
  background: #f7f8fa;
  flex-direction: column;
}

.list-items {
  padding: 0;
  margin: 0;
  list-style: none;
}

.list-item {
  position: relative;
  display: flex;
  width: 100%;
  height: 96px;
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 rgba(17, 31, 138, 0.1);
  align-items: center;
}

.list-item__avatar {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  flex-shrink: 0;
  > img {
    width: 100%;
    height: 100%;
    max-width: 100%;
  }
}

.list-item__content {
  flex: 1;
  overflow: hidden;
}

.list-item__title {
  margin: 0;
  overflow: hidden;
  font-size: 16px;
  line-height: 24px;
  color: #27282e;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item__desc {
  margin: 0;
  margin-top: 4px;
  overflow: hidden;
  font-size: 12px;
  line-height: 20px;
  color: #999;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item__action {
  position: absolute;
  top: 12px;
  right: 8px;
  padding: 0 1px;
  cursor: pointer;
}

.side-tree {
  display: flex;
  height: 100%;
  max-height: 705px;
  border-right: 1px solid rgba(39, 40, 46, 0.08);
  flex-direction: column;

  .head {
    display: flex;
    height: 60px;
    padding: 0 16px;
    border-bottom: 1px solid rgba(39, 40, 46, 0.08);
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 20px;
      color: #27282e;
    }
  }

  .filter-box {
    padding: 12px 16px;
  }
  .tree-box {
    padding: 0 16px;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
  }
}
</style>
