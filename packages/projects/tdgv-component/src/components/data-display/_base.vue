<template>
  <div class="g-data-display-container-fluid">
    <div class="g-data-display-row">
      <div v-for="itemData of innerData" :key="itemData.key" class="g-data-display-col" :class="[colClass]">
        <data-display-item :formater="formater" :item-data="itemData" />
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep, throttle } from 'lodash-es';
import DataDisplayItem from './data-display-item.vue';

export default {
  name: 'DataDisplay',
  components: {
    DataDisplayItem,
  },
  props: {
    data: Array,
    formater: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      innerData: [],
      rowNum: 0,
      colClass: 'g-data-display-col-4',
    };
  },
  mounted() {
    this.getRowNum();
    const getRowNumThrottle = throttle(this.getRowNum, 500);
    window.addEventListener('resize', getRowNumThrottle);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', getRowNumThrottle);
    });
  },
  watch: {
    rowNum() {
      this.handleData();
    },
    data: {
      handler() {
        this.handleData();
      },
      deep: true,
    },
  },
  methods: {
    getRowNum() {
      let rowNum = 4;
      const wrapperWidth = this.$el.offsetWidth;
      if (wrapperWidth <= 880) {
        rowNum = 2;
      } else if (wrapperWidth <= 896) {
        rowNum = 3;
      } else if (wrapperWidth > 1700) {
        rowNum = 5;
      }
      this.rowNum = rowNum;
    },

    handleData() {
      if (!(this.data?.length > 0 && this.rowNum)) return;

      const cloneData = cloneDeep(this.data);
      this.colClass = `g-data-display-col-${this.rowNum}`;
      const maxSubcontent = Math.max.apply(
        null,
        cloneData.map((item) => item.subContent?.length || 0),
      );

      this.innerData = cloneData.map((item, index) => {
        const contentLength = item.content.toString().length;
        let fontSize = '24px';
        if (contentLength <= 8) {
          fontSize = '32px';
        } else if (contentLength > 11) {
          fontSize = '20px';
        }
        let { subContent } = item;
        if (!subContent) {
          subContent = Array(maxSubcontent).fill('-');
        } else if (subContent.length < maxSubcontent) {
          const addArr = Array(maxSubcontent - subContent.length).fill('-');
          subContent = [...subContent, ...addArr];
        }

        const showLine = !((index + 1) % this.rowNum === 0 || index === cloneData.length - 1);
        let operation = null;
        if (item.operation) {
          operation = { ...item.operation };
          if (operation.text.length > 4) {
            operation.text = operation.text.slice(0, 4);
          }
        }
        return {
          ...item,
          key: `${item.title}-${index}`,
          contentStyle: { color: item.contentColor, fontSize },
          operation,
          subContent,
          showLine,
        };
      });
    },
  },
};
</script>

<style lang="less" scoped>
@namespace: g-data-display;
@space: 8px;

.@{namespace}-container-fluid {
  padding-top: @space;
  padding-bottom: @space;
}

.@{namespace}-row {
  &::before {
    display: table;
    content: '';
  }
  &::after {
    display: table;
    clear: both;
    content: '';
  }
}

.@{namespace}-col {
  position: relative;
  float: left;
  min-height: 1px;
}

each(range(12), {
    .@{namespace}-col-@{value} {
        width: percentage(1 / @value);
    }
});
</style>
