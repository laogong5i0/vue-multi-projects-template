## card-menu 组件

### 介绍

card-menu组件，用于可点击的卡片组场景

### 设计

![card-menu](https://tencentpartner-generic.pkg.coding.net/sample-center/images/web-card-menu.png?version=latest)

### 二级首页-功能菜单详细规范 
- 1、使用左右布局格式，icon 在左侧，标题和描述文案在右侧上下排列 
- 2、icon 底框尺寸 56px 
- 3、标题文案最长限制 24 个字，描述文案最长限制 42 个字（描述文案需要尽量准确精简，建议在 30～42 个字之间）
- 4、功能菜单的内容做自适应，页面宽度伸展，宽度超过 296px 时，多展示一条，模块高度也跟随调整（详情在下方图示） 
- 5、标题文字使用“政务系统字体包/14px/14px 1号字体-C11 中黑”，描述文字使用“政务系统字体包/12px/12px 2号字体-C12 常规” 6、外边框样式 background: #FFFFFF; border: 1px solid rgba(39,40,46,0.08); border-radius: 2px;

### API 设计

| 名称     | 类型    | 默认值             | 说明      | 必传 |
| -------- | ------- | ------------------ | ------------------------------- | ---- |
| title   | String | 空字符串              | 卡片标题      | N    |
| cards | Array  | []                       | 卡片组内各卡片项数据，Objec结构如下                                                  | N    |

### cards 数组对象结构
| 名称     | 类型    | 默认值             | 说明      | 必传 |
| -------- | ------- | ------------------ | ------------------------------- | ---- |
| avatar   | String |               | 卡片图标，示例require('@/pages/index/assets/figma-mobile.png')      | N    |
| title   | String |               | 标题文案最长限制 24 个字，超出部分将会被截取     | N    |
| desc   | String |               | 描述文案最长限制 42 个字（描述文案需要尽量准确精简，建议在 30～42 个字之间），超出部分将会被截取      | N    |
| onClick   | Function |               | 点击卡片组内部小卡片事件      | N    |

### 示例

```
<template>
  <div class="card-list">
    <div class="g-main-header">
      <span class="title">页面标题</span>
      <span class="desc">描述文案等信息，可为空。</span>
    </div>

    <div class="page-content">
      <card-menu :cards="list" title="基础信息维护" />
    </div>
  </div>
</template>

<script>
import cardMenu from './components/card-menu';

export default {
  name: 'CardList',
  components: { cardMenu },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const mockData = new Array(15);
        mockData.fill({
          avatar: require('@/pages/index/assets/figma-mobile.png'),
          title: '长文案标题长文案标题长文案标题长文案标题长文案标题长文案标题',
          desc: '三行 描述文案展示描述文案展示描述文案展示描述文案展示示描述文案展示描述文案展示描述文案展示描述文案展示描述文案展示描述文案展示示描述文案展示描述文案展示',
          onClick: () => {
            // console.log('onClick');
            this.$router.push({ path: `/table-base/${112}` });
          },
        });

        this.list = await Promise.resolve(mockData);
      } catch (e) {
        this.$message.error(e.message || `初始化失败`);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.g-main-header {
  .desc {
    display: inline-block;
    margin-top: -3px;
    margin-left: 24px;
    font-size: 12px;
    font-weight: normal;
    color: #999;
    vertical-align: middle;
  }
}
.page-content {
  margin: 24px;
}
</style>
```