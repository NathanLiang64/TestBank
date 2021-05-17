/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import CipherUtil from './CipherUtil';

const forge = require('node-forge');

class JWEUtil {
  /**
   * Get protected
   */
  // eslint-disable-next-line class-methods-use-this
  getProtected() {
    // eslint-disable-next-line no-underscore-dangle
    const _protected = {
      enc: 'A128CBC-HS256',
    };
    return forge.util.encode64(JSON.stringify(_protected));
  }

  /**
   * Encrypt AES Key by Server RSA Public Key
   * @param {*} aesKey
   * @param {*} publicKey
   */
  // eslint-disable-next-line class-methods-use-this
  getEncryptedKey(aesKey, publicKey) {
    return CipherUtil.encryptRSA(publicKey, aesKey);
  }

  /**
   * Get CipherText by ENC, IV and Message
   * @param {*} enc
   * @param {*} iv
   * @param {*} message
   */
  // eslint-disable-next-line class-methods-use-this
  getCipherText(enc, iv, message) {
    return CipherUtil.encryptAES(enc, iv, message);
  }

  /**
   * Get AAD
   * @param {*} _protected
   */
  // eslint-disable-next-line class-methods-use-this
  getAad(_protected) {
    return Buffer.byteLength(_protected, 'ascii');
  }

  /**
   * Get Tag
   * @param {*} aesKey
   * @param {*} cipherText
   */
  // eslint-disable-next-line class-methods-use-this
  getTag(aesKey, cipherText) {
    const hmac = CipherUtil.getHMAC(aesKey);
    const tag = CipherUtil.encryptHMAC(hmac, cipherText);
    const authTag = forge.util.decode64(tag).substring(0, 16);
    return forge.util.encode64(authTag);
  }

  /**
   * Encrypt JWE Message
   * @param {*} publicKeyString
   * @param {*} message
   */
  encryptJWEMessage(publicKeyString, message) {
    try {
      const publicKey = CipherUtil.getRSAPublicKeyFromPem(publicKeyString);
      const aesKey = CipherUtil.generateAES();
      const iv = CipherUtil.generateIV();
      const encryptedKey = CipherUtil.encryptRSA(publicKey, forge.util.decode64(aesKey));
      const enc = CipherUtil.getEnc(aesKey);
      const cipherText = CipherUtil.encryptAES(enc, iv, message);
      const tag = this.getTag(aesKey, message);

      return {
        tag,
        ciphertext: cipherText,
        protected: 'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2In0=',
        iv,
        recipients: [
          {
            header: {
              alg: 'RSA-OAEP-256',
            },
            encrypted_key: encryptedKey,
          },
        ],
        unprotected: null,
      };
    } catch (error) {
      // Exception
      console.log(error);
    }
  }

  /**
   * Decrypt JWE Message
   * @param {*} privateKeyString
   * @param {*} message
   */
  // eslint-disable-next-line consistent-return
  // eslint-disable-next-line class-methods-use-this
  // eslint-disable-next-line consistent-return
  decryptJWEMessage(privateKeyString, message) {
    try {
      const privateKey = CipherUtil.getRSAPrivateKeyFromPem(privateKeyString);
      const cipherText = message.ciphertext;
      const { iv } = message;
      const encryptedKey = message.recipients[0].encrypted_key;
      const aesKey = CipherUtil.decryptRSA(privateKey, encryptedKey);
      const enc = CipherUtil.getEnc(forge.util.encode64(aesKey));
      const request = CipherUtil.decryptAES(enc, iv, cipherText);

      return request; // String
    } catch (error) {
      // Exception
      console.log(error);
    }
  }
}
export default new JWEUtil();
