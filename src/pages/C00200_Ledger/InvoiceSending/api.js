/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';

export const chargeOwner = async (param) => {
  const response = await callAPI('/ledger/partner/chargeOwner', param);
  return response;
};
