## g-filter-wrapper 组件

### 介绍

通用筛选条件布局组件，将传入的表单项使用栅格布局排列，展开和收起表单项时满足设计的排列要求。


### 设计稿

![filter-wrapper](https://tencentpartner-generic.pkg.coding.net/sample-center/images/web-filter-wrapper.png?version=latest)

### UI设计

一、labelWidth固定设置120px，内容超出时需要自行设置tooltip。
二、<g-filter-wrapper>默认每行展示4列
三、当包裹的form-item数量多于colNum设置的数字时，需要自行添加展开按钮，并向组件传入 expand 控制表单的展开与收起。
四、当包裹的form-item数量多于colNum设置的数字时，最后一个form-item中的按钮需要向右对齐。


### API 设计

| 名称     | 类型    | 默认值             | 说明                                                                                                      | 必传 |
| -------- | ------- | ------------------ | --------------------------------------------------------------------------------------------------------- | ---- |
| expand   | Boolean | false              | 控制包裹的内容是否展开                                                                                    | N    |
| colNum   | Number  | 4                  | 每一行展示的列数，只可传入 1, 2, 3, 4, 6, 12 这 6 个数字                                                  | N    |
| rowProps | Object  | {gutter: [16, 24]} | 与栅格组件中的 row props 参数一致，使用时请注意某些属性不支持 IE                                          | N    |


### 开发备注

- 通过 `this.$scopedSlots.default()` 获取用户放入插槽中的内容，使用`<t-col></t-col>`包裹用户放入的内容，
- 在内容超过一行但是没有占满所有行时，需要内部填充空白项。
- 用户传入 `expand` 控制组件的展开与收缩，传入`colNum`控制每一行展示的列数
- 用户可传入 `rowProps` 自己调整栅格间距、对齐方式等。
- 组件内的最外层div设置了样式，用户可以在使用时覆盖这个样式。

### 示例

```
<template>
  <div>
    <t-divider>demo1：2个筛选条件</t-divider>
    <t-form :data="formData" labelWidth="120px" @reset="onReset" @submit="onSubmit">
      <g-filter-wrapper>
        <t-form-item name="field1">
          <tooltip-label slot="label" label="一二三四五六七八九十"></tooltip-label>
          <t-input v-model="formData.field1"> </t-input>
        </t-form-item>
        <t-form-item label="字段2" name="field2">
          <t-input v-model="formData.field2"> </t-input>
        </t-form-item>
        <t-form-item class="filter-btns" labelWidth="0">
          <t-button theme="default" variant="base" type="reset">重置</t-button>
          <t-button theme="primary" type="submit">查询</t-button>
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
        field: '',
      },
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
```
