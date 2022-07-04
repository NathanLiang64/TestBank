/* eslint-disable class-methods-use-this */
import CipherUtil from './CipherUtil';

const assert = require('assert');

class JWTUtil {
  /**
   * Encrypt JWT Message
   * @param {*} aesKey
   * @param {*} iv
   * @param {*} message
   */
  encryptJWTMessage(aesKey, iv, message) {
    const data = CipherUtil.encryptAES(aesKey, iv, message);
    const hmac = CipherUtil.encryptHMAC(aesKey, message);

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
   * @param {*} mac
   */
  decryptJWTMessage(aesKey, iv, message, mac) {
    try {
      const request = CipherUtil.decryptAES(aesKey, iv, message);
      const hmac = CipherUtil.encryptHMAC(aesKey, request);
      assert.strictEqual(hmac, mac);
      const json = JSON.parse(request);
      return json;
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }
}
export default new JWTUtil();
