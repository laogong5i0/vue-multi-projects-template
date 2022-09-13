<template>
  <t-content style="padding: 24px">
    <demo-request></demo-request>
  </t-content>
</template>

<script>
import DemoRequest from '@/pages/index/components/demo/request';

export default {
  components: {
    DemoRequest,
  },

  data() {
    return {
      infoMessage: '这是一条普通的消息提示',
    };
  },
};
</script>
