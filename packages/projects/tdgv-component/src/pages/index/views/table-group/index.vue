<template>
  <div>
    <div class="g-main-header">数据分组表格</div>
    <div class="page-content">
      <section class="search-box">
        <t-tabs theme="card" v-model="activeTab" @change="changeTab">
          <t-tab-panel value="1" label="督办我的"></t-tab-panel>
          <t-tab-panel value="2" label="我的督办"></t-tab-panel>
        </t-tabs>

        <t-input style="width: 240px" v-model="filterText" @input="search" placeholder="请入输督办内容"
          ><t-icon slot="suffix-icon" name="search" @click="search"
        /></t-input>
      </section>

      <section class="table-title">
        <span class="label"
          >已选择<em class="count">{{ selectedRowKeys.length }}</em
          >项</span
        >
        <template v-if="selectedRowKeys && selectedRowKeys.length">
          <t-button size="small" variant="text" @click="cancelSelected">取消选择</t-button>
          <t-button size="small" variant="outline" @click="setRead">标记为已读</t-button>
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
          <t-tag theme="success" variant="light" v-if="row.status === 0">任务</t-tag>
          <t-tag theme="danger" variant="light" v-if="row.status === 1">项目</t-tag>
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
import { columns } from './config';

export default {
  data() {
    return {
      activeTab: '1',
      filterText: '',
      loading: false,
      columns,
      listData: [],
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showJumper: true,
      },
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
    search() {
      this.initData();
    },
    async initData() {
      try {
        const mockData = [];
        for (let i = 1; i <= 100; i++) {
          mockData.push({
            id: i,
            name: '【任务名称】哈哈睡觉哈时间快点哈理解谁我很温和hi 啊上帝啊是的',
            date: '2020/08/08  18:00:00',
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
      console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    cancelSelected() {
      this.selectedRowKeys = [];
    },
    async setRead() {
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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
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
