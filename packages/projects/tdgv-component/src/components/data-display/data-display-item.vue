<template>
  <div class="g-data-display-panel" :class="{ 'g-data-display-line': itemData.showLine }">
    <div class="g-data-display-panel-header">
      <tooltip-label :label="itemData.title" max-width="calc(100% - 51px)" />
      <t-tooltip v-if="itemData.explain" :content="itemData.explain" placement="top">
        <t-icon class="g-data-display-icon" name="error-circle" />
      </t-tooltip>
    </div>
    <div class="g-data-display-panel-body">
      <span class="g-data-display-content" :style="itemData.contentStyle">{{ getContent(itemData.content) }}</span>
      <t-button
        v-if="itemData.operation"
        class="g-data-display-button"
        @click="itemData.operation.onClick"
        size="small"
        variant="outline"
        theme="primary"
        >{{ itemData.operation.text }}</t-button
      >
    </div>
    <div class="g-data-display-panel-footer">
      <div v-for="(subContent, i) of itemData.subContent" :key="i" class="g-data-display-sub-content">
        <tooltip-label :label="subContent" max-width="calc(100% - 39px)" />
      </div>
    </div>
  </div>
</template>

<script>
import TooltipLabel from './tooltip-label.vue';
import { filterContent } from './utils';

export default {
  name: 'DataDisplayItem',
  components: {
    TooltipLabel,
  },
  props: {
    itemData: Object,
    formater: {
      type: Number,
      default: -1,
    },
  },
  methods: {
    getContent(str) {
      if (this.formater >= 0) {
        return filterContent(str, this.formater);
      }
      return str;
    },
  },
};
</script>

<style lang="less" scoped>
@namespace: g-data-display;
@space: 8px;

.@{namespace}-panel {
  position: relative;
  margin-top: 2 * @space;
  margin-bottom: 2 * @space;
  color: #333;

  .@{namespace}-panel-header {
    margin-bottom: 4px;
    line-height: 22px;
    .@{namespace}-icon {
      font-size: 11.4px;
      color: #666;
    }
  }
  .@{namespace}-panel-body {
    margin-bottom: 3 * @space;
    .@{namespace}-content {
      line-height: 40px;
      vertical-align: middle;
    }
    .@{namespace}-button {
      margin-left: @space;
    }
  }
}
.@{namespace}-line {
  &::after {
    position: absolute;
    top: 0;
    right: 3 * @space;
    width: 1px;
    height: 100%;
    background-color: rgba(39, 40, 46, 0.08);
    content: '';
  }
}

.@{namespace}-sub-content {
  font-size: 16px;
  line-height: 24px;
  &:not(:last-child) {
    margin-bottom: @space;
  }
}
</style>
