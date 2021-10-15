import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import Accordion from 'components/Accordion';
import BottomAction from 'components/BottomAction';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import {
  CameraAltOutlined, ShareOutlined,
} from '@material-ui/icons';

/* Styles */
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import ForeignCurrencyTransferWrapper from './foreignCurrencyTransfer.style';

const ForeignCurrencyTransfer2 = () => {
  const history = useHistory();
  const isSuccess = true;

  const toTransferPage = () => {
    history.push('/foreignCurrencyTransfer');
  };

  useCheckLocation();
  usePageInfo('/api/foreignCurrencyTransfer2');

  useEffect(() => {}, []);

  return (
    <ForeignCurrencyTransferWrapper className={isSuccess ? 'confirmAndResult' : 'confirmAndResult fail'}>
      <div className="stateContainer">
        <img className="stateImage" src={isSuccess ? SuccessImage : ErrorImage} alt="" />
        <div className={isSuccess ? 'stateContent success' : 'stateContent fail'}>
          {
            isSuccess ? '轉帳成功' : '轉帳失敗'
          }
        </div>
      </div>
      {
        isSuccess && (
          <>
            <div className="confrimDataContainer">
              <div className="dataLabel">轉出金額與轉入帳號</div>
              <div className="balance">£100.00</div>
              <div className="accountInfo">遠東商銀(805)</div>
              <div className="accountInfo">00200701710979</div>
            </div>
            <div className="line" />
            <div className="infoListContainer">
              <div>
                <InformationList title="轉出帳號" content="00200700001234" />
                <InformationList title="時間" content="2020/08/23" />
              </div>
              <div style={{ marginBottom: '8rem' }}>
                <Accordion title="詳細交易">
                  <InformationList title="帳戶餘額" content="£ 5,240.56" />
                  <InformationList title="匯款性質分類" content="本人自行帳戶轉帳" />
                  <InformationList title="備註" content="聖誕節禮物" />
                </Accordion>
              </div>
            </div>
            <BottomAction>
              <button type="button" onClick={() => window.alert('call 原生截圖')}>
                <CameraAltOutlined />
                畫面截圖
              </button>
              <div className="divider" />
              <button type="button" onClick={() => window.alert('跳轉查詢明細')}>
                <ShareOutlined />
                查詢明細
              </button>
            </BottomAction>
          </>
        )
      }
      {
        !isSuccess && (
          <div className="btnContainer">
            <FEIBButton onClick={toTransferPage}>確認</FEIBButton>
          </div>
        )
      }
    </ForeignCurrencyTransferWrapper>
  );
};

export default ForeignCurrencyTransfer2;
