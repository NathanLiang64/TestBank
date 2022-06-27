/* eslint-disable object-curly-newline */
/* eslint-disable arrow-body-style */
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { startFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { FEIBButton } from 'components/elements';
import Layout from 'components/Layout/Layout';
import { logout, mobileAccountUnbind, getHomeData } from './Nav.api';

import NavWrapper from './Nav.style';

const Nav = () => {
  const history = useHistory();

  useEffect(async () => {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      history.push('/login');
    }
  }, []);

  // 登出
  const logOut = async () => {
    await logout();
    history.push('/login');
  };

  return (
    <Layout title="測試功能首頁" goBack={false} goHome={false}>
      <NavWrapper>
        <div className="bankee">
          <div onClick={() => startFunc('C00300')}>C00300 台幣存款首頁</div>
          <div onClick={() => startFunc('C00400')}>C00400 外幣存款首頁</div>
          <div onClick={() => startFunc('C00500')}>C00500 交割帳戶首頁</div>
          <div onClick={() => startFunc('M00100')}>M00100 社群圈首頁</div>
          <div onClick={() => startFunc('D00100')}>D00100 台幣轉帳 - (施工中)</div>
          <div onClick={() => startFunc('B00600')}>B00600 更多...</div>

          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x35))}>
            台幣-非約轉(2FA / PWD+OTP)
          </div>
          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x30))}>
            台幣-約轉(2FA / PWD)
          </div>
          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x17, '0900123456'))}>
            生物辨識/圖形-設定(PWD+OTP)
          </div>
          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x2B))}>
            生物辨識/圖形-解除(2FA)
          </div>
          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x2B, '0900123456'))}>
            解除手機號碼收款綁定-驗證(2FA+OTP)
          </div>

          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await mobileAccountUnbind())}>
            解除手機號碼收款綁定-執行
          </div>

          <div onClick={() => getHomeData()}>SM-API://getHomeData</div>
        </div>

        <div className="lexion">
          <p style={{ color: '#9D7ADE' }}>** 瑞芙 **</p>
          <div onClick={() => startFunc('C00100')}>C00100 帳務總覽 - (施工中)</div>
          <div onClick={() => startFunc('C00600')}>C00600 存錢計劃 - (施工中)</div>
          <div onClick={() => startFunc('C00700')}>C00700 信用卡 首頁 - (施工中)</div>
          <div onClick={() => startFunc('R00100')}>R00100 信用卡 即時消費明細 - (施工中)</div>
          <div onClick={() => startFunc('R00300')}>R00300 信用卡 帳單明細 - (施工中)</div>
          <div onClick={() => startFunc('R00400')}>R00400 信用卡 繳費 - (施工中)</div>
          <div onClick={() => startFunc('M00200')}>M00200 社群圈 好友查詢 - (施工中)</div>
        </div>

        <div className="vj">
          <p style={{ color: '#9D7ADE' }}>** 唯物 **</p>
          <div onClick={() => startFunc('A00400')}>A00400 開通APP</div>
          <div onClick={() => startFunc('B00300')}>B00300 訊息通知 - (施工中)</div>
          <div onClick={() => startFunc('S00400')}>S00400 訊息通知設定 - (施工中)</div>
          <div onClick={() => startFunc('E00100')}>E00100 換匯 - (施工中)</div>
          <div onClick={() => startFunc('T00100')}>T00100 個人化設定</div>
          <div onClick={() => startFunc('T00600')}>T00600 手機號碼收款設定 - (施工中)</div>
          <div onClick={() => startFunc('T00700')}>T00600 手機號碼收款設定 - (施工中)</div>
          <div onClick={() => startFunc('T00700')}>T00700 外幣轉外幣 - (施工中)</div>
          <div onClick={() => startFunc('cardLessSetting')}>無 function code 無卡提款設定 - (完成切版)</div>
        </div>
        {/* <div onClick={() => goToFunc({ route: '/foreignCurrencyPriceSetting', funcID: 'unset' })}>
          <ul>
            <li>功能：外幣到價通知</li>
            <li>funcID: unset</li>
          </ul>
        </div>
        <div onClick={() => goToFunc({ route: '/profile', funcID: 'T00100' })}>
          <ul>
            <li>功能：個人化設定</li>
            <li>route: /profile</li>
            <li>funcID: T00100</li>
          </ul>
        </div>
        <div onClick={() => goToFunc({ route: '/quickLoginSetting', funcID: 'T00200' })}>
          <ul>
            <li>功能：快速登入設定</li>
            <li>route: /quickLoginSetting</li>
            <li>funcID: T00200</li>
          </ul>
        </div>
        <div onClick={() => goToFunc({ route: '/smsOTPactivate', funcID: 'T00400' })}>
          <ul>
            <li>功能：簡訊OTP設定</li>
            <li>route: /smsOTPactivate</li>
            <li>funcID: T00400</li>
          </ul>
        </div>
        <div onClick={() => goToFunc({ route: '/basicInformation', funcID: 'T00700' })}>
          <ul>
            <li>功能：基本資料變更</li>
            <li>route: /basicInformation</li>
            <li>funcID: T00700</li>
          </ul>
        </div>
        <div onClick={() => goToFunc({ route: '/mobileTransfer', funcID: 'T00600' })}>
          <ul>
            <li>功能：手機號碼收款設定</li>
            <li>route: /mobileTransfer</li>
            <li>funcID: T00600</li>
          </ul>
        </div>
        <div onClick={() => goToFunc({ route: '/changeUserName', funcID: 'T00800' })}>
          <ul>
            <li>功能：使用者代號變更</li>
            <li>route: /changeUserName</li>
            <li>funcID: T00800</li>
          </ul>
        </div>
        <div onClick={() => goToFunc({ route: '/pwdModify', funcID: 'T00900' })}>
          <ul>
            <li>功能：網銀密碼變更</li>
            <li>route: /pwdModify</li>
            <li>funcID: T00900</li>
          </ul>
        </div>
        <div onClick={() => goToFunc({ route: '/notice', funcID: 'B00300' })}>
          <ul>
            <li>功能：訊息通知</li>
            <li>route: /notice</li>
            <li>funcID: B00300</li>
          </ul>
        </div>
        <div onClick={() => goToFunc({ route: '/staging', funcID: '' })}>
          <ul>
            <li>功能：晚點付</li>
            <li>route: /staging</li>
            <li>funcID: </li>
          </ul>
        </div> */}

        {/* <Accordion title="驗收單元功能清單 (1)" space="bottom">
          <Link to="/notice">E02 訊息通知</Link>
          <Link to="/noticeSetting">E02-1 訊息通知設定</Link>
          <Link to="/fingerPrintLockSetting">E05-03 生物辨識登入設定</Link>
          <Link to="/patternLockSetting">E05-04 圖形密碼登入設定</Link>
          <Link to="/smsOTPactivate">E05-06 簡訊OTP設定</Link>
          <Link to="/changeUserName">E05-10 使用者代號變更</Link>
          <Link to="/pwdModify">E05-11 網銀密碼變更</Link>
          <Link to="/projectJ">E06-06 Join智慧信貸</Link>
          <Link to="/lossReissue">E06-10 金融卡掛失補發</Link>
        </Accordion>

        <Accordion title="驗收單元功能清單 (2)" space="bottom">
          <Link to="/taiwanDollarAccount">D01 存款卡（母帳戶）</Link>
          <Link to="/billPay">D06-5 信用卡-繳費</Link>
          <Link to="/adjustment">D06-7 信用卡-額度臨調</Link>
          <Link to="/loanInquiry">D07-1 貸款應繳查詢</Link>
          <Link to="/loanInterest">D07-2 貸款繳息紀錄查詢</Link>
          <div onClick={nativeActionWasTriggered} className="shake">D08-1 QR-Code轉帳（搖一搖）</div>
          <Link to="/cardLessATM">E09 無卡提款</Link>
        </Accordion>

        <Accordion title="驗收單元功能清單 (3)" space="bottom">
          <Link to="/QRCodeTransfer">E08 QRCode 轉帳</Link>
        </Accordion>

        <Accordion title="其它功能" space="bottom">
          <Link to="/nicknameSetting">暱稱設定</Link>
          <Link to="/login">登入頁（JWE&JWT&E2EE）</Link>
          <Link to="/qAndA">Q＆A</Link>
          <Link to="/open">開通APP</Link>
          <Link to="/deduct">自動扣繳申請/查詢</Link>
          <Link to="/transfer">轉帳</Link>
        </Accordion> */}
        <FEIBButton onClick={logOut}>登出</FEIBButton>
      </NavWrapper>
    </Layout>
  );
};

export default Nav;
