import userAxios from 'apis/axiosConfig';
import CipherUtil from './CipherUtil';
import JWEUtil from './JWEUtil';

// 裝置開啟時去呼叫
const handshake = async () => {
  localStorage.clear();
  // let privateKey;
  // let publicKey;
  let jwtToken;
  // let ivToken;
  // let aesTokenKey;
  const ServerPublicKey = await userAxios.post('/auth/getPublicKey');
  const iv = CipherUtil.generateIV();
  const aesKey = CipherUtil.generateAES();
  const ivToken = iv;
  const aesTokenKey = aesKey;
  const getPublicAndPrivate = CipherUtil.generateRSA();
  const { privateKey, publicKey } = getPublicAndPrivate;
  const message = {
    publicKey: getPublicAndPrivate.publicKey.replace(/(\r\n\t|\r\n|\n|\r\t)/gm, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', ''),
    iv,
    aesKey,
  };
  const getJWTToken = JWEUtil.encryptJWEMessage(ServerPublicKey.data.data.result, JSON.stringify(message));
  const getMyJWT = await userAxios.post('/auth/handshake', getJWTToken);
  if (getMyJWT.data.code === '0000') {
    const deCode = JSON.parse(JWEUtil.decryptJWEMessage(getPublicAndPrivate.privateKey, getMyJWT.data.data));
    // console.log(getMyJWT);
    jwtToken = deCode.result.jwtToken;
    localStorage.setItem('privateKey', privateKey);
    localStorage.setItem('publicKey', publicKey);
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('iv', ivToken);
    localStorage.setItem('aesKey', aesTokenKey);
    return {
      result: 'success',
      message: getMyJWT.data.message,
    };
  }
  return {
    result: 'fail',
    message: getMyJWT.data.message,
  };
};

export default handshake;
