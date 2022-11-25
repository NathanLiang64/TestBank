/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import Avatar from 'components/Avatar';
import { DeleteIcon, EditIcon } from 'assets/images/icons';
import { toHalfWidth } from 'utilities/Generator';
import MemberAccountCardWrapper from './memberAccountCard.style';

/**
 * 包含了 Avatar 組合成一張會員帳號卡片
 * @param {*} hasNewTag 顯示NEW標籤
 * @param {*} memberId 會員UUID
 * @param {*} name 會員名稱
 * @param {*} bankNo 銀行代碼
 * @param {*} bankName 銀行名稱
 * @param {*} account 會員帳號
 * @param {*} noBorder 無框線
 * @param {*} isSelected 表示為已選取的狀態
 * @param {*} onClick 點擊會員帳號卡片事件 (選取時)
 * @param {*} moreActions [{
    type: edit | delete,
    lable: 按鈕標題,
    onClick: 點擊按鈕事件,
  }, ...]
 */
const MemberAccountCard = ({
  hasNewTag, memberId, name, bankNo, bankName, account, noBorder,
  isSelected, onClick, moreActions,
}) => {
  const wrapperRef = useRef(null);
  const [model, setModel] = useState({
    showMorePanel: false,
    startX: null,
    endX: null,
  });

  /**
   * 初始化
   */

  useEffect(() => {
    // 當使用者在元件之外 Click 或準備拖曳時，關閉已開啟的「更多Panel」
    const handleClickOutside = (event) => {
      if (!model.showMorePanel) return;
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setModel((prevModel) => ({...prevModel, showMorePanel: false}));
      }
    };

    // 為了自動關閉「更多Panel」，監聽 click 及 touchstart 事件。
    // document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
    // document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [model.showMorePanel]);

  /**
   * 處理手指拖曳結束時「更多功能」的開啟或關閉。
   */
  const handleTouchEnd = () => {
    if (!model.endX) return; // 只有點一下時, 不會有 TouchMove 事件，所以不會有值。
    let newModel = null;
    const offset = model.endX - model.startX;
    // 當手指向左滑動一小段距離時，顯示「更多功能」。
    // eslint-disable-next-line object-curly-newline
    if (offset > 10) newModel = { ...model, showMorePanel: false, startX: null, endX: null };
    // 當手指向右滑動時，則關閉「更多功能」。
    // eslint-disable-next-line object-curly-newline
    if (offset < -3) newModel = {...model, showMorePanel: true, startX: null, endX: null};

    // 強制更新畫面。
    if (newModel !== null) setModel(newModel);
  };

  /**
   * 顯示更多選項。
   * @param {*} actions 編輯、刪除 的事件處理。
   */
  const renderMoreActionMenu = (actions) => {
    if (!actions) return null;

    // 執行更多功能時，必需隱藏「更多功能」Panel
    const onActionClick = async (func) => {
      if (func) func();
      setModel((prevModel) => ({...prevModel, showMorePanel: false}));
    };

    return (
      <div className={`moreActionMenu ${model.showMorePanel ? 'show' : ''}`}>
        {
          actions?.map((action) => {
            const iconData = new Map([
              ['edit', { cssName: 'edit', icon: (<EditIcon />) }],
              ['delete', { cssName: 'remove', icon: (<DeleteIcon />) }],
            ]).get(action.type);
            return (
              <button type="button" key={action.type} className={iconData.cssName} onClick={() => onActionClick(action.onClick)}>
                {iconData.icon}
                <span>{action.lable}</span>
              </button>
            );
          })
        }
      </div>
    );
  };

  const handleTouchStart = (e) => {
    setModel((prevModel) => ({...prevModel, startX: e.targetTouches[0].pageX}));
  };
  const handleTouchMove = (e) => {
    setModel((prevModel) => ({...prevModel, endX: e.targetTouches[0].pageX}));
  };

  /**
   * 元件 HTML 輸出。
   */
  return (
    <MemberAccountCardWrapper
      ref={wrapperRef}
      $noBorder={noBorder}
      $selected={isSelected}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={model.showMorePanel ? null : onClick}
    >
      <Avatar small memberId={memberId} name={name} />
      <div className="memberInfo">
        <div className="flex-auto">
          <div className="title">
            {/* 後端目前會回傳全型文字，暫以此方法將文字轉為半形 */}
            {/* 後續需請後端修正回傳文字之格式 */}
            {toHalfWidth(name) || '會員'}
            {hasNewTag && (<div className="new-tag">New</div>)}
          </div>
          <div className="note">
            {`${bankName}(${bankNo}) ${account}`}
          </div>
        </div>
      </div>

      {/* 顯示更多選項（編輯、刪除 的事件處理）。 */}
      { renderMoreActionMenu(moreActions) }
    </MemberAccountCardWrapper>
  );
};

export default MemberAccountCard;
