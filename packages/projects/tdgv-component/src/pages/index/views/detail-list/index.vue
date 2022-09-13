<route-meta>
{
  "title": "详情列表",
  "isShowSideBar": false
}
</route-meta>
<template>
  <div>
    <div class="g-main-header">
      <div class="inner">
        <div class="top-bar">
          <span class="l">
            <span class="back" @click="$router.go(-1)"
              ><t-icon name="arrow-left" /><span class="title">详情列表</span></span
            >

            <t-breadcrumb>
              <t-breadcrumbItem href="">上一级</t-breadcrumbItem>
              <t-breadcrumbItem disabled>本级</t-breadcrumbItem>
            </t-breadcrumb>

            <t-divider theme="vertical" />

            <span class="desc">描述文案等信息，可为空。</span>
          </span>
        </div>

        <t-row>
          <t-col :span="4"> <label class="label">标题：</label><span class="content">描述内容描述内容</span> </t-col>
          <t-col :span="4"> <label class="label">标题：</label><span class="content">描述内容描述内容</span> </t-col>
          <t-col :span="4"> <label class="label">标题：</label><span class="content">描述内容描述内容</span> </t-col>
        </t-row>
        <t-row>
          <t-col :span="4"> <label class="label">标题：</label><span class="content">描述内容描述内容</span> </t-col>
          <t-col :span="8">
            <label class="label">标题：</label
            ><span class="content">描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容</span>
          </t-col>
        </t-row>
      </div>
    </div>

    <div class="page-content">
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
          <t-popup overlayClassName="actions-popup" placement="bottom" showArrow>
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
        <template #status="{ row }">
          <t-tag theme="success" variant="light" v-if="row.status === 0">标签一</t-tag>
          <t-tag theme="danger" variant="light" v-if="row.status === 1">标签二</t-tag>
        </template>

        <template #op="slotProps">
          <div class="table-actions">
            <a class="link" @click="edit(slotProps)" style="margin-left: 0">编辑</a>
            <!-- <a class="link" @click="delConfirm(slotProps)">确认删除</a> -->
            <t-popconfirm
              theme="danger"
              content="确认删除？"
              :confirmBtn="{ content: '删除', theme: 'danger' }"
              @confirm="del(slotProps)"
            >
              <a class="link">删除</a>
            </t-popconfirm>
          </div>
        </template>
      </t-table>
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
            name: '张三',
            age: 88,
            address: '广东省广州市白云区黄埔大道208号',
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
@container-width: 1184px;

.g-main-header {
  padding: 14px 24px;

  .inner {
    width: @container-width;
    margin: 0 auto;
  }

  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .l {
    display: flex;
    align-items: center;
  }

  .back {
    display: flex;
    align-items: center;
    cursor: pointer;

    .title {
      margin: 0 24px 0 12px;
    }
  }

  .t-breadcrumb,
  .desc {
    font-size: 12px;
    font-weight: normal;
    color: #999;
  }

  .t-breadcrumb__item {
    color: #999;

    &:last-child {
      color: #62667a;
    }
  }

  .r {
    .t-button + .t-button {
      margin-left: 8px;
    }
  }

  .t-row {
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;

    + .t-row {
      margin-top: 12px;
    }
  }

  .label {
    color: #62667a;
  }
}

.page-content {
  width: @container-width;
  padding: 24px 24px 0;
  margin: 24px auto;
  background: #fff;
  border-radius: 2px;

  .search-box {
    display: flex;
    margin-bottom: 16px;
    justify-content: space-between;
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
    /* stylelint-disable no-descending-specificity */
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
}
</style>
