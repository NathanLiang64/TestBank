import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { customPopup, showDrawer, closeDrawer } from 'utilities/MessageModal';
import { getAccountsList } from 'utilities/CacheData';
import { accountFormatter } from 'utilities/Generator';

/* Elements */
import AddNewItem from 'components/AddNewItem';
import SettingItem from 'components/SettingItem';
import Layout from 'components/Layout/Layout';
import { FuncID } from 'utilities/FuncID';
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import T00600ModifyForm from './T00600_ModifyForm';

import { fetchMobiles, getProfile } from './api';

/* Styles */
import MobileTransferWrapper from './T00600.style';

/**
 * 手機號碼收款設定
 */
const T00600 = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { startFunc, closeFunc } = useNavigation();
  const [mobileTransferData, setMobileTransferData] = useState([]);
  const [mobilesList, setMobilesList] = useState([]);

  const [model, setModel] = useState();
  const getModel = async () => {
    if (!model) {
      dispatch(setWaittingVisible(true));
      const profile = await getProfile();
      const modelData = {
        custName: profile.custName,
        mobilesList,
        // eslint-disable-next-line arrow-body-style
        accountList: await getAccountsList('MSC', (accts) => { // 帳戶類型 M:母帳戶, S:證券戶, C:子帳戶
          // 排除已綁定的帳號
          return accts.filter((acct) => !mobileTransferData.find((bindInfo) => bindInfo.account === acct.accountNo));
        }),
      };
      setModel(modelData);
      dispatch(setWaittingVisible(false));
      return modelData;
    }
    return model;
  };

  // 新增手機號碼收款
  const addMobileTransferSetting = async () => {
    if (mobilesList.length === 0) {
      await customPopup(
        '系統訊息',
        '您在本行留存的手機號碼皆已設定，請先取消， 再進行設定。',
      );
    } else {
      history.push('/T006001', await getModel());
    }
  };

  // 檢查是否設定快速登入、基本資料是否有手機號碼
  const checkBindAndMobile = async () => {
    const {
      bindQuickLogin, bindTxnOtpMobile, bindings, mobiles,
    } = await fetchMobiles({ tokenStatus: 1 });
    // 檢查是否綁定快速登入
    if (!bindQuickLogin) {
      await customPopup(
        '系統訊息',
        '為符合手機號碼轉帳相關規範，請至設定>指紋辨識/臉部辨識/圖形密碼登入設定，進行快速登入綁定，造成不便，敬請見諒。',
        () => startFunc(FuncID.T00200),
        closeFunc,
        '立即設定',
      );
      return;
    }
    // 檢查是否留存手機號碼
    if (!bindTxnOtpMobile) {
      await customPopup(
        '系統訊息',
        '您尚未於本行留存手機號碼，請先前往「基本資料變更」頁留存，再進設定。',
        () => startFunc(FuncID.T00700),
        closeFunc,
        '前往留存',
      );
    }

    setMobilesList(mobiles || []);
    setMobileTransferData(bindings);
  };

  // Note 不能跟 setMobilesList 在同一個方法中，否則 getModel 會取不到 mobilesList 的值。
  useEffect(async () => {
    if (mobileTransferData && mobileTransferData.length === 0) {
      await customPopup(
        '系統訊息',
        '您尚未設定「手機號碼收款」功能，是否立即進行設定？',
        async () => history.push('/T006001', await getModel()),
        closeFunc,
      );
    }
  }, [mobileTransferData]);

  // 刪除手機號碼收款
  const deleteMobileTransferSetting = async (data) => {
    history.push(
      '/T006002', {
        type: 'delete',
        isModify: true,
        data: {
          custName: (await getModel()).custName,
          ...data,
        },
      },
    );
  };

  // 編輯手機號碼收款
  const editMobileTransferSetting = async (data) => {
    const modifyData = {
      ...await getModel(),
      ...data,
    };
    await showDrawer(
      '手機號碼收款變更',
      <T00600ModifyForm modifyData={modifyData} onClose={closeDrawer} />,
    );
    // TODO 更新所有畫面資料。
  };

  // render 已設定的手機號碼收款項目
  const renderMobileTransferItems = () => (
    mobileTransferData.map((item) => (
      <SettingItem
        key={item.mobile}
        mainLable={item.mobile}
        subLabel={`${item.isDefault ? '預設收款帳戶' : '非預設收款帳戶'} ${accountFormatter(item.account)}`}
        editClick={() => editMobileTransferSetting(item)}
        deleteClick={() => deleteMobileTransferSetting(item)}
      />
    ))
  );

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    await checkBindAndMobile();
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="手機號碼收款設定">
      <MobileTransferWrapper className="settingListContainer">
        <AddNewItem onClick={addMobileTransferSetting} addLabel="新增手機號碼收款設定" />
        { renderMobileTransferItems() }
      </MobileTransferWrapper>
    </Layout>
  );
};

export default T00600;
