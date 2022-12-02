import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  note: yup.string().max(7, '限制字數為7個字元'),
});
