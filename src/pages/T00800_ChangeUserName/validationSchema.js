/* eslint-disable no-unused-vars */
import { accountValidation, confirmAccountValidation, newAccountValidation } from 'utilities/validation';
import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  // userName: accountValidation(),
  userName: yup.string().required('使用者代號尚未輸入，請重新檢查'),
  newUserName: newAccountValidation('userName'),
  newUserNameCheck: confirmAccountValidation('newUserName'),
});
