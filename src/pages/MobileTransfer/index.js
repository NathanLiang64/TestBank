import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import AddNewItem from 'components/AddNewItem';
import SettingItem from 'components/SettingItem';
import BottomDrawer from 'components/BottomDrawer';
import MobileTransferModifyForm from './mobileTransferModifyForm';

/* Styles */
import MobileTransferWrapper from './mobileTransfer.style';

const MobileTransfer = () => {
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 新增手機號碼收款
  const addMobileTransferSetting = () => {
    history.push('/mobileTransfer1');
  };

  // 編輯手機號碼收款
  const editMobileTransferSetting = () => {
    setDrawerOpen(true);
  };

  // 刪除手機號碼收款
  const deleteMobileTransferSetting = () => {
    history.push(
      '/mobileTransfer2',
      {
        type: 'delete',
        isModify: true,
      },
    );
  };

  // 關閉變更 drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // 收款變更 drawer
  const renderModifyDrawer = () => (
    <BottomDrawer
      title="手機號碼收款變更"
      isOpen={drawerOpen}
      onClose={handleCloseDrawer}
      content={(
        <MobileTransferModifyForm onClose={handleCloseDrawer} />
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/mobileTransfer');

  return (
    <MobileTransferWrapper className="settingListContainer">
      <AddNewItem onClick={addMobileTransferSetting} addLabel="新增手機號碼收款設定" />
      <SettingItem
        mainLable="0988-392726"
        subLabel="非預設收款帳戶 00300400326306"
        editClick={editMobileTransferSetting}
        deleteClick={deleteMobileTransferSetting}
      />
      { renderModifyDrawer() }
    </MobileTransferWrapper>
  );
};

export default MobileTransfer;
