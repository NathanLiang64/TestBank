import { useState } from 'react';
import DeleteIcon from 'assets/images/icons/deleteIcon.svg';

const MessageItem = ({ item, deleteClick, readClick }) => {
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

  return (
    <div
      className={`notifyItem ${item?.status === 'R' ? '' : 'newMsg'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={readClick}
    >
      <section>
        <div className="notifyTitle">{ window.atob(item?.msgOutline) }</div>
        <div className="notifyTime">{ item?.sendTime }</div>
      </section>
      <section className="notifyContent">
        { window.atob(item.msgContent) }
      </section>
      <div
        className={`deleteBtn ${showActions ? '' : 'hide'}`}
        onClick={deleteClick}
      >
        <img src={DeleteIcon} alt="" />
        刪除
      </div>
    </div>
  );
};

export default MessageItem;
