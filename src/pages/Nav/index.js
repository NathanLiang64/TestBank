import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsShake } from 'pages/ShakeShake/stores/actions';
import NavWrapper from './nav.style';

const Nav = () => {
  const dispatch = useDispatch();

  const nativeActionWasTriggered = () => {
    dispatch(setIsShake(true));
  };

  return (
    <NavWrapper>
      <Link to="/login">登入頁（JWE&JWT&E2EE）</Link>
      <Link to="/billPay">信用卡繳費</Link>
      <Link to="/lossReissue">金融卡掛失補發</Link>
      <Link to="/QRCodeTransfer">QRCode 轉帳</Link>
      <Link to="/depositOverview">存款卡首頁（帳戶）</Link>
      <Link to="/patternLockSetting">圖形密碼登入設定</Link>
      <div onClick={nativeActionWasTriggered}>搖一搖 - QRCode 收款</div>
      <Link to="/cardLessATM">無卡提款</Link>
      <Link to="/nicknameSetting">暱稱設定</Link>
      <Link to="/noticeSetting">訊息通知設定</Link>
      <Link to="/fingerPrintLockSetting">生物辨識登入設定</Link>
      <Link to="/notice">訊息通知</Link>
      <Link to="/changeUserName">使用者代號變更</Link>
      <Link to="/pwdModify">網銀密碼變更</Link>
      <Link to="/smsOTPactivate">簡訊OTP設定</Link>
      <Link to="/adjustment">信用卡額度臨調</Link>
      <Link to="/projectJ">遠傳join智慧借貸平台</Link>
      <Link to="/loanInquiry">貸款應繳本息查詢</Link>
      <Link to="/loanInterest">貸款繳息紀錄查詢</Link>
    </NavWrapper>
  );
};

export default Nav;
