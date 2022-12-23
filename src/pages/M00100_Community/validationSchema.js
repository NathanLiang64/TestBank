import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  nickname: yup.string().required('請輸入您的名稱'),
  essay: yup.string().max(200, '內容已超出字數限制'),
});
