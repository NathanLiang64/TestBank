import uuid from 'react-uuid';
import { callAPI } from 'utilities/axios';
import e2ee from 'utilities/E2ee';

export const login = async (data) => {
  const payload = {
    txnId: `WVIEW_${uuid()}`,
    custId: data.identity.toUpperCase(),
    username: e2ee(data.account),
    password: e2ee(data.password),
    rsaPubK: sessionStorage.getItem('publicKey'),
    isRepeat: !!data.isRepeat,
  };
  const loginRs = await callAPI('/smJwe/v1/login', payload);
  if (loginRs.code === '0000') {
    const response = loginRs.data;
    const { result, errCode, message } = response;

    if (result === true) return true;

    if (errCode === 'E004') {
      if (window.confirm(message)) {
        return await login({
          ...data,
          isRepeat: true,
          isgToken: response.isgToken,
        });
      }

      alert('已取消登入');
      return false;
    }
  }
  alert(loginRs.message);
  return false;
};

export const personalDataPreload = async (request) => {
  const response = await callAPI('/auth/preload', request);
  return response;
};

export const getInitData = async () => {
  const response = await callAPI('/smApi/v1/getInitData');
  return response;
};
