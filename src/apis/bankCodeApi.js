// 查詢銀行代碼
import { userRequest } from './axiosConfig';

export const getBankCode = (params) => (
  userRequest('post', '/api/transfer/queryBank', params)
);
