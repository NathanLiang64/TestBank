import { useEffect, useState } from 'react';
import { closeFunc } from 'utilities/BankeePlus';
import { accountFormatter, currencySymbolGenerator } from 'utilities/Generator';

/* Elements */
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import BottomAction from 'components/BottomAction';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import {
  CameraAltOutlined, ShareOutlined,
} from '@material-ui/icons';

/* Styles */
import ForeignCurrencyTransferWrapper from './foreignCurrencyTransfer.style';

const ForeignCurrencyTransfer2 = ({ location }) => {
  const isSuccess = true;
  const [resultData, setResultData] = useState({});

  const toTransferPage = () => {
    closeFunc();
  };

  useEffect(() => {
    setResultData(location.state);
  }, []);

  return (
    <Layout title="外幣轉帳結果">
      <ForeignCurrencyTransferWrapper className={isSuccess ? 'confirmAndResult' : 'confirmAndResult fail'}>
        <SuccessFailureAnimations isSuccess={isSuccess} successTitle="轉帳成功" errorTitle="轉帳失敗" />
        {
          isSuccess && (
            <>
              <div className="confrimDataContainer">
                <div className="dataLabel">轉出金額與轉入帳號</div>
                <div className="balance">
                  {
                    currencySymbolGenerator(resultData?.inCcyCd)
                  }
                  {
                    resultData?.inAmt
                  }
                </div>
                <div className="accountInfo">遠東商銀(805)</div>
                <div className="accountInfo">{ accountFormatter(resultData?.inAcct) }</div>
              </div>
              <div className="line" />
              <div className="infoListContainer">
                <div>
                  <InformationList title="轉出帳號" content={accountFormatter(resultData?.outAcct)} />
                  <InformationList title="時間" content={resultData?.dateStr} />
                </div>
                <div style={{ marginBottom: '8rem' }}>
                  <Accordion title="詳細交易">
                    <InformationList title="帳戶餘額" content={`${currencySymbolGenerator(resultData?.outCcyCd)}${resultData?.acctBalance}`} />
                    <InformationList title="匯款性質分類" content={resultData?.leglDesc} />
                    <InformationList title="備註" content={resultData?.memo} />
                  </Accordion>
                </div>
              </div>
              <BottomAction position={0}>
                <button type="button" onClick={() => console.log('call 原生截圖')}>
                  <CameraAltOutlined />
                  畫面截圖
                </button>
                <div className="divider" />
                <button type="button" onClick={() => console.log('跳轉查詢明細')}>
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
    </Layout>
  );
};

export default ForeignCurrencyTransfer2;
