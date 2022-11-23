import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  nickName: yup.string().required('請輸入您的名稱'),
});
