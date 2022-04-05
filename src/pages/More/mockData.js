const mockData = {
  moreList: [
    {
      id: '1',
      group: 'account',
      groupName: '帳戶服務',
      items: [
        {
          id: 'account1',
          name: '帳戶總覽',
          route: '',
          actKey: 'C00100',
        },
        {
          id: 'account2',
          name: '台幣活存',
          route: '/taiwanDollarAccount',
          actKey: 'C00300',
        },
        {
          id: 'account3',
          name: '外幣活存',
          route: '/foreignCurrencyAccount',
          actKey: 'C00400',
        },
        {
          id: 'account4',
          name: '證券交割帳戶',
          route: '/tradingAccount',
          actKey: 'C00500',
        },
        {
          id: 'account5',
          name: '台幣定存',
          route: '',
          actKey: '',
        },
        {
          id: 'account6',
          name: '存錢計畫',
          route: '',
          actKey: 'C00600',
        },
        {
          id: 'account7',
          name: '社群帳本',
          route: '',
        },
        {
          id: 'account9',
          name: '匯出存摺',
          route: '/exportBankBook',
          actKey: 'C00800',
        },
      ],
    },
    {
      id: '2',
      group: 'apply',
      groupName: '申請',
      items: [
        {
          id: 'apply1',
          name: '申請台幣活存',
          route: '',
          actKey: 'F00100',
        },
        {
          id: 'apply2',
          name: '申請外幣活存',
          route: '',
          actKey: '',
        },
        {
          id: 'apply3',
          name: '申請證券交割帳戶',
          route: '',
          actKey: 'F00200',
        },
        {
          id: 'apply4',
          name: '申請信用卡',
          route: '',
        },
        {
          id: 'apply5',
          name: '申請貸款',
          route: '',
        },
      ],
    },
    {
      id: '3',
      group: 'transaction',
      groupName: '轉帳提款',
      items: [
        {
          id: 'transaction1',
          name: '台幣轉帳',
          route: '/transfer',
          actKey: 'D00100',
        },
        {
          id: 'transaction2',
          name: '外幣轉帳',
          route: '/foreignCurrencyTransfer',
        },
        {
          id: 'transaction3',
          name: 'QR CODE轉帳',
          route: 'QRCodeTransfer',
          actKey: 'D00200',
        },
        {
          id: 'transaction4',
          name: '無卡提款',
          route: '/cardLessATM',
          actKey: 'D00300',
        },
        {
          id: 'transaction5',
          name: '變更無卡提款密碼',
          route: '/cardLessWithDrawChgPwd',
          actKey: 'D00400',
        },
        {
          id: 'transaction6',
          name: '境外快速匯',
          route: '',
        },
        {
          id: 'transaction7',
          name: '常用帳號管理',
          route: '',
          actKey: 'D00500',
        },
        {
          id: 'transaction8',
          name: '約定帳號管理',
          route: '',
          actKey: 'D00600',
        },
      ],
    },
    {
      id: '4',
      group: 'invest',
      groupName: '投資理財',
      items: [
        {
          id: 'invest1',
          name: '換匯',
          route: '/exchange',
          actKey: 'E00100',
        },
        {
          id: 'invest2',
          name: '匯率',
          route: '/exchangeRate',
          actKey: 'E00200',
        },
        {
          id: 'invest3',
          name: '金融百貨',
          route: '/financialDepartments',
          actKey: 'E00300',
        },
      ],
    },
    {
      id: '5',
      group: 'creditCard',
      groupName: '信用卡',
      items: [
        {
          id: 'creditCard1',
          name: '即時消費明細',
          route: '',
          actKey: 'R00100',
        },
        {
          id: 'creditCard5',
          name: '消費分期',
          route: '/staging',
          actKey: 'R00200',
        },
        {
          id: 'creditCard2',
          name: '帳單明細',
          route: '',
          actKey: 'R00300',
        },
        {
          id: 'creditCard3',
          name: '繳費',
          route: '',
          actKey: 'R00400',
        },
        {
          id: 'creditCard4',
          name: '額度臨調',
          route: '/adjustment',
        },
        {
          id: 'creditCard5',
          name: '自動扣繳申請/查詢',
          route: '/automaticBillPayment',
          actKey: 'R00500',
        },
      ],
    },
    {
      id: '6',
      group: 'loan',
      groupName: '貸款',
      items: [
        {
          id: 'loan1',
          name: '我的貸款',
          route: '',
          actKey: 'L00100',
        },
        {
          id: 'loan2',
          name: '應繳查詢',
          route: '',
          actKey: 'L00200',
        },
      ],
    },
    {
      id: '7',
      group: 'helper',
      groupName: '金融助手',
      items: [
        {
          id: 'helper1',
          name: '個人化設定',
          route: '/profile',
          actKey: 'T00100',
        },
        {
          id: 'helper2',
          name: '我的最愛設定',
          route: 'favorite',
          actKey: 'S00200',
        },
        {
          id: 'helper3',
          name: '手機號碼收款設定',
          route: '/mobileTransfer',
          actKey: 'T00600',
        },
        {
          id: 'helper4',
          name: '數存會員升級(立即驗)',
          route: '',
        },
        {
          id: 'helper5',
          name: '視訊約定帳號設定',
          route: '',
        },
        {
          id: 'helper6',
          name: '預約轉帳查詢',
          route: '/reserveTransferSearch',
          actKey: 'S00300',
        },
        {
          id: 'helper7',
          name: '訊息通知設定',
          route: '/noticeSetting',
          actKey: 'S00400',
        },
        {
          id: 'helper8',
          name: '他行存款自動存入設定',
          route: '',
          actKey: 'S00500',
        },
        {
          id: 'helper9',
          name: '常見問題',
          route: '/qAndA',
          actKey: 'S00600',
        },
        {
          id: 'helper10',
          name: '金融卡啟用',
          route: '',
          actKey: 'S00700',
        },
        {
          id: 'helper11',
          name: '金融卡掛失補發',
          route: '/lossReissue',
          actKey: 'S00800',
        },
      ],
    },
    {
      id: '8',
      group: 'social',
      groupName: '社群圈',
      items: [
        {
          id: 'social1',
          name: '社群圈',
          route: '/network',
          actKey: 'M00100',
        },
        {
          id: 'social2',
          name: '好友查詢',
          route: '',
          actKey: 'M00200',
        },
        {
          id: 'social3',
          name: '社群圈分潤',
          route: '',
          actKey: 'M00300',
        },
      ],
    },
  ],
};

export default mockData;
