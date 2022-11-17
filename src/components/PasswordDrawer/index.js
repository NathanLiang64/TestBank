/* eslint-disable object-curly-newline */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import CountDown from 'components/CountDown';
import { otpCodeValidation, passwordValidation } from 'utilities/validation';
import { showAlert } from 'utilities/AppScriptProxy';
import e2ee from 'utilities/E2ee';
import { setDrawerVisible } from 'stores/reducers/ModalReducer';
import { transactionAuthVerify } from './api';
import PasswordDrawerWrapper from './passwordDrawer.style';

/**
 * Web版 交易驗證模組 UI
 * @param {*} param0 {
 *   authData: {
 *     key: 本次要求驗證的金鑰，用來檢核使用者輸入
 *     otpSmsId: OTP簡訊中的識別碼。
 *     otpMobile: 簡訊識別碼發送的手機門號。
 *   },
 *   inputPWD: 表示需要使用者輸入密碼。
 *   onFinished: 完成時的事件。
 *     事件參數 {
 *       result: 驗證結果(true/false)。
 *       message: 驗證失敗狀況描述。
 *     }
 * }
 */
const PasswordDrawer = ({
  funcCode,
  authData,
  inputPWD,
  onFinished,
}) => {
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    otpCode: authData.otpSmsId ? otpCodeValidation() : null,
    password: inputPWD ? passwordValidation() : null,
  });
  const { handleSubmit, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [resendDisabled, setResendDisabled] = useState(true);
  const [replayCountDown, setReplayCountDown] = useState(false);

  const handleClickResendButton = () => {
    // TODO 重送OTP
    setResendDisabled(true);
    setReplayCountDown(true);
    // call otp api
  };

  const handleClickSubmit = async (data) => {
    // 驗證 OTP驗證碼 & 網銀密碼
    const {otpCode} = data; // 使用者輸入的「驗證碼」。
    const netbankPwd = e2ee(data.password); // 使用者輸入的「網銀密碼」，還要再做 E2EE。
    const verifyRs = await transactionAuthVerify({ authKey: authData.key, funcCode, netbankPwd, otpCode });
    // console.log(verifyRs);
    if (verifyRs?.result === true) {
      // 正常結果。
      // Note 因為之後叫用交易相關 API 時可能會需要用到，所以傳回 E2EE 加密後的 netbankPwd 值。
      onFinished({ result: true, message: null, netbankPwd });
      dispatch(setDrawerVisible(false));
    } else {
      // TODO 處理密碼錯誤的情況，累計三次驗證失敗之後，就傳回驗證失敗; 否則不會結束Promise
      showAlert(verifyRs?.message); // NOTE 不能用 Layout 中的 Drawer，因為再跳出 Popup Window 後， Drawer 會立即關掉！
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setReplayCountDown(false), 1000);
    return () => clearInterval(timer);
  }, [replayCountDown]);

  const renderOTPArea = () => (
    <div>
      <div className="countDownArea">
        <div className="countDown">
          <p>時間倒數</p>
          {/* TODO 結束時，詢問重送或取消驗證 */}
          <CountDown onEnd={() => setResendDisabled(false)} replay={replayCountDown} />
        </div>
        <FEIBButton
          className="resendButton"
          disabled={resendDisabled}
          onClick={handleClickResendButton}
        >
          重新寄驗證碼
        </FEIBButton>
      </div>
      {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
      <FEIBInputLabel>一次性 OTP 驗證 (發送門號：{`${authData.otpMobile}`})</FEIBInputLabel>
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
            placeholder="請輸入驗證碼"
            error={!!errors.otpCode}
            startAdornment={<p className="prefixCode">{`${authData.otpSmsId}`}</p>}
          />
        )}
      />
      <FEIBErrorMessage>{errors.otpCode?.message}</FEIBErrorMessage>
    </div>
  );

  const renderPasswordArea = () => (
    <PasswordInput
      id="password"
      name="password"
      control={control}
      errorMessage={errors.password?.message}
    />
  );

  return (
    <PasswordDrawerWrapper>
      <form onSubmit={handleSubmit(handleClickSubmit)}>
        { authData.otpSmsId && renderOTPArea() }
        { inputPWD && renderPasswordArea() }
        <FEIBButton type="submit">送出</FEIBButton>
      </form>
    </PasswordDrawerWrapper>
  );
};

PasswordDrawer.defaultProps = {
  authData: null,
  inputPWD: true,
  onFinished: null,
};

export default PasswordDrawer;
