import CipherUtil from './CipherUtil';

const assert = require('assert');

class JWTUtil {
  /**
   * Encrypt JWT Message
   * @param {*} aesKey
   * @param {*} iv
   * @param {*} message
   */
  // eslint-disable-next-line class-methods-use-this
  encryptJWTMessage(aesKey, iv, message) {
    const data = CipherUtil.encryptAES(aesKey, iv, message);
    const hmac = CipherUtil.encryptHMAC(aesKey, message);
    // const enc = CipherUtil.getEnc(aesKey);
    // const data = CipherUtil.encryptAES(enc, iv, message);
    // const hmac = CipherUtil.encryptHMAC(enc, message);

    return {
      data,
      mac: hmac,
    };
  }

  /**
   * Decrypt JWT Message
   * @param {*} aesKey
   * @param {*} iv
   * @param {*} message
   */
  // eslint-disable-next-line class-methods-use-this
  decryptJWTMessage(aesKey, iv, message) {
    // const enc = CipherUtil.getEnc(aesKey);
    const request = CipherUtil.decryptAES(aesKey, iv, message.data ?? message.encData); // encData ??? for SM
    const hmac = CipherUtil.encryptHMAC(aesKey, request);
    assert.strictEqual(hmac, message.mac);
    const json = JSON.parse(request);
    return json;
  }
}
export default new JWTUtil();
