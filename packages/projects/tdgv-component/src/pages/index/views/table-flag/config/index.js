export const selectOptions = [
  {
    label: '选项一',
    value: '1',
  },
  {
    label: '选项二',
    value: '2',
  },
  {
    label: '选项三',
    value: '3',
  },
];

export const columns = [
  {
    align: 'center',
    width: 60,
    ellipsis: true,
    title: '序号',
    colKey: 'orderNo',
    cell: (h, { rowIndex }) => rowIndex + 1,
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'code',
    title: '编号',
    cell: 'code',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'name',
    title: '名称',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'age',
    title: '年龄',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'address',
    title: '详细地址',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'status',
    title: '标签状态',
    cell: 'status',
  },
  {
    align: 'left',
    width: 120,
    ellipsis: true,
    fixed: 'right',
    title: '操作',
    cell: 'op',
  },
];
