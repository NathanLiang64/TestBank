import { accountFormatter, currencySymbolGenerator } from 'utilities/Generator';
import { AMOUNT_OPTION } from './constants';

export const generateAmountOptions = (bills) => {
  if (!bills) return [];
  return [
    {
      label: `本期應繳金額 ${currencySymbolGenerator('NTD', bills.newBalance)}`,
      value: AMOUNT_OPTION.ALL,
    },
    {
      label: `最低應繳金額 ${currencySymbolGenerator('NTD', bills.minDueAmount)}`,
      value: AMOUNT_OPTION.MIN,
    },
    {
      label: '自訂金額',
      value: AMOUNT_OPTION.CUSTOM,
    },
  ];
};

export const generateAccountNoOptions = (accounts) => {
  if (!accounts || !accounts.length) return [];

  return accounts.map((v) => ({
    label: accountFormatter(v.account),
    value: v.account,
  }));
};
