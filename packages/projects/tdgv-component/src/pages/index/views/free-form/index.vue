<template>
  <div>
    Free Form {{ formData }}
    <free-form> lll </free-form>
  </div>
</template>

<script>
import FreeForm from '@/pages/index/components/free-form';

export default {
  name: 'FreeFormDemo',
  components: {
    FreeForm,
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

<style scoped lang="less"></style>
