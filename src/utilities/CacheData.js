import { setBanks, setBranches, setAccounts } from 'stores/reducers/CacheReducer';
import store from 'stores/store';
import { callAPI } from 'utilities/axios';
import BankData from 'assets/data/BankData.json';
import BranchData from 'assets/data/BranchData.json';
import { restoreCache } from './AppScriptProxy';

/**
 * 查詢銀行代碼
 * @returns {Promise<[{
 *  bankNo: 銀行代碼,
 *  bankName: 銀行名稱
 * }]>} 銀行代碼清單。
 */
export const getBankCode = async () => {
  let {banks} = await restoreCache();
  if (!banks) {
    banks = BankData.data;
    // TODO 取得 BankData.version 之後的異動資料。
    // const response = await callAPI('/common/v1/queryBank');
    // if (response.isSuccess) {
    //   banks = response.data;
    // }
    store.dispatch(setBanks(banks));
  }
  return banks;
};

/**
 * 取得所有分行清單。
 * @returns {Promise<[{
     branchNo: 分行代碼,
     branchCode: 分行轉帳代碼,
     branchName: 分行名稱,
   }]>} 分行清單。
 */
export const getBranchCode = async () => {
  let {branches} = await restoreCache();
  if (!branches) {
    branches = BranchData.data;
    // TODO 取得 BranchData.version 之後的異動資料。
    // const response = await callAPI('/common/v1/getAllBranches');
    // if (response.isSuccess) {
    //   branches = response.data;
    // }
    store.dispatch(setBranches(branches));
  }
  return branches;
};

/**
 * 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
 * @return {Promise<[{
 *   acctType: 帳戶類型           // M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 *   accountNo: 帳號,
 *   branchName: 分行名稱,
 *   balance: 帳戶餘額,           // NOTE 餘額「非即時」資訊
 *   interest: 累積利息,          // NOTE 當值為 undefined 時才會載入。
 *   currency: 幣別代碼,
 *   alias: 帳戶名稱，若有暱稱則會優先用暱稱,
 *   dgType: 帳戶類別('  '.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
 *   transable: 同ID互轉(true/false)
 * }]>} 帳號基本資料。
 */
const loadAccountsList = async () => {
  // API /deposit/account/v1/getAccounts Response [{
  //   acctType: 帳戶類型 // M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
  //   account: 帳號,
  //   name: 帳戶名稱，若有暱稱則會優先用暱稱,
  //   dgType: 帳戶類別('  '.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
  //   transable: 同ID互轉(true/false)
  //   details: [{ // 外幣多幣別時有多筆
  //        balance: 帳戶餘額(, // NOTE 餘額「非即時」資訊
  //        currency: 幣別代碼,
  //   }]
  // }]
  const Promise1 = callAPI('/deposit/account/v1/getAccounts', 'MSFC');
  const Promise2 = getBranchCode();
  return await Promise.allSettled([Promise1, Promise2]).then((result) => {
    if (!result[0].value.isSuccess) return null;

    const accounts = result[0].value.data;
    return accounts.map((acct) => {
      const branches = result[1].value;
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

/**
 * 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
 * @param {String} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @return {Promise<[{
 *   acctType: 帳戶類型 // M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶,
 *   accountNo: 帳號,
 *   branchName: 分行名稱,
 *   balance: 帳戶餘額,           // NOTE 餘額「非即時」資訊
 *   interest: 累積利息,          // NOTE 當值為 undefined 時才會載入。
 *   currency: 幣別代碼,
 *   alias: 帳戶名稱 // 若有暱稱則會優先用暱稱,
 *   dgType: 帳戶類別 // ('  '.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
 *   transable: 同ID互轉(true/false)
 * }]>} 帳號基本資料。
 */
export const getAccountsList = async (acctTypes, onDataLoaded) => { // , noFlat = false) => {
  let {accounts} = await restoreCache();
  if (!accounts) {
    accounts = await loadAccountsList();
    store.dispatch(setAccounts(accounts)); // 保存所有的帳號資料。
  }

  // 做 deepClone 避免資料結構被破壞
  const result = JSON.parse(JSON.stringify(accounts)).filter((account) => acctTypes.indexOf(account.acctType) >= 0);
  // NOTE 不可破壞這個物件結構，否則各類型的帳戶資料會錯亂。
  // : accounts.filter((account) => acctTypes.indexOf(account.acctType) >= 0)
  // // NOTE 外幣帳號的架構跟臺幣不一樣。
  // // 要把一個帳戶、多個幣別 展開成 多個帳戶 的型式呈現。
  //   .map((account) => (!account.details // 若是從 APP-DD 取出的值，就沒有 details，所以直接傳回即可。
  //     ? account
  //     : account.details.map((detail) => {
  //       const acct = { ...account, ...detail};
  //       delete acct.details;
  //       return acct;
  //     })))
  //   .flat();
  if (onDataLoaded) return onDataLoaded(result);
  return result;
};

/**
 * 取得取得免費跨提/跨轉次數、數存優惠利率及資訊
 * @param {String} accountNo 存款帳號
 * @param {Function} foreUpdate
 * @param {Boolean} foreUpdate
 * @returns {Promise<{
 *   freeWithdraw: 免費跨提總次數
 *   freeWithdrawRemain: 免費跨提剩餘次數
 *   freeTransfer: 免費跨轉總次數
 *   freeTransferRemain: 免費跨轉剩餘次數
 *   isVIP: 表示此用戶是 VIP 的旗標，只有旗標為 true 時，才會有VIP跨提/跨轉優惠次數資訊。
 *   freeWithdrawTimesVIP: VIP跨提本月適用優惠次數
 *   freeWithdrawRemainVIP: VIP跨提本月優惠剩餘次數
 *   freeTransferTimesVIP: VIP跨轉本月適用優惠次數
 *   freeTransferRemainVIP: VIP跨轉本月優惠剩餘次數
 *   dLimitLeft: 非約轉當日剩餘額度
 *   mLimitLeft: 非約轉當月剩餘額度
 *   agrdTfrSelfLimitLeft: 約轉自行轉帳剩餘額度
 *   agrdTfrInterLimitLeft: 約轉跨行轉帳剩餘額度
 * }>} 優惠資訊
 */
export const getAccountBonus = async (accountNo, onDataLoaded, foreUpdate) => {
  let {accounts} = await restoreCache();
  if (!accounts) {
    accounts = await loadAccountsList();
    store.dispatch(setAccounts(accounts)); // 保存所有的帳號資料。
  }

  let bonus;
  const index = accounts.findIndex((account) => account.accountNo === accountNo);
  if (index >= 0) {
    bonus = accounts[index].bonus;
    if ((!bonus || foreUpdate) && !bonus?.isLoading) {
      accounts[index].bonus = { isLoading: true };
      store.dispatch(setAccounts(accounts));

      const response = await callAPI('/deposit/account/v1/getBonusLimitInfo', { accountNo });
      bonus = response.data;

      // bonusQuota, bonusRate 由 取得社群圈摘要資訊 api 中取得: bonusInfo.amount, bonusInfo.rate
      const resSummary = await callAPI('/community/v1/getSummary');
      bonus = {
        ...bonus,
        bonusQuota: resSummary.data.bonusInfo.amount,
        bonusRate: resSummary.data.bonusInfo.rate,
      };

      accounts[index].bonus = bonus;
      store.dispatch(setAccounts(accounts));
    }
  }
  if (onDataLoaded) onDataLoaded(bonus);
};

/**
 * 將更新後的存款帳號物件存入 Redux
 * @param {*} newAccount
 */
export const updateAccount = async (newAccount) => {
  let {accounts} = await restoreCache();
  if (!accounts) {
    accounts = await loadAccountsList();
    store.dispatch(setAccounts(accounts)); // 保存所有的帳號資料。
  }

  const index = accounts.findIndex((account) => account.accountNo === newAccount.accountNo);

  if (index >= 0) {
    const foundDetailIndex = accounts[index].details.findIndex((detail) => detail.currency === newAccount.currency);
    accounts[index].details[foundDetailIndex] = {balance: newAccount.balance, currency: newAccount.currency};
    accounts[index] = {
      ...accounts[index],
      bonus: newAccount.bonus,
      interest: newAccount.interest,
      txnDetails: newAccount.txnDetails,
      alias: newAccount.alias,
    };
    // accounts[index] = newAccount;
    store.dispatch(setAccounts(accounts));
  }
};

// 清除帳戶內的交易明細
export const cleanupAccount = async () => {
  const { accounts } = await restoreCache();
  if (!accounts) return;
  accounts.forEach((acct) => delete acct.txnDetails);
  store.dispatch(setAccounts(accounts));
};
