/* eslint-disable prefer-const */
import userAxios from 'apis/axiosConfig';
import JWEUtil from './JWEUtil';
import CipherUtil from './CipherUtil';

const getKey = async () => {
  localStorage.clear();
  let privateKey;
  let publicKey;
  let jwtToken;
  let ivToken;
  let aesTokenKey;
  const ServerPublicKey = await userAxios.get('/auth/publicKey');
  const iv = CipherUtil.generateIV();
  const aesKey = CipherUtil.generateAES();
  ivToken = iv;
  aesTokenKey = aesKey;
  const getPublicAndPrivate = CipherUtil.generateRSA();
  privateKey = getPublicAndPrivate.privateKey;
  publicKey = getPublicAndPrivate.publicKey;
  const message = {
    publicKey: getPublicAndPrivate.publicKey.replace(/(\r\n\t|\r\n|\n|\r\t)/gm, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', ''),
    iv,
    aesKey,
  };
  const getJWTToken = JWEUtil.encryptJWEMessage(ServerPublicKey.data.result.publicKey, JSON.stringify(message));
  const getMyJWT = await userAxios.post('/auth/authenticate', getJWTToken);
  const deCode = JSON.parse(JWEUtil.decryptJWEMessage(getPublicAndPrivate.privateKey, getMyJWT.data));
  jwtToken = deCode.result.jwtToken;
  localStorage.setItem('privateKey', privateKey);
  localStorage.setItem('publicKey', publicKey);
  localStorage.setItem('jwtToken', jwtToken);
  localStorage.setItem('iv', ivToken);
  localStorage.setItem('aesKey', aesTokenKey);
  // userAxios.interceptors.request.use(
  //   (config) => {
  //     const jwt = localStorage.getItem('jwtToken');
  //     // eslint-disable-next-line no-param-reassign
  //     config.headers.authorization = `Bearer ${jwt}`;
  //     const aeskey = localStorage.getItem('aesKey');
  //     const ivkey = localStorage.getItem('iv');
  //     // 加密
  //     const encrypt = JWTUtil.encryptJWTMessage(aeskey, ivkey, JSON.stringify(config.data));
  //     config.data = encrypt;
  //     return config;
  //   },
  // );
};

export default getKey;
