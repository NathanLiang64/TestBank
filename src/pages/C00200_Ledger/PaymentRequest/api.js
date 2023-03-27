/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';

export const chargePartner = (param) => {
  const response = callAPI('/owner/chargePartner', param);

  return response;
};
