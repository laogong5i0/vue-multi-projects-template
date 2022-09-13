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
    title: '证照名称',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'code',
    title: '证照编码',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'tag',
    title: '行业标签',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'status',
    title: '状态',
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
