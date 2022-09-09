import { callAPI } from 'utilities/axios';
import { loadLocalData } from 'utilities/Generator';

/**
 * 取得所有分行清單。
 * @returns {*} [{
     branchNo: 分行代碼,
     branchCode: 分行轉帳代碼,
     branchName: 分行名稱,
   }, ...]
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
  //   }, ...]
  // }, ...]
  const getBranches = getBranchCode();
  const response = await callAPI('/api/deposit/v1/getAccounts', 'MSFC');
  const branches = await getBranches;
  return response.data.map((acct) => {
    const branchId = acct.account.substring(0, 3);
    return {
      acctType: acct.acctType,
    accountNo: acct.account,
      branchName: branches.find((b) => b.branchNo === branchId)?.branchName ?? branchId,
    balance: acct.details[0].balance,
      currency: acct.details[0].currency,
    alias: acct.name,
    dgType: acct.dgType,
    transable: acct.transable,
    };
  });
};

export const AccountListCacheName = 'Accounts';

/**
 * 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
 * @param {String} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @return {Promise<[{
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
  loadLocalData(AccountListCacheName, getAccountsList).then((accounts) => {
    const accts = accounts.filter((ac) => acctTypes.indexOf(ac.acctType) >= 0);
    onDataLoaded(accts);
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
