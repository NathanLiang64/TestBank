import { useHistory } from 'react-router';

import { CreditCardIcon3, DownloadIcon } from 'assets/images/icons';
import BottomAction from 'components/BottomAction';
import { getInvoice } from '../api';
import TrayWrapper from './Tray.style';

const Tray = ({ bills }) => {
  const history = useHistory();

  return (
    <TrayWrapper>
      <BottomAction className="badFlex">
        { !(bills?.autoDeduct) && (
        <button type="button" onClick={() => history.push('/R00400')}>
          <CreditCardIcon3 />
          繳費
        </button>
        )}
        <button type="button" onClick={() => getInvoice(1)}>
          <DownloadIcon className="download" />
          下載帳單
        </button>
      </BottomAction>
    </TrayWrapper>
  );
};

export default Tray;
