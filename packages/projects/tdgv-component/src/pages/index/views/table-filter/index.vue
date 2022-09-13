<template>
  <div>
    <div class="g-main-header">快捷筛选表格</div>
    <div class="page-content">
      <section class="search-box">
        <div class="head">
          <span class="title">快捷筛选</span>
          <t-button theme="primary" variant="text" @click="reset"><t-icon name="refresh" />重置</t-button>
        </div>

        <t-input style="width: 240px" v-model="filterText" @input="search" placeholder="请入输督办内容"
          ><t-icon slot="suffix-icon" name="search" @click="search"
        /></t-input>
      </section>

      <section class="filter-box">
        <filter-tags label="产业标签" :data="tags" :checked="tagChecked" @change="filterChange"></filter-tags>
        <filter-tags label="行业标签" :data="tags" :checked="tagChecked" @change="filterChange"></filter-tags>
        <filter-tags label="发布年份" :data="tags" :checked="tagChecked" @change="filterChange"></filter-tags>
        <filter-tags label="区划/部门">
          <div class="search-form">
            <t-select
              clearable
              class="item"
              v-model="formData.field1"
              :options="selectOptions"
              @change="search"
              placeholder="请选择"
              style="width: 200px"
            ></t-select>
            <t-select
              clearable
              class="item"
              v-model="formData.field2"
              :options="selectOptions"
              @change="search"
              placeholder="请选择"
              style="width: 200px"
            ></t-select>
          </div>
        </filter-tags>
      </section>

      <section class="table-title">
        <span class="label"
          >已选择<em class="count">{{ selectedRowKeys.length }}</em
          >项</span
        >
        <template v-if="selectedRowKeys && selectedRowKeys.length">
          <t-button size="small" variant="text" @click="cancelSelected">取消选择</t-button>
          <t-button size="small" variant="outline" @click="setRead">对比选中</t-button>
        </template>
      </section>

      <t-table
        :data="listData"
        :columns="columns"
        rowKey="id"
        :hover="true"
        :pagination="pagination"
        @change="pageChange"
        :selected-row-keys="selectedRowKeys"
        @select-change="selectChange"
      >
        <template #status="{ row }">
          <t-tag theme="success" variant="light" v-if="row.status === 0">启用中</t-tag>
          <t-tag theme="default" variant="plain" v-if="row.status === 1">已停用</t-tag>
        </template>

        <template #op="slotProps">
          <div class="table-actions">
            <a class="link" @click="view(slotProps)" style="margin-left: 0">查看</a>
          </div>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script>
import { columns, selectOptions } from './config';
import FilterTags from './components/filter-tags';

export default {
  components: { FilterTags },
  data() {
    return {
      activeTab: '1',
      filterText: '',
      formData: {},
      loading: false,
      selectOptions,
      columns,
      listData: [],
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showJumper: true,
      },
      tags: [
        { label: '5G/移动通信', value: 1 },
        { label: '物联网', value: 2 },
        { label: '软件', value: 3 },
        { label: '电子信息', value: 4 },
        { label: '5G/移动通信', value: 1 },
        { label: '软件', value: 3 },
        { label: '电子信息', value: 4 },
        { label: '5G/移动通信', value: 1 },
        { label: '物联网', value: 2 },
        { label: '软件', value: 3 },
      ],
      tagChecked: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    changeTab(value) {
      this.activeTab = value;
      // TODO someting...
    },
    filterChange(e) {
      this.tagChecked = e;
      this.search();
    },
    reset() {
      this.tagChecked = [];
      this.formData = {};
      this.filterText = '';
      this.search();
    },
    search() {
      const { filterText, formData, tagChecked } = this;
      const params = {
        tagChecked,
        filterText,
        ...formData,
      };
      console.log(params);

      this.initData();
    },
    async initData() {
      try {
        const mockData = [];
        for (let i = 1; i <= 100; i++) {
          mockData.push({
            id: i,
            name: '【任务名称】哈哈睡觉哈时间快点哈理解谁我很温和hi 啊上帝啊是的',
            code: '127238473230948',
            tag: '金融业、制造业、餐饮业、娱乐业、制造业、餐饮业、娱乐业',
            status: i % 2,
          });
        }

        const res = await Promise.resolve(mockData);
        this.listData = res;
        this.pagination.total = res.length;
      } catch (e) {
        this.$message.error(e.message || `查询失败`);
      }
    },
    pageChange({ pagination }) {
      Object.assign(this.pagination, pagination);
      this.initData();
    },
    selectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      console.log(selectedRowKeys);
    },
    cancelSelected() {
      this.selectedRowKeys = [];
    },
    async setRead() {
      console.log(this.selectedRowKeys);
      try {
        await Promise.resolve(this.selectedRowKeys);
        this.$message.success(`操作成功`);
      } catch (e) {
        this.$message.error(e.message || `操作失败`);
      }
    },
    view({ row }) {
      this.$router.push({ path: `/table-base/${row.id}` });
    },
  },
};
</script>

<style lang="less" scoped>
.page-content {
  padding: 24px 24px 0;
  margin: 24px;
  background: #fff;
  border-radius: 2px;

  .search-box {
    display: flex;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(39, 40, 46, 0.08);
    justify-content: space-between;
    align-items: center;

    .head {
      display: flex;
      align-items: center;
    }

    .title {
      width: 96px;
      font-size: 20px;
      color: #27282e;
    }
  }

  .search-form {
    display: flex;
    margin: 10px 0;
    align-items: center;
    .item + .item {
      margin-left: 32px;
    }
  }

  .filter-box {
    padding: 16px 0;
  }

  .table-title {
    display: flex;
    min-height: 48px;
    padding: 12px 16px;
    background: #f7f8fa;
    align-items: center;

    .label {
      margin-right: 8px;
      color: #999;
    }

    .count {
      margin: 0 4px;
      font-style: normal;
      color: #3858e6;
    }

    .t-button + .t-button {
      margin-left: 8px;
    }
  }

  .table-actions {
    display: flex;
    .link {
      margin-left: 32px;
      color: #3858e6;
      cursor: pointer;
    }
  }
}
</style>
