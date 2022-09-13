<template>
  <section class="side-tree">
    <div class="head"><span class="title">广东省</span><t-icon name="swap" /></div>

    <div class="filter-box">
      <t-input v-model="filterText" @input="onInput" placeholder="请输入"
        ><t-icon slot="suffix-icon" name="search"
      /></t-input>
    </div>

    <t-tree
      class="tree-box"
      :data="treeData"
      transition
      hover
      activable
      expand-on-click-node
      :default-expanded="expanded"
      :filter="filterByText"
      @click="onClick"
      @expand="onExpand"
    >
      <template #icon="{ node }">
        <t-icon v-if="node.getChildren() && !node.expanded" name="caret-right-small" />
        <t-icon v-else-if="node.getChildren() && node.expanded && node.loading" name="loading" />
        <t-icon v-else-if="node.getChildren() && node.expanded" name="caret-down-small" />
      </template>

      <template #label="{ node }">
        <span v-if="node.label && node.label.indexOf(filterText) > -1">
          <t-tooltip placement="right" :content="node.label.substr(0, node.label.indexOf(filterText))">
            {{ node.label.substr(0, node.label.indexOf(filterText)) }}
          </t-tooltip>
          <span style="color: #f50">
            <t-tooltip placement="right" :content="filterText">
              {{ filterText }}
            </t-tooltip>
          </span>
          <t-tooltip placement="right" :content="node.label.substr(node.label.indexOf(filterText) + filterText.length)">
            {{ node.label.substr(node.label.indexOf(filterText) + filterText.length) }}
          </t-tooltip>
        </span>
        <span v-else>
          <t-tooltip placement="right" :content="node.label">
            {{ node.label }}
          </t-tooltip>
        </span>
      </template>
    </t-tree>
  </section>
</template>

<script>
export default {
  name: 'SideTree',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
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
      expanded: [],
      treeData: this.data || [],
      filterText: '',
      filterByText: null,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      const mockData = [];
      for (let i = 1; i <= 30; i++) {
        mockData.push({
          label: String(i),
          children: [
            {
              label: `${i}.1`,
            },
            {
              label: `${i}.2`,
            },
          ],
        });
      }
      this.treeData = mockData;
    },
    onInput() {
      this.filterByText = (node) => node.data.label.indexOf(this.filterText) >= 0;
    },
    onClick(context) {
      console.info('onClick', context);
      this.$emit('change', context);
    },
    onExpand(value, context) {
      console.info('onExpand', value, context);
    },
  },
};
</script>

<style lang="less" scoped>
.side-tree {
  display: flex;
  width: 200px;
  height: 100%;
  max-height: 705px;
  border-right: 1px solid rgba(39, 40, 46, 0.08);
  flex-direction: column;

  .head {
    display: flex;
    height: 60px;
    padding: 0 16px;
    border-bottom: 1px solid rgba(39, 40, 46, 0.08);
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 20px;
      color: #27282e;
    }
  }

  .filter-box {
    padding: 12px 16px;
  }
  .tree-box {
    padding: 0 16px;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
  }
}
</style>
