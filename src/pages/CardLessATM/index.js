import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { cardLessATMApi } from 'apis';
import { closeFunc } from 'utilities/BankeePlus';

/* Elements */
import {
  FEIBButton,
  FEIBInputLabel,
  FEIBInput,
  FEIBErrorMessage,
} from 'components/elements';
import Dialog from 'components/Dialog';
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';
import BottomDrawer from 'components/BottomDrawer';
import { passwordValidation } from 'utilities/validation';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';

import DealContent from './dealContent';

const CardLessATM = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    withdrawPassword: yup
      .string()
      .required('請輸入提款密碼')
      .min(4, '提款密碼須為 4-12 位數字')
      .max(12, '提款密碼須為 4-12 位數字')
      .matches(/^[0-9]*$/, '提款密碼僅能使用數字'),
    withdrawPasswordCheck: yup
      .string()
      .required('請再輸入一次提款密碼')
      .min(4, '提款密碼須為 4-12 位數字')
      .max(12, '提款密碼須為 4-12 位數字')
      .matches(/^[0-9]*$/, '提款密碼僅能使用數字')
      .oneOf([yup.ref('withdrawPassword'), null], '兩次輸入的提款密碼必須相同'),
    otpCode: yup
      .string()
      .required('請輸入開通驗證碼'),
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

  const [quickLogin, setQuickLogin] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dialogCallback, setDialogCallback] = useState(() => () => setOpenDialog(false));

  // 跳轉到無卡提款申請頁
  const toWithdrawPage = () => {
    history.push('/cardLessATM1');
  };

  const handleDialogOpen = (message) => {
    setErrorMessage(message);
    setOpenDialog(true);
  };

  // 開通無卡提款
  const cardLessActive = async (callbackFnc) => {
    const activeResponse = await cardLessATMApi.cardLessWithdrawActive();
    const { activeResultCode, message } = activeResponse.data;
    if (activeResultCode === 0) {
      callbackFnc();
    } else {
      handleDialogOpen(message);
    }
  };

  // 設定無卡提款密碼
  const changePwdHandler = async (param) => {
    // 檢查是否新網站申請
    const newSiteRegistResponse = await cardLessATMApi.checkNewSiteRegist();
    const { newSiteRegist } = newSiteRegistResponse.data;
    if (newSiteRegist) {
      cardLessATMApi.changeCardlessPwd(param)
        .then((response) => {
          if (response.code === 0) {
            cardLessActive(() => toWithdrawPage());
          } else {
            handleDialogOpen(response.message);
          }
        });
    } else {
      cardLessActive(() => toWithdrawPage());
    }
  };

  const onSubmit = async (data) => {
    const param = {
      newWithdrawPwd: data.withdrawPassword,
    };
    // 是否使用快速登入
    if (quickLogin) {
      setDrawerOpen(true);
    } else {
      changePwdHandler(param);
    }
  };

  const drawerSubmit = (data) => {
    const param = {
      newWithdrawPwd: getValues().withdrawPassword,
      pwd: data.password,
    };
    changePwdHandler(param);
  };

  // 檢查UDID與快速登入
  const checkUDIDAndQuickLogin = async () => {
    const checkUDIDAndQuickLoginResponse = await cardLessATMApi.checkUDIDAndQuickLogin();
    // eslint-disable-next-line no-shadow
    const { quickLogin, checkUDID, message } = checkUDIDAndQuickLoginResponse.data;
    if (checkUDID) {
      setQuickLogin(quickLogin);
    } else {
      handleDialogOpen(message);
      setDialogCallback(() => () => {
        setOpenDialog(false);
        closeFunc('home');
      });
    }
    return checkUDID;
  };

  const getStatusCode = async () => {
    // 檢查晶片狀態；“01”=新申請 “02”=尚未開卡 “04”=已啟用 “05”=已掛失 “06”=已註銷 “07”=已銷戶 “08”=臨時掛失中 “09”=申請中
    const statusCodeResponse = await cardLessATMApi.getStatusCode();
    const { statusCode, message } = statusCodeResponse.data;
    if (statusCode === 2) {
      // eslint-disable-next-line no-console
      console.log('無卡提款已開通');
      checkUDIDAndQuickLogin().then((res) => {
        if (res) {
          toWithdrawPage();
        }
      });
    }
    if (statusCode !== 2) {
      if (statusCode === 1) {
        // eslint-disable-next-line no-console
        console.log('無卡提款已申請未開通');
        checkUDIDAndQuickLogin();
      } else {
        handleDialogOpen(message);
      }
    }
  };

  const getCardStatus = async () => {
    // 檢查晶片狀態；“01”=新申請 “02”=尚未開卡 “04”=已啟用 “05”=已掛失 “06”=已註銷 “07”=已銷戶 “08”=臨時掛失中 “09”=申請中
    const cardStatusResponse = await cardLessATMApi.getCardStatus();
    const { cardStatus, message } = cardStatusResponse.data;
    if (cardStatus === 4) {
      // eslint-disable-next-line no-console
      console.log('無卡提款已啟用');
      getStatusCode();
    }
    if (cardStatus !== 4) {
      if (cardStatus === 1) {
        handleDialogOpen('晶片卡申請中');
      }
      if (cardStatus === 2) {
        console.log('轉導到晶片卡開卡頁');
      }
      if (cardStatus !== 1 || cardStatus !== 2) {
        handleDialogOpen(message);
      }
    }
  };

  const renderPage = () => (
    <form id="withdrawPwdForm" onSubmit={handleSubmit(onSubmit)}>
      <PasswordInput
        label="提款密碼"
        id="withdrawPassword"
        name="withdrawPassword"
        placeholder="請輸入提款密碼(4-12位數字)"
        control={control}
        errorMessage={errors.withdrawPassword?.message}
      />
      <PasswordInput
        label="確認提款密碼"
        id="withdrawPasswordCheck"
        name="withdrawPasswordCheck"
        placeholder="請再輸入一次提款密碼(4-12位數字)"
        control={control}
        errorMessage={errors.withdrawPasswordCheck?.message}
      />
      <FEIBInputLabel htmlFor="OTPPassword">開通驗證碼</FEIBInputLabel>
      <Controller
        name="otpCode"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FEIBInput
            {...field}
            type="text"
            id="otpCode"
            name="otpCode"
            placeholder="請輸入開通驗證碼"
            error={!!errors.otpCode?.message}
          />
        )}
      />
      <FEIBErrorMessage>{errors.otpCode?.message}</FEIBErrorMessage>
      <Accordion space="both">
        <ul>
          <li>本交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。</li>
          <li>提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。 </li>
          <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
        </ul>
      </Accordion>
      <Accordion title="無卡提款約定事項" space="bottom">
        <DealContent />
      </Accordion>
      <div className="btn-fix">
        <FEIBButton
          type="submit"
        >
          同意條款並送出
        </FEIBButton>
      </div>
    </form>
  );

  const renderDialog = () => (
    <Dialog
      isOpen={openDialog}
      onClose={dialogCallback}
      content={<p>{errorMessage}</p>}
      action={(
        <FEIBButton onClick={dialogCallback}>
          確定
        </FEIBButton>
      )}
    />
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

  useCheckLocation();
  usePageInfo('/api/cardLessATM');

  useEffect(async () => {
    getCardStatus();
  }, []);

  return (
    <CardLessATMWrapper>
      {renderPage()}
      {renderDrawer()}
      {renderDialog()}
    </CardLessATMWrapper>
  );
};

export default CardLessATM;
