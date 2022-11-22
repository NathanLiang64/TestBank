/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { FEIBButton } from 'components/elements';
import { EditIcon } from 'assets/images/icons';
import { showCustomDrawer, showCustomPrompt, showError } from 'utilities/MessageModal';
import { closeFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';

import { getBasicInformation } from 'pages/T00700_BasicInformation/api';
import { AuthCode } from 'utilities/TxnAuthCode';
import {getStatus, reIssueOrLost} from './api';
import LossReissueWrapper from './S00800.style';
import {actionTextGenerator} from './utils';
import { S00800_1 } from './S00800_1';

const LossReissue = () => {
  const dispatch = useDispatch();
  const [debitCardInfo, setDebitCardInfo] = useState();
  const [currentFormValue, setCurrentFormValue] = useState({});
  const actionText = actionTextGenerator(debitCardInfo?.status);

  const updateDebitCardStatus = async () => {
    const cardInfo = await getStatus();

    if (cardInfo) {
      // 在 新申請(1) 或是 已銷戶(7) 的情況下不能進行掛失或補發
      if (cardInfo.status === 1 || cardInfo.status === 7) {
        await showCustomPrompt({
          message: cardInfo.statusDesc,
          onOk: () => closeFunc(),
          onClose: () => closeFunc(),
        });
      }

      const formValue = {
        county: cardInfo.addrCity.trim(),
        city: cardInfo.addrDistrict.trim(),
        addr: cardInfo.addrStreet,
      };
      setCurrentFormValue(formValue);
      setDebitCardInfo(cardInfo);
    } else {
      showError('Network Error', closeFunc);
    }
    dispatch(setWaittingVisible(false));
  };

  useEffect(() => {
    dispatch(setWaittingVisible(true));
    updateDebitCardStatus();
  }, []);

  // 執行掛失或補發
  const executeAction = async () => {
    const {data} = await getBasicInformation();
    const auth = await transactionAuth(AuthCode.S00800, data.mobile);

    if (auth && auth.result) {
      const res = await reIssueOrLost();
      showCustomPrompt({
        message: (
          <SuccessFailureAnimations
            isSuccess={res && res.result}
            successTitle={`${actionText}設定成功`}
            errorTitle={`${actionText}設定失敗`}
            successDesc={`狀態： (${debitCardInfo?.account}) ${res.message}`}
            errorDesc={`狀態： (${debitCardInfo?.account}) ${res.message}`}
          />
        ),
        onOk: () => updateDebitCardStatus(),
        onclose: () => updateDebitCardStatus(),
      });
    }
  };

  const onSubmit = async (values) => {
    console.log(values);
    // const auth = await transactionAuth(AuthCode.S00800);
    // if (auth && auth.result) {
    //   // TODO 修改地址 API
    // }

    setCurrentFormValue({...values});
    dispatch(setDrawerVisible(false));
  };

  const handleClickEditAddress = () => {
    showCustomDrawer({
      title: '通訊地址',
      content: <S00800_1 currentFormValue={currentFormValue} onSubmit={onSubmit} />,
    });
  };

  const onActionConfirm = () => {
    showCustomPrompt({
      message: `是否確認${actionText}?`,
      onOk: () => executeAction(),
      noDismiss: true,
    });
  };

  return (
    <Layout title="金融卡掛失/補發">
      <LossReissueWrapper small>
        <div className="lossReissueContent">
          <ul className="mainBlock">
            <li>
              <div className="blockLeft">
                <p className="label debitCardStatusLabel">金融卡狀態</p>
                <span className="content">{debitCardInfo?.account || '-'}</span>
              </div>
              <div className="blockRight">
                <h3 className="debitState">{debitCardInfo?.statusDesc}</h3>
              </div>
            </li>
            {actionText === '補發' && (
            <li>
              <div className="blockLeft">
                <p className="label">通訊地址</p>
                <span className="content">
                  {currentFormValue.county + currentFormValue.city + currentFormValue.addr || '-'}
                </span>
              </div>
              <div className="blockRight">
                <button type="button" onClick={handleClickEditAddress}>
                  <EditIcon />
                </button>
              </div>
            </li>
            )}
          </ul>

          {actionText === '補發' && (
            <div className="notice">
              <p className="section_1">提醒您：金融卡補發將收取新臺幣150元(包含手續費100元及郵寄掛號費用50元)，將由您的Bankee存款帳戶中自動扣除。請確認您的存款帳戶餘額至少有150元。</p>
              <br />
              <p className="section_2">申請後5-7個工作天，我們會將金融卡寄送至您留存在本行的通訊地址。</p>
            </div>
          )}

          <Accordion space="top">
            <ol>
              <li>Bankee存款帳戶申請補發Bankee金融卡，手續費新臺幣(以下同)100元及郵寄掛號費50元將由Bankee存款帳戶中自動扣除(前述Bankee存款帳戶泛指持有「Bankee數位存款帳戶」或「Bankee一般帳戶」者，以下簡稱本存戶)。</li>
              <li>本存戶向遠東國際商業銀行辦理金融卡申請/異動申請，除金融卡註銷外，嗣後往來仍悉遵「遠東國際商業銀行金融卡服務約定事項」有關業務規定辦理。</li>
              <li>於各項異動手續辦理妥前，所有使用本存戶Bankee金融卡之交易或申請人為不實之申請，而致蒙受損害時，其一切損害及責任概由本存戶負責。</li>
              <li>本存戶於申請此服務時，業已審閱並充分了解全部內容，並完全同意後才使用各項服務及申請憑證。</li>
            </ol>
          </Accordion>
        </div>

        {actionText && (
          <FEIBButton onClick={onActionConfirm}>{`${actionText}`}</FEIBButton>
        )}
      </LossReissueWrapper>
    </Layout>
  );
};

export default LossReissue;
