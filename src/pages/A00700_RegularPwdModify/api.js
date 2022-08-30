import { callAPI } from 'utilities/axios';

/**
 * 更新密碼
 *
 * 因為驗證關係，更新密碼使用此API
 *
 * @param JwtToken
 * @param PwdChgRq {
 *    password:         舊網銀密碼
 *    newPassword:      新網銀密碼
 *    newPasswordCheck: 新網銀密碼確認
 *    actionCode:       欲執行動作,I:新增;D:刪除單筆;A:全部刪除;M:維護
 * }
 * @return PwdChgRs{
 *    custName:
 * }
 * @throws Exception
 */
export const renewPwd = async (param) => {
  const response = await callAPI('/api/setting/renewPwd', param);
  return response;
};
