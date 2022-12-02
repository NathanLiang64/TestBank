import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { customPopup, showDrawer, closeDrawer } from 'utilities/MessageModal';
import { closeFunc, startFunc } from 'utilities/AppScriptProxy';

/* Elements */
import AddNewItem from 'components/AddNewItem';
import SettingItem from 'components/SettingItem';
import Layout from 'components/Layout/Layout';
import { FuncID } from 'utilities/FuncID';
import T00600ModifyForm from './T00600_ModifyForm';

import { fetchMobiles, fetchName } from './api';

/* Styles */
import MobileTransferWrapper from './T00600.style';

const T00600 = () => {
  const history = useHistory();

  const [mobileTransferData, setMobileTransferData] = useState([]);
  const [mobilesList, setMobilesList] = useState([]);
  const [modifyData, setModifyData] = useState({
    mobile: '',
    account: '',
    status: '',
    isDefault: '',
  });
  const [otpMobileNum, setOtpMobileNum] = useState('');
  // 新增手機號碼收款
  const addMobileTransferSetting = () => {
    if (mobilesList.length === 0) {
      customPopup(
        '系統訊息',
        '您在本行留存的手機號碼皆已設定，請先取消， 再進行設定。',
      );
      return;
    }
    history.push('/T006001', { otpMobileNum });
  };

  // 檢查是否設定快速登入、基本資料是否有手機號碼
  const checkBindAndMobile = async () => {
    const {
      bindQuickLogin, bindTxnOtpMobile, bindings, mobiles, otpMobile,
    } = await fetchMobiles({ tokenStatus: 1 });
    setMobileTransferData(bindings || []);
    setMobilesList(mobiles || []);
    setOtpMobileNum(otpMobile);
    // 檢查是否綁定快速登入
    if (bindQuickLogin === 'N') {
      customPopup(
        '系統訊息',
        '為符合手機號碼轉帳相關規範，請至設定>指紋辨識/臉部辨識/圖形密碼登入設定，進行快速登入綁定，造成不便，敬請見諒。',
        () => startFunc(FuncID.T00200),
        closeFunc,
      );
      return;
    }
    // 檢查是否留存手機號碼
    if (bindTxnOtpMobile === 'N') {
      customPopup(
        '系統訊息',
        '您尚未於本行留存手機號碼，請先前往「基本資料變更」頁留存，再進設定。',
        () => startFunc(FuncID.T00700),
        closeFunc,
        '前往留存',
      );
      return;
    }
    if (bindings && bindings.length === 0) {
      customPopup(
        '系統訊息',
        '您尚未設定「手機號碼收款」功能，是否立即進行設定？',
        () => history.push('/T006001', { otpMobileNum: otpMobile }),
        closeFunc,
      );
    }
  };

  // 刪除手機號碼收款
  const deleteMobileTransferSetting = async (data) => {
    const { custName } = await fetchName();
    history.push(
      '/T006002',
      {
        type: 'delete',
        isModify: true,
        data: {
          userName: custName || '',
          ...data,
        },
      },
    );
  };

  // 關閉變更 drawer
  const handleCloseDrawer = () => {
    closeDrawer();
  };

  // 編輯手機號碼收款
  const editMobileTransferSetting = (data) => {
    setModifyData(data);
    showDrawer(
      '手機號碼收款變更',
      <T00600ModifyForm modifyData={modifyData} onClose={handleCloseDrawer} />,
    );
  };

  // render 已設定的手機號碼收款項目
  const renderMobileTransferItems = () => mobileTransferData
    .map((item) => (
      <SettingItem
        key={item.mobile}
        mainLable={item.mobile}
        subLabel={`${item.isDefault ? '預設收款帳戶' : '非預設收款帳戶'} ${item.account}`}
        editClick={() => editMobileTransferSetting(item)}
        deleteClick={() => deleteMobileTransferSetting(item)}
      />
    ));

  useEffect(() => {
    checkBindAndMobile();
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
