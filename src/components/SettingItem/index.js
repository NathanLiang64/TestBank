/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { CreateRounded, DeleteRounded } from '@material-ui/icons';
import SettingItemWrapper from './settingItem.style';
/*
* ==================== SettingItem 組件說明 ====================
* 新增各類設定選項
* ==================== SettingItem 可傳參數 ====================
* */

const SettingItem = ({
  mainLable,
  subLabel,
  editClick,
  deleteClick,
}) => {
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [showActions, setShowActions] = useState(false);

  const handleTouchStart = (event) => {
    setStartX(event.targetTouches[0].clientX);
  };

  const handleTouchMove = (event) => {
    setEndX(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const show = endX - startX < 0;
    setShowActions(show);
  };

  const renderMoreActionMenu = () => (
    <div className={`actionsContainer ${showActions && 'show'}`}>
      <div className="actionBtn edit" onClick={editClick}>
        <CreateRounded />
        <span>
          編輯
        </span>
      </div>
      <div className="actionBtn delete" onClick={deleteClick}>
        <DeleteRounded />
        <span>
          刪除
        </span>
      </div>
    </div>
  );

  return (
    <SettingItemWrapper
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mainLabel">{mainLable}</div>
      <div className="subLabel">{subLabel}</div>
      { renderMoreActionMenu() }
    </SettingItemWrapper>
  );
};

export default SettingItem;
