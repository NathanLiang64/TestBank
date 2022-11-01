import * as yup from 'yup';

export const generateValidationSchema = (maxAmount) => yup.object().shape({
  name: yup
    .string()
    .required('請輸入計畫名稱')
    .max(7, '請輸入7個以內的中英文字、數字或符號'),
  cycleDuration: yup.string().required('請選擇存錢區間'),
  cycleMode: yup.string().required('請選擇存錢頻率'),
  cycleTiming: yup.string().required('請選擇週期'),
  amount: yup
    .number()
    .required('請輸入每期存錢金額')
    .min(10000, '每期最低金額為 $10,000元')
    .max(
      maxAmount || 90000000,
      `每期最高金額為 $${maxAmount || 90000000}元`,
    ),
  bindAccountNo: yup.string().required('請選擇帳號'),
});
