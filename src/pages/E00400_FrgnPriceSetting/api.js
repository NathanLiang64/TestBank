import { callAPI } from 'utilities/axios';
// import { setFreqAccts } from 'stores/reducers/CacheReducer';
// import store from 'stores/store';
// import { showPrompt } from 'utilities/MessageModal';

/**
 * 查詢匯率行情
  @returns [
    {
      ccyname: 外幣幣別,
      ccycd: 外幣代碼,
      brate: 即時買進,
      srate: 即時賣出
    }
  ]
*/
export const getExchangeRateInfo = async () => {
  const response = await callAPI('/deposit/foreign/v1/getExRateInfo');
  return response.data;
};
