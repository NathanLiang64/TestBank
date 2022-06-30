import { callAPI } from 'utilities/axios';

/**
 * 查詢匯率行情
  @param { }
  @returns [
    {
      ccyname: 外幣幣別,
      ccycd: 外幣代碼,
      brate: 即時買進,
      srate: 即時賣出
    }
  ]
*/
export const getExchangeRateInfo = async (param) => {
  const response = await callAPI('/api/frgn/queryRrateInfo', param);
  return response;
};
