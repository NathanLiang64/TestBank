/**
 * 進頁面useEffect先抓資料
 * （正式時沒有參數，這邊參數為測試不同情境使用）
 *
 * @param {
 *  1 | 2 | 3 | 4 | 5 | 6   number，判斷情境（情境說明如下）
 * }
 * 1: 未開通 未申請、未綁定、門號 ""
 * 2: 未開通 未申請、已綁定、門號 "0900000000"
 * 3: 未開通 已申請、未綁定、門號 ""
 * 4: 未開通 已申請、已綁定、門號 "0900000000"
 * 5: 已開通      、未綁定、門號 "0900000000" (這個狀況可能出現嗎?)
 * 6: 已開通      、門號 "0900000000"
 *
 * @return {
 *  originalStatus   0已開通 | 1已註銷（未申請未開通） | 2已申請未開通
 *  QLStatus         true | false
 *  mobile           "0900000000" | ""
 * }
 */
export const mockT00300Data = (param) => {
  console.log('T00300 mockT00300Data() case:', param);
  switch (param) {
    case 1:
      return {
        originalStatus: 1,
        QLStatus: false,
        mobile: '',
      };
    case 2:
      return {
        originalStatus: 1,
        QLStatus: true,
        mobile: '0900000000',
      };
    case 3:
      return {
        originalStatus: 2,
        QLStatus: false,
        mobile: '',
      };
    case 4:
      return {
        originalStatus: 2,
        QLStatus: true,
        mobile: '0900000000',
      };
    case 5:
      return {
        originalStatus: 0,
        QLStatus: false,
        mobile: '0900000000',
      };
    default:
      return {
        originalStatus: 0,
        QLStatus: true,
        mobile: '0900000000',
      };
  }
};
