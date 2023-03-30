import { callAPI } from 'utilities/axios';

/**
 * 取得帳本成員清單
 * =====================
 * 這隻API有雷 使用上要注意：
 * 1.陣列裡會有null
 * 2.布林值給字串
 * 3.回傳物件的key不一致
 *
 * 備註
 * memberInviteStatus
 * 1 -> 邀請中
 * 2 -> 待審核
 * 3 -> 已加入
 */
export const getAll = async (payload = {}) => {
  const response = await callAPI('/ledger/partner/getAll', payload);
  return response.data;
};

// 踢除帳本成員 (partnerId, //取自 /partner/getAll 的 groupMemberId)
export const kickout = async (payload = { partnerId: '' }) => {
  const response = await callAPI('/ledger/partner/kickout', payload);
  return response.data;
};

// 取消邀請
export const cancel = async (payload = { token: '' }) => {
  const response = await callAPI('/ledger/partner/invite/cancel', payload);
  return response.data;
};

// 重新邀請
export const resend = async (payload = { token: '' }) => {
  const response = await callAPI('/ledger/partner/invite/resend', payload);
  return response.data;
};

// 同意成員加入帳本
export const confirm = async (payload = { accept: false, partnerId: '' }) => {
  const response = await callAPI('/ledger/partner/invite/confirm', payload);
  return response.data;
};
