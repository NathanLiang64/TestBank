/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';

export const chargeOwner = async (param) => {
  console.log('chargeOwner', param);

  const response = await callAPI('/ledger/partner/chargeOwner');
  return response;
};
