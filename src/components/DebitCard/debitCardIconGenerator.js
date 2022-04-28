import {
  FixedDepositIcon, ExchangeIcon, CoverDownloadIcon, RadioUncheckedIcon, EditAccountIcon,
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
    default:
      return null;
  }
};
