## search-control-panel 组件

### 介绍

可配置的表单组件
使用filter-wrapper组件的布局

### 设计

![search-control-panel](https://tencentpartner-generic.pkg.coding.net/sample-center/images/web-search-control-panel.png?version=latest)
### 注

> 优化版的 config 支持 Object Array 两种配置结构 ，加入 Object 配置结构的好处是，更新某一项属性 value 时可通过对象打点调用赋值的方式直接更新获取，如下面 `针对 select 异步加载 selectList 示例`

### props

| 参数          | 说明                                        | 类型            | 可选值            | 默认值 |
| ------------- | ------------------------------------------- | --------------- | ----------------- | ------ |
| config        | 控件配置，options 详见下面 `config Options` | [Object, Array] | -                 | -      |
| colNum        | 每一行展示的列数                            | Number          | 1, 2, 3, 4, 6, 12 | 4      |
| defaultExpand | 查询面板默认是否展开                        | Boolean         | true false        | false  |

### config Options

| 属性                 | 说明                     | 类型   | 可选值                                                        | 默认值  |
| -------------------- | ------------------------ | ------ | ------------------------------------------------------------- | ------- |
| label                | 文本说明                 | String | -                                                             | -       |
| key                  | 作为传入接口的 key       | String | -                                                             | -       |
| value                | 作为传入接口的 value     | Any    | -                                                             | -       |
| type                 | 要展示的控件类型         | String | `select、range-datepicker、datepicker、input 、t-tree-select` | `input` |
| rule                 | 校验规则同 FormItem rule | Array  | -                                                             | -       |
| selectProps          | 透传 select 组件属性     | Object | -                                                             | -       |
| rangeDatepickerProps | 透传 DatePicker 组件属性 | Object | -                                                             | -       |
| treeSelectProps      | 透传 TreeSelect 组件属性 | Object | -                                                             | -       |
| inputProps           | 透传 Input 组件属性      | Object | -                                                             | -       |

### datepicker 控件独有属性

配置示例参考 `两个单选时间控件，开始与结束时间可选范围配置示例`
| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| relation | 要关联的另一个控件的 key 值 | String | - |
| timeRange | 标识开始还是结束时间 | String | `start、end` | - |

### 方法

| 方法      | 说明     | 参数 |
| --------- | -------- | ---- |
| getParams | 获取参数 | -    |

### event

| 事件名称 | 说明     | 回调参数 |
| -------- | -------- | -------- |
| search   | 查询回调 | -        |

### slot

| name             | 说明               | scoped           |
| ---------------- | ------------------ | ---------------- |
| config[item].key | 自定义查询条件控件 | `item, formData` |

### 自定义控件示例

```javascript
<template>
  <search-control-panel
    ref="queryControl"
    :config="queryControlConfig"
    @search="queryList"
  >
    <template #gmfmc="{ item, formData }">
      <t-input
        v-model="formData[item.key]"
        :placeholder="item.placeholder || '请输入'"
      ></t-input>
    </template>
  </search-control-panel>
</template>
```

### 针对 select 异步加载 selectList 示例

```javascript
<template>
 <search-control-panel ref="queryControl" :config="queryControlConfig" @search="queryList" />
</template>

export default {
  data() {
    queryControlConfig: {
      aaa: {
        label: '哈哈哈哈：',
        key: 'aaa',
        value: '',
        selectList: [],
      },
      bbb: {
        label: '哇哇哇哇：',
        key: 'bbb',
        type: 'input',
        value: '',
      },
    }
  },
  async getAaaSelectList() {
    const res = await getAaaSelectList();
    const { list } = res;
    this.queryControlConfig.aaa.selectList = list;
  },
}
```

### 两个单选时间控件，开始与结束时间可选范围配置示例

```json
const = queryControlConfig [
  {
    label: '启用日期起',
    key: 'qyrqq',
    relation: 'qyrqz', // 关联 启用日期止 key 值
    timeRange: 'start', // 标识开始时间
    type: 'datepicker',
    value: '',
    clearable: true,
  },
  {
    label: '启用日期止',
    key: 'qyrqz',
    relation: 'qyrqq', // 关联 启用日期起 key 值
    timeRange: 'end', // 标识结束时间
    type: 'datepicker',
    value: '',
    clearable: true,
  },
]
```
