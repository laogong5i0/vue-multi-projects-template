<template>
  <t-drawer header="高级搜索" placement="right" size="448px" :visible="visible" :closeBtn="true" @close="close">
    <div class="drawer-form">
      <t-form :data="formData" ref="form" :label-width="60" label-align="top">
        <t-form-item label="姓名" name="field6">
          <t-input v-model="formData.field6" placeholder="输入" style="width: 240px"></t-input>
        </t-form-item>

        <t-form-item label="状态" name="field1">
          <t-select
            clearable
            v-model="formData.field1"
            :options="selectOptions"
            placeholder="请选择"
            style="width: 240px"
          ></t-select>
        </t-form-item>

        <t-form-item label="年龄" name="field3">
          <t-input v-model="formData.field3" placeholder="输入" style="width: 88px"></t-input>
        </t-form-item>

        <t-form-item label="婚姻状况" name="field2">
          <t-select
            clearable
            v-model="formData.field2"
            :options="selectOptions"
            placeholder="请选择"
            style="width: 240px"
          ></t-select>
        </t-form-item>

        <t-form-item label="性别" name="field4">
          <t-radio-group v-model="formData.field4">
            <t-radio value="1">男</t-radio>
            <t-radio value="2">女</t-radio>
          </t-radio-group>
        </t-form-item>

        <t-form-item label="学历" name="field5">
          <t-checkbox-group v-model="checked" :options="checkOptions"></t-checkbox-group>
        </t-form-item>
      </t-form>
    </div>

    <template #footer>
      <div class="drawer-actions">
        <t-button variant="outline" @click="reset">重置</t-button>
        <div class="r">
          <t-button variant="outline" @click="close">关闭</t-button>
          <t-button :loading="loading" @click="submit">查询</t-button>
        </div>
      </div>
    </template>
  </t-drawer>
</template>

<script>
import { selectOptions } from '../config';

export default {
  name: 'AdvancedSearch',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    value(v) {
      this.visible = v;
    },
    visible(v) {
      this.$emit('input', v);
    },
  },
  data() {
    return {
      visible: false,
      formData: this.data,
      selectOptions,
      checkOptions: [
        {
          label: '中学',
          value: 1,
        },
        {
          label: '本科',
          value: 2,
        },
        {
          label: '研究生',
          value: 3,
        },
        {
          label: '博士',
          value: 4,
        },
      ],
      loading: false,
      checked: [],
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.loading = false;
    },
    reset() {
      // this.$refs.form.reset();
      this.formData = {};
      this.checked = [];
    },
    submit() {
      this.loading = true;
      const params = {
        checkboxField: this.checked,
        ...this.formData,
      };

      this.$emit('submit', params);
      this.close();
    },
  },
};
</script>

<style lang="less" scoped>
.t-drawer {
  /deep/ .t-drawer__body {
    padding: 20px 24px 24px 40px;
  }
}
.drawer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
