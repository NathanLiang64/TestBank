import { useState } from 'react';
import {
  AccountCircleRounded, AddRounded, CreateRounded, DeleteRounded,
} from '@material-ui/icons';
import Avatar from 'components/Avatar';
import BottomDrawer from 'components/BottomDrawer';
import { FEIBIconButton } from 'components/elements';
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
  };

  const handleClickCloseDrawer = () => {
    setOpenDrawer(false);
    setActionText('');
  };

  const renderMemberDrawerContent = () => (
    <MemberDrawerContentWrapper>
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
    </MemberDrawerContentWrapper>
  );

  const renderChangeMemberButton = () => (
    <div className="changeMemberButton" onClick={handleClickSwitchMemberDrawer}>
      <FEIBIconButton $iconColor={theme.colors.primary.light} $fontSize={2.4}>
        <AccountCircleRounded />
      </FEIBIconButton>
    </div>
  );

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
        content={renderMemberDrawerContent()}
      />
    </>
  );
};

export default MemberAccountCard;
