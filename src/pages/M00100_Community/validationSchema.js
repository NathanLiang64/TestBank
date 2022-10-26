import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  nickname: yup.string().required('請提供無卡提款金額'),
  essay: yup.string().max(200, '內容已超出字數限制'),
});
