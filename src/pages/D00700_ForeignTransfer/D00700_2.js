import { useState } from 'react';
import { useHistory } from 'react-router';
import { useNavigation } from 'hooks/useNavigation';
import { Func } from 'utilities/FuncID';
import { screenShot } from 'utilities/AppScriptProxy';

/* Elements */
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import BottomAction from 'components/BottomAction';
import InformationList from 'components/InformationList';
import SnackModal from 'components/SnackModal';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { CameraIcon } from 'assets/images/icons';
import { CameraAltOutlined, ShareOutlined } from '@material-ui/icons';

/* Styles */
import theme from 'themes/theme';
import ForeignCurrencyTransferWrapper from './D00700.style';

/**
 * 外幣轉帳 結果頁
 * @param {{location: {state: {model, viewModel, viewData}}}} props
 */
const D00700_2 = (props) => {
  const { location: {state} } = props;
  const { model, viewModel, viewData } = state;

  const history = useHistory();
  const { startFunc } = useNavigation();

  const [showSnapshotSuccess, setShowSnapshotSuccess] = useState();

  const handleClickScreenshot = async () => {
    await screenShot();
    setShowSnapshotSuccess(true);
    setTimeout(() => setShowSnapshotSuccess(false), 1000); // 1 秒後自動關閉。
  };

  /**
   * 返回外幣轉帳首頁
   */
  const goBack = () => {
    delete viewModel.inAccount;
    delete viewModel.currency;
    // delete viewModel.amount;
    history.replace('D00700', { model: null, viewModel });
  };

  /**
   * 主頁面輸出
   */
  return (
    <Layout title="外幣轉帳結果" goBackFunc={goBack}>
      <ForeignCurrencyTransferWrapper className={viewData.isSuccess ? 'confirmAndResult' : 'confirmAndResult fail'}>
        <SuccessFailureAnimations isSuccess={viewData.isSuccess} successTitle="轉帳成功" errorTitle="轉帳失敗" />
        {
          viewData.isSuccess && (
            <>
              <div className="confrimDataContainer">
                <div className="dataLabel">轉出金額與轉入帳號</div>
                <div className="balance">{viewData.amount}</div>
                <div className="accountInfo">遠東商銀(805)</div>
                <div className="accountInfo">{viewData.outAccount}</div>
              </div>
              <div className="line" />
              <div className="infoListContainer">
                <div>
                  <InformationList title="轉出帳號" content={viewData.inAccount} />
                  <InformationList title="時間" content={viewData.transData} />
                </div>
                <div style={{ marginBottom: '8rem' }}>
                  <Accordion title="詳細交易">
                    <InformationList title="帳戶餘額" content={viewData.balance} />
                    <InformationList title="匯款性質分類" content={viewData.property} />
                    <InformationList title="備註" content={viewData.memo} />
                  </Accordion>
                </div>
              </div>
              <BottomAction position={0}>
                <button type="button" onClick={handleClickScreenshot}>
                  <CameraAltOutlined />
                  畫面截圖
                </button>
                <div className="divider" />
                <button type="button" onClick={() => startFunc(Func.C004, { defaultCurrency: model.currency })}>
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

export default D00700_2;
