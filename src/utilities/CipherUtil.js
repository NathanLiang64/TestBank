/* eslint-disable class-methods-use-this */
import CryptoJS from 'crypto-js';

const { Buffer } = require('buffer');
const forge = require('node-forge');

class CipherUtil {
  /**
   * Generate RSA, only for web
   */
  generateRSA() {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKey = forge.pki.setRsaPublicKey(keyPair.privateKey.n, keyPair.privateKey.e);
    const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
    return {
      privateKey: privateKeyPem,
      publicKey: publicKeyPem.replace(/(\r\n\t|\r\n|\n|\r\t)/gm, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', ''),
    };
  }

  /**
   * 產生指定位元長度的隨機 Key 值陣列，並以 Base64 字串傳回。
   * @param {*} bits 隨機 Key 的位元長度。
   * @returns Base64 格式的隨機 Key 值陣列。
   */
  generateKey(bits) {
    const key = forge.random.getBytesSync(bits / 8);
    return forge.util.encode64(key);
  }

  /**
   * Get ENC for JWE
   * @param {*} aesKey
   */
  getEnc(aesKey) {
    const key = forge.util.decode64(aesKey);
    const enc = key.substring(16, 32);
    return forge.util.encode64(enc);
  }

  /**
   * Get HMAC, only for web for JWE
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
   * 以 modulus 及 exponent 進行 RSA 加密。
   */
  encryptRSAe2ee(modulus, exponent, message) {
    const n = new forge.jsbn.BigInteger(modulus, 16);
    const e = new forge.jsbn.BigInteger(exponent, 16);
    // console.log(n, e);
    const publicKey = forge.pki.setRsaPublicKey(n, e);
    // console.log(publicKey);

    const buffer = forge.util.createBuffer(message, 'utf8');
    const bytes = buffer.getBytes();
    const encrypted = publicKey.encrypt(bytes, 'RSAES-PKCS1-V1_5'); // BUG 應為 RSA/ECB/PKCS1Padding
    return forge.util.bytesToHex(encrypted);
  }

  /**
   * e2ee加密
   * @param value
   * @returns {string}
   */
  e2ee(message) {
    // const response = await getE2EEFlag();
    const response = {
      exponent: '8C9B',
      modulus: 'B6CA16477CA1E33065A73E6F6724A811BA84BB1A539E2DC5C48608ADDE8562A586413CD631D875F9960AC0D0C0B9657F2D1E1F4CEDA2CFF8CD63B3E636297869E674EA24DD73B2B7EED745580B140513232FD4D6C0C4E2A6A7BA081FF99395FFDEAF22C8F8A5D6CEBA13A40D9E3A27ADC64566B2AA8815964780F3F60511A18448690B428E217252FB425D00B774B7B74E58AE0AFCE693AA86F6FB176949FA34F25100919158131859E9BE9A80B6239D5B9DC67F3722D7B495F85CF39E0253587A516E3A734CF6AE82E1767578B7C9AD5780B5DACB9F26365FF5640B3EDE0582FD81A70CCEA29AC0753C6DF77641134F472DC7B8EF085E7E9118CA0D2B969021',
    };

    const PUBLIC_EXPONENT = response.exponent;
    const MODULUS = response.modulus;

    const inputData = this.encryptRSAe2ee(MODULUS, PUBLIC_EXPONENT, message);
    // console.log('****** E2EE : ', inputData);
    return inputData;
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
    // return crypto.createHmac('sha256', aesKey).update(message).digest('base64');
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, aesKey);
    return hmac.update(message).finalize().toString(CryptoJS.enc.Base64);
  }
}

export default new CipherUtil();
