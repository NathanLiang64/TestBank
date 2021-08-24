import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AddRounded } from '@material-ui/icons';
import BottomDrawer from 'components/BottomDrawer';
import MemberAccountCard from 'components/MemberAccountCard';
import TransferDrawerWrapper from './transferDrawer.style';
import TransferFrequentlyUsedAccount from '../TransferFrequentlyUsedAccount';
import TransferDesignedAccount from '../TransferDesignedAccount';
import { setOpenDrawer } from '../Transfer/stores/actions';

const TransferDrawer = () => {
  const frequentlyUsedAccounts = useSelector(({ transfer }) => transfer.frequentlyUsedAccounts);
  const designedAccounts = useSelector(({ transfer }) => transfer.designedAccounts);
  const openDrawer = useSelector(({ transfer }) => transfer.openDrawer);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);
  const dispatch = useDispatch();

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
        key={member.acctId}
        type={type}
        name={member.acctName}
        bankNo={member.bankNo}
        bankName={member.bankName}
        account={member.acctId}
        avatarSrc={member.acctImg}
      />
    ))
  );

  const renderMemberAccountCardListByType = () => {
    // 如果當前頁面為常用帳號則 render 常用帳號清單卡片
    if (openDrawer.title === '常用帳號' && frequentlyUsedAccounts) {
      return memberAccountCardList(frequentlyUsedAccounts, openDrawer.title);
    }
    // 否則 render 約定帳號清單卡片
    return memberAccountCardList(designedAccounts, openDrawer.title);
  };

  // 預設的會員帳號頁面 (常用/約定帳號清單)，常用帳號才有新增按鈕
  const defaultMemberAccountContent = (title) => (
    <>
      { title === '常用帳號' && (
        <div className="addMemberButtonArea" onClick={handleClickAddFrequentlyUsedAccount}>
          <div className="addMemberButtonIcon">
            <AddRounded />
          </div>
          <span className="addMemberButtonText">新增常用帳號</span>
        </div>
      ) }
      { renderMemberAccountCardListByType() }
    </>
  );

  // 追蹤點擊事件選項
  useEffect(() => {
    const { click, button } = clickMoreOptions;
    // 如果點擊選項為 edit (編輯) 且當前頁面為常用帳號，則 Drawer 內容跳轉至編輯常用帳號 UI
    if (click && button === 'edit' && openDrawer.title === '常用帳號') {
      dispatch(setOpenDrawer({
        ...openDrawer,
        title: '編輯常用帳號',
        content: 'editFrequentlyUsedAccount',
      }));
    }
    // 如果點擊選項為 edit (編輯) 且當前頁面為約定帳號，則 Drawer 內容跳轉至編輯約定帳號 UI
    if (click && button === 'edit' && openDrawer.title === '約定帳號') {
      dispatch(setOpenDrawer({
        ...openDrawer,
        title: '編輯約轉帳號',
        content: 'editDesignedAccount',
      }));
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
        </TransferDrawerWrapper>
      )}
    />
  );
};

export default TransferDrawer;
