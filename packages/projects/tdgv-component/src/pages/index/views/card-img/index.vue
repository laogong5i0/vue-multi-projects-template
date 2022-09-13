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
            :data="formData"
            @submit="search"
            scrollToFirstError="smooth"
            layout="inline"
          >
            <t-form-item name="field1">
              <t-input v-model="formData.field1" placeholder="请输入" style="width: 208px">
                <t-icon name="search" slot="suffix-icon" @click="search" />
              </t-input>
            </t-form-item>

            <t-form-item name="field2">
              <t-select
                clearable
                v-model="formData.field2"
                :options="selectOptions"
                placeholder="请选择类型"
                style="width: 208px"
                @change="search"
              ></t-select>
            </t-form-item>
          </t-form>
        </div>

        <t-tabs :value="tabValue" theme="card" size="medium" @change="(newValue) => (tabValue = newValue)">
          <t-tab-panel value="1" label="选项卡1"> </t-tab-panel>
          <t-tab-panel value="2" label="选项卡2"> </t-tab-panel>
          <t-tab-panel value="3" label="选项卡3"> </t-tab-panel>
        </t-tabs>
      </section>

      <ul class="list">
        <li class="item" v-for="(item, idx) in list" :key="idx">
          <a class="figure" href="javascript:void(0);">
            <img :src="item.avatar" alt="" />
          </a>
          <div class="figure-detail">
            <div class="title">{{ item.title }}</div>
            <div class="desc">{{ item.desc }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { selectOptions } from './config';

export default {
  name: 'CardList',
  data() {
    return {
      formData: {},
      selectOptions,
      tabValue: '1',
      list: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    search() {
      console.log(this.formData);
    },
    async initData() {
      try {
        const mockData = new Array(15);
        mockData.fill({
          avatar: 'https://tdesign.gtimg.com/site/source/figma-mobile.png',
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

  .search-box {
    display: flex;
    padding: 16px 24px;
    margin-bottom: 16px;
    background: #fff;
    border-radius: 2px;
    // justify-content: space-between;
    align-items: center;
  }

  .search-form {
    /deep/ .t-form {
      display: flex;
      align-items: center;

      .t-form__label {
        padding-right: 12px;
      }
      .t-form__item {
        margin-bottom: 0;
      }
    }
  }

  .search-actions {
    flex: 1;
    .t-button {
      margin-right: 8px;
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
    width: 284px;
    height: 210px;
    margin: 0 16px 20px 0;
    cursor: pointer;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 4px 10px 0 rgba(17, 31, 138, 0.1);

    &:last-child {
      margin-right: 0;
    }

    .figure {
      display: block;
      width: 100%;
      height: 130px;

      > img {
        display: block;
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 4px;
        object-fit: cover;
      }
    }

    .figure-detail {
      padding: 16px;

      .title {
        font-size: 16px;
        line-height: 24px;
        color: #27282e;
      }

      .desc {
        margin-top: 4px;
        overflow: hidden;
        font-size: 12px;
        line-height: 20px;
        color: #999;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
