const mockData = {
  getCards: {
    cards: [
      {
        id: 1,
        cardBranch: '信義分行',
        cardName: '保時捷車友會',
        cardAccount: '04300499001234',
        cardBalance: 2000000,
        cardColor: 'purple',
        interbankWithdrawal: 3,
        interbankTransfer: 5,
        interest: 3,
        interestRate: 2.6,
        interestRateLimit: '5萬',
        interbankTransferLimit: 5,
        interbankTransferRemaining: 3,
        functionList: [
          { title: '轉帳', path: '/transfer', icon: null },
          { title: '無卡提款', path: '/cardLessATM', icon: null },
        ],
        moreList: [
          { title: '定存', path: '/', icon: 'monetization_on' },
          { title: '換匯', path: '/', icon: 'euro' },
        ],
      },
      {
        id: 2,
        cardBranch: '大安分行',
        cardName: '帳戶 2',
        cardAccount: '04300499005678',
        cardBalance: 32923,
        cardColor: 'pink',
        interbankWithdrawal: 3,
        interbankTransfer: 5,
        interest: 3,
        interestRate: 2.6,
        interestRateLimit: '5萬',
        interbankTransferLimit: 5,
        interbankTransferRemaining: 4,
        functionList: [
          { title: '轉帳', path: '/transfer', icon: null },
          { title: '無卡提款', path: '/cardLessATM', icon: null },
        ],
        moreList: [
          { title: '定存', path: '/', icon: 'monetization_on' },
          { title: '換匯', path: '/', icon: 'euro' },
        ],
      },
      {
        id: 3,
        cardBranch: '古亭分行',
        cardName: '帳戶 3',
        cardAccount: '04300499009101',
        cardBalance: 258020,
        cardColor: 'yellow',
        interbankWithdrawal: 3,
        interbankTransfer: 5,
        interest: 3,
        interestRate: 2.6,
        interestRateLimit: '5萬',
        interbankTransferLimit: 5,
        interbankTransferRemaining: 1,
        functionList: [
          { title: '轉帳', path: '/transfer', icon: null },
          { title: '無卡提款', path: '/cardLessATM', icon: null },
        ],
        moreList: [
          { title: '定存', path: '/', icon: 'monetization_on' },
          { title: '換匯', path: '/', icon: 'euro' },
        ],
      },
    ],
  },
  getFavoriteBankCodeList: {
    favoriteBankCodeList: [
      { bankNo: '805', bankName: '遠東商銀' },
      { bankNo: '806', bankName: '元大商銀' },
      { bankNo: '812', bankName: '台新銀行' },
    ],
  },
  getFavoriteAcct: {
    favoriteAcctList: [
      {
        id: 'uLoH7Uli3qTpZh3tzu0BQp8cqtKhrThB',
        bankNo: '805',
        bankName: '遠東商銀',
        acctId: '04300499004455',
        acctName: 'Robert Fox',
        acctImg: 'https://images.unsplash.com/photo-1591605555749-d25cfd47e981?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 'SX2yA9f7XnFQ9HO9C6gfY5LyVx0yy8uF',
        bankNo: '806',
        bankName: '元大商銀',
        acctId: '04300499006677',
        acctName: 'Jermey123',
        acctImg: '',
      },
    ],
  },
  getDesignedAcct: {
    designedAcctList: [
      {
        id: 'fL9HylbGfbbRPs9N5AAgy0cazPT2wDXc',
        bankNo: '805',
        bankName: '遠東商銀',
        acctId: '04300499008899',
        acctName: 'Catherine Smith',
        acctImg: 'https://images.unsplash.com/photo-1528341866330-07e6d1752ec2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=801&q=80',
      },
      {
        id: 'xC3wzNqK0x3OOkih0uDxJP5aXeP5eFwu',
        bankNo: '805',
        bankName: '遠東商銀',
        acctId: '04300499001010',
        acctName: 'Jason',
        acctImg: '',
      },
      {
        id: 's1JkfvhrK0pmtz8UtPYafyjD0Enprlqp',
        bankNo: '806',
        bankName: '元大商銀',
        acctId: '04300499001011',
        acctName: 'Mike',
        acctImg: '',
      },
    ],
  },
};

export default mockData;
