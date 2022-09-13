<template>
  <div>
    <h1 style="">企业所得税年度纳税申报基础信息表</h1>
    <crazy-form>
      <div class="titleText">
        基本经营情况（<span style=" font-size: 16px; font-weight: bold;color: #f00; vertical-align: middle">*</span>
        为必填项）
      </div>
      <div class="NewTableMain"></div>
    </crazy-form>
  </div>
</template>

<script>
import CrazyForm from '@/components/crazy-form';

export default {
  components: { CrazyForm },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped></style>
