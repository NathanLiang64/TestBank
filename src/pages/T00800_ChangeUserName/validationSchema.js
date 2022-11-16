import { accountValidation, confirmAccountValidation, newAccountValidation } from 'utilities/validation';
import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  userName: accountValidation(),
  newUserName: newAccountValidation('userName'),
  newUserNameCheck: confirmAccountValidation('newUserName'),
});
