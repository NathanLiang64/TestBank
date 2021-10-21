/* eslint-disable */
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BottomDrawer from 'components/BottomDrawer';
import MemberAccountCard from 'components/MemberAccountCard';
import { AddIcon } from 'assets/images/icons';
// import { doGetInitData } from 'apis/transferApi';
import { getFavAcct,queryRegAcct } from 'apis/transferApi';
import TransferDrawerWrapper from './transferDrawer.style';
import TransferFrequentlyUsedAccount from '../TransferFrequentlyUsedAccount';
import TransferDesignedAccount from '../TransferDesignedAccount';
import { setClickMoreOptions, setOpenDrawer,setFqlyUsedAccounts,setDgnedAccounts } from '../Transfer/stores/actions';


const TransferDrawer = ({ setTabId }) => {
  const [frequentlyUsedAccounts, setFrequentlyUsedAccounts] = useState();
  const [designedAccounts, setDesignedAccounts] = useState();
  const openDrawer = useSelector(({ transfer }) => transfer.openDrawer);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);
  const frequentlyUsedAccountsRedux = useSelector(({ transfer }) => transfer.frequentlyUsedAcct);
  const designedAccountsRedux = useSelector(({ transfer }) => transfer.designedAcct);
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
        // id={member.id}
        key={member.accountId}
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
    ))
  );

  // eslint-disable-next-line consistent-return
  const renderMemberAccountCardListByType = () => {
    // 如果當前頁面為常用帳號則 render 常用帳號清單卡片
    console.log(frequentlyUsedAccounts);
    if (openDrawer.title === '常用帳號' && frequentlyUsedAccounts && frequentlyUsedAccounts!==undefined && frequentlyUsedAccounts.length>0) {
      console.log(frequentlyUsedAccounts);
      return memberAccountCardList(frequentlyUsedAccounts, openDrawer.title);
    }
    // 否則 render 約定帳號清單卡片
    if (openDrawer.title === '約定帳號' && designedAccounts && designedAccounts!==undefined && designedAccounts.length>0) {
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
    console.log("redux")
    console.log(frequentlyUsedAccountsRedux);
    if(!frequentlyUsedAccounts&&!frequentlyUsedAccountsRedux){
      const favoriteResponse = await getFavAcct({});
      if (favoriteResponse.code!='WEBCTL1003' || favoriteResponse.code!= "WEBCTL1001"){
        setFrequentlyUsedAccounts(favoriteResponse);
        dispatch(setFqlyUsedAccounts(favoriteResponse))
      } 
    }else{
      setFrequentlyUsedAccounts(frequentlyUsedAccountsRedux);
    }

    if(!designedAccounts&&!designedAccountsRedux){
      const designedResponse = await queryRegAcct({});
      if (designedResponse.code!='WEBCTL1003'){
        setDesignedAccounts(designedResponse);
        dispatch(setDgnedAccounts(designedResponse))
      } 
    }else{
      setDesignedAccounts(designedAccountsRedux);
    }
    
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
      console.log("典籍刪除");
      console.log(clickMoreOptions);
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
