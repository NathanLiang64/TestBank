const mockDataset = [
  {
    // Index 0 是否已申請bankee帳戶(台幣) -> Alert 1 (FBI-30)
    plans: [],
    subAccounts: [],
    totalSubAccountCount: 0,
  },
  {
    // Index 1 是否已開立8個子帳戶 -> Alert 2 (FBI-30)
    plans: [],
    subAccounts: [
      { accountNo: '11111111111111', balance: 100 },
      { accountNo: '22222222222222', balance: 100 },
      { accountNo: '33333333333333', balance: 100 },
      { accountNo: '44444444444444', balance: 100 },
      { accountNo: '55555555555555', balance: 100 },
      { accountNo: '66666666666666', balance: 100 },
      { accountNo: '77777777777777', balance: 100 },
      { accountNo: '88888888888888', balance: 100 },
    ],
    totalSubAccountCount: 8,
  },
  {
    // Index 2 該子帳戶餘額是否為0 -> Alert 3 (FBI-30)
    plans: [],
    subAccounts: [
      { accountNo: '11111111111111', balance: 100 },
      { accountNo: '22222222222222', balance: 100 },
      { accountNo: '33333333333333', balance: 100 },
      { accountNo: '44444444444444', balance: 0 },
      { accountNo: '55555555555555', balance: 100 },
      { accountNo: '66666666666666', balance: 100 },
      { accountNo: '77777777777777', balance: 100 },
      { accountNo: '88888888888888', balance: 100 },
    ],
    totalSubAccountCount: 8,
  },
  {
    // Index 3 沒有存錢計畫 -> (FBI-12)
    plans: [],
    subAccounts: [
      {
        accountNo: '04300491000001',
        balance: 0,
      },
    ],
    totalSubAccountCount: 1,
  },
  {
    // Index 4 有存錢計畫 -> (FBI-11)
    plans: [
      {
        planId: 'UUID',
        progCode: 0,
        imageId: 1,
        name: '假的計畫資料7',
        startDate: '20220101',
        endDate: '20221231',
        cycleMode: 1,
        cycleTime: 0,
        amount: 10000,
        subAccountNo: '04300491000001',
        bindAccountNo: '04300491000001',
        isMaster: true,
      },
    ],
    subAccounts: [
      {
        accountNo: '04300491000001',
        balance: 100,
      },
    ],
    totalSubAccountCount: 1,
  },
];

export const getDepositPlans = () => mockDataset[4];
