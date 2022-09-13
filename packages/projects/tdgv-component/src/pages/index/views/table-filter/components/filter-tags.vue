<template>
  <div class="filter-tags">
    <label class="label" :title="label">{{ label }}</label>

    <slot></slot>

    <div v-if="!$slots.default && data.length" class="tag-items">
      <div class="row" v-for="(row, index) in rows" :key="index" :class="{ hide: index > 0 && !showMore }">
        <t-check-tag
          v-for="(tag, index) in row"
          :key="index"
          :defaultChecked="isChecked(tag)"
          @click="handleClick(tag, index)"
          :class="{ 'is-check-all': isCheckAll(tag) }"
          >{{ tag.label }}</t-check-tag
        >
        <span v-show="index === 0 && rows.length > 1" class="more" @click="toggleMore"
          >{{ showMore ? '收起' : '展开' }}
          <t-icon name="chevron-up" v-show="showMore" />
          <t-icon name="chevron-down" v-show="!showMore" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
const CHECK_ALL = Symbol('check_all');

export default {
  name: 'AdvancedSearch',
  props: {
    label: {
      type: String,
      required: true,
      default: '',
    },
    data: {
      type: Array,
      default: () => [],
    },
    checked: {
      type: Array,
      default: () => [],
    },
    max: {
      type: Number,
      default: 9,
    },
    all: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value(v) {
      this.visible = v;
    },
    visible(v) {
      this.$emit('input', v);
    },
    checked(v = []) {
      this.checkedSet = new Set(v);
    },
  },
  data() {
    return {
      showMore: false,
      checkAll: !!this.all,
      checkedSet: new Set(this.checked),
    };
  },
  computed: {
    rows() {
      const items = Array.from(this.data);

      if (this.all) {
        items.unshift({
          label: '全部',
          value: CHECK_ALL,
        });
      }

      const step = this.max;

      return items.reduce((rows, item, idx) => {
        const row = items.slice(idx * step, (idx + 1) * step);
        row.length && rows.push(row);

        return rows;
      }, []);
    },
  },
  methods: {
    isCheckAll(tag) {
      return tag.value === CHECK_ALL;
    },
    isChecked(tag) {
      if (!this.checkedSet.size && this.isCheckAll(tag)) {
        return true;
      }

      return this.checkedSet.has(tag);
    },
    handleClick(tag) {
      if (this.isCheckAll(tag)) {
        this.checkedSet.clear();
      } else if (this.checkedSet.has(tag)) {
        this.checkedSet.delete(tag);
      } else {
        this.checkedSet.add(tag);
      }

      // force update tag checked status
      this.$forceUpdate();

      this.$emit('change', [...this.checkedSet]);
    },
    toggleMore() {
      this.showMore = !this.showMore;
    },
  },
};
</script>

<style lang="less" scoped>
.filter-tags {
  display: flex;
  align-items: flex-start;
  .label {
    // margin: 10px 40px 10px 0;
    width: 96px;
    margin: 10px 0;
    overflow: hidden;
    font-size: 14px;
    line-height: 22px;
    color: #999;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tag-items {
    flex: 1;
  }

  .row {
    position: relative;
    display: flex;
    border-bottom: 1px solid rgba(39, 40, 46, 0.08);
    flex: 1;
    align-items: center;
    flex-wrap: wrap;

    &.hide {
      display: none;
    }

    .t-tag {
      padding: 0 6px;
      margin: 10px 16px;
      &:first-child {
        margin-left: 0;
      }
    }
    .more {
      position: absolute;
      right: 0;
      cursor: pointer;
    }
  }
}
</style>
