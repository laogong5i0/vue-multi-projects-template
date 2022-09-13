<template>
  <div class="g-card-menu" ref="cardMenu">
    <div class="g-card-menu__header">{{ title }}</div>
    <div class="g-card-menu__content" ref="content">
      <card-item :data="item" :class="rowClass" v-for="(item, index) in cards" :key="index" />
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash-es';
import cardItem from './card-item';

export default {
  components: { cardItem },
  name: 'CardMenu',
  props: {
    cards: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
      require: true,
    },
  },
  data() {
    return {
      rowClass: '',
      rowNum: 0,
      itemClass: () => {},
    };
  },
  watch: {
    rowNum(val) {
      this.rowClass = `g-card-menu-col-${val}`;
    },
  },
  methods: {
    getRowNum() {
      let rowNum = 4;
      const wrapperWidth = this.$refs.content.offsetWidth;
      if (wrapperWidth <= 896) {
        rowNum = 3;
      } else if (wrapperWidth <= 1376) {
        rowNum = 4;
      } else {
        rowNum = 5;
      }
      this.rowNum = rowNum;
    },
  },
  mounted() {
    // 兼容IE9不支持media情况，获取屏幕分辨率，设置cardMenu最大宽度
    // this.$refs['cardMenu'];
    const getRowNumThrottle = throttle(this.getRowNum, 500);
    window.addEventListener('resize', getRowNumThrottle);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', getRowNumThrottle);
    });
    getRowNumThrottle();
  },
};
</script>

<style lang="less" scoped>
@namespace: g-card-menu;
.@{namespace} {
  background-color: #fff;

  &__header {
    padding: 24px 0;
    margin: 0 24px;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0;
    color: #333;
    border-bottom: 1px solid rgba(39, 40, 46, 0.08);
  }

  &__content {
    padding: 24px 8px 0 24px;
    font-size: 0;
  }
  each(range(12), {
    .@{namespace}-col-@{value} {
        width: percentage(1 / @value);
    }
  });
}
</style>
