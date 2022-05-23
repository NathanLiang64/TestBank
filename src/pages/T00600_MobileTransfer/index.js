import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useGetEnCrydata } from 'hooks';
import { customPopup } from 'utilities/MessageModal';
import { closeFunc, startFunc } from 'utilities/BankeePlus';

/* Elements */
import AddNewItem from 'components/AddNewItem';
import SettingItem from 'components/SettingItem';
import BottomDrawer from 'components/BottomDrawer';
import Layout from 'components/Layout/Layout';
import MobileTransferModifyForm from './mobileTransferModifyForm';

import { getUserActNo, fetchMobiles } from './api';

/* Styles */
import MobileTransferWrapper from './mobileTransfer.style';

const MobileTransfer = () => {
  const history = useHistory();

  // eslint-disable-next-line no-unused-vars
  const [mobileTransferData, setMobileTransferData] = useState([]);
  const [modifyData, setModifyData] = useState({
    id: 1,
    mobile: '0988392899',
    isDefault: true,
    account: '00300400326307',
    userName: '王小明',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 新增手機號碼收款
  const addMobileTransferSetting = () => {
    history.push('/mobileTransfer1');
  };

  const getBindedAccountList = async () => {
    const { accounts } = await getUserActNo({ tokenStatus: 1 });
    console.log('已綁定帳號', accounts);
    if (accounts && accounts.length === 0) {
      customPopup(
        '系統訊息',
        '您尚未設定「手機號碼收款」功能，是否立即進行設定？',
        null,
        closeFunc,
      );
    }
    setMobileTransferData(accounts || []);
  };

  // 檢查是否設定快速登入、基本資料是否有手機號碼
  const checkBindAndMobile = async () => {
    const { binding, cifMobile } = await fetchMobiles({ tokenStatus: 1 });
    // 檢查是否綁定快速登入
    if (binding === 'N') {
      customPopup(
        '系統訊息',
        '為符合手機號碼轉帳相關規範，請至設定>指紋辨識/臉部辨識/圖形密碼登入設定，進行快速登入綁定，造成不便，敬請見諒。',
        () => startFunc('T00200'),
        closeFunc,
      );
      return;
    }
    // 檢查是否留存手機號碼
    if (!cifMobile) {
      customPopup(
        '系統訊息',
        '您尚未於本行留存手機號碼，請先前往「基本資料變更」頁留存，再進設定。',
        () => startFunc('T00700'),
        closeFunc,
        '前往留存',
      );
      return;
    }
    getBindedAccountList();
  };

  // 編輯手機號碼收款
  const editMobileTransferSetting = (data) => {
    console.log(data);
    setModifyData(data);
    setDrawerOpen(true);
  };

  // 刪除手機號碼收款
  const deleteMobileTransferSetting = (data) => {
    history.push(
      '/mobileTransfer2',
      {
        type: 'delete',
        isModify: true,
        data,
      },
    );
  };

  // 關閉變更 drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // render 已設定的手機號碼收款項目
  const renderMobileTransferItems = () => mobileTransferData
    .map((item) => (
      <SettingItem
        key={item.id}
        mainLable={item.mobile}
        subLabel={`${item.isDefault ? '預設收款帳戶' : '非預設收款帳戶'} ${item.account}`}
        editClick={() => editMobileTransferSetting(item)}
        deleteClick={() => deleteMobileTransferSetting(item)}
      />
    ));

  // 收款變更 drawer
  const renderModifyDrawer = () => (
    <BottomDrawer
      title="手機號碼收款變更"
      isOpen={drawerOpen}
      onClose={handleCloseDrawer}
      content={(
        <MobileTransferModifyForm modifyData={modifyData} onClose={handleCloseDrawer} />
      )}
    />
  );

  useGetEnCrydata();

  useEffect(() => {
    checkBindAndMobile();
  }, []);

  return (
    <Layout title="手機號碼收款設定">
      <MobileTransferWrapper className="settingListContainer">
        <AddNewItem onClick={addMobileTransferSetting} addLabel="新增手機號碼收款設定" />
        { renderMobileTransferItems() }
        { renderModifyDrawer() }
      </MobileTransferWrapper>
    </Layout>
  );
};

export default MobileTransfer;
