import store from 'stores/store';
import { getBankCode } from 'utilities/CacheData';
import { callAPI } from 'utilities/axios';
import { setAgreAccts, setFreqAccts } from 'stores/reducers/CacheReducer';
import { showPrompt } from 'utilities/MessageModal';
import { isDifferentAccount } from './util';

/**
 * 建立臺幣轉帳交易，需再完成交易確認才會真的執行轉帳。
 * @param {{
 *   transOut: '轉出帳號',
 *   transIn: {
 *     bank: '轉入帳戶的銀行',
 *     account: '轉入帳戶的帳號',
 *   },
 *   amount: '轉出金額',
 *   booking: {
 *     mode: '立即或預約。 0.立即轉帳, 1.預約轉帳',
 *     multiTimes: '單次或多次。 單次, *.多次',
 *     transDate: '轉帳日期。 multiTimes="1"時',
 *     transRange: '轉帳日期區間。 multiTimes="*"時',
 *     cycleMode: '交易頻率。 1.每周, 2.每月',
 *     cycleTiming: '交易週期。〔 0-6: 周日-周六 〕或〔 1-31: 每月1-31〕',
 *   },
 *   memo: '備註',
 * }} request
 * @returns {Promise<{
 *   tfrId: '轉帳交易識別碼',
 *   result: '表示是否成功建立臺幣轉帳交易記錄',
 *   message: '紀錄無法成功建立的原因',
 *   isAgreedTxn: '表示約定轉帳的旗標',
 * }>}
 */
export const createNtdTransfer = async (request, getCallerFunc) => {
  const response = await callAPI('/deposit/transfer/ntd/v1/create', {
    ...request,
    // 啟用轉帳功能的 FuncCode, 例: 從臺幣首頁叫轉帳時，應傳入C003
    // 此來源功能代碼與交易驗證無關，只是要掌握是那從那個功能發動轉帳功能。
    callerFunc: getCallerFunc(),
  });
  return response.data;
};

/**
 * 執行轉帳交易。
 * @param {String} tfrId 轉帳交易識別碼
 * @returns {Promise<{
 *    isSuccess,
 *    balance: 轉出後餘額,
 *    fee: 手續費,
 *    fiscCode: '財金序號 跨轉才有',
 *    accountName: 戶名,
 *    errorCode,
 *    message: 錯誤訊息,
 * }>} 轉帳結果。
 */
export const executeNtdTransfer = async (tfrId) => {
  const response = await callAPI('/deposit/transfer/ntd/v1/execute', tfrId);
  return {
    ...response.data,
    isSuccess: (response.isSuccess && !response.data.errorCode),
  };
};

/**
 * 查詢指定轉出帳號約定轉入帳號清單。
 * @param {{
 *   accountNo: String, // 要查詢約定轉入帳號清單的帳號。
 *   includeSelf: Boolean, // 表示傳回清單要包含同ID互轉的帳號。
 * }} request
 * @returns {Promise<[{
 *   bankId: '約定轉入帳戶-銀行代碼'
 *   acctId: '約定轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   email: '通知EMAIL'
 *   isSelf: '是否為本行自己的其他帳戶'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }]>} 約定轉入帳號清單。
 */
const getAgreedAccount = async (request) => {
  let {agreAccts} = store.getState()?.CacheReducer;
  if (!agreAccts) agreAccts = {};

  const {accountNo} = request;
  if (!agreAccts[accountNo]) {
    const response = await callAPI('/deposit/transfer/agreedAccount/v1/get', request);
    const bankList = await getBankCode();
    agreAccts[accountNo] = response.data?.map((item) => ({
      ...item,
      bankName: (bankList?.find((b) => b.bankNo === item.bankId)?.bankName ?? item.bankId),
    }));
    store.dispatch(setAgreAccts(agreAccts));
  }
  return agreAccts[accountNo];
};

// 檢查轉入的帳號是否為約定帳號
export const checkIsAgreedAccount = async (accountNo, transIn) => {
  const request = {
    accountNo,
    includeSelf: true,
  };

  const agreedAccounts = await getAgreedAccount(request);
  const {
    bank, type, freqAcct, account,
  } = transIn;
  const isAgreedAccount = agreedAccounts.length
        && agreedAccounts.find(
          ({ acctId, bankId }) => (!isDifferentAccount(acctId, account)
              && bankId === bank && type === 0)
            || (!isDifferentAccount(acctId, freqAcct?.accountNo)
              && bankId === freqAcct?.bankId && type === 1),
        );
  return isAgreedAccount;
};

/**
 * 查詢非約轉設定狀態與綁定的手機號碼。
 * @returns {Promise<{
 *   status: Number,
 *   mobile: String,
 * }>}
 * - status: 非約轉設定狀態：0.未申請, 1.已申請未開通, 2.密碼逾期30日, 3.已開通, 4.已註銷, 5.OTP啟用密碼錯誤鎖定, 6.OTP交易密碼錯誤鎖定, 7.其他
 * - mobile: 預設為非約轉OTP門號；若尚未設有非約轉OTP門號時，則傳回CIF門號。
 */
export const getSettingInfo = async () => {
  const response = await callAPI('/deposit/transfer/nonAgreed/v1/getSettingInfo');
  return response.data;
};

/**
 * 查詢用戶自設的常用轉入帳號清單。
 * @returns {Promise<[{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   email: '通知EMAIL'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }]>} 常用轉入帳號清單。
 */
export const getFrequentAccount = async () => {
  let {freqAccts} = store.getState()?.CacheReducer;
  if (!freqAccts) {
    const response = await callAPI('/deposit/transfer/frequentAccount/v1/getAll');
    freqAccts = response.data;
    store.dispatch(setFreqAccts(freqAccts));
  }
  return freqAccts;
};

/**
 * 新增常用轉入帳號。
 * @param {{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   nickName: '新暱稱；可為空值'
 *   email: '新通知EMAIL；可為空值'
 *   headshot: '代表圖檔的內容，使用 Base64 格式；若為 null 表示還沒有設定頭像。'
 * }} account
 * @returns {Promise<[{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   email: '通知EMAIL'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }]} 傳回刪除指定項目後的清單。
 */
export const addFrequentAccount = async (account) => {
  /**
   * NOTE : 改透過 getFrequentAccount 取得常用帳號清單 (若已經拿過清單，資料會從 redux 取得，若無則打 API 並回傳)
   * 若直接透過 CacheReducer 拿取清單的話，在轉帳完成要新增常用帳號的情境下(D00100_2)，freqAccts 可能會是空值
   */
  // const {freqAccts} = store.getState()?.CacheReducer;
  const freqAccts = await getFrequentAccount();
  // 先檢查要加入的帳號是否已經存在於 freqAccts 內

  const existedAcct = freqAccts.find(({ bankId, acctId }) => bankId === account.bankId && (acctId.padStart(16, '0') === account.acctId.padStart(16, '0')));
  if (existedAcct) {
    await showPrompt('此帳號資料已存在');
    return null;
  }
  const response = await callAPI('/deposit/transfer/frequentAccount/v1/add', account);
  // 如果新增失敗，則回傳原來的 freqAccts
  if (!response.isSuccess) return freqAccts;
  const headshotId = response.data;

  // 將新帳號加入快取。
  const newAccount = {
    ...account,
    headshot: headshotId,
    isNew: true,
  };
  freqAccts.splice(0, 0, newAccount); // 插入到第一筆。
  store.dispatch(setFreqAccts(freqAccts));

  return freqAccts;
};
