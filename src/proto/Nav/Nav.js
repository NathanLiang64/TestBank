import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { FuncID } from 'utilities/FuncID';
import { FEIBButton } from 'components/elements';
import Layout from 'components/Layout/Layout';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useNavigation } from 'hooks/useNavigation';
import { forceLogout } from 'utilities/AppScriptProxy';

import { assetSummary, getAssetSummaryValues, registerToken } from './Nav.api';
import NavWrapper from './Nav.style';

const Nav = () => {
  const dispatch = useDispatch();
  const { startFunc } = useNavigation();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      // NOTE 要每次執行，因為在單元功能執行中可能會變更引用的內容。
      // await getHomeData();
      await assetSummary();
    } else {
      forceLogout();
    }

    dispatch(setWaittingVisible(false));

    // NOTE 只有在登入後的初始化 getAssetSummary 一次，將資料寫回DB及Token中。
    if (sessionStorage.getItem('HomeDataLoaded') === null) {
      sessionStorage.setItem('HomeDataLoaded', 'Y');
      // 用非同步取得 getAssetSummary 的初始值。
      getAssetSummaryValues().then(() => {
        // pushToken 可透過 GET https://bankeesit.feib.com.tw/ords/db1/app/bankee2app/DeviceBindingByCustId?custId=A120000000 取得
        registerToken({ pushToken: '878161cad9c7f9b9aa246a2672bd0af545e49849703e6ed23899847c01ca2503' });
        // getBanner()
      });
    }
  }, []);

  return (
    <Layout title="測試功能首頁" goBack={false} goHome={false}>
      <NavWrapper>
        <div className="bankee">
          <div onClick={() => startFunc(FuncID.D00100_臺幣轉帳)}>D00100 轉帳</div>
          <div onClick={() => startFunc(FuncID.C00300)}>C00300 台幣存款首頁</div>
          <div onClick={() => startFunc(FuncID.C00400)}>C00400 外幣存款首頁</div>
          <div onClick={() => startFunc(FuncID.C00500)}>C00500 交割帳戶首頁</div>
          <div onClick={() => startFunc(FuncID.M00100)}>M00100 社群圈首頁</div>
          <div onClick={() => startFunc(FuncID.D00500)}>D00500 常用帳號管理</div>
          <div onClick={() => startFunc(FuncID.D00600)}>D00600 約定帳號管理</div>
          <div onClick={() => startFunc(FuncID.B00600)}>B00600 更多...</div>
          <div onClick={() => startFunc(FuncID.T00100)}>T00100 個人化設定</div>
          <div onClick={() => startFunc(FuncID.S00100_我的最愛)}>S00100 我的最愛</div>
          <div onClick={() => startFunc(FuncID.S00101_我的最愛v2)}>S00101 我的最愛v2</div>
          <div onClick={() => startFunc(FuncID.E00100_換匯)}>E00100 換匯 - (施工中)</div>
          <div onClick={() => startFunc(FuncID.A00600)}>A00600 定期更新個資</div>
          <div onClick={() => startFunc(FuncID.A00700)}>A00700 定期更新密碼</div>
        </div>

        <FEIBButton onClick={forceLogout}>登出</FEIBButton>
      </NavWrapper>
    </Layout>
  );
};

export default Nav;
