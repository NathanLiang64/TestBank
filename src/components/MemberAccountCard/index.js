import { useState, useEffect, useRef } from 'react';
import Avatar from 'components/Avatar';
import { DeleteIcon, EditIcon } from 'assets/images/icons';
import MemberAccountCardWrapper from './memberAccountCard.style';

/*
* ==================== MemberAccountCard 組件說明 ====================
* MemberAccountCard 組件包含了 Avatar 組合成一張會員帳號卡片
* ==================== MemberAccountCard 可傳參數 ====================
* 1. hasNewTag -> 顯示NEW標籤
* 2. name -> 會員名稱
* 3. bankNo -> 銀行代碼
* 4. bankName -> 銀行名稱
* 5. account -> 會員帳號
* 6. avatarSrc -> 會員頭像的圖片路徑
* 7. noBorder -> 無框線
* onClick -> 點擊會員帳號卡片事件 (選取時)
* moreActions: [{
  type: edit | delete,
  lable: 按鈕標題,
  onClick: 點擊按鈕事件,
}, ...]
* */

const MemberAccountCard = ({
  hasNewTag, name, bankNo, bankName, account, avatarSrc, noBorder,
  onClick, moreActions,
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
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setModel({...model, showMorePanel: false});
      }
    };

    // 為了自動關閉「更多Panel」，監聽 click 及 touchstart 事件。
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, []);

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
    if (offset < -3) newModel = { ...model, showMorePanel: true };

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
    const onActionClick = (func) => {
      setModel({ ...model, showMorePanel: false });
      if (func) func();
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

  /**
   * 元件 HTML 輸出。
   */
  return (
    <MemberAccountCardWrapper
      ref={wrapperRef}
      $noBorder={noBorder}
      onTouchStart={(e) => { model.startX = e.targetTouches[0].pageX; }}
      onTouchMove={(e) => { model.endX = e.targetTouches[0].pageX; }}
      onTouchEnd={handleTouchEnd}
      onClick={model.showMorePanel ? null : onClick}
    >
      <>
        <Avatar small src={avatarSrc} name={name} />
        <div className="memberInfo">
          <div className="flex-auto">
            <div className="title">
              {name || '會員'}
              {hasNewTag && (<div className="new-tag">New</div>)}
            </div>
            <div className="note">
              {`${bankName}(${bankNo}) ${account}`}
            </div>
          </div>
        </div>
      </>

      {/* 顯示更多選項（編輯、刪除 的事件處理）。 */}
      { renderMoreActionMenu(moreActions) }
    </MemberAccountCardWrapper>
  );
};

export default MemberAccountCard;
