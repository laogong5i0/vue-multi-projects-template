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
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
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
    title: '操作',
    cell: 'op',
  },
];
