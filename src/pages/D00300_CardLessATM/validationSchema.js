import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  withdrawAmount: yup
    .number()
    .max(20000, '提款金額上限為$20,000')
    .min(1000, '請輸入提款金額')
    .required('請輸入提款金額'),
  account: yup.string().required('無帳戶資訊'),
});
