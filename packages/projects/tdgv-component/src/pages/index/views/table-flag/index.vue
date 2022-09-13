<template>
  <div>
    <div class="g-main-header">数据标签表格</div>
    <div class="page-content">
      <t-tabs v-model="activeTab" @change="changeTab">
        <t-tab-panel value="1" label="选项1">
          <section class="search-box">
            <div class="search-form">
              <t-form
                :data="formData"
                ref="form"
                :label-width="60"
                @submit="search"
                scrollToFirstError="smooth"
                layout="inline"
              >
                <t-form-item label="选项一" name="field1">
                  <t-select
                    clearable
                    v-model="formData.field1"
                    :options="selectOptions"
                    placeholder="请选择"
                    style="width: 200px"
                  ></t-select>
                </t-form-item>

                <t-form-item label="选项二" name="field2">
                  <t-select
                    clearable
                    v-model="formData.field2"
                    :options="selectOptions"
                    placeholder="请选择"
                    style="width: 200px"
                  ></t-select>
                </t-form-item>

                <t-button theme="primary" variant="text" @click="showDrawer = true">高级搜索</t-button>
              </t-form>
            </div>

            <div class="search-actions">
              <t-popup placement="bottom" showArrow>
                <t-button variant="outline">更多操作<t-icon name="caret-down-small" /></t-button>
                <template slot="content">
                  <div class="more">
                    <div><t-button variant="text">操作1</t-button></div>
                    <div><t-button variant="text">操作2</t-button></div>
                    <div><t-button variant="text">操作3</t-button></div>
                  </div>
                </template>
              </t-popup>

              <t-button variant="outline">批量导入</t-button>
              <t-button><t-icon name="add" />创建人员</t-button>
            </div>
            <!-- 高级搜索 -->
            <advanced-search v-model="showDrawer" :data="formData" @submit="search"></advanced-search>
          </section>

          <t-table
            :data="listData"
            :columns="columns"
            rowKey="id"
            :hover="true"
            :pagination="pagination"
            @change="pageChange"
          >
            <template #code="{ row }">
              <sub class="code-col-badge status-0" v-if="row.status === 0"><span class="text">新</span></sub>
              <sub class="code-col-badge status-1" v-if="row.status === 1"><span class="text">督</span></sub>

              <t-tooltip content="状态点的说明">
                <span class="dot"></span>
              </t-tooltip>
              <span>{{ row.code }}</span>
            </template>

            <template #status="{ row }">
              <t-tag theme="success" variant="light" v-if="row.status === 0">标签一</t-tag>
              <t-tag theme="danger" variant="light" v-if="row.status === 1">标签二</t-tag>
            </template>

            <template #op="slotProps">
              <div class="table-actions">
                <a class="link" @click="edit(slotProps)" style="margin: 0 32px 0 0">查看</a>
                <t-popup placement="bottom" showArrow>
                  <t-icon name="more" />
                  <template slot="content">
                    <div class="more">
                      <div><t-button variant="text">操作1</t-button></div>
                      <div><t-button variant="text">操作2</t-button></div>
                      <div><t-button variant="text">操作3</t-button></div>
                    </div>
                  </template>
                </t-popup>
              </div>
            </template>
          </t-table>
        </t-tab-panel>
        <t-tab-panel value="2" label="选项2"> 选项2 </t-tab-panel>
        <t-tab-panel value="3" label="选项3"> 选项3 </t-tab-panel>
        <t-tab-panel value="4" label="选项4"> 选项4 </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>

<script>
import { columns, selectOptions } from './config';
import AdvancedSearch from './components/advanced-search';

export default {
  components: { AdvancedSearch },
  data() {
    return {
      activeTab: '1',
      showDrawer: false,
      loading: false,
      selectOptions,
      formData: {},
      columns,
      listData: [],
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
    search(e) {
      console.log(e);
      this.initData();
    },
    async initData() {
      try {
        const mockData = [];
        for (let i = 1; i <= 100; i++) {
          mockData.push({
            id: i,
            code: '7218912730128',
            name: '张三',
            age: 88,
            address: '广东省广州市白云区黄埔大道208号',
            status: i % 2,
          });
        }

        const res = await Promise.resolve(mockData);
        this.pagination.total = res.length;
        this.listData = res;
      } catch (e) {
        this.$message.error(e.message || `查询失败`);
      }
    },
    pageChange({ pagination }) {
      Object.assign(this.pagination, pagination);
      this.initData();
    },
    edit({ row }) {
      this.$router.push({ path: `/table-base/${row.id}` });
    },
    async del({ row }) {
      try {
        await Promise.resolve(row);
        this.$message.success(`操作成功`);
      } catch (e) {
        this.$message.error(e.message || `操作失败`);
      }
    },
    // async delConfirm({ row }) {
    //   try {
    //     const dialogVm = this.$dialog.confirm({
    //       theme: 'danger',
    //       header: '确认删除？',
    //       body: '用清晰直白的语言简要描述删除后果。',
    //       confirmBtn: '删除',
    //       cancelBtn: '取消',
    //       onConfirm: async () => {
    //         await Promise.resolve(row);
    //         dialogVm.hide();
    //         this.$message.success(`操作成功`);
    //       },
    //       onClose: () => {
    //         dialogVm.hide();
    //       },
    //     });
    //   } catch (e) {
    //     this.$message.error(e.message || `操作失败`);
    //   }
    // },
  },
};
</script>

<style lang="less" scoped>
.page-content {
  padding: 0 24px;
  margin: 24px;
  background: #fff;
  border-radius: 2px;
  /deep/ .t-tabs__content {
    margin-top: 24px;
  }

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
        margin-bottom: 0;
      }
    }
  }

  .search-actions {
    .t-button {
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

  .code-col-badge {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-right: 28px solid transparent;

    &.status-0 {
      border-top: 28px solid #18b274;
    }

    &.status-1 {
      border-top: 28px solid #ed5353;
    }

    .text {
      position: absolute;
      top: -30px;
      left: 2px;
      display: inline-block;
      font-size: 12px;
      color: #fff;
    }
  }

  .dot {
    position: relative;
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 12px;
    cursor: pointer;
    background: #ed5353;
    // border: 1px solid #fff;
    border-radius: 50%;

    &::after {
      position: absolute;
      top: -1px;
      left: -1px;
      width: 100%;
      height: 100%;
      border: 1px solid #3858e6;
      border-radius: 50%;
      content: '';
      animation: statusprocessing 1.2s ease-in-out infinite;
      animation: statusProcessing 1.2s ease-in-out infinite;
    }
  }

  @keyframes statusProcessing {
    0% {
      opacity: 0.5;
      transform: scale(0.8);
    }
    to {
      opacity: 0;
      transform: scale(2.4);
    }
  }
  @keyframes statusProcessing {
    0% {
      opacity: 0.5;
      transform: scale(0.8);
    }
    to {
      opacity: 0;
      transform: scale(2.4);
    }
  }
}
</style>
