import { callAPI } from 'utilities/axios';

// 變更無卡提款密碼 done
export const changeCardlessPwd = async (param) => {
  const response = await callAPI('/api/cardlessWD/changePwd', param);
  return response;
};
