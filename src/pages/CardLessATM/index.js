import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
// import { useCheckLocation, usePageInfo } from 'hooks';
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
import ConfirmButtons from 'components/ConfirmButtons';
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
    verificationCode: yup
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

  // const [quickLogin, setQuickLogin] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [newSiteReg, setNewSiteReg] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogButtons, setDialogButtons] = useState(null);
  const [dialogCloseCallback, setDialogCloseCallback] = useState(() => () => setOpenDialog(false));

  // 回原生首頁
  const closeFunction = () => () => closeFunc('home');

  // 跳轉到無卡提款申請頁
  const toWithdrawPage = () => {
    history.push('/cardLessATM1');
  };

  // 設定 Dialog 內容
  const generateDailog = (content, buttons, closeCallback) => {
    setDialogCloseCallback(closeCallback);
    setDialogContent(content);
    setDialogButtons(buttons);
    setOpenDialog(true);
  };

  // 檢查無卡提款狀態; 0=未申請, 1=已申請未開通, 2=已開通, 3=已註銷, 4=已失效, 5=其他
  const getCardlessStatus = async (param) => {
    const statusCodeResponse = await cardLessATMApi.getCardlessStatus(param);
    const { cwdStatus, newSiteRegist } = statusCodeResponse;
    setNewSiteReg(newSiteRegist);
    switch (cwdStatus) {
      case '1':
        generateDailog(
          '愛方便的您，怎麼少了無卡提款服務，快來啟用吧！',
          (
            <ConfirmButtons
              mainButtonValue="確認"
              mainButtonOnClick={() => setOpenDialog(false)}
              subButtonValue="取消"
              subButtonOnClick={() => closeFunc('home')}
            />
          ),
          closeFunction,
        );
        break;

      case '2':
        toWithdrawPage();
        break;

      default:
        generateDailog(
          '發生錯誤',
          (
            <FEIBButton onClick={() => setOpenDialog(false)}>確定</FEIBButton>
          ),
          closeFunction,
        );
        break;
    }
  };

  // 檢查金融卡狀態；“01”=新申請 “02”=尚未開卡 “04”=已啟用 “05”=已掛失 “06”=已註銷 “07”=已銷戶 “08”=臨時掛失中 “09”=申請中
  const getCardStatus = async () => {
    const param = {
      custId: 'A196158521',
    };
    const cardStatusResponse = await cardLessATMApi.getCardStatus(param);
    const { cardStatus } = cardStatusResponse;
    switch (cardStatus) {
      case '01':
        generateDailog(
          '晶片卡申請中！',
          (<FEIBButton onClick={() => closeFunc('home')}>確定</FEIBButton>),
          closeFunction,
        );
        break;

      case '02':
        generateDailog(
          '請先完成金融卡開卡以啟用無卡提款服務！',
          (
            <ConfirmButtons
              mainButtonValue="我要開卡"
              mainButtonOnClick={() => console.log('跳轉到金融開卡頁')}
              subButtonValue="取消"
              subButtonOnClick={() => closeFunc('home')}
            />
          ),
          closeFunction,
        );
        break;

      case '04':
        getCardlessStatus(param);
        break;

      default:
        generateDailog(
          '發生錯誤',
          (<FEIBButton onClick={() => closeFunc('home')}>確定</FEIBButton>),
          closeFunction,
        );
        break;
    }
  };

  // 開通無卡提款與設定無卡提款密碼
  const activateWithdrawAndSetPwd = async (param) => {
    cardLessATMApi.cardLessWithdrawActivate(param)
      .then((response) => {
        if (response.code === 0) {
          generateDailog(
            '已完成開通無卡提款服務！',
            (
              <FEIBButton
                onClick={() => {
                  setOpenDialog(false);
                  toWithdrawPage();
                }}
              >
                確定
              </FEIBButton>
            ),
            () => () => {
              setOpenDialog(false);
              toWithdrawPage();
            },
          );
        } else {
          generateDailog(
            response.message,
            (
              <FEIBButton onClick={() => setOpenDialog(false)}>確定</FEIBButton>
            ),
            () => () => setOpenDialog(false),
          );
        }
      });
  };

  const onSubmit = async (data) => {
    const param = {
      withdrawPwd: data.withdrawPassword,
      verificationCode: data.verificationCode,
    };
    activateWithdrawAndSetPwd(param);
  };

  const drawerSubmit = (data) => {
    const param = {
      withdrawPwd: getValues().withdrawPassword,
      verificationCode: data.password,
    };
    activateWithdrawAndSetPwd(param);
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
        name="verificationCode"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FEIBInput
            {...field}
            type="text"
            id="verificationCode"
            name="verificationCode"
            placeholder="請輸入開通驗證碼"
            error={!!errors.verificationCode?.message}
          />
        )}
      />
      <FEIBErrorMessage>{errors.verificationCode?.message}</FEIBErrorMessage>
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
      onClose={dialogCloseCallback}
      content={<p>{dialogContent}</p>}
      action={(
        dialogButtons
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

  // useCheckLocation();
  // usePageInfo('/api/cardLessATM');

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
