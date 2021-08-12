import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { cardLessATMApi } from 'apis';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';
import Dialog from 'components/Dialog';
import Alert from 'components/Alert';
import BottomDrawer from 'components/BottomDrawer';
import { passwordValidation } from 'utilities/validation';

/* Styles */
// import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

const CardLessWithDrawChgPwd = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    withdrawPwdConfirm: yup
      .string()
      .required('請輸入舊無卡提款密碼')
      .min(4, '提款密碼須為 4-12 位數字')
      .max(12, '提款密碼須為 4-12 位數字')
      .matches(/^[0-9]*$/, '提款密碼僅能使用數字'),
    newWithdrawPwd: yup
      .string()
      .required('請輸入新無卡提款密碼')
      .min(4, '新提款密碼須為 4-12 位數字')
      .max(12, '新提款密碼須為 4-12 位數字')
      .matches(/^[0-9]*$/, '提款密碼僅能使用數字'),
    newWithdrawPwdConfirm: yup
      .string()
      .required('請再輸入一次新無卡提款密碼')
      .min(4, '新提款密碼須為 4-12 位數字')
      .max(12, '新提款密碼須為 4-12 位數字')
      .matches(/^[0-9]*$/, '提款密碼僅能使用數字')
      .oneOf([yup.ref('newWithdrawPwd'), null], '兩次輸入的新提款密碼必須相同'),
  });
  const {
    handleSubmit, control, formState: { errors }, getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const passwordSchema = yup.object().shape({
    ...passwordValidation,
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const history = useHistory();

  // const [quickLogin, setQuickLogin] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [dialogCallback, setDialogCallback] = useState(() => () => setShowResultDialog(false));

  const toWithdrawPage = () => {
    history.push('/cardLessATM1');
  };

  const handleDialogOpen = (data) => {
    if (data.result) {
      setAlertType('success');
      setDialogTitle('變更成功');
      setDialogContent('您的無卡提款密碼變更成功囉！');
      setDialogCallback(() => () => toWithdrawPage());
    } else {
      setAlertType('error');
      setDialogTitle('變更失敗');
      setDialogContent('您的無卡提款密碼變更失敗！');
    }
    setShowResultDialog(true);
  };

  // 設定無卡提款密碼
  const changePwdHandler = async (param) => {
    cardLessATMApi.changeCardlessPwd(param)
      .then((response) => {
        if (response.code === 0) {
          handleDialogOpen(response.data);
        }
      });
  };

  const onSubmit = (data) => {
    const param = {
      newWithdrawPwd: data.newWithdrawPwd,
    };
    // 是否使用快速登入
    const quickLogin = true;
    if (quickLogin) {
      setDrawerOpen(true);
    } else {
      changePwdHandler(param);
    }
  };

  const drawerSubmit = (data) => {
    const param = {
      newWithdrawPwd: getValues().newWithdrawPwd,
      pwd: data.password,
    };
    changePwdHandler(param);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PasswordInput
        label="舊提款密碼"
        id="withdrawPwdConfirm"
        name="withdrawPwdConfirm"
        placeholder="請輸入舊提款密碼(4-12位數字)"
        inputMode="numric"
        control={control}
        errorMessage={errors.withdrawPwdConfirm?.message}
      />
      <PasswordInput
        label="新提款密碼"
        id="newWithdrawPwd"
        name="newWithdrawPwd"
        placeholder="請輸入新提款密碼(4-12位數字)"
        inputMode="numric"
        control={control}
        errorMessage={errors.newWithdrawPwd?.message}
      />
      <PasswordInput
        label="確認新提款密碼"
        id="newWithdrawPwdConfirm"
        name="newWithdrawPwdConfirm"
        placeholder="請再輸入一次新提款密碼(4-12位數字)"
        inputMode="numric"
        control={control}
        errorMessage={errors.newWithdrawPwdConfirm?.message}
      />
      <Accordion space="both">
        <ul>
          <li>提醒您應注意密碼之設置及使用，不宜使用與您個人資料有關或具連續性、重複性或規則性之號碼為密碼，且不得將上開交易驗證資訊以任何方式使第三人知悉獲得以知悉，以確保交易安全。</li>
        </ul>
      </Accordion>
      <FEIBButton
        type="submit"
      >
        確認
      </FEIBButton>
    </form>
  );

  const renderDrawer = () => (
    <BottomDrawer
      title="輸入網銀密碼"
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      content={(
        <CardLessATMWrapper style={{ marginTop: '0', padding: '0 1.6rem 4rem' }}>
          <form onSubmit={passwordForm.handleSubmit(drawerSubmit)}>
            <PasswordInput
              label="網銀密碼"
              id="password"
              name="password"
              control={passwordForm.control}
              errorMessage={passwordForm.formState.errors.password?.message}
            />
            <FEIBButton
              type="submit"
            >
              送出
            </FEIBButton>
          </form>
        </CardLessATMWrapper>
      )}
    />
  );

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={dialogCallback}
      content={(
        <>
          <Alert state={alertType}>{dialogTitle}</Alert>
          <p>
            { dialogContent }
          </p>
        </>
      )}
      action={(
        <FEIBButton onClick={dialogCallback}>
          確定
        </FEIBButton>
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/cardLessWithDrawChgPwd');

  return (
    <CardLessATMWrapper>
      {renderDrawer()}
      {renderForm()}
      <ResultDialog />
    </CardLessATMWrapper>
  );
};

export default CardLessWithDrawChgPwd;
