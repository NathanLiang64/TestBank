import { useHistory } from 'react-router';

import { R004, DownloadIcon } from 'assets/images/icons';
import BottomAction from 'components/BottomAction';
import { FuncID } from 'utilities/FuncID';
import { getInvoice } from '../api';
import TrayWrapper from './Tray.style';

const Tray = ({ deductInfo }) => {
  const history = useHistory();

  return (
    <TrayWrapper>
      <BottomAction className="badFlex" position={0}>
        { (deductInfo?.autoDeductStatus === '0') && (
        <button type="button" onClick={() => history.push(`/${FuncID.R00400}`)}>
          <R004 />
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
