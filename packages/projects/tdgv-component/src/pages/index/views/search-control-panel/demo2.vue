<template>
  <div>
    <t-divider>demo2：</t-divider>
    <search-control-panel
      ref="queryControl"
      :config="queryControlConfig"
      @search="resetPageQueryList"
    ></search-control-panel>
  </div>
</template>
<script>
const condingStatusList = [
  { label: '启用', value: 'Y' },
  { label: '停用', value: 'N' },
];

export default {
  data() {
    return {
      queryControlConfig: [
        { label: '合并编码：', key: 'spbm', type: 'input', value: '' },
        { label: '货物和劳务名称：', key: 'hwhlwmc', type: 'input', value: '' },
        { label: '关键字：', key: 'gjz', type: 'input', value: '' },
        { label: '编码状态：', key: 'bmzt', type: 'select', selectList: condingStatusList, value: '', clearable: true },
        {
          label: '启用日期起',
          key: 'qyrqq',
          relation: 'qyrqz',
          timeRange: 'start',
          type: 'datepicker',
          value: '',
          clearable: true,
        },
        {
          label: '启用日期止',
          key: 'qyrqz',
          relation: 'qyrqq',
          timeRange: 'end',
          type: 'datepicker',
          value: '',
          clearable: true,
        },
        {
          label: '停用日期起：',
          key: 'tyrqq',
          relation: 'tyrqz',
          timeRange: 'start',
          type: 'datepicker',
          value: '',
          clearable: true,
        },
        {
          label: '停用日期止：',
          relation: 'tyrqq',
          timeRange: 'end',
          key: 'tyrqz',
          type: 'datepicker',
          value: '',
          clearable: true,
        },
      ],
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
