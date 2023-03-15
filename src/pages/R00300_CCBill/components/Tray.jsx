import { useNavigation } from 'hooks/useNavigation';
import { R004, DownloadIcon } from 'assets/images/icons';
import BottomAction from 'components/BottomAction';
import { Func } from 'utilities/FuncID';
import { getInvoice } from '../api';
import TrayWrapper from './Tray.style';

const Tray = ({ deductInfo, currentMonth }) => {
  const { startFunc } = useNavigation();

  return (
    <TrayWrapper>
      <BottomAction className="badFlex" position={0}>
        { (deductInfo?.autoDeductStatus === '0') && (
        <button type="button" onClick={() => startFunc(Func.R004.id)}>
          <R004 />
          繳費
        </button>
        )}
        <button type="button" onClick={() => getInvoice(currentMonth)}>
          <DownloadIcon className="download" />
          下載帳單
        </button>
      </BottomAction>
    </TrayWrapper>
  );
};

export default Tray;
