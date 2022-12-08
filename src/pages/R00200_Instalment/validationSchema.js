import * as yup from 'yup';

export const entranceSchema = yup.object().shape({
  installmentType: yup.string().required('請選擇欲申請之晚點付項目'),
});

export const installmentItemSchema = yup.object().shape({
  installmentItem: yup.string().required('請選擇要分期消費的項目'),
});

export const installmentNumberSchema = yup.object().shape({
  installmentNumber: yup.string().required('請選擇欲申請之晚點付期數'),
});
