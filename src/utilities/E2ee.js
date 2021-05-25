import TWCA4E2EELib from './TWCA4E2EELib';
import { getE2EEFlag } from '../apis/e2eeApi';

/**
 * e2ee加密
 * @param value
 * @returns {string}
 */
const e2ee = async (value) => {
  const response = await getE2EEFlag();
  const e2eeFlag = response.e2ee_flag;
  const PUBLIC_EXPONENT = response.exponent;
  const MODULUS = response.modulus;
  let inputData;
  if (e2eeFlag === 'Y') {
    const errorCode = TWCA4E2EELib.EncryptSecret(value, PUBLIC_EXPONENT, MODULUS);
    if (errorCode === 0) {
      inputData = TWCA4E2EELib.getSecret();
    }
  }
  return inputData;
};

export default e2ee;
