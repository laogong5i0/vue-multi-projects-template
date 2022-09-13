<template>
  <div class="iframe-view">
    <!-- <t-skeleton v-if="loading" animation="gradient" /> -->
    <div v-show="loading">预留使用骨架屏组件提高体验</div>
    <iframe
      ref="iframe"
      v-show="!loading"
      :id="id"
      :src="src"
      frameborder="0"
      width="100%"
      :height="height"
      @load="onload"
    />
  </div>
</template>

<script>
export default {
  name: 'IframeView',
  data() {
    return {
      height: '100%',
      loading: true,
    };
  },
  props: {
    src: String,
    id: { type: String, default: Date.now().toString() },
  },
  methods: {
    onload() {
      this.loading = false;
      setTimeout(() => {
        const childrenWindow = this.$refs.iframe.contentWindow;
        const body = childrenWindow.document.getElementsByTagName('body')[0];
        console.log(body.offsetHeight, 'kkk');
        this.height = `${body.offsetHeight}px`;
      }, 100);
    },
  },
};
</script>

<style lang="less" scoped>
@namespace: iframe-view;
.@{namespace} {
  height: 100%;
}
</style>
