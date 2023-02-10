import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { accountFormatter, currencySymbolGenerator } from 'utilities/Generator';

/* Elements */
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import BottomAction from 'components/BottomAction';
import InformationList from 'components/InformationList';
import SnackModal from 'components/SnackModal';
import theme from 'themes/theme';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { CameraIcon } from 'assets/images/icons';
import {
  CameraAltOutlined, ShareOutlined,
} from '@material-ui/icons';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Styles */
import ForeignCurrencyTransferWrapper from './D00700.style';
import { executeTransfer } from './api';

const ForeignCurrencyTransfer2 = ({ location }) => {
  const dispatch = useDispatch();

  const [model, setModel] = useState(location.state);
  const [transferResult, setTransferResult] = useState({});
  const [showSnapshotSuccess, setShowSnapshotSuccess] = useState();

  /**
   * 頁面初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const result = await executeTransfer();
    const isSuccess = (result?.code === '0000'); // Debug 假設！
    await setTransferResult({
      isSuccess,
      errorCode: result?.code,
      message: result?.message, // 錯誤訊息
    });
    console.log('==> 轉帳執行結果：', result);
    console.log('==> transferResult：', transferResult);
    if (isSuccess) {
      console.log('==> isSuccess：', isSuccess);
      setModel((prevModel) => {
        const updatedBalance = result.acctBalance;
        return {
          ...prevModel,
          transOut: {
            ...prevModel.transOut,
            balance: updatedBalance,
          },
        };
      });
    }
    console.log('==> model：', model);
  }, []);

  /**
   * 初始化完成，關閉等待中狀態。
   */
  useEffect(async () => {
    console.log('==> (66)transferResult：', transferResult);
    if (transferResult) dispatch(setWaittingVisible(false));
  }, [transferResult]);

  const handleClickScreenshot = () => {
    // TODO 透過原生功能進行截圖。
    setShowSnapshotSuccess(true);
    setTimeout(() => setShowSnapshotSuccess(false), 1000); // 1 秒後自動關閉。
  };

  return (
    <Layout title="外幣轉帳結果">
      <ForeignCurrencyTransferWrapper className={transferResult.isSuccess ? 'confirmAndResult' : 'confirmAndResult fail'}>
        <SuccessFailureAnimations isSuccess={transferResult.isSuccess} successTitle="轉帳成功" errorTitle="轉帳失敗" />
        {
          transferResult.isSuccess && (
            <>
              <div className="confrimDataContainer">
                <div className="dataLabel">轉出金額與轉入帳號</div>
                <div className="balance">
                  {
                    currencySymbolGenerator(model?.inCcyCd)
                  }
                  {
                    model?.inAmt
                  }
                </div>
                <div className="accountInfo">遠東商銀(805)</div>
                <div className="accountInfo">{ accountFormatter(model?.inAcct) }</div>
              </div>
              <div className="line" />
              <div className="infoListContainer">
                <div>
                  <InformationList title="轉出帳號" content={accountFormatter(model?.outAcct)} />
                  <InformationList title="時間" content={model?.dateStr} />
                </div>
                <div style={{ marginBottom: '8rem' }}>
                  <Accordion title="詳細交易">
                    <InformationList title="帳戶餘額" content={`${currencySymbolGenerator(model?.outCcyCd)}${model?.transOut?.balance}`} />
                    <InformationList title="匯款性質分類" content={model?.leglDesc} />
                    <InformationList title="備註" content={model?.memo} />
                  </Accordion>
                </div>
              </div>
              <BottomAction position={0}>
                <button type="button" onClick={handleClickScreenshot}>
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
        { showSnapshotSuccess && (
          <SnackModal icon={<CameraIcon size={32} color={theme.colors.basic.white} />} text="截圖成功" />
        ) }
      </ForeignCurrencyTransferWrapper>
    </Layout>
  );
};

export default ForeignCurrencyTransfer2;
