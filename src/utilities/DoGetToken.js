/* eslint-disable prefer-const */
import userAxios from 'apis/axiosConfig';
import JWEUtil from './JWEUtil';
import CipherUtil from './CipherUtil';
import e2ee from './E2ee';
// const iv = CipherUtil.generateIV();
// const aesKey = CipherUtil.generateAES();
// const getPublicAndPrivate = CipherUtil.generateRSA();
const txnId = 'WEBCTLff7fd095-2cd0-4418-94cb-023256911c06';
const channelCode = 'HHB_A';
const appVersion = '1.0.15';
const txSeq = '20210802155847';

const getKey = async (data) => {
  localStorage.clear();
  let privateKey;
  let publicKey;
  let jwtToken;
  let ivToken;
  let aesTokenKey;
  const ServerPublicKey = await userAxios.post('/auth/publicKey');
  console.log(ServerPublicKey);
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
    txnId,
    channelCode,
    appVersion,
    txSeq,
    custId: data.identity.toUpperCase(),
    username: await e2ee(data.account),
    password: await e2ee(data.password),
  };
  // const getJWTToken = JWEUtil.encryptJWEMessage(ServerPublicKey.data.result.publicKey, JSON.stringify(message));
  // const getMyJWT = await userAxios.post('/auth/authenticate', getJWTToken);
  const getJWTToken = JWEUtil.encryptJWEMessage(ServerPublicKey.data.result.publicKey, JSON.stringify(message));
  const getMyJWT = await userAxios.post('/auth/login', getJWTToken);
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
