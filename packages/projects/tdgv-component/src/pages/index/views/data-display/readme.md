## g-data-display 组件

### 介绍

数据展示组件，使用统一的样式展示数据。

### 设计

![g-data-display](https://tencentpartner-generic.pkg.coding.net/sample-center/images/web-g-data-display.png?version=latest)
### API 设计

| 名称     | 类型    | 默认值             | 说明                                                                                                      | 必传 |
| -------- | ------- | ------------------ | --------------------------------------------------------------------------------------------------------- | ---- |
| data   | Array |               | 卡片组内各卡片项数据，Objec结构如下                                                                                    | N    |
| formate   | Int |  -1             | data中字段content数据类型为Number时，formater值为保留位数，如：formate=0，输出3，000   | N    |

#### data数组对象的结构

| 名称     | 类型    | 默认值             | 说明                                                                                                      | 必传 |
| -------- | ------- | ------------------ | --------------------------------------------------------------------------------------------------------- | ---- |
| title   | String |               | 标题                                                                                    | Y    |
| explain   | String  |                   | 标题说明，配置后会显示icon                                                 | N    |
| content | String  |  | 主要数据                                      | Y    |
| contentColor | String  |  | 设置主要数据的颜色                                      | N    |
| operation | Object  |  | 主要数据右侧的操作按钮,示例：operation: {text: '去调增',onClick: this.clickfn }                                      | N    |
| subContent | Array<string> &vert; slot  |  | 辅助数据内容,示例:subContent: ['当月最高持票： 200张', '当月剩余可领用纸票：160张'] ;    subContent为slot，name值为`subContent${index}` , index为data组索引                                | N    |

### 开发备注

- 因为设计稿中有等分栅格的需求，且现有组件不支持，所以组件内实现了兼容IE的等分栅格布局，最大支持12等分
- 组件内通过监听窗口的 `resize` 事件，来动态设置组件每行列数。在切换菜单栏显示方式等其他情况下，无法作出响应。如果需要严格监听组件包裹元素的宽度变化并且兼容IE9，可以引入`element-resize-detector`或`resize-observer-polyfill`。

### 示例

```
<template>
    <data-display :data="data" />
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          title: '当前可用额度（元）',
          explain: '当前可用额度（元）说明',
          content: '3,000',
          contentColor: '#fc5541',
          operation: {
            text: '去调增',
            onClick: this.clickfn,
          },
          subContent: ['月可用总额度： 2,000,000元'],
        },
        {
          title: '很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多字',
          explain: '很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多字',
          content: '56',
          subContent: [
            '很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多字',
            '很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多字',
          ],
        },
        {
          title: '蓝票开具金额（元）',
          content: '2,097,000',
          subContent: ['发票税额： 62,910元', '发票数量：3,800张'],
        },
        {
          title: '红票开具金额（元）',
          content: '100,000',
          subContent: ['发票税额： 3,000元', '发票数量：560张'],
        },
        {
          title: '当前可用额度（元）',
          explain: '当前可用额度（元）说明',
          content: '3,000',
          contentColor: '#fc5541',
          operation: {
            text: '去调增',
            onClick: this.clickfn,
          },
          subContent: ['月可用总额度： 2,000,000元'],
        },
        {
          title: '当前可用纸票数量（张）',
          explain: '当前可用纸票数量（张）说明',
          content: '56',
          subContent: ['当月最高持票： 200张', '当月剩余可领用纸票：160张'],
        },
      ],
    };
  },
  methods: {
    clickfn() {
      console.log('调用了clickfn方法！');
    },
  },
};
</script>
```