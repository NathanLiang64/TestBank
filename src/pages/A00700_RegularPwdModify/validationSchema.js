import {
  confirmPasswordValidation,
  newPasswordValidation,
} from 'utilities/validation';
import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  password: yup.string().required('請輸入您的網銀密碼'),
  newPassword: newPasswordValidation('password'),
  newPasswordCheck: confirmPasswordValidation('newPassword'),
});
