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
// import e2ee from 'utilities/E2ee';

/* Styles */
// import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

const CardLessWithDrawChgPwd = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    oldPassword: yup
      .string()
      .required('請輸入舊無卡提款密碼')
      .min(4, '提款密碼須為 4-12 位數字')
      .max(12, '提款密碼須為 4-12 位數字')
      .matches(/^[0-9]*$/, '提款密碼僅能使用數字'),
    newPassword: yup
      .string()
      .required('請輸入新無卡提款密碼')
      .min(4, '新提款密碼須為 4-12 位數字')
      .max(12, '新提款密碼須為 4-12 位數字')
      .matches(/^[0-9]*$/, '提款密碼僅能使用數字'),
    newPasswordConfirm: yup
      .string()
      .required('請再輸入一次新無卡提款密碼')
      .min(4, '新提款密碼須為 4-12 位數字')
      .max(12, '新提款密碼須為 4-12 位數字')
      .matches(/^[0-9]*$/, '提款密碼僅能使用數字')
      .oneOf([yup.ref('newPassword'), null], '兩次輸入的新提款密碼必須相同'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const history = useHistory();

  const [alertType, setAlertType] = useState('success');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [dialogCallback, setDialogCallback] = useState(() => () => setShowResultDialog(false));

  const toWithdrawPage = () => {
    history.push('/cardLessATM1');
  };

  const handleDialogOpen = (data) => {
    if (data.respMsg === '') {
      setAlertType('success');
      setDialogTitle('變更成功');
      setDialogContent('您的無卡提款密碼變更成功囉！');
      setDialogCallback(() => () => toWithdrawPage());
    } else {
      setAlertType('error');
      setDialogTitle('變更失敗');
      setDialogContent(data.message);
    }
    setShowResultDialog(true);
  };

  // 設定無卡提款密碼
  const changePwdHandler = async (param) => {
    cardLessATMApi.changeCardlessPwd(param)
      .then((response) => {
        handleDialogOpen(response);
      });
  };

  const onSubmit = async (data) => {
    const param = {
      // oldPassword: await e2ee(data.oldPassword),
      // newPassword: await e2ee(data.newPassword),
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    changePwdHandler(param);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PasswordInput
        label="舊提款密碼"
        id="oldPassword"
        name="oldPassword"
        placeholder="請輸入舊提款密碼(4-12位數字)"
        inputMode="numric"
        control={control}
        errorMessage={errors.oldPassword?.message}
      />
      <PasswordInput
        label="新提款密碼"
        id="newPassword"
        name="newPassword"
        placeholder="請輸入新提款密碼(4-12位數字)"
        inputMode="numric"
        control={control}
        errorMessage={errors.newPassword?.message}
      />
      <PasswordInput
        label="確認新提款密碼"
        id="newPasswordConfirm"
        name="newPasswordConfirm"
        placeholder="請再輸入一次新提款密碼(4-12位數字)"
        inputMode="numric"
        control={control}
        errorMessage={errors.newPasswordConfirm?.message}
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
      {renderForm()}
      <ResultDialog />
    </CardLessATMWrapper>
  );
};

export default CardLessWithDrawChgPwd;
