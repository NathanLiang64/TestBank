import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BottomDrawer from 'components/BottomDrawer';
import MemberAccountCard from 'components/MemberAccountCard';
import { AddIcon } from 'assets/images/icons';
import TransferStaticDrawerWrapper from './transferStaticDrawer.style';
import TransferStaticFrequentlyUsedAccount from '../TransferStaticFrequentlyUsedAccount';
import TransferStaticDesignedAccount from '../TransferStaticDesignedAccount';
import { setOpenDrawer, setClickMoreOptions } from '../TransferStatic/stores/actions';
import mockData from '../TransferStatic/mockData';

const TransferStaticDrawer = ({ setTabId }) => {
  const [frequentlyUsedAccounts, setFrequentlyUsedAccounts] = useState();
  const [designedAccounts, setDesignedAccounts] = useState();
  const openDrawer = useSelector(({ transferStatic }) => transferStatic.openDrawer);
  const clickMoreOptions = useSelector(({ transferStatic }) => transferStatic.clickMoreOptions);
  const dispatch = useDispatch();

  const handleClick = (buttonType, id) => {
    dispatch(setClickMoreOptions({
      ...clickMoreOptions,
      [buttonType]: { click: true, target: id },
    }));
  };

  // 點擊關閉 Drawer
  const handleCloseDrawer = () => {
    dispatch(setOpenDrawer({ ...openDrawer, content: 'default', open: false }));
  };

  // 點擊新增常用帳號按鈕
  const handleClickAddFrequentlyUsedAccount = () => {
    dispatch(setOpenDrawer({ ...openDrawer, title: '新增常用帳號', content: 'addFrequentlyUsedAccount' }));
  };

  const memberAccountCardList = (list, type) => (
    list.map((member) => (
      <MemberAccountCard
        id={member.id}
        key={member.id}
        type={type}
        name={member.acctName}
        bankNo={member.bankNo}
        bankName={member.bankName}
        account={member.acctId}
        avatarSrc={member.acctImg}
        onSelect={() => handleClick('select', member.id)}
        onEdit={() => handleClick('edit', member.id)}
        onRemove={() => handleClick('remove', member.id)}
      />
    ))
  );

  // eslint-disable-next-line consistent-return
  const renderMemberAccountCardListByType = () => {
    // 如果當前頁面為常用帳號則 render 常用帳號清單卡片
    if (openDrawer.title === '常用帳號' && frequentlyUsedAccounts) {
      return memberAccountCardList(frequentlyUsedAccounts, openDrawer.title);
    }
    // 否則 render 約定帳號清單卡片
    if (openDrawer.title === '約定帳號' && designedAccounts) {
      return memberAccountCardList(designedAccounts, openDrawer.title);
    }
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
      { renderMemberAccountCardListByType() }
    </>
  );

  useEffect(async () => {
    const { getFavoriteAcct, getDesignedAcct } = mockData;
    setFrequentlyUsedAccounts(getFavoriteAcct.favoriteAcctList);
    setDesignedAccounts(getDesignedAcct.designedAcctList);
  }, []);

  useEffect(() => {
    // 如果常用帳號清單為空的，預設開啟新增常用帳號，若無新增即關閉 Drawer 則導回一般轉帳頁面
    if (openDrawer.title === '新增常用帳號' && !openDrawer.open && frequentlyUsedAccounts) {
      if (frequentlyUsedAccounts.length === 0) setTabId('transfer');
    }
  }, [openDrawer, frequentlyUsedAccounts]);

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
    if (remove.click && openDrawer.title === '常用帳號') {
      // call api 刪除常用帳號內的單筆資料
    }
  }, [clickMoreOptions]);

  // 由 drawerController 控制當前顯示畫面
  const drawerController = (content) => {
    switch (content) {
      // 新增常用帳號
      case 'addFrequentlyUsedAccount':
        return <TransferStaticFrequentlyUsedAccount />;
      // 編輯常用帳號
      case 'editFrequentlyUsedAccount':
        return <TransferStaticFrequentlyUsedAccount />;
      // 編輯約定帳號
      case 'editDesignedAccount':
        return <TransferStaticDesignedAccount />;
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
        <TransferStaticDrawerWrapper>
          { drawerController(openDrawer?.content) }
        </TransferStaticDrawerWrapper>
      )}
    />
  );
};

export default TransferStaticDrawer;
