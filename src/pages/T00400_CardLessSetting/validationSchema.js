import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  withdrawPwd: yup
    .string()
    .required('請輸入提款密碼')
    .min(6, '提款密碼須為 6-12 位數字')
    .max(12, '提款密碼須為 6-12 位數字')
    .matches(/^[0-9]*$/, '提款密碼僅能使用數字'),
  withdrawPwdCheck: yup
    .string()
    .required('請再輸入一次提款密碼')
    .min(6, '提款密碼須為 6-12 位數字')
    .max(12, '提款密碼須為 6-12 位數字')
    .matches(/^[0-9]*$/, '提款密碼僅能使用數字')
    .oneOf([yup.ref('withdrawPwd'), null], '兩次輸入的提款密碼必須相同'),
});
