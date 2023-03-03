export const typeOptions = [
  {
    label: '食',
    value: '1',
  },
  {
    label: '衣',
    value: '2',
  },
  {
    label: '住',
    value: '3',
  },
  {
    label: '行',
    value: '4',
  },
  {
    label: '育',
    value: '5',
  },
  {
    label: '樂',
    value: '6',
  },
  {
    label: '其他',
    value: '7',
  },
];

export const handleTypeText = (typeId) => {
  switch (typeId) {
    case '1':
      return '食';
    case '2':
      return '衣';
    case '3':
      return '住';
    case '4':
      return '行';
    case '5':
      return '育';
    case '6':
      return '樂';
    case '7':
      return '其他';
    default:
      return '--';
  }
};
