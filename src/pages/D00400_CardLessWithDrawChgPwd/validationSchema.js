import * as yup from 'yup';
import {
  cardlessWithdrawPasswordValidation,
  confirmCardlessWithdrawPasswordValidation,
} from 'utilities/validation';

export const validationSchema = yup.object().shape({
  oldPassword: cardlessWithdrawPasswordValidation(),
  newPassword: cardlessWithdrawPasswordValidation(),
  newPasswordConfirm: confirmCardlessWithdrawPasswordValidation('newPassword'),
});
