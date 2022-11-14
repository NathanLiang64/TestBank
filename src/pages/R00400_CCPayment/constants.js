export const PAYMENT_OPTION = {
  INTERNAL: 'self',
  EXTERNAL: 'external',
  CSTORE: 'shop',
};

export const AMOUNT_OPTION = {
  CUSTOM: 'custom',
  MIN: 'min',
  ALL: 'all',
};

export const paymentMethodOptions = [
  { label: '本行帳戶', value: PAYMENT_OPTION.INTERNAL },
  { label: '他行帳戶', value: PAYMENT_OPTION.EXTERNAL },
  { label: '超商條碼', value: PAYMENT_OPTION.CSTORE },
];

export const defaultValues = {
  paymentMethod: PAYMENT_OPTION.INTERNAL,
  amountOptions: '',
  customAmount: null,
  accountNo: '',
  bankId: '',
  extAccountNo: '',
};
