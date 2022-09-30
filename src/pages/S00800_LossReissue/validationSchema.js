/* eslint-disable no-unused-vars */
import { addressValidation } from 'utilities/validation';
import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  addr: addressValidation(),
});
