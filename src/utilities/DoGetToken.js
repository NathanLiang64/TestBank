/* eslint-disable prefer-const */
import userAxios from 'apis/axiosConfig';
import e2ee from './E2ee';

const channelCode = 'HHB_A';
const appVersion = '1.0.15';

const getKey = async (data) => {
  const message = {
    channelCode,
    appVersion,
    custId: data.identity.toUpperCase(),
    username: e2ee(data.account),
    password: e2ee(data.password),
  };
  localStorage.setItem('custId', message.custId);
  const loginResponse = await userAxios.post('/auth/login', message);
  if (loginResponse.code === '0000' || loginResponse.code === 'WEBCTL1008') {
    if (loginResponse.code === 'WEBCTL1008') {
      if (window.confirm(loginResponse.message)) {
        const repeatLoginResponse = await userAxios.post('/auth/repeatLogin', {});
        if (Object.keys(repeatLoginResponse).length === 0) {
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
    message: loginResponse.data.message,
  };
};

export default getKey;
