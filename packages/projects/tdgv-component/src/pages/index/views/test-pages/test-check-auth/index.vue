<template>
  <div style="padding: 50px; margin: 50px">
    <t-button block variant="dashed" @click="useGLayout('N')">url带?useGLayout=N,不使用g-layout</t-button>
    <t-button block variant="dashed" @click="useGLayout('Y')">url带?useGLayout=Y，使用g-layout</t-button>
    <t-button block variant="outline" @click="toPage">url带?token=1234567890</t-button>
    <t-button block variant="dashed" @click="setStorage('1234567890')">token（1234567890）存入缓存</t-button>
    <t-button block variant="outline" @click="setStorage('123')">token（123）存入缓存</t-button>
    <t-button block variant="dashed" @click="removeStorage">清除sessionStorage的token缓存</t-button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    useGLayout(type) {
      window.location.href = `http://localhost:9000/check-auth/test-check-auth?useGLayout=${type}`;
    },
    toPage() {
      window.location.href = 'http://localhost:9000/check-auth/test-check-auth?token=1234567890';
    },
    setStorage(item) {
      sessionStorage.setItem('token', item);
      this.$message.success(`token（${item}）已存入缓存,即将刷新页面`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    removeStorage() {
      sessionStorage.removeItem('token');
      this.$message.success('token已移除缓存,即将刷新页面');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  },
};
</script>
