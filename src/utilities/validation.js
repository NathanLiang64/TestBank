import * as yup from 'yup';

/* =========== 錯誤訊息 =========== */
const errorMessage = {
  includeEnglishAndNumber: '密碼需包含英文與數字',
  passwordCannotBeTheSameAsId: '「密碼」不可與「身分證號碼」相同',
  MoneyRequired: '輸入金額欄位尚未填寫，請重新檢查。',
  wrongFormatOfMoney: '輸入金額欄位格式有誤，請重新檢查。',
  bankCodeRequired: '轉出行庫尚未選取，請重新檢查。',
  transferAccountRequired: '輸入轉出帳號尚未填寫，請重新檢查。',
  wrongFormatOfAccount: '輸入轉出帳號格式有誤，請重新檢查。',
};

/* =========== 驗證規則 =========== */
// 自訂金額驗證規則
const payAmountValidationNotZero = (value) => (parseFloat(value) > parseFloat('0'));
const payAmountValidation = {
  then: yup.number(errorMessage.wrongFormatOfMoney)
    .required(errorMessage.MoneyRequired)
    .test('payAmount-notzero', errorMessage.wrongFormatOfMoney, (value) => payAmountValidationNotZero(value)),
};

// 轉出帳號行庫驗證規則
const bankCodeValidation = {
  then: yup.string().test('otherBankCode-notspace', errorMessage.bankCodeRequired, (value) => value !== ' '),
};

// 轉出帳號驗證規則
const transferAccountValidation = {
  then: yup.string(errorMessage.transferAccountRequired)
    .required(errorMessage.transferAccountRequired).max(16, errorMessage.wrongFormatOfAccount),
};

export {
  payAmountValidation,
  bankCodeValidation,
  transferAccountValidation,
};
