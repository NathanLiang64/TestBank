import { callAPI } from '../../utilities/axios';

export const userLogin = async (request) => {
  const response = await callAPI('/auth/login', request);
  return response;
};
