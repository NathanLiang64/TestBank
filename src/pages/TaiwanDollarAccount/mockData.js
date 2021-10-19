const mockData = {
  getAccounts: [
    {
      id: 1,
      acctBranch: '信義分行',
      acctName: '保時捷車友會',
      acctId: '04300499312641',
      acctType: '004',
      acctBalx: 2000000,
      ccyCd: 'TWD',
      interbankWithdrawal: 3,
      interbankTransfer: 5,
      interest: 3,
      interestRate: 2.6,
      interestRateLimit: '5萬',
      functionList: [
        { title: '轉帳', path: '/transfer', icon: null },
        { title: '無卡提款', path: '/cardLessATM', icon: null },
      ],
      moreList: [
        { title: '定存', path: '/', icon: 'monetization_on' },
        { title: '換匯', path: '/', icon: 'euro' },
        { title: '存摺封面下載', path: '/', icon: 'system_update' },
        // { title: '存摺封面下載', path: 'http://114.32.27.40:8080/test/downloadPDF', icon: 'system_update' },
      ],
    },
    // {
    //   id: 2,
    //   acctBranch: '大安分行',
    //   acctName: '另一張存款卡',
    //   acctId: '04300499001234',
    //   acctType: '004',
    //   acctBalx: 1680000,
    //   ccyCd: 'TWD',
    //   interbankWithdrawal: 1,
    //   interbankTransfer: 5,
    //   interest: 5,
    //   interestRate: 3.6,
    //   interestRateLimit: '6萬',
    //   functionList: [
    //     { title: '轉帳', path: '/transfer', icon: null },
    //     { title: '無卡提款', path: '/cardLessATM', icon: null },
    //   ],
    //   moreList: [
    //     { title: '設為速查帳戶', path: '/cardLessATM', icon: 'playlist_add' },
    //     { title: '增加子帳戶', path: '/cardLessATM', icon: 'library_add' },
    //     { title: '存摺封面下載', path: '/cardLessATM', icon: 'system_update' },
    //     { title: '編輯帳戶別名', path: '/cardLessATM', icon: 'edit' },
    //   ],
    // },
  ],
};

export default mockData;
