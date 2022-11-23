import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { showAnimationModal } from 'utilities/MessageModal';

/* Elements */
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { FEIBButton } from 'components/elements';
import { PasswordInputField } from 'components/Fields';

import { AuthCode } from 'utilities/TxnAuthCode';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { activate } from './api';

/* Styles */
import CardLessSettingWrapper from './T00400.style';
import DealContent from './dealContent';
import { validationSchema } from './validationSchema';

const CardLessATM = () => {
  const {handleSubmit, control } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const history = useHistory();
  const dispatch = useDispatch();

  // 開通無卡提款與設定無卡提款密碼
  const activateWithdrawAndSetPwd = async (param) => {
    const {result} = await transactionAuth(AuthCode.T00400);
    if (result) {
      dispatch(setWaittingVisible(true));
      const {message} = await activate(param);
      dispatch(setWaittingVisible(false));

      // 開通狀態顯示
      showAnimationModal({
        isSuccess: !message, // 若 message 不存在代表成功
        successTitle: '設定成功',
        successDesc: '',
        errorTitle: '設定失敗',
        errorCode: '',
        errorDesc: message,
        onClose: () => history.goBack(),
      });
    }
  };

  const onSubmit = async ({ withdrawPwd }) => {
    activateWithdrawAndSetPwd(withdrawPwd);
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
      <FEIBButton type="submit">
        同意條款並送出
      </FEIBButton>
    </form>
  );

  return (
    <Layout title="無卡提款設定" goBackFunc={() => history.goBack()}>
      <CardLessSettingWrapper>{renderPage()}</CardLessSettingWrapper>
    </Layout>
  );
};

export default CardLessATM;
