import { useState } from 'react';
import {
  AccountCircleRounded, AddRounded, CreateRounded, DeleteRounded,
} from '@material-ui/icons';
import Avatar from 'components/Avatar';
import BottomDrawer from 'components/BottomDrawer';
import BankCodeInput from 'components/BankCodeInput';
import {
  FEIBErrorMessage, FEIBIconButton, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import theme from 'themes/theme';
import MemberAccountCardWrapper, { MemberDrawerContentWrapper } from './memberAccountCard.style';

/*
* ==================== MemberAccountCard 組件說明 ====================
* MemberAccountCard 組件包含了 Avatar 組合成一張會員帳號卡片
* ==================== MemberAccountCard 可傳參數 ====================
* 1. listType -> 列表卡片型態
*    列表卡片擁有列表的樣式，可滑動顯示編輯卡片，且沒有右側 icon
* 2. name -> 會員名稱
* 3. avatarSrc -> 會員頭像的圖片路徑
* 4. branchCode -> 銀行代碼
* 5. branchName -> 銀行名稱
* 6. account -> 會員帳號
* 7. onClick -> 點擊事件
* */

const MemberAccountCard = ({
  listType,
  name,
  avatarSrc,
  branchCode,
  branchName,
  account,
  // onClick,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [actionText, setActionText] = useState('');
  const [renderContent, setRenderContent] = useState('default');
  const [moreAction, setMoreAction] = useState({
    isMoreActionOpen: false,
    startX: 0,
    endX: 0,
  });

  const handleClickSwitchMemberDrawer = () => {
    setOpenDrawer(true);
  };

  const handleClickAddMemberButton = () => {
    setActionText('新增');
    setRenderContent('addFrequentlyUsedAccount');
  };

  const handleClickCloseDrawer = () => {
    setOpenDrawer(false);
    setActionText('');
    setRenderContent('default');
  };

  const handleTouchStart = (event) => {
    const touch = event.targetTouches[0];
    setMoreAction({ ...moreAction, startX: touch.pageX });
    // console.info('start', moreAction.startX);
  };

  const handleTouchMove = (event) => {
    const touch = event.targetTouches[0];
    setMoreAction({ ...moreAction, endX: touch.pageX });
    // console.info('end', moreAction.endX);
  };

  // eslint-disable-next-line no-unused-vars
  const handleTouchEnd = () => {
    // console.info('result-startX', moreAction.startX);
    // console.info('result-endX', moreAction.endX);

    if ((moreAction.startX > moreAction.endX) && (moreAction.startX - moreAction.endX > 20)) {
      setMoreAction({ ...moreAction, isMoreActionOpen: true });
    } else {
      setMoreAction({ ...moreAction, isMoreActionOpen: false });
    }
  };

  // 預設的會員帳號頁面 (常用轉帳、約定轉帳)
  const defaultMemberAccountContent = () => (
    <>
      <div className="addMemberButtonArea" onClick={handleClickAddMemberButton}>
        <div className="addMemberButtonIcon">
          <AddRounded />
        </div>
        <span className="addMemberButtonText">新增常用帳號</span>
      </div>
      <div className="members">
        <MemberAccountCard
          listType
          name="Robert Fox"
          branchName="遠東商銀"
          branchCode="805"
          account="043000990000"
        />
        <MemberAccountCard
          listType
          name="Jermey123"
          branchName="遠東商銀"
          branchCode="805"
          account="043000990000"
        />
      </div>
    </>
  );

  // 新增常用帳號頁面
  const addFrequentlyUsedAccountContent = () => (
    <>
      <div>
        <BankCodeInput />
      </div>
      <div>
        <FEIBInputLabel>帳號</FEIBInputLabel>
        <FEIBInput type="number" placeholder="請輸入" />
        <FEIBErrorMessage>請輸入銀行帳號</FEIBErrorMessage>
      </div>
    </>
  );

  // 變更選取的會員按鈕
  const renderChangeMemberButton = () => (
    <div className="changeMemberButton" onClick={handleClickSwitchMemberDrawer}>
      <FEIBIconButton $iconColor={theme.colors.primary.light} $fontSize={2.4}>
        <AccountCircleRounded />
      </FEIBIconButton>
    </div>
  );

  // 更多選項 (編輯、刪除)
  const renderMoreActionMenu = () => (
    <div className={`moreActionMenu ${moreAction.isMoreActionOpen ? 'show' : ''}`}>
      <button type="button">
        <CreateRounded />
        <span>編輯</span>
      </button>
      <button type="button">
        <DeleteRounded />
        <span>刪除</span>
      </button>
    </div>
  );

  // 由 renderController 控制要顯示哪個頁面
  const renderController = (content) => {
    switch (content) {
      case 'default':
        return defaultMemberAccountContent();
      case 'addFrequentlyUsedAccount':
        return addFrequentlyUsedAccountContent();
      default:
        return defaultMemberAccountContent();
    }
  };

  return (
    <>
      <MemberAccountCardWrapper
        $listType={listType}
        onTouchStart={listType && handleTouchStart}
        onTouchMove={listType && handleTouchMove}
        onTouchEnd={listType && handleTouchEnd}
      >
        <Avatar small src={avatarSrc} name={name} />
        <div className="memberInfo">
          <h3>{name || '會員'}</h3>
          <p>{`${branchName}(${branchCode}) ${account}`}</p>
        </div>
        { listType ? renderMoreActionMenu() : renderChangeMemberButton() }
      </MemberAccountCardWrapper>
      <BottomDrawer
        title={`${actionText}常用帳號`}
        isOpen={openDrawer}
        onClose={handleClickCloseDrawer}
        content={(
          <MemberDrawerContentWrapper>
            { renderController(renderContent) }
          </MemberDrawerContentWrapper>
        )}
      />
    </>
  );
};

export default MemberAccountCard;
