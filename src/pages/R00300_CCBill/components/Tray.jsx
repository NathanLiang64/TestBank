import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { TransactionIcon, DownloadIcon } from 'assets/images/icons';
import { setDrawer, setDrawerVisible } from 'stores/reducers/ModalReducer';
import BottomAction from 'components/BottomAction';
import { getInvoice } from '../api';
import TrayWrapper, { DownloadWrapper } from './Tray.style';

const Tray = ({ bills }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDownloadInvoice = () => {
    dispatch(setDrawer({
      title: '',
      content: (
        <DownloadWrapper>
          <li>
            <button type="button" onClick={() => getInvoice(1)}>
              下載 PDF
              <DownloadIcon />
            </button>
          </li>
          <li>
            <button type="button" onClick={() => getInvoice(2)}>
              下載 EXCEL
              <DownloadIcon />
            </button>
          </li>
        </DownloadWrapper>
      ),
    }));
    dispatch(setDrawerVisible(true));
  };

  return (
    <TrayWrapper>
      <BottomAction className="badFlex">
        { !(bills?.autoDeduct) && (
        <button type="button" onClick={() => history.push('/R00400')}>
          <TransactionIcon />
          繳費
        </button>
        )}
        <button type="button" onClick={handleDownloadInvoice}>
          <DownloadIcon className="download" />
          下載帳單
        </button>
      </BottomAction>
    </TrayWrapper>
  );
};

export default Tray;
