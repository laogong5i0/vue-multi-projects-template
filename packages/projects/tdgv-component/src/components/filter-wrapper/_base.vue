<script>
export default {
  name: 'GFilterWrapper',
  props: {
    // 是否展开,默认不展开
    expand: {
      type: Boolean,
      default: false,
    },
    // 每行列数,默认4列
    colNum: {
      type: Number,
      default: 4,
      validator(value) {
        // 内部使用了分为12块的栅格系统,能被12整除的数才能被平均分配
        return [1, 2, 3, 4, 6, 12].indexOf(value) !== -1;
      },
    },
    // 与栅格组件中的row props参数一致,使用时请注意某些属性不支持IE
    rowProps: {
      type: Object,
      default() {
        return {
          gutter: [16, 24],
        };
      },
    },
  },
  methods: {
    renderContent() {
      // 获取插槽中的节点
      const defaultSlots = this.$scopedSlots.default();
      // 标记用户不想显示的节点（需通过v-show或者v-if设置）
      const noShowIndexs = [];
      const newItems = [...defaultSlots];
      newItems.forEach((vn, index) => {
        // 设置了v-if的节点通过vn.isComment属性判断
        if (vn.isComment) {
          noShowIndexs.push(index);
          return;
        }
        // 设置了v-show的节点通过vn.data.directives属性判断
        const obj = {};
        vn.data?.directives?.forEach((directive) => {
          obj[directive.rawName] = directive.value;
        });
        if (Object.prototype.hasOwnProperty.call(obj, 'v-show') && !obj['v-show']) {
          noShowIndexs.push(index);
        }
      });
      // 计算出最终需要隐藏的节点index
      let finalHiddenIndexs = [];
      const newItemIndexs = newItems.map((item, i) => i);
      if (!this.expand) {
        const showIndexs = [];
        newItemIndexs.forEach((i) => {
          if (noShowIndexs.includes(i)) {
            finalHiddenIndexs.push(i);
            return;
          }
          if (i === newItemIndexs.length - 1) {
            showIndexs.push(i);
            return;
          }
          if (showIndexs.length < this.colNum - 1) {
            showIndexs.push(i);
            return;
          }
          finalHiddenIndexs.push(i);
        });
      } else {
        finalHiddenIndexs = noShowIndexs;
      }
      // 添加空白占位节点
      const finalItemLength = newItems.length - finalHiddenIndexs.length;
      const totalRows = Math.ceil(finalItemLength / this.colNum);
      if (totalRows > 1) {
        const strArr = Array(this.colNum * totalRows - finalItemLength).fill('');
        newItems.splice(newItems.length - 1, 0, ...strArr);
      }
      const rowProps = {
        props: { ...this.rowProps },
      };
      return (
        <t-row {...rowProps}>
          {newItems.map((item, index) => {
            // 设置span（span为0时节点隐藏）
            const span = finalHiddenIndexs.includes(index) ? 0 : 12 / this.colNum;
            const colProps = {
              props: { span, key: index },
              domProps: {
                'data-index': index,
              },
            };
            return <t-col {...colProps}>{item}</t-col>;
          })}
        </t-row>
      );
    },
  },
  render() {
    return <div class="g-filter-wrapper">{this.renderContent()}</div>;
  },
};
</script>

<style lang="less" scoped>
.g-filter-wrapper {
  padding: 24px;
  // tdesign的form label样式覆盖
  .t-form__label {
    padding-right: 8px;
  }
}
</style>
