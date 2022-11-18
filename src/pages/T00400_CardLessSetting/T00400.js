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

const CardLessSetting = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [active, setActive] = useState(false);
  const [bankAccount, setBankAccount] = useState('');

  const checkQLStatus = (status) => {
    switch (status) {
      case ('0'):
        showError('裝置未綁定');
        return false;
      case ('3'):
        showError('已在其它裝置綁定');
        return false;
      case ('4'):
        showError('本裝置已綁定其他帳號');
        return false;
      default:
        return true;
    }
  };

  // 點擊 switch 檢查裝置綁定狀態
  const handleSwitchClick = async (e) => {
    // 1. 確認裝置綁定狀態
    const { QLStatus } = await getQLStatus();
    const shouldContinue = checkQLStatus(QLStatus);
    if (shouldContinue) {
      // 2. 確認交易驗證
      const {result} = await transactionAuth(AuthCode.T00400);
      if (result) {
        if (e.target.checked) {
          // 開啟無卡提款
          history.push('/T004001'); // 檢查成功跳轉設定無卡提款密碼頁
        } else {
          // 關閉無卡提款
          const data = await activate();
          if (data) setActive(false);
        }
      }
    }
  };

  // 跳轉變更無卡提款密碼變更
  const toChangePwd = () => {
    startFunc(FuncID.D00400);
  };

  // 檢查無卡提款狀態
  const getCardlessStatus = async () => {
    dispatch(setWaittingVisible(true));
    const response = await getStatus();
    if (response.code === '0000') {
      const { cwdStatus, account } = response.data;
      const statusNumber = Number(cwdStatus);

      if (statusNumber === 2) {
        setBankAccount(account);
        setActive(true);
      }
    }
    dispatch(setWaittingVisible(false));
  };

  useEffect(() => {
    getCardlessStatus();
  }, []);

  return (
    <Layout title="無卡提款設定">
      <CardLessSettingWrapper>
        <div className="controlContainer">
          <div className="switchContainer">
            <div className="labelContainer">
              <p className="labelTxt">無卡提款</p>
              {
                active && (
                  <p className="phoneNum">{ bankAccount }</p>
                )
              }
            </div>
            <FEIBSwitch
              checked={active}
              onClick={handleSwitchClick}
            />
          </div>
          {
            active && (
              <div className="mainBlock toChangePwd" onClick={toChangePwd}>
                變更無卡提款密碼
                <EditIcon />
              </div>
            )
          }
        </div>
        <Accordion title="使用條款" space="both">
          <div className="dealContent">
            無卡提款設定服務條款
          </div>
        </Accordion>
      </CardLessSettingWrapper>
    </Layout>
  );
};

export default CardLessSetting;
