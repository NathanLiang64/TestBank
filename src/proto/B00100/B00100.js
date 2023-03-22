/* eslint-disable no-unused-vars */
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Func } from 'utilities/FuncID';
import { FEIBButton } from 'components/elements';
import Layout from 'components/Layout/Layout';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useNavigation } from 'hooks/useNavigation';
// import { useNavigation } from 'hooks/useNavigation.min';
import { forceLogout } from 'utilities/AppScriptProxy';

import { assetSummary, getAssetSummaryValues, registerToken } from './api';
import NavWrapper from './B00100.style';

const Nav = () => {
  const dispatch = useDispatch();
  const { startFunc } = useNavigation();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      // NOTE 要每次執行，因為在單元功能執行中可能會變更引用的內容。
      assetSummary().then(() => {
        // NOTE 只有在登入後的初始化 getAssetSummary 一次，將資料寫回DB及Token中。
        if (sessionStorage.getItem('HomeDataLoaded') === null) {
          sessionStorage.setItem('HomeDataLoaded', 'N');
          // 用非同步取得 getAssetSummary 的初始值。
          getAssetSummaryValues().then(() => {
            sessionStorage.setItem('HomeDataLoaded', 'Y');
            dispatch(setWaittingVisible(false));
            // pushToken 可透過 GET https://bankeesit.feib.com.tw/ords/db1/app/bankee2app/DeviceBindingByCustId?custId=A120000000 取得
            registerToken({ pushToken: '878161cad9c7f9b9aa246a2672bd0af545e49849703e6ed23899847c01ca2503' });
            // getBanner()
          });
        }
      });
    } else {
      forceLogout();
    }

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="測試功能首頁" goBack={false} goHome={false}>
      <NavWrapper>
        <div className="bankee">
          {/* <div onClick={() => startFunc(Func.D001.id)}>D00100 轉帳</div> */}
          <div onClick={() => startFunc(Func.C002.id)}>C00200 社群帳本</div>
          <div onClick={() => startFunc(Func.C003.id)}>C00300 台幣存款首頁</div>
          <div onClick={() => startFunc(Func.C004.id)}>C00400 外幣存款首頁</div>
          {/* <div onClick={() => startFunc(Func.C005.id)}>C00500 交割帳戶首頁</div> */}
          {/* <div onClick={() => startFunc(Func.M001.id)}>M00100 社群圈首頁</div> */}
          {/* <div onClick={() => startFunc(Func.D005.id)}>D00500 常用帳號管理</div> */}
          {/* <div onClick={() => startFunc(Func.D006.id)}>D00600 約定帳號管理</div> */}
          <div onClick={() => startFunc(Func.B006.id)}>B00600 更多...</div>
          <div onClick={() => startFunc(Func.T001.id)}>T00100 個人化設定</div>
          <div onClick={() => startFunc(Func.D007.id)}>D00700 外幣轉帳 - (開發中)</div>
          <div onClick={() => startFunc(Func.E001.id)}>E00100 換匯 - (測試中)</div>
          <div onClick={() => startFunc(Func.A006.id)}>A00600 定期更新個資</div>
          <div onClick={() => startFunc(Func.A007.id)}>A00700 定期更新密碼</div>
        </div>

        <FEIBButton onClick={forceLogout}>登出</FEIBButton>
      </NavWrapper>
    </Layout>
  );
};

export default Nav;
