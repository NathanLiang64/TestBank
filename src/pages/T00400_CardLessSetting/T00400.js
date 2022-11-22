/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { FEIBSwitch } from 'components/elements';
import {getQLStatus, startFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { EditIcon } from 'assets/images/icons';

import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { AuthCode } from 'utilities/TxnAuthCode';
import { FuncID } from 'utilities/FuncID';
import { showError } from 'utilities/MessageModal';
import CardLessSettingWrapper from './T00400.style';

import { getStatus, activate } from './api';
import { checkQLStatus } from './utils';

const CardLessSetting = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [cardLessStatus, setCardLessStatus] = useState();
  const [bankAccount, setBankAccount] = useState('');
  const isEnable = cardLessStatus === 2;

  // 點擊 switch 檢查裝置綁定狀態
  const handleSwitchClick = async () => {
    // 1. 確認裝置綁定狀態
    const { QLStatus } = await getQLStatus();
    const shouldContinue = await checkQLStatus(QLStatus);

    if (shouldContinue) {
      if (cardLessStatus === 0 || cardLessStatus === 3 || cardLessStatus === 4) {
        // 跳轉設定無卡提款密碼頁
        history.push('/T004001');
      } else {
        // 若是 1.已申請未開通 或是 2.已開通 狀態時需要先進行交易驗證
        const { result } = await transactionAuth(AuthCode.T00400);
        if (result) {
          const { message } = await activate('');
          // 無 message 出現代表成功執行
          if (!message) {
            setCardLessStatus((prevStatus) => (prevStatus === 2 ? 3 : 2));
          } else {
            showError(message);
          }
        }
      }
    }
  };

  // 檢查無卡提款狀態
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    try {
      const {data} = await getStatus();
      const statusNumber = Number(data.cwdStatus);
      setBankAccount(data.account);
      setCardLessStatus(statusNumber);
    } catch (err) {
      console.log('getStatus error', err.mesage);
    }

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="無卡提款設定">
      <CardLessSettingWrapper>
        <div className="controlContainer">
          <div className="switchContainer">
            <div className="labelContainer">
              <p className="labelTxt">無卡提款</p>
              {isEnable && <p className="phoneNum">{bankAccount}</p>}
            </div>
            <FEIBSwitch checked={isEnable} onClick={handleSwitchClick} />
          </div>
          {isEnable && (
            <div className="mainBlock toChangePwd" onClick={() => startFunc(FuncID.D00400)}>
              變更無卡提款密碼
              <EditIcon />
            </div>
          )}
        </div>
        <Accordion title="注意事項" space="both">
          <div className="dealContent">無卡提款設定服務條款</div>
        </Accordion>
      </CardLessSettingWrapper>
    </Layout>
  );
};

export default CardLessSetting;
