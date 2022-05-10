/* eslint-disable class-methods-use-this */
const forge = require('node-forge');
// eslint-disable-next-line no-unused-vars
const crypto = require('crypto');
// eslint-disable-next-line no-unused-vars
const { type } = require('os');

class CipherUtil {
  /**
   * Generate RSA, only for web
   */
  // eslint-disable-next-line class-methods-use-this
  generateRSA() {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKey = forge.pki.setRsaPublicKey(keyPair.privateKey.n, keyPair.privateKey.e);
    const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
    return {
      privateKey: privateKeyPem,
      publicKey: publicKeyPem,
    };
  }

  generateKey(len) {
    const key = forge.random.getBytesSync(len);
    return forge.util.encode64(key);
  }

  /**
   * Generate AES, only for web
   */
  generateAES() {
    return this.generateKey(16);
  }

  /**
   * Generate IV, only for web
   */
  generateIV() {
    return this.generateKey(16);
  }

  /**
   * Get ENC
   * @param {*} aesKey
   */
  getEnc(aesKey) {
    const key = forge.util.decode64(aesKey);
    const enc = key.substring(16, 32);
    return forge.util.encode64(enc);
  }

  /**
   * Get HMAC, only for web
   * @param {*} aesKey
   */
  getHMAC(aesKey) {
    const key = forge.util.decode64(aesKey);
    const hmac = key.substring(0, 16);
    return forge.util.encode64(hmac);
  }

  /**
   * From Message to Base64, only for web
   * @param {*} publicKey
   * @param {*} message
   */
  encryptRSA(publicKey, message) {
    const encrypted = publicKey.encrypt(message, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create(),
      },
    });

    return forge.util.encode64(encrypted);
  }

  /**
   * From Base64 to Message, only for web
   * @param {*} privateKey
   * @param {*} message
   */
  decryptRSA(privateKey, message) {
    const decodeMessage = Buffer.from(message, 'base64');
    const decrypted = privateKey.decrypt(decodeMessage, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create(),
      },
    });

    return decrypted;
  }

  /**
   * From Message to Base64
   * @param {*} enc
   * @param {*} iv
   * @param {*} message
   */
  encryptAES(enc, iv, message) {
    const cipher = forge.cipher.createCipher('AES-CBC', forge.util.decode64(enc));
    cipher.start({ iv: forge.util.decode64(iv) });
    cipher.update(forge.util.createBuffer(message, 'utf8'));
    cipher.finish();
    const encrypted = cipher.output;

    return forge.util.encode64(encrypted.bytes());
  }

  /**
   * From Base64 to Message
   * @param {*} enc
   * @param {*} iv
   * @param {*} message
   */
  decryptAES(enc, iv, message) {
    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.decode64(enc));
    decipher.start({ iv: forge.util.decode64(iv) });
    // decipher.update(forge.util.createBuffer(forge.util.decode64(message)));
    decipher.update(forge.util.createBuffer(Buffer.from(message, 'base64')));
    // eslint-disable-next-line no-unused-vars
    const result = decipher.finish();

    return decipher.output.toString();
  }

  /**
   * Transfer Private Key String to Buffer, only for web
   * @param {*} privatKeyString
   */
  getRSAPrivateKeyFromPem(privatKeyString) {
    const privatKey = forge.pki.privateKeyFromPem(`-----BEGIN RSA PRIVATE KEY-----\n${privatKeyString}-----END RSA PRIVATE KEY-----\n`);

    return privatKey;
  }

  /**
   * Transfer Public Key String to Buffer, only for web
   * @param {*} publicKeyString
   */
  getRSAPublicKeyFromPem(publicKeyString) {
    // eslint-disable-next-line no-param-reassign
    publicKeyString = `-----BEGIN PUBLIC KEY-----\n${publicKeyString}-----END PUBLIC KEY-----\n`;
    const publicKey = forge.pki.publicKeyFromPem(publicKeyString);

    return publicKey;
  }

  /**
   *
   * @param {*} aesKey
   * @param {*} message
   */
  encryptHMAC(aesKey, message) {
    return crypto.createHmac('sha256', aesKey).update(message).digest('base64');
  }
}

export default new CipherUtil();
