<template>
  <div class="g-card-menu-item">
    <div class="g-card-menu-item__content" @click="handleClick">
      <div class="g-card-menu-item__item-left">
        <img :src="data.avatar" alt="" />
      </div>
      <div class="g-card-menu-item__item-right">
        <div class="g-card-menu-item__title">{{ titleComp }}</div>
        <div class="g-card-menu-item__desc">{{ descComp }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardItem',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    titleComp() {
      return this.data.title && this.data.title.slice(0, 24);
    },
    descComp() {
      return this.data.desc && this.data.desc.slice(0, 42);
    },
  },
  methods: {
    handleClick() {
      typeof this.data.onClick === 'function' && this.data.onClick();
    },
  },
};
</script>

<style lang="less" scoped>
@namespace: g-card-menu-item;
.@{namespace} {
  display: inline-block;
  &__content {
    position: relative;
    height: 134px;
    padding: 24px;
    margin: 0 16px 16px 0;
    overflow: hidden;
    vertical-align: middle;
    cursor: pointer;
    background: #fff;
    border: 1px solid rgba(39, 40, 46, 0.08);
    border-radius: 2px;
    &:hover {
      box-shadow: 0 4px 10px 0 rgba(17, 31, 138, 0.1);
    }
  }
  &__item-left {
    position: absolute;
    top: 50%;
    left: 24px;
    display: inline-block;
    margin-right: 16px;
    transform: translateY(-50%);
    > img {
      width: 48px;
      height: 48px;
      border-radius: 5px;
    }
  }
  &__item-right {
    position: absolute;
    right: 24px;
    left: 88px;
    display: inline-block;
  }
  &__title {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    letter-spacing: 0;
    color: #333;
  }
  &__desc {
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0;
    color: #666;
  }
}
</style>
