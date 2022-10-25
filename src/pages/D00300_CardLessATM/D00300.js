import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  closeFunc, startFunc, switchLoading, transactionAuth,
} from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';
import { getCardlessStatus, getCardStatus, cardLessWithdrawActivate } from 'pages/D00300_CardLessATM/api';

/* Elements */
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { FEIBButton } from 'components/elements';
import { PasswordInputField } from 'components/Fields';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';
import DealContent from './dealContent';
import { validationSchema } from './validationSchema';

const CardLessATM = () => {
  /**
   *- 資料驗證
   */

  const {handleSubmit, control } = useForm({
    defaultValues: {
      withdrawPwd: '',
      withdrawPwdCheck: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const history = useHistory();

  // eslint-disable-next-line no-unused-vars
  const [newSiteReg, setNewSiteReg] = useState(false);

  // 跳轉到無卡提款申請頁
  const toWithdrawPage = () => {
    history.push('/D003001');
  };

  // 檢查無卡提款狀態; 0=未申請, 1=已申請未開通, 2=已開通, 3=已註銷, 4=已失效, 5=其他
  const fetchCardlessStatus = async (param) => {
    switchLoading(true);
    const statusCodeResponse = await getCardlessStatus(param);
    switchLoading(false);
    const { cwdStatus, newSiteRegist, message } = statusCodeResponse;
    // newSiteRegist 目前沒有用處
    setNewSiteReg(newSiteRegist);
    switch (cwdStatus) {
      case '1':
        await showCustomPrompt({message: '愛方便的您，怎麼少了無卡提款服務，快來啟用吧！', onCancel: () => closeFunc()});
        break;
      case '2':
        toWithdrawPage();
        break;
      default:
        await showCustomPrompt({message, onOk: () => closeFunc(), onCancel: () => closeFunc()});
    }
  };

  // 檢查金融卡狀態；“01”=新申請 “02”=尚未開卡 “04”=已啟用 “05”=已掛失 “06”=已註銷 “07”=已銷戶 “08”=臨時掛失中 “09”=申請中
  const fetchCardStatus = async () => {
    switchLoading(true);
    const { cardStatus, message } = await getCardStatus();
    switchLoading(false);
    switch (cardStatus) {
      case '02':
        await showCustomPrompt({
          message,
          okContent: '我要開卡',
          onOk: () => startFunc('S00700'),
          onCancel: () => closeFunc(),
          onClose: () => closeFunc(),
        });
        break;
      case '04':
        fetchCardlessStatus({});
        break;
      default:
        await showCustomPrompt({message, onOk: () => closeFunc(), onClose: () => closeFunc()});
        break;
    }
  };

  // 開通無卡提款與設定無卡提款密碼
  const activateWithdrawAndSetPwd = async (param) => {
    const authCode = 0x20;
    const jsRs = await transactionAuth(authCode);

    if (jsRs.result) {
      switchLoading(true);
      const activateResponse = await cardLessWithdrawActivate(param);
      const { message } = activateResponse;
      if (message) {
        await showCustomPrompt({
          message,
          onOk: () => closeFunc(),
          onCancel: () => closeFunc(),
          onClose: () => closeFunc(),
        });
      } else {
        await showCustomPrompt({
          message: '已完成開通無卡提款服務！',
          onOk: () => toWithdrawPage(),
          onCancel: () => toWithdrawPage(),
          onClose: () => toWithdrawPage(),
        });
      }
      switchLoading(false);
    } else {
      showCustomPrompt({
        message: '發生錯誤，無法進行交易驗證',
        onOk: () => closeFunc(),
      });
    }
  };

  const onSubmit = async ({withdrawPwd}) => {
    console.log('withdrawPwd', withdrawPwd);
    activateWithdrawAndSetPwd({withdrawPwd});
  };

  const renderPage = () => (
    <form id="withdrawPwdForm" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <PasswordInputField
          labelName="提款密碼"
          placeholder="請輸入提款密碼(4-12位數字)"
          name="withdrawPwd"
          control={control}
        />
        <PasswordInputField
          labelName="確認提款密碼"
          placeholder="請再輸入一次提款密碼(4-12位數字)"
          name="withdrawPwdCheck"
          control={control}
        />
        <Accordion title="無卡提款約定事項" space="both">
          <DealContent />
        </Accordion>
        <Accordion space="bottom">
          <ul>
            <li>本交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。</li>
            <li>提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。 </li>
            <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
          </ul>
        </Accordion>
      </div>
      <FEIBButton
        type="submit"
      >
        同意條款並送出
      </FEIBButton>
    </form>
  );

  useEffect(() => {
    fetchCardStatus();
  }, []);

  return (
    <Layout title="無卡提款">
      <CardLessATMWrapper>
        {renderPage()}
      </CardLessATMWrapper>
    </Layout>
  );
};

export default CardLessATM;
