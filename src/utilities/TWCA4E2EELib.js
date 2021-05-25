/* eslint-disable no-unused-vars */
/*
 * TWCA Crypto E2EE Lib
 */
const TWCA_E2EE_SUCCESS = 0;
const TWCA_E2EE_INPUTPUBLIC_ERROR = 0x1001;
const TWCA_E2EE_ENCRYPT_ERROR = 0x1002;
let retSecret = '';
const version = '2.0.0.1';

module.exports = {

  getVersion() {
    return version;
  },
  getSecret(s1) {
    return retSecret;
  },
  EncryptSecret(Secret, exponent, modulus) {
    let ret = TWCA_E2EE_SUCCESS;
    // eslint-disable-next-line no-undef
    const rsa = new RSAKey();
    do {
      try {
        if (window.is_hexadecimal(modulus) && window.is_hexadecimal(exponent)) {
          rsa.setPublic(modulus, exponent);
        } else {
          ret = TWCA_E2EE_INPUTPUBLIC_ERROR;
        }
      } catch (e) {
        ret = TWCA_E2EE_INPUTPUBLIC_ERROR;
        break;
      }
      try {
        const encrypted = rsa.encrypt(Secret);
        if (encrypted) {
          retSecret = encrypted;
        } else {
          ret = TWCA_E2EE_ENCRYPT_ERROR;
        }
      } catch (e) {
        ret = TWCA_E2EE_ENCRYPT_ERROR;
        break;
      }
    } while (false);
    return ret;
  },
};
