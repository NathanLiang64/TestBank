import { callAPI } from 'utilities/axios';

/**
 * 更新本地 SessionStoreage 中的資料。
 * @param {*} storeName 存在 SessionStoreage 時使用的名稱。
 * @param {*} newData 要存入的新資料；若為 null 將在 SessionStoreage 中清除此項目。
 * @returns
 */
export const setLocalData = async (storeName, newData) => {
  if (newData) {
    sessionStorage.setItem(storeName, JSON.stringify(newData));
  } else {
    sessionStorage.removeItem(storeName);
  }
  return newData;
};

/**
 * 載入本地 SessionStoreage 中的資料。
 * @param {*} storeName 存在 SessionStoreage 時使用的名稱。
 * @param {*} loadDataFunc 當 SessionStoreage 沒有資料時，可以透過這個方法取得 預設值。
 * @returns {Promise<*>} 存在 SessionStoreage 中的資料。
 */
export const loadLocalData = async (storeName, loadDataFunc) => {
  let data = sessionStorage.getItem(storeName);
  try {
    data = JSON.parse(data);
  } catch (ex) {
    sessionStorage.removeItem(storeName);
    data = null;
  }

  if (!data && loadDataFunc) {
    const result = loadDataFunc();
    if (result instanceof Promise) {
      await result.then((response) => {
        setLocalData(storeName, response); // 暫存入以減少API叫用
        data = response;
      });
    } else {
      data = result;
    }
  }

  return data;
};

/**
 * 查詢銀行代碼
 * @returns {Promise<[{
 *  bankNo: 銀行代碼,
 *  bankName: 銀行名稱
 * }]>} 銀行代碼清單。
 */
export const getBankCode = async () => {
  const banks = await loadLocalData('BankList', async () => {
    const response = await callAPI('/api/transfer/queryBank');
    return response.data;
  });
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
const loadAccountsList = async () => {
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
export const getAccountsList = async (acctTypes, onDataLoaded) => {
  loadLocalData('Accounts', loadAccountsList).then((data) => {
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
 * 清除帳號基本資料快取，直到下次使用 getAccountsList 時再重新載入。
 */
export const resetAccountsList = () => setLocalData('Accounts', null);
