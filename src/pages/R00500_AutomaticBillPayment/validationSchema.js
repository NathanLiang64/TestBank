import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  account: yup.string().required('請選擇扣款帳號'),
  isFullPay: yup.string().required('請選擇扣款方式'),
  bank: yup.string().required('無指定銀行代碼'),
});
