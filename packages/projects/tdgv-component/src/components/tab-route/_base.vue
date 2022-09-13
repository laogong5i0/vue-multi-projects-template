<template>
  <div :class="extraClass" class="g-tabRoute__container">
    <template v-if="isOpen">
      <t-tabs :value="value" theme="card" @remove="removeTab" @change="changeTab">
        <t-tab-panel v-for="data in panelData" :key="data.value" :value="data.value" :removable="data.removable">
          <div slot="label" class="g-label__container">
            <t-tooltip :content="data.label" placement="top" show-arrow>
              <div class="g-label__content">
                <div class="g-tab-item-text">{{ data.label }}</div>
                <div class="g-tab-item-cover"></div>
                <div class="g-tab-item-line"></div></div
            ></t-tooltip>
          </div>
        </t-tab-panel>
      </t-tabs>
      <keep-alive v-if="isCacheMode">
        <slot><router-view :class="extraContentClass" /></slot>
      </keep-alive>
      <slot v-else><router-view :class="extraContentClass" /></slot>
    </template>
    <slot v-else><router-view :class="extraContentClass" /></slot>
  </div>
</template>

<script>
let dialogInstance = null;
let tabValue = 0;
// 页签最大个数
const defaultMaxTabCount = 20;
export default {
  name: 'GTabRoute',
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
    isCacheMode: {
      type: Boolean,
      default: true,
    },
    maxTabCount: {
      type: Number,
      default: defaultMaxTabCount,
    },
    extraClass: {
      type: String,
      default: '',
    },
    extraContentClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      panelData: [],
      value: null,
    };
  },
  watch: {
    isOpen(value) {
      value && this.dealRouteChange(this.$route);
    },
    $route(to) {
      if (!this.isOpen) return;
      this.dealRouteChange(to);
    },
  },
  created() {
    // 添加路由前 拦截
    this.$router.beforeEach((to, from, next) => {
      // 页签个数超过最大限制
      if (this.isOpen && this.panelData.length >= this.maxTabCount) {
        // 如果是切换 已经存在的页签则放过
        const existPanel = this.panelData.find((panel) => panel.name === to.name);
        if (existPanel) {
          next();
          return;
        }
        dialogInstance = this.$dialog.alert({
          header: '提示',
          body: `最多可同时开启 ${this.maxTabCount} 个页签，请关闭其他页签后重试！`,
          theme: 'warning',
          onConfirm: async () => {
            dialogInstance && dialogInstance.hide();
          },
        });
        return;
      }
      next();
    });
  },
  methods: {
    dealRouteChange(to) {
      // 路由去重，如果有直接跳转到 已经打卡的路由界面
      const existPanel = this.panelData.find((panel) => panel.name === to.name);
      if (existPanel) {
        this.value = existPanel.value;
      } else {
        this.dealAddTab(to);
      }
    },
    /**
     * 处理添加页签
     */
    dealAddTab(to) {
      const { title } = to.meta;
      tabValue += 1;

      this.panelData.push({
        label: title || to.path,
        value: tabValue,
        removable: true,
        path: to.path,
        name: to.name,
        params: to.params,
        query: to.query,
      });

      // 重设 第一个tab 是否可删除
      this.$set(this.panelData[0], 'removable', this.panelData.length !== 1);

      this.value = tabValue;
    },
    /**
     * 移出tab时触发
     */
    removeTab({ value }) {
      const index = this.panelData.findIndex((data) => data.value === value);
      if (index < 0) return false;
      this.panelData.splice(index, 1);

      // 剩下最后一个tab，不可删除
      if (this.panelData.length === 1) {
        this.$set(this.panelData[0], 'removable', false);
      }

      // 删除当前选中的 tab
      if (this.value === value) {
        this.changeTab(this.panelData[Math.max(index - 1, 0)].value);
      }

      return false;
    },
    /**
     * 当前tab 变更时触发
     */
    changeTab(value) {
      this.value = value;
      // 找到当前 路由url
      const currentPanel = this.panelData.find((panel) => panel.value === value);
      // 考虑代参数情况，通过url跳转
      this.$router.push({
        path: currentPanel.path,
        params: currentPanel.params,
        query: currentPanel.query,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@tabHeight: 40px;
@tabLineHeight: 40px;
@prefix-gov: g;
@prefix: t;

.@{prefix-gov}-tabRoute__container {
  > .@{prefix}-tabs {
    // ie兼容代码 yxuanzhang 2022-02-23 15:49:56 start
    // 解决overflow hidden，挤压兄弟元素问题
    .remove-btn {
      position: absolute;
      top: 13px;
      right: 12px;
    }
    // ie兼容代码 yxuanzhang 2022-02-23 15:49:56 end

    .@{prefix-gov}-label__container {
      height: @tabHeight;
      line-height: @tabLineHeight;

      .@{prefix-gov}-label__content {
        max-width: 76px;
        overflow: hidden;
      }
      .@{prefix-gov}-tab-item-text {
        min-width: 37px;
      }
      .@{prefix-gov}-tab-item-cover {
        position: absolute;
        top: 0;
        right: -2px;
        display: inline-block;
        width: 13px;
        height: @tabHeight;
        background-image: linear-gradient(270deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
      }
      .@{prefix-gov}-tab-item-line {
        position: absolute;
        top: 12px;
        right: -32px;
        width: 1px;
        height: 16px;
        background-color: #f7f8fa;
      }
    }

    .@{prefix}-tabs__nav-item {
      position: relative;
      height: @tabHeight;
      padding-right: 32px;
      padding-left: 12px;
      margin-right: 2px;
      line-height: @tabLineHeight;
      background: #fff;
      &:only-child {
        /* stylelint-disable declaration-no-important*/
        padding-right: 12px !important;
      }
      &:last-child {
        margin-right: 24px;
      }
      &:first-child {
        margin-left: 24px;
      }
    }

    .@{prefix}-tabs__nav-scroll {
      background-color: #fff;
    }

    .@{prefix}-tabs__nav--card.@{prefix}-tabs__nav-item,
    .@{prefix}-tabs__nav--card.@{prefix}-tabs__nav-item:not(:first-of-type) {
      border: 0;
    }

    .@{prefix}-tabs__nav--card.@{prefix}-tabs__nav-item.@{prefix}-is-active {
      background-color: #f7f8fa;
      border-bottom-color: #f7f8fa;
      border-radius: 4px 4px 0 0;
      .@{prefix-gov}-tab-item-cover {
        background-image: linear-gradient(270deg, #f7f8fa 0%, rgba(247, 248, 250, 0) 100%);
      }
    }

    .@{prefix}-tabs__btn.@{prefix}-size-m {
      width: 24px;
      height: @tabHeight;
      line-height: @tabLineHeight;
      &:hover {
        color: #5383ec;
      }
    }
    .@{prefix}-tabs__nav--card.@{prefix}-tabs__nav-item:not(.@{prefix}-is-disabled):not(.@{prefix}-is-active):hover {
      background-color: #f7f8fa;
      .@{prefix-gov}-tab-item-cover {
        background-image: linear-gradient(270deg, #f7f8fa 0%, rgba(247, 248, 250, 0) 100%);
      }
    }
  }
}
</style>
