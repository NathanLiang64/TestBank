/* eslint-disable class-methods-use-this */
import CipherUtil from './CipherUtil';

const forge = require('node-forge');

class JWEUtil {
  /**
   * Get protected
   */
  getProtected() {
    return forge.util.encode64(JSON.stringify({ enc: 'A128CBC-HS256' }));
  }

  /**
   * Encrypt AES Key by Server RSA Public Key
   * @param {*} aesKey
   * @param {*} publicKey
   */
  getEncryptedKey(aesKey, publicKey) {
    return CipherUtil.encryptRSA(publicKey, aesKey);
  }

  /**
   * Get CipherText by ENC, IV and Message
   * @param {*} enc
   * @param {*} iv
   * @param {*} message
   */
  getCipherText(enc, iv, message) {
    return CipherUtil.encryptAES(enc, iv, message);
  }

  /**
   * Get AAD
   * @param {*} _protected
   */
  getAad(_protected) {
    return Buffer.byteLength(_protected, 'ascii');
  }

  /**
   * Get Tag
   * @param {*} aesKey
   * @param {*} cipherText
   */
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
    const publicKey = CipherUtil.getRSAPublicKeyFromPem(publicKeyString);
    const contextKey = CipherUtil.generateKey(256); // [本文加密金鑰]加密演算法採 A128CBC-HS256，亂數前 128 Bits 為 HMAC Key，後 128 Bits 為 ENC Key。
    const iv = CipherUtil.generateKey(128); // iv 的長度固定為 128its
    const encryptedKey = CipherUtil.encryptRSA(publicKey, forge.util.decode64(contextKey));
    const enc = CipherUtil.getEnc(contextKey);
    const ciphertext = CipherUtil.encryptAES(enc, iv, message);
    const tag = this.getTag(contextKey, message);

    return {
      tag,
      ciphertext,
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
  }

  /**
   * Decrypt JWE Message
   * @param {*} privateKeyString
   * @param {*} message
   */
  decryptJWEMessage(privateKeyString, message) {
    const privateKey = CipherUtil.getRSAPrivateKeyFromPem(privateKeyString);
    const {ciphertext} = message;
    const {iv} = message;
    const encryptedKey = message.recipients[0].encrypted_key;
    const aesKey = CipherUtil.decryptRSA(privateKey, encryptedKey);
    const enc = CipherUtil.getEnc(forge.util.encode64(aesKey));
    const request = CipherUtil.decryptAES(enc, iv, ciphertext);

    return request; // String
  }
}
export default new JWEUtil();
