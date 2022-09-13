<template>
  <div>
    <t-divider>demo1：</t-divider>
    <search-control-panel
      ref="queryControl"
      :config="queryControlConfig"
      @search="resetPageQueryList"
    ></search-control-panel>
  </div>
</template>
<script>
const spztSelectListMap = {
  '00': { value: '00', label: '待提交', tagTheme: 'success' },
  '01': { value: '01', label: '审批中', tagTheme: 'warning' },
};

export default {
  data() {
    return {
      queryControlConfig: {
        stqjr: {
          label: '申请提交人',
          key: 'sqtjr',
          type: 'input',
          value: '',
        },
        spzt: {
          label: '审批状态：',
          key: 'spzt',
          type: 'select',
          value: '',
          selectList: Object.values(spztSelectListMap),
        },
        sqrq: {
          label: '申请提交时间',
          key: 'sqrq',
          type: 'range-datepicker',
          value: [],
        },
      },
    };
  },
  methods: {
    resetPageQueryList() {
      const formdata = this.$refs.queryControl.getParams();
      console.log(formdata);
    },
  },
};
</script>
