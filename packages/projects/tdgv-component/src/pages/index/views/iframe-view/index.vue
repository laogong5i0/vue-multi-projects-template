<template>
  <div class="iframe-view-demo">
    <iframe-view
      :src="`${routerBase}/static/sb/xgmzzs/form/index.html?ywzt=Y&gdslxDm=1&sssqQ=2022-01-01&sssqZ=2022-12-31&skssq_q=2022-01-01&skssq_z=2022-12-31&nsqx_dm=10&sbqx=2023-05-31&zsxmDm=10104&zspmDm=101040001&nsqxDmIn=&tjNd=2023&tjYf=03`"
    />
  </div>
</template>

<script>
import IframeView from '@/pages/index/components/iframe-view';

export default {
  name: 'IframeViewDemo',
  components: {
    IframeView,
  },
  props: {
    name: String,
  },
  data() {
    return {
      formData: '112566',
    };
  },
};
</script>

<style scoped lang="less">
@namespace: iframe-view-demo;
.@{namespace} {
  width: 100%;
  height: 100%;
}
</style>
