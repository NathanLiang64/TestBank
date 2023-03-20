/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { accountFormatter, currencySymbolGenerator, dateToString } from 'utilities/Generator';

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

/* Styles */
import { screenShot } from 'utilities/AppScriptProxy';
import { useHistory } from 'react-router';
import ForeignCurrencyTransferWrapper from './D00700.style';

const D00700_2 = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {location: {state}} = props;
  const transferResult = state;
  const [showSnapshotSuccess, setShowSnapshotSuccess] = useState();

  const handleClickScreenshot = async () => {
    await screenShot();
    setShowSnapshotSuccess(true);
    setTimeout(() => setShowSnapshotSuccess(false), 1000); // 1 秒後自動關閉。
  };

  const propertyName = state.viewModel.properties.find(({value}) => value === state.model.property).label;

  const goBack = () => {
    // TODO 待調整回傳的內容
    const { model, viewModel } = state;
    const updatedModel = { ...model, amount: '', memo: '', property: '*' }; // 保留 currency, inAccount
    history.replace('D00700', { model: updatedModel, viewModel });
  };

  return (
    <Layout title="外幣轉帳結果" goBackFunc={goBack}>
      <ForeignCurrencyTransferWrapper className={transferResult.isSuccess ? 'confirmAndResult' : 'confirmAndResult fail'}>
        <SuccessFailureAnimations isSuccess={transferResult.isSuccess} successTitle="轉帳成功" errorTitle="轉帳失敗" />
        {
          transferResult.isSuccess && (
            <>
              <div className="confrimDataContainer">
                <div className="dataLabel">轉出金額與轉入帳號</div>
                <div className="balance">
                  {
                    currencySymbolGenerator(state.model.currency, state.model.amount)
                  }
                </div>
                <div className="accountInfo">遠東商銀(805)</div>
                <div className="accountInfo">{ accountFormatter(state.model.inAccount) }</div>
              </div>
              <div className="line" />
              <div className="infoListContainer">
                <div>
                  <InformationList title="轉出帳號" content={accountFormatter(state.model.outAccount, true)} />
                  <InformationList title="時間" content={dateToString(new Date())} />
                </div>
                <div style={{ marginBottom: '8rem' }}>
                  <Accordion title="詳細交易">
                    {/* TODO 帳戶餘額是否以交易完成後的回傳資訊為準，待確認回傳的資料結構  */}
                    {/* <InformationList title="帳戶餘額" content={`${currencySymbolGenerator(model?.outCcyCd)}${model?.transOut?.balance}`} /> */}
                    <InformationList title="匯款性質分類" content={propertyName} />
                    <InformationList title="備註" content={state.model.memo} />
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

export default D00700_2;
