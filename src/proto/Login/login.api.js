import uuid from 'react-uuid';
import { callAPI } from 'utilities/axios';
import CipherUtil from 'utilities/CipherUtil';

export const login = async (data) => {
  const payload = {
    txnId: `WVIEW_${uuid()}`,
    custId: data.identity.toUpperCase(),
    username: CipherUtil.e2ee(data.account),
    password: CipherUtil.e2ee(data.password),
    rsaPubK: sessionStorage.getItem('publicKey'),
    isRepeat: !!data.isRepeat,
    // deviceBindingKey: '', // NOTE 表示APP安裝的Token，與快登有直接關連，為1對1；因為 Web版 是用帳密登入，所以不需要提供。
  };
  const loginRs = await callAPI('/smJwe/v1/login', payload);
  if (loginRs.code === '0000') {
    const response = loginRs.data;
    const { result, errCode, message } = response;

    if (result === true) return response;

    if (errCode === 'E004') {
      if (window.confirm(message)) {
        const relogin = {
          ...data,
          isRepeat: true,
          isgToken: response.isgToken,
        };
        return await login(relogin);
      }

      alert('已取消登入');
    } else alert(message);
  } else alert(loginRs.message);

  return false;
};

// export const personalDataPreload = async (request) => {
//   const response = await callAPI('/auth/preload', request);
//   return response;
// };

export const getInitData = async () => {
  const response = await callAPI('/smApi/v1/getInitData');
  return response;
};

export const getAnnouncementData = async () => {
  const response = await callAPI('/smApi/v1/getAnnouncementData');
  return response;
};

// export const getHomeData = async () => {
//   const response = await callAPI('/smApi/v1/getHomeData');
//   return response;
// };
