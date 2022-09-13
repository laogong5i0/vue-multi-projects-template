<template>
  <div>
    <t-divider>demo6</t-divider>
    <p>说明: 也可以放置其他内容</p>
    <g-filter-wrapper :expand="expand">
      <div class="block">1</div>
      <div class="block">2</div>
      <div class="block">3</div>
      <div class="block">4</div>
      <div>5</div>
      <div>6</div>
      <div style="text-align: right">
        <t-button @click="expand = !expand">按钮</t-button>
      </div>
    </g-filter-wrapper>
  </div>
</template>
<script>
export default {
  data() {
    return {
      expand: false,
    };
  },
};
</script>
<style lang="less" scoped>
.block {
  display: block;
  width: 100%;
  height: 32px;
  background-color: gray;
}
</style>
