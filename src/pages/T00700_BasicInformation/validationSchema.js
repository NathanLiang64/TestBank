import { addressValidation } from 'utilities/validation';
import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  mobile: yup
    .string()
    .required('請輸入行動電話')
    .matches(/^09[0-9]{8}$/, '行動電話格式不符'),
  email: yup.string().required('請輸入電子信箱').email('電子信箱格式不符'),
  county: yup.string().required('請選擇縣市'),
  city: yup.string().required('請選擇鄉鎮市區'),
  addr: addressValidation(),
});
