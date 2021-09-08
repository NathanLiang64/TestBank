// import userAxios from 'apis/axiosConfig';

// 頁面資訊
const pageInfo = {
  login: {
    title: '登入',
  },
  lossReissue: {
    title: '金融卡掛失補發',
  },
  accountMaintenance: {
    title: '常用帳號管理',
  },
  depositOverview: {
    title: '帳戶',
  },
  depositInquiry: {
    title: '交易明細',
  },
  depositPlus: {
    title: '優惠利率額度',
  },
  billPay: {
    title: '信用卡繳費',
  },
  cardLessATM: {
    title: '無卡提款',
  },
  cardLessWithDrawChgPwd: {
    title: '變更無卡提款密碼',
  },
  noticeSetting: {
    title: '訊息通知設定',
  },
  nicknameSetting: {
    title: '暱稱設定',
  },
  patternLockSetting: {
    title: '圖形密碼登入設定',
  },
  fingerPrintLockSetting: {
    title: '生物辨識登入設定',
  },
  notice: {
    title: '訊息通知',
  },
  changeUserName: {
    title: '使用者代號變更',
  },
  pwdModify: {
    title: '網銀密碼變更',
  },
  regularPwdModify: {
    title: '定期網銀密碼變更',
  },
  smsOTPactivate: {
    title: '簡訊 OTP 設定',
  },
  QRCodeTransfer: {
    title: 'QRCode 轉帳',
  },
  adjustment: {
    title: '信用卡額度臨調',
  },
  projectJ: {
    title: '遠傳join智慧借貸平台',
  },
  loanInquiry: {
    title: '貸款應繳本息查詢',
  },
  loanInterest: {
    title: '貸款繳息紀錄查詢',
  },
  basicInformation: {
    title: '基本資料變更',
  },
  qAndA: {
    title: 'Q & A',
  },
  open: {
    title: '開通 APP',
  },
  deduct: {
    title: '自動扣繳申請/查詢',
  },
  exchange: {
    title: '外幣換匯',
  },
  exchange1: {
    title: '外幣換匯確認',
  },
  exchange2: {
    title: '外幣換匯結果',
  },
  transfer: {
    title: '轉帳',
  },
  profile: {
    title: '個人化設定',
  },
  more: {
    title: '更多',
  },
  financialDepartments: {
    title: '金融百貨',
  },
  network: {
    title: '社群圈',
  },
  securitiesSwapAccounts: {
    title: '帳戶',
  },
  foreignCurrencyAccounts: {
    title: '帳戶',
  },
  regularBasicInformation: {
    title: '六個月基本資料變更',
  },
  exportBankBook: {
    title: '匯出存摺',
  },
};

// 取得頁面資訊
export const doGetPageInfo = async (apiUrl) => (
  pageInfo[apiUrl.replace('/api/', '')]
);
