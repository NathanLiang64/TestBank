import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  nickname: yup
    .string()
    .max(20, '限制字數為20個字元')
    .required('請輸入您的名稱'),
});
