<template>
  <div class="g-tooltip-label-wrapper" :style="labelStyle">
    <t-tooltip v-if="showTooltip" placement="top" :content="label" class="g-tooltip-label-tooltip">
      <div class="g-tooltip-label-label" ref="content">{{ label }}</div>
    </t-tooltip>
    <div v-else class="g-tooltip-label-label" ref="content">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'TooltipLabel',
  props: {
    /**
     * 文本内容
     */
    label: {
      type: String,
      default: () => '',
    },
    /**
     * 文本最大宽度
     */
    maxWidth: {
      type: [Number, String],
      default: '100%',
    },
  },
  computed: {
    labelStyle() {
      if (typeof this.maxWidth === 'number') {
        return `max-width: ${this.maxWidth}px`;
      }
      return `max-width: ${this.maxWidth}`;
    },
  },
  watch: {
    label() {
      this.checkTooltip();
    },
  },
  data() {
    return {
      showTooltip: false,
    };
  },
  mounted() {
    this.checkTooltip();
    window.addEventListener('resize', this.checkTooltip);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkTooltip);
  },
  methods: {
    checkTooltip() {
      this.$nextTick(() => {
        const el = this.$refs.content;
        this.showTooltip = el && el.offsetWidth < el.scrollWidth;
      });
    },
  },
};
</script>

<style lang="less" scoped>
@namespace: g-tooltip-label;

.@{namespace}-wrapper {
  display: inline-block;
  max-width: 100%;
  vertical-align: bottom;
}

.@{namespace}-tooltip {
  width: 100%;
  vertical-align: bottom;
}

.@{namespace}-label {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
