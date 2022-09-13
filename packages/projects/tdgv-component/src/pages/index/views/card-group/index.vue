<template>
  <div class="card-list">
    <div class="g-main-header">
      <span class="title">页面标题</span>
      <span class="desc">描述文案等信息，可为空。</span>
    </div>

    <div class="page-content">
      <section class="search-box">
        <div class="search-actions">
          <t-button><t-icon name="add" />新建卡片</t-button>
          <t-button variant="outline">其他操作</t-button>
        </div>

        <div class="search-form">
          <t-form
            labelWidth="0"
            ref="form"
            :label-width="60"
            @submit="search"
            scrollToFirstError="smooth"
            layout="inline"
          >
            <t-form-item name="field1">
              <t-input v-model="input" placeholder="请输入" style="width: 208px">
                <t-icon name="search" slot="suffix-icon" @click="search" />
              </t-input>
            </t-form-item>
          </t-form>
        </div>
      </section>

      <section class="card-group">
        <div class="card-item" v-for="g in groups" :key="g.id">
          <div class="card-head" @click="toggle(g)">
            <t-icon name="caret-down-small" v-show="g.open" />
            <t-icon name="caret-right-small" v-show="!g.open" />
            <span class="title">标题（{{ g.open ? '展开' : '收起' }}）</span>
          </div>
          <ul class="list" v-show="g.open">
            <li class="item" v-for="(item, idx) in g.list" :key="idx">
              <img :src="item.avatar" alt="" />
              <div class="title">{{ item.title }}</div>
              <div class="desc">{{ item.desc }}</div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardList',
  data() {
    return {
      input: '',
      groups: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    toggle(group) {
      /* eslint no-param-reassign: ["error", { "props": false }] */
      group.open = !group.open;
    },
    search() {
      console.log(this.input);
    },
    async initData() {
      try {
        const groups = [];
        for (let i = 0; i < 2; i++) {
          const mockData = new Array(8);
          mockData.fill({
            avatar: 'https://tdesign.gtimg.com/list-icon.png',
            title: '卡片标题',
            desc: '卡片描述卡片描述卡片描述卡片描述述卡片描述',
          });

          groups.push({
            id: i,
            open: true,
            list: mockData,
          });
        }

        this.groups = await Promise.resolve(groups);
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

  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .search-form {
    /deep/ .t-form {
      display: flex;
      align-items: center;

      .t-form__label {
        padding-right: 12px;
      }
      .t-form__item {
        margin-right: 0;
        margin-bottom: 0;
      }
    }
  }

  .search-actions {
    .t-button {
      margin-right: 8px;
    }
  }
}

.card-group {
  .card-item {
    padding: 0 24px;
    margin-bottom: 16px;
    background: #fff;
    border-radius: 2px;
  }

  .card-head {
    padding: 16px 0;
    font-size: 16px;
    line-height: 24px;
    color: #27282e;
    cursor: pointer;

    .title {
      margin-left: 12px;
    }
  }
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
    width: 272px;
    height: 195px;
    padding: 24px;
    margin: 0 16px 16px 0;
    cursor: pointer;
    background: #fff;
    border: 1px solid rgba(39, 40, 46, 0.08);
    border-radius: 2px;

    &:hover {
      border: 1px solid transparent;
      box-shadow: 0 4px 10px 0 rgba(17, 31, 138, 0.1);
    }

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
