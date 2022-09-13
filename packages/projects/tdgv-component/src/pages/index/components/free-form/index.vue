<template>
  <t-form
    :data="formData"
    labelWidth="calc(8em + 8px)"
    ref="form"
    @reset="onReset"
    @submit="onSubmit"
    scrollToFirstError="smooth"
  >
    <g-filter-wrapper :expand="expand" :colNum="colNum" col-style="margin-bottom: 24px">
      <t-form-item v-for="(item, key) in config" :key="key" v-bind="colProps" :name="item.key" :rules="item.rule">
        <template slot="label">
          <t-tooltip v-if="shouldEllipsis(item.label)" :content="item.label">
            <span>{{ sliceText(item.label) }}</span>
          </t-tooltip>
          <span v-else>{{ item.label }}</span>
        </template>
        <slot :name="item.key" :item="item" :formData="formData">
          <t-select
            v-if="item.type === 'select'"
            v-bind="item.selectProps"
            v-model="formData[item.key]"
            :options="item.selectList"
            :disabled="item.disabled || false"
            :placeholder="item.placeholder || '请选择'"
            :multiple="item.multiple || false"
            :clearable="item.clearable || false"
            :filterable="item.filterable || false"
          ></t-select>
          <t-date-picker
            v-else-if="item.type === 'range-datepicker'"
            range
            v-model="formData[item.key]"
            mode="date"
            style="width: 100%"
            v-bind="item.rangeDatepickerProps"
            :placeholder="['开始时间', '结束时间']"
          />
          <t-date-picker
            v-else-if="item.type === 'datepicker'"
            v-model="formData[item.key]"
            mode="date"
            style="width: 100%"
            v-bind="item.datepickerProps"
            :disableDate="(date) => getDisableDate(date, item)"
            :clearable="item.clearable || false"
            :placeholder="'请选择日期'"
          />
          <t-tree-select
            v-else-if="item.type === 'tree-select'"
            style="width: 100%"
            v-bind="item.treeSelectProps"
            :data="item.selectList"
            v-model="formData[item.key]"
            :multiple="item.multiple || false"
            :value="item.value || ''"
            placeholder="请选择"
          />
          <t-input
            v-else
            v-bind="item.inputProps"
            v-model="formData[item.key]"
            :placeholder="item.placeholder || '请输入'"
            :clearable="item.clearable || false"
            :disabled="item.disabled || false"
          >
            <t-icon v-if="item.iconName" :name="item.iconName" slot="suffix-icon" />
          </t-input>
        </slot>
      </t-form-item>
      <t-form-item class="filter-btns" :class="shouldShowExtend ? 'float-right' : ''" labelWidth="0">
        <t-button theme="default" variant="base" type="reset">重置</t-button>
        <t-button theme="primary" type="submit">查询</t-button>
        <t-button v-if="shouldShowExtend" theme="primary" variant="text" @click="changeChevron">
          <span>
            {{ expand ? '收起' : '展开' }}
            <t-icon :name="expand ? 'chevron-up' : 'chevron-down'" slot="icon" />
          </span>
        </t-button>
      </t-form-item>
    </g-filter-wrapper>
  </t-form>
</template>

<script>
import dayjs from 'dayjs';

const LABEL_THRESHOLD = 8;
const DOUBLE_BYTE_THRESHOLD = 255;

export default {
  // eslint-disable-next-line prettier/prettier
  name: 'SearchControlPanel',
  props: {
    config: [Object, Array],
    colNum: {
      type: Number,
      default: 4,
    },
    defaultExpand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expand: false,
      colProps: {
        xs: 6, // >= 768
        md: 4, // >= 992px
        // eslint-disable-next-line prettier/prettier
        lg: 3, // >= 1200px
        xl: 3, // >= 1400 px
        xxl: 2, // >= 1880
      },
      isShowHighSearchButton: false,
      formData: {},
    };
  },
  computed: {
    shouldShowExtend() {
      return Object.keys(this.config).length >= this.colNum;
    },
  },
  mounted() {
    this.expand = this.defaultExpand;
    this.setFormData(this.config);
  },
  methods: {
    getDisableDate(date, item) {
      if (!item.relation || !item.timeRange) return false;
      const selectData = this.formData[item.relation];
      if (!selectData) return false;

      const formatDate = dayjs(selectData).hour(0).minute(0).second(0);

      if (item.timeRange === 'start') {
        // 大于选中结束时间的都不可选
        return date > new Date(formatDate);
      }

      if (item.timeRange === 'end') {
        // 小于选中开始时间的都不可选
        return date < new Date(formatDate);
      }

      return false;
    },
    changeInput($event) {
      this.$emit('changeInput', $event);
    },
    changeChevron() {
      this.expand = !this.expand;
    },
    // 计算字符串字节长度，英文字母为单字节字符，中文汉字为双字节字符
    getStringLength(str) {
      const strLength = str.length;

      let count = 0;
      for (let i = 0; i < strLength; i++) {
        count += str.charCodeAt(i) > DOUBLE_BYTE_THRESHOLD ? 2 : 1;
      }
      return count;
    },
    // 根据预设值判断label是否显示省略
    shouldEllipsis(str) {
      return this.getStringLength(str) > LABEL_THRESHOLD * 2;
    },
    // label文字切割
    sliceText(text, length = 7) {
      if (this.shouldEllipsis(text)) {
        return `${text.slice(0, length)}...`;
      }
      return text;
    },
    onReset() {
      this.$emit('reset');
      this.$emit('search');
    },
    onSubmit({ validateResult }) {
      if (validateResult === true) {
        this.$emit('search');
      }
    },
    setFormData(data) {
      const formData = {};
      Object.keys(data).forEach((key) => {
        const item = data[key];
        if (item) {
          formData[item.key] = item.value;
        }
      });
      this.formData = formData;
    },
    getParams(key) {
      if (key) return this.formData[key];
      // 防止组件外使用getParams()修改formData
      return { ...this.formData };
    },
    resetFormData() {
      this.formData = {};
    },
  },
};
</script>

<style scoped lang="less">
.float-right {
  float: right;
}
.filter-btns {
  button {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
