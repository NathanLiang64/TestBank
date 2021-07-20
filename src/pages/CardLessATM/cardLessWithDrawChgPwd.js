import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';
import Dialog from 'components/Dialog';
import Alert from 'components/Alert';

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
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const history = useHistory();

  const [showResultDialog, setShowResultDialog] = useState(false);

  const toStep1 = () => {
    history.push('/cardLessATM1');
  };

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    setShowResultDialog(true);
  };

  const handleResultButton = () => {
    setShowResultDialog(false);
    toStep1();
  };

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(
        <>
          <Alert state="success">變更成功</Alert>
          <p>
            您的無卡提款密碼已變更成功囉！
          </p>
        </>
      )}
      action={(
        <FEIBButton onClick={handleResultButton}>
          確定
        </FEIBButton>
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/cardLessWithDrawChgPwd');

  return (
    <CardLessATMWrapper>
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
          control={control}
          errorMessage={errors.newWithdrawPwd?.message}
        />
        <PasswordInput
          label="確認新提款密碼"
          id="newWithdrawPwdConfirm"
          name="newWithdrawPwdConfirm"
          placeholder="請再輸入一次新提款密碼(4-12位數字)"
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
      <ResultDialog />
    </CardLessATMWrapper>
  );
};

export default CardLessWithDrawChgPwd;
