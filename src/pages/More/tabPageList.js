const tabPageList = {
  service: {
    value: '0',
    mainLabel: '帳戶服務',
    list: [
      {
        value: '0',
        label: '帳戶總覽',
        route: '',
      },
      {
        value: '1',
        label: '台幣活存',
        route: '/depositOverview',
      },
      {
        value: '2',
        label: '外幣活存',
        route: '/foreignCurrencyAccount',
      },
      {
        value: '3',
        label: '證券交割帳戶',
        route: '/tradingAccount',
      },
      {
        value: '4',
        label: '台幣定存',
        route: '',
      },
      {
        value: '5',
        label: '存錢計畫',
        route: '',
      },
      {
        value: '6',
        label: '社群帳本',
        route: '',
      },
      {
        value: '7',
        label: '綜合對帳單',
        route: '',
      },
      {
        value: '8',
        label: '匯出存摺',
        route: '/exportBankBook',
      },
    ],
  },
  apply: {
    value: '1',
    mainLabel: '申請',
    list: [
      {
        value: '0',
        label: '申請台幣活存',
        route: '',
      },
      {
        value: '1',
        label: '申請外幣活存',
        route: '',
      },
      {
        value: '2',
        label: '申請證券交割帳戶',
        route: '',
      },
      {
        value: '3',
        label: '申請信用卡',
        route: '',
      },
      {
        value: '4',
        label: '申請貸款',
        route: '',
      },
    ],
  },
  withdrawal: {
    value: '2',
    mainLabel: '轉帳提款',
    list: [
      {
        value: '0',
        label: '台幣轉帳',
        route: '/transfer',
      },
      {
        value: '1',
        label: '外幣轉帳',
        route: '/foreignCurrencyTransfer',
      },
      {
        value: '2',
        label: 'QR CODE 轉帳',
        route: '',
      },
      {
        value: '3',
        label: '無卡提款',
        route: '/cardLessATM',
      },
      {
        value: '4',
        label: '變更無卡提款密碼',
        route: '/cardLessWithDrawChgPwd',
      },
      {
        value: '5',
        label: '境外快速匯',
        route: '',
      },
      {
        value: '6',
        label: '常用帳號管理',
        route: '',
      },
      {
        value: '7',
        label: '約定帳號管理',
        route: '',
      },
    ],
  },
  invest: {
    value: '3',
    mainLabel: '投資理財',
    list: [
      {
        value: '0',
        label: '換匯',
        route: '/exchange',
      },
      {
        value: '1',
        label: '匯率',
        route: '',
      },
      {
        value: '2',
        label: '金融百貨',
        route: '/financialDepartments',
      },
    ],
  },
  creditCard: {
    value: '4',
    mainLabel: '信用卡',
    list: [
      {
        value: '0',
        label: '即時消費明細',
        route: '',
      },
      {
        value: '1',
        label: '帳單明細',
        route: '',
      },
      {
        value: '2',
        label: '繳費',
        route: '',
      },
      {
        value: '3',
        label: '額度臨調',
        route: '/adjustment',
      },
      {
        value: '4',
        label: '自動扣繳申請/查詢',
        route: '/deduct',
      },
    ],
  },
  loan: {
    value: '5',
    mainLabel: '貸款',
    list: [
      {
        value: '0',
        label: '我的貸款',
        route: '',
      },
      {
        value: '1',
        label: '應繳查詢',
        route: '',
      },
    ],
  },
  helper: {
    value: '6',
    mainLabel: '金融助手',
    list: [
      {
        value: '0',
        label: '個人化設定',
        route: '/profile',
      },
      {
        value: '1',
        label: '交易服務設定',
        route: '',
      },
      {
        value: '2',
        label: '我的最愛設定',
        route: '',
      },
      {
        value: '3',
        label: '手機號碼收款設定',
        route: '/mobileTransfer',
      },
      {
        value: '4',
        label: '數位會員升級（立即驗）',
        route: '',
      },
      {
        value: '5',
        label: '視訊約定帳號設定',
        route: '',
      },
      {
        value: '6',
        label: '預約轉帳查詢',
        route: '/reserveTransferSearch',
      },
      {
        value: '7',
        label: '訊息通知設定',
        route: '/noticeSetting',
      },
      {
        value: '8',
        label: '他行存款自動存入設定',
        route: '',
      },
      {
        value: '9',
        label: '常見問題',
        route: '/qAndA',
      },
      {
        value: '10',
        label: '金融卡啟用',
        route: '',
      },
      {
        value: '11',
        label: '金融卡掛失補發',
        route: '/lossReissue',
      },
    ],
  },
  community: {
    value: '7',
    mainLabel: '社群圈',
    list: [
      {
        value: '0',
        label: '社群圈',
        route: '/network',
      },
      {
        value: '1',
        label: '好友查詢',
        route: '',
      },
      {
        value: '2',
        label: '社群圈分潤',
        route: '',
      },
    ],
  },
};

export default tabPageList;
