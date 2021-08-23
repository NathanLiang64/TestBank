/* eslint-disable radix,no-restricted-globals */
import * as yup from 'yup';

/* ====================== 錯誤訊息 ====================== */
const errorMessage = {
  // 密碼
  passwordRequired: '請輸入您的網銀密碼',
  passwordIncludeEnglishAndNumber: '密碼需包含英文與數字',
  passwordCannotBeTheSameAsId: '「密碼」不可與「身分證號碼」相同',
  passwordWrongLength: '您輸入的網銀密碼長度有誤，請重新輸入',
  passwordCannotSameCharacter: '「密碼」同一個字母或數字不可超過4次',
  passwordCannotConsecutive: '「密碼」連續字母或數字不可超過4位',

  // 身份證字號
  identityRequired: '身分證字號尚未輸入，請確認',
  identityWrongFormat: '輸入錯誤，請重新填寫',

  // 使用者代號
  userAccountRequired: '使用者代號尚未輸入，請確認',
  userAccountWrongLength: '您輸入的使用者代號長度有誤，請重新輸入',

  // Email 信箱
  emailWrongFormat: '電子信箱格式有誤，請重新檢查',
  emailRequired: '電子信箱尚未填寫，請重新檢查',

  // 金額
  moneyRequired: '輸入金額欄位尚未填寫，請重新檢查',
  moneyWrongFormat: '輸入金額欄位格式有誤，請重新檢查',

  // 轉出金額
  transferAmountRequired: '請輸入轉帳金額',
  transferAmountWrongFormat: '轉出金額不可大於百萬',
  transferAmountCannotBeZero: '金額不可為 0',

  // 轉出行庫
  bankCodeRequired: '轉出行庫尚未選取，請重新檢查',

  // 銀行帳號
  bankAccountRequired: '請輸入銀行帳號',
  bankAccountWrongFormat: '轉入帳號格式有誤，請重新檢查',

  // 轉出帳號
  transferAccountRequired: '輸入轉出帳號尚未填寫，請重新檢查',
  transferAccountWrongFormat: '輸入轉出帳號格式有誤，請重新檢查',

  // 轉入帳號
  receivingAccountRequired: '請輸入轉入帳號',
  receivingAccountWrongFormat: '轉入帳號格式有誤，請重新檢查',

  // 暱稱
  nicknameRequired: '請輸入暱稱',
};

/* ====================== 驗證規則 ====================== */
/**
 *- 驗證不為0
 * @param value
 * @returns {boolean}
 */
const payAmountValidationNotZero = (value) => (parseFloat(value) > parseFloat('0'));

/**
 *-驗證身分證格式
 * @param id
 * @returns {boolean}
 */
const checkID = (id) => {
  const tab = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
  const A1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3];
  const A2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5];
  const Mx = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

  if (id.length !== 10) return false;
  let i = tab.indexOf(id.charAt(0));
  if (i === -1) return false;
  let sum = A1[i] + A2[i] * 9;

  for (i = 1; i < 10; i += 1) {
    const v = parseInt(id.charAt(i));
    if (isNaN(v)) return false;
    sum += v * Mx[i];
  }
  if (sum % 10 !== 0) return false;
  return true;
};

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
  password: yup.string().matches(/^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/, errorMessage.passwordIncludeEnglishAndNumber)
    .required(errorMessage.passwordRequired).min(8, errorMessage.passwordWrongLength)
    .max(20, errorMessage.passwordWrongLength)
    .test(
      'check-password-text-repeat',
      errorMessage.passwordCannotSameCharacter,
      (value) => validateTextRepeat(value),
    )
    .test(
      'check-password-text-continuous',
      errorMessage.passwordCannotConsecutive,
      (value) => validateTextContinuous(value),
    ),
};

// 身分證
const identityValidation = {
  identity: yup.string().required(errorMessage.identityRequired)
    .test(
      'check-custID',
      errorMessage.identityWrongFormat,
      (value) => checkID(value),
    ),
};

// 使用者代號
const accountValidation = {
  account: yup.string().required(errorMessage.userAccountRequired)
    .min(6, errorMessage.userAccountWrongLength).max(20, errorMessage.userAccountWrongLength),
};

// 銀行帳號
const bankAccountValidation = () => (
  yup.string()
    .required(errorMessage.bankAccountRequired)
    .min(10, errorMessage.bankAccountWrongFormat).max(16, errorMessage.bankAccountWrongFormat)
);

// 轉入帳號
const receivingAccountValidation = () => (
  yup.string()
    .required(errorMessage.receivingAccountRequired)
    .min(10, errorMessage.receivingAccountWrongFormat).max(16, errorMessage.receivingAccountWrongFormat)
);

// 轉出金額
const transferAmountValidation = () => (
  yup.string()
    .required(errorMessage.transferAmountRequired)
    .max(7, errorMessage.transferAmountWrongFormat)
    .test('test', errorMessage.transferAmountCannotBeZero, (value) => !(parseInt(value, 10) <= 0))
);

// 銀行代碼
// const bankCodeValidation = {
//   bankCode: yup.object({
//     bankCode: yup.string().required(errorMessage.bankCodeRequired),
//     bankName: yup.string().required(errorMessage.bankCodeRequired),
//   }).nullable(true).required(errorMessage.bankCodeRequired),
// };

// 銀行代碼
const bankCodeValidation = () => (
  yup.object({
    bankNo: yup.string().required(errorMessage.bankCodeRequired),
    bankName: yup.string().required(errorMessage.bankCodeRequired),
  }).nullable(true).required(errorMessage.bankCodeRequired)
);

// 暱稱
const nicknameValidation = () => (
  yup.string()
    .required(errorMessage.nicknameRequired)
);

/**
 *- 信用卡繳款驗證
 */
// 繳款金額驗證
const payAmountValidation = {
  payAmount: yup.number()
    .when('payMoney', {
      is: 3,
      then: yup.number(errorMessage.moneyWrongFormat)
        .required(errorMessage.moneyRequired)
        .test('payAmount-notzero', errorMessage.moneyWrongFormat, (value) => payAmountValidationNotZero(value)),
    }),
};

// 轉出帳號行庫驗證
const billPayBankCodeValidation = {
  otherBankCode: yup.object()
    .when('payType', {
      is: 2,
      then: bankCodeValidation(),
      // then: yup.object({
      //   bankCode: yup.string().required(errorMessage.bankCodeRequired),
      //   bankName: yup.string().required(errorMessage.bankCodeRequired),
      // }).nullable(true).required(errorMessage.bankCodeRequired),
      // then: yup.string().test('otherBankCode-notspace', errorMessage.bankCodeRequired, (value) => value !== ''),
    }),
};

// 轉出帳號驗證
const transferAccountValidation = {
  otherTrnAcct: yup.string()
    .when('payType', {
      is: 2,
      then: yup.string(errorMessage.transferAccountRequired)
        .required(errorMessage.transferAccountRequired).max(16, errorMessage.transferAccountWrongFormat),
    }),
};

// Email 驗證
const emailValidation = {
  email: yup.string()
    .when('sendEmail', {
      is: true,
      then: yup.string().email(errorMessage.emailWrongFormat).required(errorMessage.emailRequired),
    }),
};

export {
  identityValidation,
  accountValidation,
  passwordValidation,
  payAmountValidation,
  billPayBankCodeValidation,
  transferAccountValidation,
  emailValidation,
  bankAccountValidation,
  receivingAccountValidation,
  transferAmountValidation,
  nicknameValidation,
  bankCodeValidation,
};
