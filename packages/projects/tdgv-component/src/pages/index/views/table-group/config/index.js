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
    title: '督办内容',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'date',
    title: '督办时间',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'status',
    title: '督办类型',
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
