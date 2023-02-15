import {
  FixedDepositIcon,
  ExchangeIcon,
  CoverDownloadIcon,
  RadioUncheckedIcon,
  EditAccountIcon,
  D008,
  E004,
} from 'assets/images/icons';

export const iconGenerator = (name) => {
  switch (name) {
    case 'fixedDeposit':
      return <FixedDepositIcon />;
    case 'exchange':
      return <ExchangeIcon />;
    case 'coverDownload':
      return <CoverDownloadIcon />;
    case 'edit':
      return <EditAccountIcon />;
    case 'temp':
      return <RadioUncheckedIcon />;
    case 'reserve':
      return <D008 />;
    case 'foreignCurrencyPriceSetting':
      return <E004 />;
    default:
      return null;
  }
};
