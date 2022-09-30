import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  cardLessCredit: yup.number().required('請提供無卡提款金額'),
});
