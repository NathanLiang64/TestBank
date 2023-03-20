import { callAPI } from 'utilities/axios';

/**
 * 成員加入帳本
 */
export const inviteJoin = async (
  payload = {
    token: '', nickname: '', bankCode: '', account: '',
  },
) => {
  const response = await callAPI('/ledger/partner/invite/join', payload);
  return response.data;
};
