import { callAPI } from 'utilities/axios';

/**
 * 訪客註冊
 * @param rq {
 *      passwd // 密碼
 *      name // 戶名
 *      email // 信箱
 *      mobile // 電話
 * }
 * @return {
 *      accessToken
 *      memberId
 * }
 */
export const memberRegister = async (param) => {
  const result = await callAPI('/fintech/ledger/memberRegister', param);
  return result.data;
};
