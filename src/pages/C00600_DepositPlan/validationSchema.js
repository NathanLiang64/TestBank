import { toCurrency } from 'utilities/Generator';
import * as yup from 'yup';

export const createSchema = yup.object().shape({
  code: yup.string().required('請選擇計畫'),
});

export const generateEditSchema = (program) => yup.object().shape({
  name: program?.type
    ? yup.string().required('請輸入計畫名稱')
    : yup
      .string()
      .required('請輸入計畫名稱')
      .max(7, '請輸入7個以內的中英文字、數字或符號'),
  cycleDuration: yup
    .number()
    .required('請選擇存錢區間')
    .typeError('請選擇存錢區間'),
  cycleMode: yup
    .number()
    .required('請選擇存錢頻率')
    .typeError('請選擇存錢頻率'),
  cycleTiming: yup.number().required('請選擇週期').typeError('請選擇週期'),
  amount: yup
    .number()
    .required('請輸入每期存錢金額')
    .typeError('請輸入每期存錢金額')
    .min(
      program?.amountRange.month.min || 10000,
      `每期最低金額為 ${toCurrency(
        program?.amountRange.month.min || 10000,
      )}元`,
    )
    .max(
      program?.amountRange.month.max || 90000000,
      `每期最高金額為 ${toCurrency(
        program?.amountRange.month.max || 90000000,
      )}元`,
    )
    .test(
      'baseError',
      '金額需以萬元為單位',
      (values) => !(values % 10000),
    ),
  bindAccountNo: yup.string().required('請選擇帳號'),
});

export const generateRestirctedEditSchema = (plan) => yup.object().shape({
  name: plan?.progInfo.type
    ? yup.string().required('請輸入計畫名稱')
    : yup
      .string()
      .required('請輸入計畫名稱')
      .max(7, '請輸入7個以內的中英文字、數字或符號'),
  cycleDuration: yup
    .string()
    .required('請選擇存錢區間')
    .typeError('請選擇存錢區間'),
  cycleMode: yup
    .number()
    .required('請選擇存錢頻率')
    .typeError('請選擇存錢頻率'),
  cycleTiming: yup.number().required('請選擇週期').typeError('請選擇週期'),
  amount: yup
    .string()
    .required('請輸入每期存錢金額')
    .typeError('請輸入每期存錢金額'),
  bindAccountNo: yup.string().required('請選擇帳號'),
});
