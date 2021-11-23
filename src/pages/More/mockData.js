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
        },
        {
          id: 'account2',
          label: '台幣活存',
          route: '/taiwanDollarAccount',
        },
        {
          id: 'account3',
          label: '外幣活存',
          route: '/foreignCurrencyAccount',
        },
        {
          id: 'account4',
          label: '證券交割帳戶',
          route: '/tradingAccount',
        },
        {
          id: 'account5',
          label: '台幣定存',
          route: '',
        },
        {
          id: 'account6',
          label: '存錢計畫',
          route: '',
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
    // TODO: 轉帳路由記得改回來
    {
      id: '3',
      group: 'transaction',
      groupName: '轉帳提款',
      blocks: [
        {
          id: 'transaction1',
          label: '台幣轉帳',
          route: '/transferStatic',
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
        },
        {
          id: 'transaction4',
          label: '無卡提款',
          route: '/cardLessATM',
        },
        {
          id: 'transaction5',
          label: '變更無卡提款密碼',
          route: '/cardLessWithDrawChgPwd',
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
        },
        {
          id: 'transaction8',
          label: '約定帳號管理',
          route: '',
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
        },
        {
          id: 'invest2',
          label: '匯率',
          route: '',
        },
        {
          id: 'invest3',
          label: '金融百貨',
          route: '/financialDepartments',
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
        },
        {
          id: 'creditCard2',
          label: '帳單明細',
          route: '',
        },
        {
          id: 'creditCard3',
          label: '繳費',
          route: '',
        },
        {
          id: 'creditCard4',
          label: '額度臨調',
          route: '/adjustment',
        },
        {
          id: 'creditCard5',
          label: '自動扣繳申請/查詢',
          route: '/deduct',
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
        },
        {
          id: 'loan2',
          label: '應繳查詢',
          route: '',
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
        },
        {
          id: 'helper2',
          label: '我的最愛設定',
          route: 'favorite',
        },
        {
          id: 'helper3',
          label: '手機號碼收款設定',
          route: '/mobileTransfer',
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
        },
        {
          id: 'helper7',
          label: '訊息通知設定',
          route: '/noticeSetting',
        },
        {
          id: 'helper8',
          label: '他行存款自動存入設定',
          route: '',
        },
        {
          id: 'helper9',
          label: '常見問題',
          route: '/qAndA',
        },
        {
          id: 'helper10',
          label: '金融卡啟用',
          route: '',
        },
        {
          id: 'helper11',
          label: '金融卡掛失補發',
          route: '/lossReissue',
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
        },
        {
          id: 'social2',
          label: '好友查詢',
          route: '',
        },
        {
          id: 'social3',
          label: '社群圈分潤',
          route: '',
        },
      ],
    },
  ],
};

export default mockData;
