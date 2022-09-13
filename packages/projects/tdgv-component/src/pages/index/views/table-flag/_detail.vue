<template>
  <div class="m-detail">detail</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    console.log(this.$route.params);
  },
};
</script>

<style lang="less" scoped></style>
