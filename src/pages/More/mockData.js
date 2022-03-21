const mockData = {
  moreList: [
    {
      id: '1',
      group: 'account',
      groupName: '帳戶服務',
      blocks: [
        {
          id: 'account1',
          label: '帳戶總覽',
          route: '',
          funcID: 'C00100',
        },
        {
          id: 'account2',
          label: '台幣活存',
          route: '/taiwanDollarAccount',
          funcID: 'C00300',
        },
        {
          id: 'account3',
          label: '外幣活存',
          route: '/foreignCurrencyAccount',
          funcID: 'C00400',
        },
        {
          id: 'account4',
          label: '證券交割帳戶',
          route: '/tradingAccount',
          funcID: 'C00500',
        },
        {
          id: 'account5',
          label: '台幣定存',
          route: '',
          funcID: '',
        },
        {
          id: 'account6',
          label: '存錢計畫',
          route: '',
          funcID: 'C00600',
        },
        {
          id: 'account7',
          label: '社群帳本',
          route: '',
        },
        {
          id: 'account9',
          label: '匯出存摺',
          route: '/exportBankBook',
          funcID: 'C00800',
        },
      ],
    },
    {
      id: '2',
      group: 'apply',
      groupName: '申請',
      blocks: [
        {
          id: 'apply1',
          label: '申請台幣活存',
          route: '',
        },
        {
          id: 'apply2',
          label: '申請外幣活存',
          route: '',
        },
        {
          id: 'apply3',
          label: '申請證券交割帳戶',
          route: '',
          funcID: 'F00200',
        },
        {
          id: 'apply4',
          label: '申請信用卡',
          route: '',
        },
        {
          id: 'apply5',
          label: '申請貸款',
          route: '',
        },
      ],
    },
    {
      id: '3',
      group: 'transaction',
      groupName: '轉帳提款',
      blocks: [
        {
          id: 'transaction1',
          label: '台幣轉帳',
          route: '/transfer',
          funcID: 'D00100',
        },
        {
          id: 'transaction2',
          label: '外幣轉帳',
          route: '/foreignCurrencyTransfer',
        },
        {
          id: 'transaction3',
          label: 'QR CODE轉帳',
          route: 'QRCodeTransfer',
          funcID: 'D00200',
        },
        {
          id: 'transaction4',
          label: '無卡提款',
          route: '/cardLessATM',
          funcID: 'D00300',
        },
        {
          id: 'transaction5',
          label: '變更無卡提款密碼',
          route: '/cardLessWithDrawChgPwd',
          funcID: 'D00400',
        },
        {
          id: 'transaction6',
          label: '境外快速匯',
          route: '',
        },
        {
          id: 'transaction7',
          label: '常用帳號管理',
          route: '',
          funcID: 'D00500',
        },
        {
          id: 'transaction8',
          label: '約定帳號管理',
          route: '',
          funcID: 'D00600',
        },
      ],
    },
    {
      id: '4',
      group: 'invest',
      groupName: '投資理財',
      blocks: [
        {
          id: 'invest1',
          label: '換匯',
          route: '/exchange',
          funcID: 'E00100',
        },
        {
          id: 'invest2',
          label: '匯率',
          route: '/exchangeRate',
          funcID: 'E00200',
        },
        {
          id: 'invest3',
          label: '金融百貨',
          route: '/financialDepartments',
          funcID: 'E00300',
        },
      ],
    },
    {
      id: '5',
      group: 'creditCard',
      groupName: '信用卡',
      blocks: [
        {
          id: 'creditCard1',
          label: '即時消費明細',
          route: '',
          funcID: 'R00100',
        },
        {
          id: 'creditCard5',
          label: '消費分期',
          route: '/staging',
          funcID: 'R00200',
        },
        {
          id: 'creditCard2',
          label: '帳單明細',
          route: '',
          funcID: 'R00300',
        },
        {
          id: 'creditCard3',
          label: '繳費',
          route: '',
          funcID: 'R00400',
        },
        {
          id: 'creditCard4',
          label: '額度臨調',
          route: '/adjustment',
        },
        {
          id: 'creditCard5',
          label: '自動扣繳申請/查詢',
          route: '/automaticBillPayment',
          funcID: 'R00500',
        },
      ],
    },
    {
      id: '6',
      group: 'loan',
      groupName: '貸款',
      blocks: [
        {
          id: 'loan1',
          label: '我的貸款',
          route: '',
          funcID: 'L00100',
        },
        {
          id: 'loan2',
          label: '應繳查詢',
          route: '',
          funcID: 'L00200',
        },
      ],
    },
    {
      id: '7',
      group: 'helper',
      groupName: '金融助手',
      blocks: [
        {
          id: 'helper1',
          label: '個人化設定',
          route: '/profile',
          funcID: 'T00100',
        },
        {
          id: 'helper2',
          label: '我的最愛設定',
          route: 'favorite',
          funcID: 'S00200',
        },
        {
          id: 'helper3',
          label: '手機號碼收款設定',
          route: '/mobileTransfer',
          funcID: 'T00600',
        },
        {
          id: 'helper4',
          label: '數存會員升級(立即驗)',
          route: '',
        },
        {
          id: 'helper5',
          label: '視訊約定帳號設定',
          route: '',
        },
        {
          id: 'helper6',
          label: '預約轉帳查詢',
          route: '/reserveTransferSearch',
          funcID: 'S00300',
        },
        {
          id: 'helper7',
          label: '訊息通知設定',
          route: '/noticeSetting',
          funcID: 'S00400',
        },
        {
          id: 'helper8',
          label: '他行存款自動存入設定',
          route: '',
          funcID: 'S00500',
        },
        {
          id: 'helper9',
          label: '常見問題',
          route: '/qAndA',
          funcID: 'S00600',
        },
        {
          id: 'helper10',
          label: '金融卡啟用',
          route: '',
          funcID: 'S00700',
        },
        {
          id: 'helper11',
          label: '金融卡掛失補發',
          route: '/lossReissue',
          funcID: 'S00800',
        },
      ],
    },
    {
      id: '8',
      group: 'social',
      groupName: '社群圈',
      blocks: [
        {
          id: 'social1',
          label: '社群圈',
          route: '/network',
          funcID: 'M00100',
        },
        {
          id: 'social2',
          label: '好友查詢',
          route: '',
          funcID: 'M00200',
        },
        {
          id: 'social3',
          label: '社群圈分潤',
          route: '',
          funcID: 'M00300',
        },
      ],
    },
  ],
};

export default mockData;
