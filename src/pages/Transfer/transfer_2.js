import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AddRounded } from '@material-ui/icons';
import BottomDrawer from 'components/BottomDrawer';
import MemberAccountCard from 'components/MemberAccountCard';
import { TransferDrawerWrapper } from './transfer.style';
import TransferFrequentlyUsedAccount from '../TransferFrequentlyUsedAccount';
import TransferDesignedAccount from '../TransferDesignedAccount';

const Transfer2 = ({ openDrawer, setOpenDrawer }) => {
  const frequentlyUsedAccounts = useSelector(({ transfer }) => transfer.frequentlyUsedAccounts);
  const designedAccounts = useSelector(({ transfer }) => transfer.designedAccounts);
  const [drawerContent, setDrawerContent] = useState('default');
  const [clickMoreOption, setClickMoreOption] = useState({ click: false, button: '', target: null });

  const handleCloseDrawer = () => {
    setOpenDrawer({ ...openDrawer, open: false });
    setDrawerContent('default');
  };

  // 點擊新增常用帳號按鈕
  const handleClickAddFrequentlyUsedAccount = () => {
    setOpenDrawer({ ...openDrawer, title: '新增常用帳號' });
    setDrawerContent('addFrequentlyUsedAccount');
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
        setClickMoreOption={setClickMoreOption}
      />
    ))
  );

  const renderMemberAccountCardListByType = () => {
    if (openDrawer.title === '常用帳號' && frequentlyUsedAccounts) {
      return memberAccountCardList(frequentlyUsedAccounts, openDrawer.title);
    }
    return memberAccountCardList(designedAccounts, openDrawer.title);
  };

  // 預設的會員帳號頁面 (常用帳號、約定帳號)，常用帳號才有新增按鈕
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

  useEffect(() => {
    // if (clickMoreOption) console.log(clickMoreOption);
    const { click, button } = clickMoreOption;
    if (click && button === 'edit' && openDrawer.title === '常用帳號') {
      setDrawerContent('editFrequentlyUsedAccount');
      setOpenDrawer({ ...openDrawer, title: '編輯常用帳號' });
    } else if (click && button === 'edit' && openDrawer.title === '約定帳號') {
      setDrawerContent('editDesignedAccount');
      setOpenDrawer({ ...openDrawer, title: '編輯約轉帳號' });
    }
  }, [clickMoreOption]);

  // 由 drawerController 控制要顯示哪個頁面
  const drawerController = (content) => {
    switch (content) {
      case 'default':
        return defaultMemberAccountContent(openDrawer.title);
      case 'addFrequentlyUsedAccount':
        return (
          <TransferFrequentlyUsedAccount
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            setDrawerContent={setDrawerContent}
            setClickMoreOption={setClickMoreOption}
          />
        );
      case 'editFrequentlyUsedAccount':
        return (
          <TransferFrequentlyUsedAccount
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            setDrawerContent={setDrawerContent}
            setClickMoreOption={setClickMoreOption}
            target={clickMoreOption.target}
          />
        );
      case 'editDesignedAccount':
        return (
          <TransferDesignedAccount
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            setDrawerContent={setDrawerContent}
            setClickMoreOption={setClickMoreOption}
            target={clickMoreOption.target}
          />
        );
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
          { drawerController(drawerContent) }
        </TransferDrawerWrapper>
      )}
    />
  );
};

export default Transfer2;
