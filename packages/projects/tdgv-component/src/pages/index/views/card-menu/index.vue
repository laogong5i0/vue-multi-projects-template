<template>
  <div>
    <div class="g-main-header">card-menu组件</div>
    <div class="page-content">
      <div class="block">
        <h4>介绍12</h4>
        <div><checkboxes-widget :enumOptions="checkboxes" /></div>
        <p>card-menu组件，用于可点击的卡片组场景</p>
      </div>

      <div class="block">
        <h4>示例</h4>
        <card-menu :cards="list" title="二级首页-功能菜单" />
      </div>

      <div class="block">
        <h4>Props</h4>
        <p>
          <t-table :data="listData" :columns="columns" rowKey="name" />
        </p>
        <h4>cards数组对象的结构</h4>
        <p>
          <t-table :data="listData2" :columns="columns" rowKey="name" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckboxesWidget } from '@fx/gt4-components';
import { hasKey } from '@fx/gt4-utils';

// const { IconQuestion } = Icon;
export default {
  name: 'CardList',
  components: { CheckboxesWidget },
  data() {
    return {
      checkboxes: [
        { value: '333', label: '示例3' },
        { value: '22', label: '示例2' },
        { value: '111', label: '示例1' },
      ],
      list: [],
      listData: [
        {
          name: 'title',
          type: 'String',
          defaultValue: '空字符串',
          required: 'true',
          desc: '卡片标题',
        },
        {
          name: 'cards',
          type: 'Array',
          defaultValue: '[]',
          required: 'false',
          desc: '卡片组内各卡片项数据，Objec结构如下',
        },
      ],
      listData2: [
        {
          name: 'avatar',
          type: 'String',
          defaultValue: '',
          required: 'false',
          desc: "卡片图标，示例require('@/pages/index/assets/figma-mobile.png')",
        },
        {
          name: 'title',
          type: 'String',
          defaultValue: '',
          required: 'false',
          desc: '标题文案最长限制 24 个字，超出部分将会被截取',
        },
        {
          name: 'desc',
          type: 'String',
          defaultValue: '',
          required: 'false',
          desc: '描述文案最长限制 42 个字（描述文案需要尽量准确精简，建议在 30～42 个字之间），超出部分将会被截取	',
        },
        {
          name: 'onClick',
          type: 'Function',
          defaultValue: '',
          required: 'false',
          desc: '点击卡片组内部小卡片事件',
        },
      ],
      columns: [
        {
          width: '100',
          colKey: 'name',
          title: '名称',
        },
        {
          width: '100',
          colKey: 'type',
          title: '类型',
        },
        {
          width: '100',
          colKey: 'defaultValue',
          title: '默认值',
        },
        {
          width: '100',
          colKey: 'required',
          title: '必传',
        },
        {
          width: '300',
          colKey: 'desc',
          title: '简介',
        },
      ],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      const obj = {
        name: 123333333,
      };
      console.log(hasKey(obj, 'name'), '3333', hasKey(obj, 'add'));
      try {
        const mockData = new Array(15);
        mockData.fill(
          {
            avatar: require('@/pages/index/assets/figma-mobile.png'),
            title: '长文案标题长文案标题长文案标题长文案标题长文案标题长文案标题',
            desc: '一行 描述文案展示',
            onClick: () => {
              this.$router.push({ path: `/table-base/${112}` });
            },
          },
          0,
          2,
        );

        mockData.fill(
          {
            avatar: require('@/pages/index/assets/figma-mobile.png'),
            title: '长文案标题长文案标题长文案标题长文案标题长文案标题长文案标题',
            desc: '两行 描述文案展示描述文案展示描述文案展示描述文案展示',
            onClick: () => {
              this.$router.push({ path: `/table-base/${112}` });
            },
          },
          2,
          4,
        );

        mockData.fill(
          {
            avatar: require('@/pages/index/assets/figma-mobile.png'),
            title: '长文案标题长文案标题长文案标题长文案标题长文案标题长文案标题',
            desc: '三行 描述文案展示描述文案展示描述文案展示描述文案展示示描述文案展示描述文案展示描述文案展示描述文案展示描述文案展示描述文案展示示描述文案展示描述文案展示',
            onClick: () => {
              this.$router.push({ path: `/table-base/${112}` });
            },
          },
          4,
          5,
        );

        mockData.fill(
          {
            avatar: require('@/pages/index/assets/figma-mobile.png'),
            title: '标题内容',
            desc: '三行 描述文案展示描述文案展示描述文案展示描述文案展示示描述文案展示描述文案展示描述文案展示描述文案展示描述文案展示描述文案展示示描述文案展示描述文案展示',
            onClick: () => {
              this.$router.push({ path: `/table-base/${112}` });
            },
          },
          5,
          10,
        );

        mockData.fill(
          {
            avatar: require('@/pages/index/assets/figma-mobile.png'),
            title: '标题内容',
            desc: '一行 描述文案展示',
            onClick: () => {
              this.$router.push({ path: `/table-base/${112}` });
            },
          },
          10,
          12,
        );

        mockData.fill(
          {
            avatar: require('@/pages/index/assets/figma-mobile.png'),
            title: '标题内容',
            desc: '两行 描述文案展示描述文案展示描述文案展示描述文案展示',
            onClick: () => {
              this.$router.push({ path: `/table-base/${112}` });
            },
          },
          12,
          15,
        );

        this.list = await Promise.resolve(mockData);
      } catch (e) {
        this.$message.error(e.message || `初始化失败`);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.page-content {
  padding: 24px;
  margin: 24px;
  background: #fff;
  border-radius: 2px;

  .block + .block {
    margin-top: 36px;
  }

  p {
    margin: 16px 0;
    font-size: 14px;
    line-height: 21px;
  }

  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }
}
</style>
