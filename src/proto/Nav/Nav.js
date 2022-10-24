/* eslint-disable object-curly-newline */
/* eslint-disable arrow-body-style */
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { startFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { FEIBButton } from 'components/elements';
import Layout from 'components/Layout/Layout';
// import {
//   getAllFrequentAccount,
//   addFrequentAccount,
//   updateFrequentAccount,
//   deleteFrequentAccount,
// } from 'pages/D00500_FrequentContacts/api';
// import { getAllRegisteredAccount, updateRegisteredAccount } from 'pages/D00600_RegisteredContacts/api';
import { logout, getHomeData, registerToken } from './Nav.api';

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
          <div onClick={() => startFunc('D00100')}>D00100 轉帳 - (施工中)</div>
          <div onClick={() => startFunc('C00300')}>C00300 台幣存款首頁</div>
          <div onClick={() => startFunc('C00400')}>C00400 外幣存款首頁</div>
          <div onClick={() => startFunc('C00500')}>C00500 交割帳戶首頁</div>
          <div onClick={() => startFunc('M00100')}>M00100 社群圈首頁</div>
          <div onClick={() => startFunc('D00500')}>D00500 常用帳號管理</div>
          <div onClick={() => startFunc('D00600')}>D00600 約定帳號管理</div>
          <div onClick={() => startFunc('B00600')}>B00600 更多...</div>
          <div onClick={() => startFunc('S00700')}>S00700 金融卡啟用</div>

          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x26))}>
            基本資料變更-電子郵件(2FA / OTP)
          </div>
          {/* <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x35))}>
            台幣-非約轉(2FA / PWD+OTP)
          </div>
          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x30))}>
            台幣-約轉(2FA / PWD)
          </div>
          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x17, '0900123456'))}>
            生物辨識/圖形-設定(PWD+OTP)
          </div>
          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x20))}>
            生物辨識/圖形-解除(2FA)
          </div>
          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await transactionAuth(0x2B, '0900123456'))}>
            解除手機號碼收款綁定-驗證(2FA+OTP)
          </div>

          <div onClick={async () => console.log('*** Result from AppScriptProxy : ', await mobileAccountUnbind())}>
            解除手機號碼收款綁定-執行
          </div> */}

          <div onClick={() => getHomeData()}>SM-API://getHomeData</div>
          <div onClick={() => registerToken({ pushToken: '4fcd5d52dc5ba7208bac5758bb84d6ca7061f5abfe0bd54b684a9d1a6c3a7e49' })}>SM-API://registerToken</div>
          {/* <div onClick={() => functionTrace({ date: '2022-07-05 14:40:20', functionCode: 'C00100', functionParams: '' })}>SM-API://functionTrace</div> */}
        </div>

        <div className="lexion">
          <p style={{ color: '#9D7ADE' }}>** 瑞芙 **</p>
          <div onClick={() => startFunc('C00100')}>C00100 帳務總覽</div>
          <div onClick={() => startFunc('C00600')}>C00600 存錢計劃</div>
          <div onClick={() => startFunc('C00700')}>C00700 信用卡 首頁 - (施工中)</div>
          <div onClick={() => startFunc('R00100')}>R00100 信用卡 即時消費明細 - (施工中)</div>
          <div onClick={() => startFunc('R00300')}>R00300 信用卡 帳單明細 - (施工中)</div>
          <div onClick={() => startFunc('R00400')}>R00400 信用卡 繳費 - (施工中)</div>
          <div onClick={() => startFunc('M00200')}>M00200 社群圈 好友查詢</div>
          <div onClick={() => startFunc('L00100')}>L00100 貸款 首頁 - (施工中)</div>
          <div onClick={() => startFunc('L001001')}>L00100 貸款 可能回饋頁 - (施工中)</div>
          <div onClick={() => startFunc('L001002')}>L00100 貸款 資訊頁 - (施工中)</div>
        </div>

        <div className="vj">
          <p style={{ color: '#9D7ADE' }}>** 唯物 **</p>
          <div onClick={() => startFunc('A00400')}>A00400 開通APP</div>
          <div onClick={() => startFunc('A00600')}>A00600 定期更新基本個資</div>
          <div onClick={() => startFunc('A00700')}>A00700 定期更新網銀密碼</div>
          <div onClick={() => startFunc('A00400')}>A00400 開通APP</div>
          <div onClick={() => startFunc('B00300')}>B00300 訊息通知 - (施工中)</div>
          <div onClick={() => startFunc('C00800')}>C00800 匯出存摺</div>
          <div onClick={() => startFunc('D00300')}>D00300 無卡提款</div>
          <div onClick={() => startFunc('D00700')}>D00700 外幣轉外幣 - (施工中)</div>
          <div onClick={() => startFunc('D00800')}>D00800 預約轉帳查詢</div>
          <div onClick={() => startFunc('E00100')}>E00100 換匯 - (施工中)</div>
          <div onClick={() => startFunc('L00300')}>L00300 繳款紀錄查詢 - (施工中)</div>
          <div onClick={() => startFunc('R00500')}>R00500 自動扣繳 - (施工中)</div>
          <div onClick={() => startFunc('S00400')}>S00400 訊息通知設定 - (施工中)</div>
          <div onClick={() => startFunc('T00100')}>T00100 個人化設定</div>
          <div onClick={() => startFunc('T00200')}>T00200 快速登入設定</div>
          <div onClick={() => startFunc('T00600')}>T00600 手機號碼收款設定 - (施工中)</div>
          <div onClick={() => startFunc('T00700')}>T00700 基本資料變更 - (施工中)</div>
          <div onClick={() => startFunc('cardLessSetting')}>無 function code 無卡提款設定 - (完成切版)</div>
        </div>

        {/* <div className="bankee">
          <p style={{ color: '#9D7ADE' }}>** 使用 Y120409367 測試  **</p>
          <div onClick={() => getAllFrequentAccount()}>D00500-API://getAllFrequentAccount</div>
          <div onClick={() => addFrequentAccount({ bankId: '822', acctId: '107532104335', nickName: 'Jerry', email: 'jerry88634@feib.com.tw' })}>D00500-API://addFrequentAccount</div>
          <div onClick={() => updateFrequentAccount({ bankId: '805', acctId: '04300498002896', nickName: 'New Name', email: 'alaya@gmail.com', orgBankId: '805', orgAcctId: '04300498002896' })}>D00500-API://updateFrequentAccount</div>
          <div onClick={() => deleteFrequentAccount({ bankId: '822', acctId: '107532104335' })}>D00500-API://deleteFrequentAccount</div>

          <div onClick={() => getAllRegisteredAccount('04300499100376')}>D00600-API://getAllRegisteredAccount</div>
          <div onClick={() => updateRegisteredAccount({ bankId: '805', acctId: '04300490004059', nickName: 'Jerry帳本', email: 'jerry88634@feib.com.tw' })}>D00600-API://updateRegisteredAccount</div>
        </div> */}

        <FEIBButton onClick={logOut}>登出</FEIBButton>
      </NavWrapper>
    </Layout>
  );
};

export default Nav;
