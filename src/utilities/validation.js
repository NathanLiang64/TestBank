import * as yup from 'yup';

/* =========== 錯誤訊息 =========== */
const errorMessage = {
  includeEnglishAndNumber: '密碼需包含英文與數字',
  passwordCannotBeTheSameAsId: '「密碼」不可與「身分證號碼」相同',
  moneyRequired: '輸入金額欄位尚未填寫，請重新檢查。',
  wrongFormatOfMoney: '輸入金額欄位格式有誤，請重新檢查。',
  bankCodeRequired: '轉出行庫尚未選取，請重新檢查。',
  transferAccountRequired: '輸入轉出帳號尚未填寫，請重新檢查。',
  wrongFormatOfAccount: '輸入轉出帳號格式有誤，請重新檢查。',
  wrongEmail: '電子信箱格式有誤，請重新檢查。',
  emailRequried: '電子信箱尚未填寫，請重新檢查。',
};

/* =========== 驗證規則 =========== */
/**
 *- 驗證不為0
 * @param value
 * @returns {boolean}
 */
const payAmountValidationNotZero = (value) => (parseFloat(value) > parseFloat('0'));
/**
 * 檢核字串是否有重複的英文或數字
 * 初始值為超過4次就擋，例如：a11a11a1 (X) bb1bb1b1(X) a11a11aaA (O) bb1bb111(O)
 *
 * @param value
 *            驗證的參數
 * @return 檢核結果
 */
const validateTextRepeat = (value) => {
  let repeatCount = 0;
  const maxRepeatCount = 5;
  const charArray = value.split('');
  for (let i = 0; i < value.length; i += 1) {
    repeatCount = 0;
    for (let j = 0; j < value.length; j += 1) {
      if (charArray[i] === charArray[j]) {
        repeatCount += 1;
      }
      if (repeatCount === maxRepeatCount) {
        return false;
      }
    }
  }
  return true;
};
/**
 * 檢核字串是否有連續順序的字串
 * 初始值為超過4次就擋，例如：12345 (X) 1234(O) ABCDE (X) ABCDA(O)
 *
 * @param value
 *            驗證的參數
 * @return 檢核結果
 */
const validateTextContinuous = (password) => {
  let isRepeat = false;
  const repeat = {};
  for (let index = 0; index < password.length; index++) {
    const preIndex = index - 1 < 0 ? 0 : index - 1;
    const preStr = repeat[preIndex] || '';
    const preStrLastLetter = preStr[preStr.length - 1] || '';
    const currentLetter = password[index];
    const preStrLastLetterCharCode = preStrLastLetter.charCodeAt();
    const curCharCode = currentLetter.charCodeAt();
    if (
      curCharCode - preStrLastLetterCharCode === 1 // 数字或字母递增
    ) {
      if (preStr.length <= 1) {
        repeat[index] = `${preStr}${currentLetter}`;
      } else {
        let start = 0;
        for (let j = preStr.length - 2; j > 0; j--) {
          if (preStr[j + 1].charCodeAt() - preStr[j].charCodeAt() !== 1) {
            start = j + 1;
            break;
          }
        }
        const result = `${preStr.substring(start)}${currentLetter}`;
        repeat[index] = result;
        if (result.length >= 5) {
          isRepeat = true;
        }
      }
    } else if (currentLetter === preStrLastLetter) { // 数字或者字母重复
      let repeatStart = 0;
      for (let j = preStr.length - 1; j > 0; j--) {
        if (preStr[j] !== currentLetter) {
          repeatStart = j + 1;
          break;
        }
      }
      const result = `${preStr.substring(repeatStart)}${currentLetter}`;
      repeat[index] = result;
      if (result.length >= 5) {
        isRepeat = true;
      }
    } else if (preStrLastLetterCharCode - curCharCode === 1) { // 数字或字母递减
      if (preStr.length <= 1) {
        repeat[index] = `${preStr}${currentLetter}`;
      } else {
        let start = 0;
        for (let j = preStr.length - 2; j > 0; j--) {
          if (preStr[j].charCodeAt() - preStr[j + 1].charCodeAt() !== 1) {
            start = j + 1;
            break;
          }
        }
        const result = `${preStr.substring(start)}${currentLetter}`;
        repeat[index] = result;
        if (result.length >= 5) {
          isRepeat = true;
        }
      }
    } else {
      repeat[index] = currentLetter;
    }
  }
  return !isRepeat;
};
/* =========== 頁面驗證項目 =========== */
/**
 *- 共通驗證
 */
// 密碼驗證
const passwordValidation = {
  password: yup.string().matches(/^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/, '密碼需包含英文與數字')
    .required('請輸入您的網銀密碼').min(8, '您輸入的網銀密碼長度有誤，請重新輸入。')
    .max(20, '您輸入的網銀密碼長度有誤，請重新輸入。')
    .test(
      'check-password-text-repeat',
      '「密碼」同一個字母或數字不可超過4次',
      (value) => validateTextRepeat(value),
    )
    .test(
      'check-password-text-continuous',
      '「密碼」連續字母或數字不可超過4位',
      (value) => validateTextContinuous(value),
    ),
  // 密碼相同驗證
  passwordDoubleCheck: yup.string()
    .oneOf([yup.ref('password'), null], '密碼必須相同')
    .required('必填'),
};
/**
 *- 信用卡繳款驗證
 */
// 繳款金額驗證
const payAmountValidation = {
  payAmount: yup.number()
    .when('payMoney', {
      is: 3,
      then: yup.number(errorMessage.wrongFormatOfMoney)
        .required(errorMessage.moneyRequired)
        .test('payAmount-notzero', errorMessage.wrongFormatOfMoney, (value) => payAmountValidationNotZero(value)),
    }),
};
// 轉出帳號行庫驗證
const bankCodeValidation = {
  otherBankCode: yup.string()
    .when('payType', {
      is: 2,
      then: yup.string().test('otherBankCode-notspace', errorMessage.bankCodeRequired, (value) => value !== ' '),
    }),
};
// 轉出帳號驗證
const transferAccountValidation = {
  otherTrnAcct: yup.string()
    .when('payType', {
      is: 2,
      then: yup.string(errorMessage.transferAccountRequired)
        .required(errorMessage.transferAccountRequired).max(16, errorMessage.wrongFormatOfAccount),
    }),
};
// email驗證
const emailValidation = {
  email: yup.string()
    .when('sendEmail', {
      is: true,
      then: yup.string().email(errorMessage.wrongEmail).required(errorMessage.emailRequried),
    }),
};

export {
  passwordValidation,
  payAmountValidation,
  bankCodeValidation,
  transferAccountValidation,
  emailValidation,
};
