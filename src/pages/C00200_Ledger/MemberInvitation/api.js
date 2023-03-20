import { callAPI } from 'utilities/axios';

/**
 * 邀請成員
 *  request {
 *     type, // M.簡訊, Q.QR-Code ,S.分享連結
 *     phone,
 *   }
 */
export const inviteSend = async (payload = {}) => {
  const response = await callAPI('/ledger/partner/invite/send', payload);
  return response.data;
};
