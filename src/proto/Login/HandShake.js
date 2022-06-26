import uuid from 'react-uuid';
import Cookies from 'js-cookie';
import CipherUtil from 'utilities/CipherUtil';
import { userRequest, callAPI } from 'utilities/axios';

// 裝置開啟時去呼叫
const handshake = async () => {
  localStorage.clear();
  sessionStorage.clear();

  const { privateKey, publicKey } = CipherUtil.generateRSA();
  const aesKey = CipherUtil.generateAES();
  const iv = CipherUtil.generateIV();

  sessionStorage.setItem('privateKey', privateKey);
  sessionStorage.setItem('publicKey', publicKey);
  sessionStorage.setItem('aesKey', aesKey);
  sessionStorage.setItem('iv', iv);

  const message = {
    txnId: `WVIEW_${uuid()}`,
    // deviceId: null,
    osType: 0,
    osVersion: '15.5',
    appVersion: '1.0.26',
    encK: aesKey,
    iv,
    rsaPubK: publicKey,
  };
  if (!message.deviceId) alert('請在 proto/Login/HandShake 填入 deviceId');
  const getPKeyRs = await userRequest('get', '/auth/v1/getPublicKey');
  sessionStorage.setItem('serverPKey', getPKeyRs.data.data);

  //
  // 精誠隨想的 Handshak
  //
  const preloadRs = await callAPI('/smJwe/v1/preload', message);
  if (preloadRs.code === '0000') {
    const { jwtToken } = preloadRs.data;
    sessionStorage.setItem('jwtToken', jwtToken);
    Cookies.set('jwtToken', jwtToken);
  } else {
    alert(`Hand shake fail! ${preloadRs.message}`);
  }
};

export default handshake;
