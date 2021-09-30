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

  // eslint-disable-next-line no-unused-vars
  const [mobileTransferData, setMobileTransferData] = useState([
    {
      id: 0,
      mobile: '0988392726',
      isDefault: false,
      account: '00300400326306',
      userName: '王小明',
    },
    {
      id: 1,
      mobile: '0988392899',
      isDefault: true,
      account: '00300400326307',
      userName: '王小明',
    },
  ]);
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

  useCheckLocation();
  usePageInfo('/api/mobileTransfer');

  return (
    <MobileTransferWrapper className="settingListContainer">
      <AddNewItem onClick={addMobileTransferSetting} addLabel="新增手機號碼收款設定" />
      { renderMobileTransferItems() }
      { renderModifyDrawer() }
    </MobileTransferWrapper>
  );
};

export default MobileTransfer;
