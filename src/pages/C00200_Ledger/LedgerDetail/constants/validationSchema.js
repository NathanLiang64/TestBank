import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  notice: yup.string().max(30, '限制字數為20個字元').required('請輸入文字'),
});
