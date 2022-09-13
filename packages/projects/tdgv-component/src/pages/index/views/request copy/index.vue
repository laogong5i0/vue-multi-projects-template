<template>
  <t-content style="padding: 24px">
    <div class="tdesign-demo-block">
      <t-alert theme="success" message="这是一条成功的消息提示" />
      <t-alert theme="info" :message="infoMessage" />
      <t-alert theme="warning">
        <template #message> 这是一条警示信息</template>
      </t-alert>
      <t-alert theme="error"> 高危操作/出错信息提示</t-alert>
    </div>

    <div class="t-demo-row">
      <t-icon name="add"></t-icon>
      <t-icon name="check-circle-filled" size="small" />
      <t-icon name="check-circle-filled" />
      <t-icon name="check-circle-filled" size="medium" />
      <t-icon name="check-circle-filled" size="large" />
      <t-icon name="check-circle-filled" size="25px" />
      <t-icon name="check-circle-filled" size="2em" />
      <span class="test-img"></span>
    </div>

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
