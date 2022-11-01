import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { switchLoading, transactionAuth } from 'utilities/AppScriptProxy';
import { showAnimationModal } from 'utilities/MessageModal';

/* Elements */
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { FEIBButton } from 'components/elements';
import { PasswordInputField } from 'components/Fields';

import { activate } from './api';

/* Styles */
import CardLessSettingWrapper from './cardLessSetting.style';
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

  // 開通無卡提款與設定無卡提款密碼
  const activateWithdrawAndSetPwd = async (param) => {
    const authCode = 0x20;
    const jsRs = await transactionAuth(authCode);
    if (jsRs.result) {
      switchLoading(true);
      const activateResponse = await activate(param);
      switchLoading(false);
      // 開通成功
      showAnimationModal({
        isSuccess: activateResponse.chgPwMessage === '',
        successTitle: '設定成功',
        successDesc: '',
        errorTitle: '設定失敗',
        errorCode: '',
        errorDesc: activateResponse.message,
        onClose: () => history.goBack(),
      });
    }
  };

  const onSubmit = async ({ withdrawPwd }) => {
    activateWithdrawAndSetPwd({ clwdNewPassword: withdrawPwd });
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

  return (
    <Layout title="無卡提款設定">
      <CardLessSettingWrapper>
        {renderPage()}
      </CardLessSettingWrapper>
    </Layout>
  );
};

export default CardLessATM;
