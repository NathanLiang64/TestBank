import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
// import { Controller, useForm } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { closeFunc, switchLoading, transactionAuth } from 'utilities/AppScriptProxy';
import { getCardlessStatus, getCardStatus, cardLessWithdrawActivate } from 'pages/D00300_CardLessATM/api';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBButton,
  // FEIBInputLabel,
  // FEIBInput,
  // FEIBErrorMessage,
} from 'components/elements';
// import Dialog from 'components/Dialog';
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';
// import ConfirmButtons from 'components/ConfirmButtons';

/* Styles */
import { showCustomPrompt } from 'utilities/MessageModal';
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
    // verificationCode: yup
    //   .string()
    //   .required('請輸入開通驗證碼'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const history = useHistory();

  // eslint-disable-next-line no-unused-vars
  const [newSiteReg, setNewSiteReg] = useState(false);
  // const [openDialog, setOpenDialog] = useState(false);
  // const [dialogContent, setDialogContent] = useState('');
  // const [dialogButtons, setDialogButtons] = useState(null);
  // const [dialogCloseCallback, setDialogCloseCallback] = useState(() => () => setOpenDialog(false));

  // 回上一個功能
  // const closeFunction = () => () => closeFunc();

  // 跳轉到無卡提款申請頁
  const toWithdrawPage = () => {
    switchLoading(false);
    history.push('/D003001');
  };

  // 設定 Dialog 內容
  // const generateDailog = (content, buttons, closeCallback) => {
  //   setDialogCloseCallback(closeCallback);
  //   setDialogContent(content);
  //   setDialogButtons(buttons);
  //   setOpenDialog(true);
  //   switchLoading(false);
  // };

  // 檢查無卡提款狀態; 0=未申請, 1=已申請未開通, 2=已開通, 3=已註銷, 4=已失效, 5=其他
  const fetchCardlessStatus = async (param) => {
    const statusCodeResponse = await getCardlessStatus(param);
    console.log('無卡提款狀態', statusCodeResponse);
    const { cwdStatus, newSiteRegist, message } = statusCodeResponse;
    // newSiteReg 目前沒有用處
    setNewSiteReg(newSiteRegist);
    switch (cwdStatus) {
      case '1':
        await showCustomPrompt({message: '愛方便的您，怎麼少了無卡提款服務，快來啟用吧！', onCancel: () => closeFunc()});
        break;
      case '2':
        toWithdrawPage();
        break;
      // cwdStatus = '4' 是什麼意思？
      case '4':
        await showCustomPrompt({message, onOk: () => closeFunc(), onCancel: () => closeFunc()});
        break;

      default:
        await showCustomPrompt({message, onOk: () => closeFunc(), onCancel: () => closeFunc()});
    }
  };

  // 檢查金融卡狀態；“01”=新申請 “02”=尚未開卡 “04”=已啟用 “05”=已掛失 “06”=已註銷 “07”=已銷戶 “08”=臨時掛失中 “09”=申請中
  const fetchCardStatus = async () => {
    switchLoading(true);

    // TODO 因為沒有提供 cardStatus 資訊，所以 response 是 undefined，因此讀不到 message 造成 error
    const cardStatusResponse = await getCardStatus({});
    console.log('金融卡狀態', cardStatusResponse);
    const { cardStatus, message } = cardStatusResponse;
    switch (cardStatus) {
      case '02':
        // TODO 等待開卡頁面做好
        await showCustomPrompt({
          message,
          okContent: '我要開卡',
          onOk: () => console.log('跳轉到金融開卡頁面'),
          onCancel: () => closeFunc(),
          onClose: () => closeFunc(),
        });
        break;
      case '04':
        fetchCardlessStatus({});
        break;
      default:
        await showCustomPrompt({message, onOk: () => closeFunc(), onClose: () => closeFunc()});
        break;
    }
  };

  // 開通無卡提款與設定無卡提款密碼
  const activateWithdrawAndSetPwd = async (param) => {
    const authCode = 0x20;
    const jsRs = await transactionAuth(authCode);

    if (jsRs.result) {
      switchLoading(true);
      const activateResponse = await cardLessWithdrawActivate(param);
      const { message } = activateResponse;

      if (message) {
        await showCustomPrompt({
          message,
          onOk: () => closeFunc(),
          onCancel: () => closeFunc(),
          onClose: () => closeFunc(),
        });
        // generateDailog(
        //   message,
        //   (
        //     <FEIBButton
        //       onClick={() => {
        //         setOpenDialog(false);
        //         closeFunc();
        //       }}
        //     >
        //       確定
        //     </FEIBButton>
        //   ),
        //   () => () => setOpenDialog(false),
        // );
      } else {
        await showCustomPrompt({
          message: '已完成開通無卡提款服務！',
          onOk: () => toWithdrawPage(),
          onCancel: () => toWithdrawPage(),
          onClose: () => toWithdrawPage(),
        });
        // generateDailog(
        //   '已完成開通無卡提款服務！',
        //   (
        //     <FEIBButton
        //       onClick={() => {
        //         setOpenDialog(false);
        //         toWithdrawPage();
        //       }}
        //     >
        //       確定
        //     </FEIBButton>
        //   ),
        //   () => () => {
        //     setOpenDialog(false);
        //     toWithdrawPage();
        //   },
        // );
      }
    }
  };

  const onSubmit = async (data) => {
    const param = {
      withdrawPwd: data.withdrawPassword,
      verificationCode: data.verificationCode,
    };
    activateWithdrawAndSetPwd(param);
  };

  const renderPage = () => (
    <form id="withdrawPwdForm" onSubmit={handleSubmit(onSubmit)}>
      <div>
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
        {/* <FEIBInputLabel htmlFor="OTPPassword">開通驗證碼</FEIBInputLabel>
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
        <FEIBErrorMessage>{errors.verificationCode?.message}</FEIBErrorMessage> */}
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

  // const renderDialog = () => (
  //   <Dialog
  //     isOpen={openDialog}
  //     onClose={dialogCloseCallback}
  //     content={<p>{dialogContent}</p>}
  //     action={(
  //       dialogButtons
  //     )}
  //   />
  // );

  useEffect(() => {
    fetchCardStatus();
  }, []);

  return (
    <Layout title="無卡提款">
      <CardLessATMWrapper>
        {renderPage()}
        {/* {renderDialog()} */}
      </CardLessATMWrapper>
    </Layout>
  );
};

export default CardLessATM;