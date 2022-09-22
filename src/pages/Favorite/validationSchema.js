import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  personalDataTerm: yup.bool().oneOf([true], 'Agreement To Terms Is Required'),
  privacyTerm: yup.bool().oneOf([true], 'Agreement To Terms Is Required'),
});
