/* eslint-disable no-unused-vars */
import { addressValidation } from 'utilities/validation';
import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  addr: addressValidation(),
});

export const generateSchema = (actionText) => {
  let schema;
  if (actionText === '補發') {
    schema = yup.object().shape({
      addr: addressValidation(),
    });
  } else {
    schema = yup.object().shape({});
  }
  return schema;
};
