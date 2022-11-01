import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { FEIBSwitch } from 'components/elements';
import {
  startFunc, closeFunc, transactionAuth, switchLoading,
} from 'utilities/AppScriptProxy';
import { EditIcon } from 'assets/images/icons';
import { showCustomPrompt } from 'utilities/MessageModal';

import CardLessSettingWrapper from './cardLessSetting.style';

import { getStatus } from './api';

const CardLessSetting = () => {
  const history = useHistory();
  const [active, setActive] = useState(false);
  const [bankAccount, setBankAccount] = useState('');

  // 點擊 switch 檢查裝置綁定狀態
  const handleSwitchClick = async () => {
    if (!active) {
      const authCode = 0x20;
      const jsRs = await transactionAuth(authCode);

      // 檢查成功跳轉設定無卡提款密碼頁
      if (jsRs.result) {
        history.push('/T004001');
      }
    }
  };

  // 跳轉變更無卡提款密碼變更
  const toChangePwd = () => {
    startFunc('D00400');
  };

  // 檢查無卡提款狀態
  const getCardlessStatus = async () => {
    switchLoading(true);
    const response = await getStatus();
    switchLoading(false);
    if (response.code === '0000') {
      const { cwdStatus, account } = response.data;
      const statusNumber = Number(cwdStatus);
      // 已申請未開通
      if (
        statusNumber === 0
        || statusNumber === 1
        || statusNumber === 3
        || statusNumber === 4
      ) {
        await showCustomPrompt({
          message: '愛方便的您，怎麼少了無卡提款服務，快來啟用吧！',
          onCancel: () => closeFunc(),
          onClose: () => closeFunc(),
        });
        return;
      }

      if (statusNumber === 2) {
        setBankAccount(account);
        setActive(true);
      }
    } else {
      closeFunc();
    }
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
