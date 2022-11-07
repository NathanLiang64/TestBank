import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  actno: yup
    .string()
    .required('請輸入金融卡帳號')
    .matches(/^(\d{14})?$/, '金融卡帳號由14個數字所組成'),
  serial: yup
    .string()
    .required('請輸入金融卡序號')
    .matches(/^(\d{6})?$/, '金融卡序號由6個數字所組成'),
  // termAgree: yup.boolean().required('您尚未同意告知事項').oneOf([true], '您尚未同意告知事項'),
});
