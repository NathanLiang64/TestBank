import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { changeCardlessPwd } from 'pages/D00400_CardLessWithDrawChgPwd/api';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBButton,
} from 'components/elements';
import Accordion from 'components/Accordion';
import { PasswordInputField } from 'components/Fields';

/* Styles */
import { AuthCode } from 'utilities/TxnAuthCode';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showAnimationModal } from 'utilities/MessageModal';
import CardLessATMWrapper from '../D00300_CardLessATM/D00300.style';
import { validationSchema } from './validationSchema';

const CardLessWithDrawChgPwd = () => {
  const dispatch = useDispatch();

  const { handleSubmit, control } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    resolver: yupResolver(validationSchema),
  });

  // 設定無卡提款密碼
  const changePwdHandler = async (param) => {
    const {result} = await transactionAuth(AuthCode.D00400);
    if (result) {
      dispatch(setWaittingVisible(true));
      const { code, message } = await changeCardlessPwd(param);
      dispatch(setWaittingVisible(false));

      showAnimationModal({
        isSuccess: code === '0000',
        successTitle: '設定成功',
        errorTitle: '設定失敗',
        successDesc: '您的無卡提款密碼變更成功囉！',
        errorCode: code,
        errorDesc: message,
      });
    }
  };

  const onSubmit = async (data) => {
    const param = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    changePwdHandler(param);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <PasswordInputField
          labelName="舊提款密碼"
          name="oldPassword"
          inputProps={{ placeholder: '請輸入舊提款密碼(4-12位數字)', inputMode: 'numeric', autoComplete: 'off'}}
          control={control}
        />
        <PasswordInputField
          labelName="新提款密碼"
          name="newPassword"
          inputProps={{ placeholder: '請輸入新提款密碼(4-12位數字)', inputMode: 'numeric', autoComplete: 'off' }}
          control={control}
        />
        <PasswordInputField
          labelName="確認新提款密碼"
          name="newPasswordConfirm"
          inputProps={{ placeholder: '請再輸入一次新提款密碼(4-12位數字)', inputMode: 'numeric', autoComplete: 'off' }}
          control={control}
        />
        <Accordion space="both">
          <ul>
            <li>
              提醒您應注意密碼之設置及使用，不宜使用與您個人資料有關或具連續性、重複性或規則性之號碼為密碼，且不得將上開交易驗證資訊以任何方式使第三人知悉獲得以知悉，以確保交易安全。
            </li>
          </ul>
        </Accordion>
      </div>
      <FEIBButton type="submit">確認</FEIBButton>
    </form>
  );

  return (
    <Layout title="變更無卡提款密碼">
      <CardLessATMWrapper>
        {renderForm()}
      </CardLessATMWrapper>
    </Layout>
  );
};

export default CardLessWithDrawChgPwd;
