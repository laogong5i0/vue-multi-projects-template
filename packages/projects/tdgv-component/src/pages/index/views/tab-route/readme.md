## g-tab-route 组件

### 介绍

g-tab-route 页签组件，用于记录路由切换，默认最多可打开20个选项卡，可灵活配置个数，默认开启页面缓存功能，可自行关闭；

### API
| 名称     | 类型    | 默认值             | 说明                                                             | 必传 |
| -------- | ------- | ------------------ | ---------------------------------------------------------------- | ---- |
| isOpen   | Boolean | true              | 是否开启页签功能                                           | N    |
| isCacheMode   | Boolean | true              | 是否开启页签缓存                                           | N    |
| maxTabCount   | Number  | 20                  | 可开启页签的最大值 | N    |

### Slot
默认为route-view, 如果需要自定义route-view外层的样式，可自定义slot配置，可参考app.vue


### 使用方案
- 第一步

路由配置中添加 meta -> title，如下
```
{
    name: 'card-list',
    path: '/card-list',
    component: cardListIndex,
    meta: {
      title: '基础样式',
    },
  },
```

- 第二步
引入 页签组件至 app.vue，替换router-view 拦截所有路由跳转
```
  <g-tab-route />
  <!-- 
    <router-view />
  -->
```

### 示例

可运行项目在项目中查看页签组件的交互效果