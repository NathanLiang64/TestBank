/* eslint-disable no-unused-vars */
import { addressValidation } from 'utilities/validation';
import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  // addr: addressValidation(),
  county: yup.string().required('請選擇縣市'),
  city: yup.string().required('請選擇鄉鎮市區'),
  addr: yup.string().required('請輸入通訊地址'),
});

// const generateSchema = (actionText) => {
//   let schema;
//   if (actionText === '補發') {
//     schema = yup.object().shape({
//       addrStreet: addressValidation(),
//     });
//   } else {
//     schema = yup.object().shape({});
//   }
//   return schema;
// };
