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

export const CStoreContent = () => (
  <ol>
    <li>便利超商單筆繳款金額不得高於新臺幣2萬元整。</li>
    <li>繳款完成後約3個銀行營業日入帳，請您務必保留超商所提供之繳費收據至確認繳款正確入帳。</li>
    <li>上述應繳金額未含超商APP代收手續費(15元)，各超商手續費收取依超商現場條碼讀取金額為準。</li>
  </ol>
);

export const ExternalContent = () => (
  <ol>
    <li>待提供</li>
    <li>待提供</li>
    <li>待提供</li>
  </ol>
);
