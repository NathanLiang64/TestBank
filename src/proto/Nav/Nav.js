import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Func } from 'utilities/FuncID';
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
          <div onClick={() => startFunc(Func.D00100_臺幣轉帳.id)}>D00100 轉帳</div>
          <div onClick={() => startFunc(Func.C00300.id)}>C00300 台幣存款首頁</div>
          <div onClick={() => startFunc(Func.C00400.id)}>C00400 外幣存款首頁</div>
          <div onClick={() => startFunc(Func.C00500.id)}>C00500 交割帳戶首頁</div>
          <div onClick={() => startFunc(Func.C00700.id)}>C00700 信用卡首頁</div>
          <div onClick={() => startFunc(Func.M00100.id)}>M00100 社群圈首頁</div>
          <div onClick={() => startFunc(Func.D00500.id)}>D00500 常用帳號管理</div>
          <div onClick={() => startFunc(Func.D00600.id)}>D00600 約定帳號管理</div>
          <div onClick={() => startFunc(Func.B00600.id)}>B00600 更多...</div>
          <div onClick={() => startFunc(Func.T00100.id)}>T00100 個人化設定</div>
          <div onClick={() => startFunc(Func.S00100_我的最愛.id)}>S00100 我的最愛</div>
          <div onClick={() => startFunc(Func.S00101_我的最愛v2.id)}>S00101 我的最愛v2</div>
          <div onClick={() => startFunc(Func.E00100_換匯.id)}>E00100 換匯 - (施工中)</div>
          <div onClick={() => startFunc(Func.A00600.id)}>A00600 定期更新個資</div>
          <div onClick={() => startFunc(Func.A00700.id)}>A00700 定期更新密碼</div>
        </div>

        <FEIBButton onClick={forceLogout}>登出</FEIBButton>
      </NavWrapper>
    </Layout>
  );
};

export default Nav;
