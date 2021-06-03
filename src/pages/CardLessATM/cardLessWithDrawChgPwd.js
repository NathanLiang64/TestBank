import { useState } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
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
    password: yup
      .string()
      .required('請輸入新無卡提款密碼')
      .min(8, '您輸入的無卡提款密碼長度有誤，請重新輸入。')
      .max(20, '您輸入的無卡提款密碼長度有誤，請重新輸入。'),
    passwordConfirm: yup
      .string()
      .required('請再輸入一次新無卡提款密碼')
      .min(8, '您輸入的無卡提款密碼長度有誤，請重新輸入。')
      .max(20, '您輸入的無卡提款密碼長度有誤，請重新輸入。'),
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

  return (
    <CardLessATMWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FEIBInputLabel>新提款密碼設定</FEIBInputLabel>
        <Controller
          name="password"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="password"
              id="password"
              name="password"
              placeholder="請輸入新無卡提款密碼"
              error={!!errors.password}
            />
          )}
        />
        <FEIBErrorMessage>{errors.password?.message}</FEIBErrorMessage>
        <FEIBInputLabel>確認新提款密碼</FEIBInputLabel>
        <Controller
          name="passwordConfirm"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="請輸入新無卡提款密碼"
              error={!!errors.passwordConfirm}
            />
          )}
        />
        <FEIBErrorMessage>{errors.passwordConfirm?.message}</FEIBErrorMessage>
        <Accordion space="both">
          一些注意事項
        </Accordion>
        <FEIBButton
          type="submit"
        >
          確定送出
        </FEIBButton>
      </form>
      <ResultDialog />
    </CardLessATMWrapper>
  );
};

export default CardLessWithDrawChgPwd;
