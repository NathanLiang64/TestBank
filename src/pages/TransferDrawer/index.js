import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BottomDrawer from 'components/BottomDrawer';
import MemberAccountCard from 'components/MemberAccountCard';
import Dialog from 'components/Dialog';
import { FEIBButton } from 'components/elements';
import { getFavAccounts, getRegAccounts, removeFavAccount } from 'apis/transferApi';
import { AddIcon } from 'assets/images/icons';
import TransferDrawerWrapper from './transferDrawer.style';
import TransferFrequentlyUsedAccount from '../TransferFrequentlyUsedAccount';
import TransferDesignedAccount from '../TransferDesignedAccount';
import {
  setClickMoreOptions, setFavAccounts, setOpenDrawer, setRegAccounts,
} from '../Transfer/stores/actions';

const TransferDrawer = ({ setTabId }) => {
  const [openAlertDialog, setOpenAlertDialog] = useState({ open: false, content: '' });
  const openDrawer = useSelector(({ transfer }) => transfer.openDrawer);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);
  const favAccounts = useSelector(({ transfer }) => transfer.favAccounts);
  const regAccounts = useSelector(({ transfer }) => transfer.regAccounts);

  const dispatch = useDispatch();

  // 設置點擊狀態
  const handleClick = (buttonType, id) => {
    dispatch(setClickMoreOptions({
      ...clickMoreOptions,
      [buttonType]: { click: true, target: id },
    }));
  };

  // 取得常用帳號清單
  const updateFavAccounts = () => {
    getFavAccounts().then((response) => {
      // 若常用帳號列表為空或得到錯誤，開啟新增常用帳號 Drawer UI
      if (!response?.length) {
        dispatch(setFavAccounts([]));
        handleClick('add', null);
        dispatch(setOpenDrawer({ title: '新增常用帳號', content: 'addFrequentlyUsedAccount', open: true }));
        return;
      }
      dispatch(setFavAccounts(response));
    });
    // .catch((error) => console.log('查詢常用帳號 error', error));
  };

  // 點擊關閉 Drawer
  const handleCloseDrawer = () => {
    dispatch(setOpenDrawer({ ...openDrawer, content: 'default', open: false }));
  };

  // 點擊新增常用帳號按鈕
  const handleClickAddFrequentlyUsedAccount = () => {
    handleClick('add', null);
    dispatch(setOpenDrawer({ ...openDrawer, title: '新增常用帳號', content: 'addFrequentlyUsedAccount' }));
  };

  const handleRemoveAccount = () => {
    const account = favAccounts.find((member) => member.accountId === clickMoreOptions.remove.target);
    const {
      accountId, accountName, bankId, email,
    } = account;
    const params = {
      email,
      inBank: bankId,
      inAcct: accountId,
      nickName: accountName,
    };
    removeFavAccount(params).then(() => {
      // console.log('刪除常用帳號 res', response);
      dispatch(setClickMoreOptions({ ...clickMoreOptions, remove: { click: false, target: null } }));
      updateFavAccounts();
    });
    // .catch((error) => console.log('刪除常用帳號 err', error));
  };

  // 點擊關閉提示彈窗
  const handleCloseAlertDialog = () => {
    setOpenAlertDialog({ ...openAlertDialog, open: false });

    // 若點擊狀態為刪除，彈窗提示確認後將執行刪除常用帳號
    if (clickMoreOptions.remove.click) {
      handleRemoveAccount();
      return;
    }

    // 若點擊狀態非刪除，代表此警示彈窗為提醒用戶臨櫃設定約轉帳號，純粹關閉彈窗並導回一般轉帳頁籤
    setTabId('transfer');
  };

  const memberAccountCardList = (list, type) => list.map((member) => (
    <MemberAccountCard
      id={member.accountId}
      // key={member.accountId}
      key={Date.now + Math.random()}
      type={type}
      name={member.accountName}
      bankNo={member.bankId}
      bankName={member.bankName}
      account={member.accountId}
      avatarSrc={member.acctImg}
      onSelect={() => handleClick('select', member.accountId)}
      onEdit={() => handleClick('edit', member.accountId)}
      onRemove={() => handleClick('remove', member.accountId)}
    />
  ));

  const renderMemberAccountCardListByType = (type) => {
    // 如果當前頁面為常用帳號則 render 常用帳號清單卡片
    if (type === '常用帳號' && favAccounts?.length) return memberAccountCardList(favAccounts, type);
    // 如果當前頁面為約定帳號則 render 約定帳號清單卡片
    if (type === '約定帳號' && regAccounts?.length) return memberAccountCardList(regAccounts, type);
    return null;
  };

  // 預設的會員帳號頁面 (常用/約定帳號清單)，常用帳號才有新增按鈕
  const defaultMemberAccountContent = (title) => (
    <>
      { title === '常用帳號' && (
        <div className="addMemberButtonArea" onClick={handleClickAddFrequentlyUsedAccount}>
          <div className="addMemberButtonIcon">
            <AddIcon />
          </div>
          <span className="addMemberButtonText">新增常用帳號</span>
        </div>
      ) }
      { renderMemberAccountCardListByType(openDrawer?.title) }
    </>
  );

  useEffect(() => {
    if (openDrawer.title === '常用帳號' && openDrawer.open) updateFavAccounts();

    if (openDrawer.title === '約定帳號' && openDrawer.open) {
      getRegAccounts().then((response) => {
        // Test mock data
        // const regMockData = [
        //   { bankId: '007', bankName: '第一銀行', accountId: '456464654646', accountName: '１１３１３１３', email: '' },
        //   { bankId: '805', bankName: '遠東銀行', accountId: '04300499100835', accountName: '８３５', email: ''  },
        // ]
        // dispatch(setRegAccounts(regMockData))

        if (!response.accounts?.length) {
          console.log(response);
          dispatch(setRegAccounts([]));
          setOpenAlertDialog({ open: true, content: response.message });
          return;
        }
        dispatch(setRegAccounts(response?.accounts));
      });
      // .catch((error) => console.log('查詢約定帳號 error', error));
    }
  }, [openDrawer?.title, openDrawer?.open]);

  useEffect(() => {
    // 如果常用帳號列表為空，無新增任何常用帳號即關閉 Drawer 則導回一般轉帳頁面
    if (openDrawer.title === '新增常用帳號' && !openDrawer.open && !favAccounts?.length) setTabId('transfer');
  }, [openDrawer, favAccounts]);

  // 追蹤點擊事件選項
  useEffect(() => {
    const { edit, remove } = clickMoreOptions;
    // 如果點擊選項為 edit (編輯) 且當前頁面為常用帳號，則 Drawer 內容跳轉至編輯常用帳號 UI
    if (edit.click && openDrawer.title === '常用帳號') {
      dispatch(setOpenDrawer({
        ...openDrawer,
        title: '編輯常用帳號',
        content: 'editFrequentlyUsedAccount',
      }));
    }
    // 如果點擊選項為 edit (編輯) 且當前頁面為約定帳號，則 Drawer 內容跳轉至編輯約定帳號 UI
    if (edit.click && openDrawer.title === '約定帳號') {
      dispatch(setOpenDrawer({
        ...openDrawer,
        title: '編輯約轉帳號',
        content: 'editDesignedAccount',
      }));
    }
    // 如果點擊選項為 remove (刪除) 且當前頁面為常用帳號
    if (remove.click && openDrawer.title === '常用帳號') {
      setOpenAlertDialog({ open: true, content: '您確定要將該筆帳號從常用帳號清單移除嗎？' });
    }
  }, [clickMoreOptions]);

  // 由 drawerController 控制當前顯示畫面
  const drawerController = (content) => {
    switch (content) {
      // 新增常用帳號
      case 'addFrequentlyUsedAccount':
        return <TransferFrequentlyUsedAccount />;
      // 編輯常用帳號
      case 'editFrequentlyUsedAccount':
        return <TransferFrequentlyUsedAccount />;
      // 編輯約定帳號
      case 'editDesignedAccount':
        return <TransferDesignedAccount />;
      // 常用/約定帳號清單
      default:
        return defaultMemberAccountContent(openDrawer.title);
    }
  };

  return (
    <BottomDrawer
      title={openDrawer.title}
      isOpen={openDrawer.open}
      onClose={handleCloseDrawer}
      content={(
        <TransferDrawerWrapper>
          { drawerController(openDrawer?.content) }
          <Dialog
            isOpen={openAlertDialog.open}
            onClose={handleCloseAlertDialog}
            content={<p>{openAlertDialog.content}</p>}
            action={<FEIBButton onClick={handleCloseAlertDialog}>確認</FEIBButton>}
          />
        </TransferDrawerWrapper>
      )}
    />
  );
};

export default TransferDrawer;
