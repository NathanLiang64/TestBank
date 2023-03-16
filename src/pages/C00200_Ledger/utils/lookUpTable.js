const ledgerTypeList = [
  {
    ledgerType: '945',
    typeName: '聚餐',
  },
  {
    ledgerType: '946',
    typeName: '社團',
  },
  {
    ledgerType: '947',
    typeName: '收禮',
  },
  {
    ledgerType: '948',
    typeName: '存錢',
  },
  {
    ledgerType: '949',
    typeName: '團購',
  },
  {
    ledgerType: '950',
    typeName: '旅行',
  },
  {
    ledgerType: '951',
    typeName: '活動',
  },
  {
    ledgerType: '952',
    typeName: '學校',
  },
  {
    ledgerType: '953',
    typeName: '約會',
  },
  {
    ledgerType: '954',
    typeName: '朋友',
  },
  {
    ledgerType: '955',
    typeName: '公司',
  },
  {
    ledgerType: '956',
    typeName: '家庭',
  },
  {
    ledgerType: '957',
    typeName: '休閒',
  },
];

const ledgerUsageList = [
  {
    usageType: '1',
    typeName: '食',
  },
  {
    usageType: '2',
    typeName: '衣',
  },
  {
    usageType: '3',
    typeName: '住',
  },
  {
    usageType: '4',
    typeName: '行',
  },
  {
    usageType: '5',
    typeName: '育',
  },
  {
    usageType: '6',
    typeName: '樂',
  },
  {
    usageType: '7',
    typeName: '其他',
  },
];

export const getLedgerTypeName = (ledgerType) => {
  const name = ledgerTypeList.find((item) => +item.ledgerType === +ledgerType);
  return name?.typeName;
};

export const getLedgerUsageName = (usageType) => {
  const name = ledgerUsageList.find((item) => +item.usageType === +usageType);
  return name?.typeName;
};
