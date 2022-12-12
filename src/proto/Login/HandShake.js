import uuid from 'react-uuid';
import CipherUtil from 'utilities/CipherUtil';
import { userRequest, callAPI } from 'utilities/axios';
import { getOsType } from 'utilities/AppScriptProxy';

// 裝置開啟時去呼叫
const handshake = async () => {
  localStorage.clear();
  sessionStorage.clear();
  sessionStorage.setItem('webMode', true);

  const { privateKey, publicKey } = CipherUtil.generateRSA();
  const aesKey = CipherUtil.generateKey(256); // 使用JWT模式時，Request/Response Payload 的加解密金鑰，採用 AES256。
  const iv = CipherUtil.generateKey(128); // IV固定為 128bits

  sessionStorage.setItem('privateKey', privateKey);
  sessionStorage.setItem('publicKey', publicKey);
  sessionStorage.setItem('aesKey', aesKey);
  sessionStorage.setItem('iv', iv);

  const message = {
    txnId: `WVIEW_${uuid()}`,
    // deviceId: null,
    deviceId: uuid(),
    // NOTE 用不用的 deviceId 可以進行「已在不同手機做過綁定」的情境。
    osType: getOsType() - 1,
    osVersion: '16.1.1',
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
  } else {
    alert(`Hand shake fail! ${preloadRs.message}`);
  }
};

export default handshake;
