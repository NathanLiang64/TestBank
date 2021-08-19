/* eslint-disable */
import { useState } from 'react';
import * as yup from 'yup';
import { CreateRounded, DeleteRounded } from '@material-ui/icons';
import Avatar from 'components/Avatar';
import { bankAccountValidation, bankCodeValidation, nicknameValidation } from 'utilities/validation';
import MemberAccountCardWrapper from './memberAccountCard.style';
import BankCodeInput from '../BankCodeInput';
import { FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel } from '../elements';
import { Controller } from 'react-hook-form';

/*
* ==================== MemberAccountCard 組件說明 ====================
* MemberAccountCard 組件包含了 Avatar 組合成一張會員帳號卡片
* ==================== MemberAccountCard 可傳參數 ====================
* 1. listType -> 列表卡片型態
*    列表卡片擁有列表的樣式，可滑動顯示編輯卡片，且沒有右側 icon
* 2. transferType -> 轉帳型態 (常用或預約)
* 3. name -> 會員名稱
* 4. avatarSrc -> 會員頭像的圖片路徑
* 5. bankNo -> 銀行代碼
* 6. bankName -> 銀行名稱
* 7. account -> 會員帳號
* */

const MemberAccountCard = ({
  type,
  name,
  bankNo,
  bankName,
  account,
  avatarSrc,
  noBorder,
  setClickMoreOption,
}) => {
  const schema = yup.object().shape({
    memberAccountCardBankCode: bankCodeValidation(),
    bankAccount: bankAccountValidation(),
    nickname: nicknameValidation(),
  });

  const [moreAction, setMoreAction] = useState({
    isMoreActionOpen: false,
    startX: 0,
    endX: 0,
  });

  const handleClickEdit = () => {
    setClickMoreOption({ click: true, button: 'edit', target: account });
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

  const handleTouchEnd = () => {
    // console.info('result-startX', moreAction.startX);
    // console.info('result-endX', moreAction.endX);

    if ((moreAction.startX > moreAction.endX) && (moreAction.startX - moreAction.endX > 20)) {
      setMoreAction({ ...moreAction, isMoreActionOpen: true });
    } else {
      setMoreAction({ ...moreAction, isMoreActionOpen: false });
    }
  };

  // 更多選項 (編輯、刪除)
  const renderMoreActionMenu = () => (
    <div className={`moreActionMenu ${moreAction.isMoreActionOpen ? 'show' : ''}`}>
      <button type="button" className="edit" onClick={handleClickEdit}>
        <CreateRounded />
        <span>編輯</span>
      </button>
      {/* 常用帳號才有刪除選項 */}
      { type === '常用帳號' && (
        <button type="button" className="remove">
          <DeleteRounded />
          <span>刪除</span>
        </button>
      ) }
    </div>
  );

  return (
    <MemberAccountCardWrapper
      $noBorder={noBorder}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Avatar small src={avatarSrc} name={name} />
      <div className="memberInfo">
        <h3>{name || '會員'}</h3>
        <p>{`${bankName}(${bankNo}) ${account}`}</p>
      </div>
      { renderMoreActionMenu() }
    </MemberAccountCardWrapper>
  );
};

export default MemberAccountCard;
