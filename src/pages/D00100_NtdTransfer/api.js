import { callAPI } from 'utilities/axios';
import { loadLocalData, dateToString } from 'utilities/Generator';

/**
 * 取得所有分行清單。
 * @returns {Promise<[{
     branchNo: 分行代碼,
     branchCode: 分行轉帳代碼,
     branchName: 分行名稱,
   }]>} 分行清單。
 */
const getBranchCode = async () => {
  const branches = await loadLocalData('BranchList', async () => {
    const response = await callAPI('/api/v1/getAllBranches');
    return response.data;
  });
  return branches;
};

/**
 * 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
 * @return {Promise<[{
 *   acctType: 帳戶類型 // M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 *   accountNo: 帳號,
 *   branchName: 分行名稱,
 *   balance: 帳戶餘額(, // NOTE 餘額「非即時」資訊
 *   currency: 幣別代碼,
 *   alias: 帳戶名稱，若有暱稱則會優先用暱稱,
 *   dgType: 帳戶類別('  '.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
 *   transable: 已設約轉 或 同ID互轉(true/false)
 * }]>} 帳號基本資料。
 */
const getAccountsList = async () => {
  // API /api/deposit/v1/getAccounts Response [{
  //   acctType: 帳戶類型 // M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
  //   account: 帳號,
  //   name: 帳戶名稱，若有暱稱則會優先用暱稱,
  //   dgType: 帳戶類別('  '.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
  //   transable: 已設約轉 或 同ID互轉(true/false)
  //   details: [{ // 外幣多幣別時有多筆
  //        balance: 帳戶餘額(, // NOTE 餘額「非即時」資訊
  //        currency: 幣別代碼,
  //   }]
  // }]
  const Promise1 = callAPI('/api/deposit/v1/getAccounts', 'MSFC');
  const Promise2 = getBranchCode();
  return await Promise.allSettled([Promise1, Promise2]).then((result) => {
    const accounts = result[0].value.data;
    const branches = result[1].value;

    return accounts.map((acct) => {
      const branchId = acct.account.substring(0, 3);
      return {
        acctType: acct.acctType,
        accountNo: acct.account,
        branchName: branches.find((b) => b.branchNo === branchId)?.branchName ?? branchId,
        details: acct.details,
        alias: acct.name,
        dgType: acct.dgType,
        transable: acct.transable,
      };
    });
  });
};

export const AccountListCacheName = 'Accounts';

/**
 * 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
 * @param {String} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @return {Promise<[{
 *   acctType: 帳戶類型 // M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶,
 *   accountNo: 帳號,
 *   branchName: 分行名稱,
 *   balance: 帳戶餘額, // NOTE 餘額「非即時」資訊
 *   currency: 幣別代碼,
 *   alias: 帳戶名稱 // 若有暱稱則會優先用暱稱,
 *   dgType: 帳戶類別 // ('  '.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
 *   transable: 已設約轉 或 同ID互轉(true/false)
 * }]>} 帳號基本資料。
 */
export const loadAccountsList = async (acctTypes, onDataLoaded) => {
  loadLocalData(AccountListCacheName, getAccountsList).then((data) => {
    const accounts = data.filter((account) => acctTypes.indexOf(account.acctType) >= 0)
      // NOTE 外幣帳號的架構跟台幣不一樣。
      // 要把一個帳戶、多個幣別 展開成 多個帳戶 的型式呈現。
      .map((account) => (!account.details // 若是從 sessionStorage 取出的值，就沒有 details，所以直接傳回即可。
        ? account
        : account.details.map((detail) => {
          const acct = { ...account, ...detail};
          delete acct.details;
          return acct;
        })))
      .flat();
    onDataLoaded(accounts);
  });
};

/**
 * 取得取得免費跨提/跨轉次數、數存優惠利率及資訊
 * @param {String} accountNo 存款帳號
 * @returns {Promise<
  {
    freeWithdraw: 免費跨提總次數
    freeWithdrawRemain: 免費跨提剩餘次數
    freeTransfer: 免費跨轉總次數
    freeTransferRemain: 免費跨轉剩餘次數
    bonusQuota: 優惠利率額度
    bonusRate: 優惠利率
    interest: 累積利息
  }>} 優惠資訊
 */
export const getAccountExtraInfo = async (accountNo) => {
  const response = await callAPI('/api/depositPlus/v1/getBonusInfo', accountNo);
  return response.data;
};

/**
 * 建立台幣轉帳交易，需再完成交易確認才會真的執行轉帳。
 * @param {{
      transOut: 轉出帳號
      transIn: {
        bank: 轉入帳戶的銀行
        account: 轉入帳戶的帳號
      }
      amount: 轉出金額
      booking: {
        mode: 立即或預約 // 0.立即轉帳, 1.預約轉帳
        multiTimes: 單次或多次 // 單次, *.多次
        transDate: 轉帳日期 // multiTimes='1'時
        transRange: 轉帳日期區間 // multiTimes='*'時
        cycleMode: 交易頻率 // 1.每周, 2.每月
        cycleTiming: 交易週期 // 〔 0~6: 周日~周六 〕或〔 1~31: 每月1~31〕, 月底(29/30/31)會加警示。
      }
      memo: 備註
    }} request
 * @returns {*}
 */
export const createNtdTransfer = async (request) => {
  const response = await callAPI('/api/transfer/ntd/v1/create', request);
  return response.data;
};

/**
 * 執行轉帳交易。
 * @returns {{
      isSuccess,
      balance: 轉出後餘額,
      fee: 手續費,
      errorCode,
      message,
      // TODO payDate, SERVER交易序號, 交易識別碼
 * }} 轉帳結果。
 */
export const executeNtdTransfer = async () => {
  const response = await callAPI('/api/transfer/ntd/v1/execute');
  return response.data;
};

/**
 * 將轉帳金額加標千分位符號及前置'$'.
 */
export const getDisplayAmount = (amount) => `$${new Intl.NumberFormat('en-US').format(amount)}`;

/**
 * 產生轉帳發生時間或區間的描述訊息。
 */
export const getTransDate = (model) => {
  const { booking } = model;

  if (!booking?.mode) return dateToString(new Date()); // 立即轉帳 用今天表示。

  const { multiTimes, transDate, transRange } = booking;
  if (multiTimes === '1') {
    return `${dateToString(transDate)}`;
  }
  return `${dateToString(transRange[0])} ~ ${dateToString(transRange[1])}`;
};

/**
 * 產生週期預約轉帳的描述訊息。
 */
export const getCycleDesc = (booking) => {
  const cycleWeekly = ['日', '一', '二', '三', '四', '五', '六'];
  const { cycleTiming } = booking;
  if (booking.cycleMode === 1) {
    return `每周${cycleWeekly[booking.cycleTiming]}`;
  }
  return `每個月${cycleTiming}號`;
};
