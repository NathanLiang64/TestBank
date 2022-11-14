import { accountFormatter, currencySymbolGenerator } from 'utilities/Generator';
import { AMOUNT_OPTION } from './constants';

export const generateAmountOptions = (bills) => {
  if (!bills) return [];

  return [
    {
      label: `本期應繳金額 ${currencySymbolGenerator(
        bills.currency ?? 'NTD',
        bills.amount,
      )}`,
      value: bills.amount,
    },
    {
      label: `最低應繳金額 ${currencySymbolGenerator(
        bills.currency ?? 'NTD',
        bills.minAmount,
      )}`,
      value: bills.minAmount,
    },
    {
      label: '自訂金額',
      value: AMOUNT_OPTION.CUSTOM,
    },
  ];
};

export const generateAccountNoOptions = (bills) => {
  if (!bills) return [];

  return bills.accounts.map((v) => ({
    label: accountFormatter(v.accountNo),
    value: v.accountNo,
  }));
};
