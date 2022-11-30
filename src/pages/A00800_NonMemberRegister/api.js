/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';

/**
 * 訪客註冊
 * path: /app/
 * @param rq {
 *      passwd // 密碼
 *      name // 戶名
 *      email // 信箱
 *      mobile // 電話
 * }
 * @return {
 *      token
 *      memberId
 * }
 */
export const memberRegister = async (param) => {
  // url: /app/memberRegister
  console.log({param});
  const result = await callAPI('/app/ledger/memberRegister', param);
  // const result = {code: '0000'};
  return result;
};
