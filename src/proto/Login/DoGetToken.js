/* eslint-disable prefer-const */
import { callAPI } from 'utilities/axios';
import e2ee from 'utilities/E2ee';

const channelCode = 'HHB_A';
const appVersion = '1.0.15';

const getKey = async (data) => {
  const request = {
    channelCode,
    appVersion,
    custId: data.identity.toUpperCase(),
    username: e2ee(data.account),
    password: e2ee(data.password),
  };
  localStorage.setItem('custId', request.custId);
  // console.log(request);
  const loginRs = await callAPI('/auth/login', request);
  if (loginRs.code === '0000' || loginRs.code === 'WEBCTL1008') {
    if (loginRs.code === 'WEBCTL1008') {
      if (window.confirm(loginRs.message)) {
        const reloginRs = await callAPI('/auth/repeatLogin');
        if (Object.keys(reloginRs).length === 0) {
          return {
            result: 'success',
            message: 'Login success',
          };
        }
      } else {
        localStorage.clear();
        return {
          result: 'fail',
          message: '已取消登入',
        };
      }
    } else {
      return {
        result: 'success',
        message: 'Login success',
      };
    }
  }
  return {
    result: 'fail',
    message: loginRs.message,
  };
};

export default getKey;
