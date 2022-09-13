<template>
  <div>
    <t-divider>demo2：3列</t-divider>
    <t-form :data="formData" labelWidth="120px" @reset="onReset" @submit="onSubmit">
      <g-filter-wrapper :expand="expand" :colNum="3">
        <t-form-item name="field1">
          <tooltip-label slot="label" label="一二三四五六七八九十"></tooltip-label>
          <t-input v-model="formData.field1"></t-input>
        </t-form-item>
        <t-form-item label="字段2" name="field2">
          <t-input v-model="formData.field2"></t-input>
        </t-form-item>
        <t-form-item label="字段3" name="field3">
          <t-input v-model="formData.field3"></t-input>
        </t-form-item>
        <t-form-item label="字段4" name="field4">
          <t-input v-model="formData.field4"></t-input>
        </t-form-item>
        <t-form-item class="filter-btns float-right" labelWidth="0">
          <t-button theme="default" variant="base" type="reset">重置</t-button>
          <t-button theme="primary" type="submit">查询</t-button>
          <t-button variant="text" @click="expand = !expand">
            <span>
              {{ expand ? '收起' : '展开' }}
              <t-icon :name="expand ? 'chevron-up' : 'chevron-down'" slot="icon" />
            </span>
          </t-button>
        </t-form-item>
      </g-filter-wrapper>
    </t-form>
  </div>
</template>
<script>
import TooltipLabel from './tooltip-label.vue';

export default {
  components: {
    TooltipLabel,
  },
  data() {
    return {
      formData: {
        field1: '',
        field2: '',
        field3: '',
        field4: '',
      },
      expand: false,
    };
  },
  methods: {
    onReset() {
      this.$message.success('重置成功');
    },
    onSubmit({ validateResult, firstError }) {
      if (validateResult === true) {
        this.$message.success('查询成功');
      } else {
        console.log('Errors: ', validateResult);
        this.$message.warning(firstError);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.float-right {
  float: right;
}
.filter-btns {
  button {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
