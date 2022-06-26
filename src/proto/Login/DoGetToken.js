import uuid from 'react-uuid';
import { callAPI } from 'utilities/axios';
import e2ee from 'utilities/E2ee';

const getKey = async (data) => {
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

    if (result === true) {
      return {
        result: 'success',
        message: 'Login success',
      };
    }

    if (errCode === 'E004') {
      if (window.confirm(message)) {
        return await getKey({
          ...data,
          isRepeat: true,
          isgToken: response.isgToken,
        });
      }
      return {
        result: 'fail',
        message: '已取消登入',
      };
    }
  }
  return {
    result: 'fail',
    message: loginRs.message,
  };
};

export default getKey;
