import * as yup from 'yup';

export const generateValidationSchema = (bills) => yup.object().shape({
  paymentMethod: yup.string().required('請選擇繳款方式'),
  amountOptions: yup.string().required('請選擇繳款金額'),
  customAmount: yup.number().when('amountOptions', (amountOptions, s) => (amountOptions === 'customized' && !!bills
    ? s
      .required('請填入自訂金額')
      .typeError('請填入自訂金額')
      .max(
        // bills 應該要存在，若不存在的話，在 R00400 會直接導向首頁，讓使用者無法使用表單
        bills?.amount || 10000000,
        '繳款金額需介於最低應繳金額和本期應繳金額之間',
      )
      .min(
        bills.minAmount || 10000000,
        '繳款金額需介於最低應繳金額和本期應繳金額之間',
      )
    : s.nullable())),
  accountNo: yup
    .string()
    .when('paymentMethod', (method, s) => (method === 'self' ? s.required('請選擇轉出帳號') : s.notRequired())),
  bankId: yup
    .string()
    .when('paymentMethod', (method, s) => (method === 'external' ? s.required('請選擇銀行代碼') : s.notRequired())),
  extAccountNo: yup
    .string()
    .when('paymentMethod', (method, s) => (method === 'external'
      ? s
        .matches(/\d{12,16}/, '金融卡帳號由14個數字所組成')
        .required('請選擇轉出帳號')
      : s.nullable())),
});
