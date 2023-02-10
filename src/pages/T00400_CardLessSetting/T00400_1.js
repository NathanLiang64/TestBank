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

import { Func } from 'utilities/FuncID';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { activate } from './api';

/* Styles */
import CardLessSettingWrapper from './T00400.style';
import DealContent from './dealContent';
import { validationSchema } from './validationSchema';

const CardLessATM = () => {
  const {handleSubmit, control } = useForm({
    defaultValues: {
      withdrawPwd: '',
      withdrawPwdCheck: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const history = useHistory();
  const dispatch = useDispatch();

  // 開通無卡提款與設定無卡提款密碼
  const activateWithdrawAndSetPwd = async (param) => {
    const {result} = await transactionAuth(Func.T004.authCode);
    if (result) {
      dispatch(setWaittingVisible(true));
      const activateRes = await activate(param);

      // 開通狀態顯示
      showAnimationModal({
        isSuccess: !!activateRes,
        successTitle: '設定成功',
        errorTitle: '設定失敗',
        errorDesc: '設定失敗',
        onClose: () => history.goBack(),
      });
      dispatch(setWaittingVisible(false));
    }
  };

  const onSubmit = async ({ withdrawPwd }) => {
    activateWithdrawAndSetPwd(withdrawPwd);
  };

  const renderPage = () => (
    <form id="withdrawPwdForm" onSubmit={handleSubmit(onSubmit)}>

      <PasswordInputField
        labelName="提款密碼"
        inputProps={{
          maxLength: 12,
          placeholder: '請輸入提款密碼(4-12位數字)',
          inputMode: 'numeric',
          autoComplete: 'off',
        }}
        name="withdrawPwd"
        control={control}
      />
      <PasswordInputField
        labelName="確認提款密碼"
        inputProps={{
          maxLength: 12,
          placeholder: '請再輸入一次提款密碼(4-12位數字)',
          inputMode: 'numeric',
          autoComplete: 'off',
        }}
        name="withdrawPwdCheck"
        control={control}
      />
      <Accordion title="無卡提款約定事項">
        <DealContent />
      </Accordion>
      <Accordion>
        <ul>
          <li>
            提醒您應注意密碼之設置及使用，不宜使用與您個人資料有關或具連續性、重複性或規則性之號碼為密碼，且不得將上開交易驗證資訊以任何方式使第三人知悉獲得以知悉，以確保交易安全。
          </li>
        </ul>
      </Accordion>

      <FEIBButton type="submit">同意條款並送出</FEIBButton>
    </form>
  );

  return (
    <Layout title="無卡提款設定" goBackFunc={() => history.goBack()}>
      <CardLessSettingWrapper>{renderPage()}</CardLessSettingWrapper>
    </Layout>
  );
};

export default CardLessATM;
