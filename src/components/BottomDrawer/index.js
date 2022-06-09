import { FEIBIconButton } from 'components/elements';
import { ArrowBackIcon, CrossIcon } from 'assets/images/icons';
import store from 'stores/store';
import { setDrawerVisible } from 'stores/reducers/ModalReducer';
import DrawerWrapper from './bottomDrawer.style';

/*
* ==================== BottomDrawer 組件說明 ====================
* BottomDrawer 組件封裝了 Material UI 的抽屜組件
* ==================== BottomDrawer 可傳參數 ====================
* 1. className -> class 名稱
* 2. title -> 標題文字
* 3. content -> 顯示於抽屜之內容
* 4. noScrollable -> 當內容高度超過 Drawer 高度仍不可滾動
* 5. isOpen -> 根據此布林值判斷抽屜是否彈出 (true 開啟、false 關閉)
* 6. onClose -> 點擊抽屜背景遮罩時所觸發的事件 (通常點擊遮罩要關閉抽屜，建議傳入觸發抽屜關閉的事件)
* 7. onBack -> 若需要在 Drawer 中控制上一頁，直接傳入事件即可
* */

const BottomDrawer = ({
  className,
  title,
  content,
  noScrollable,
  isOpen,
  onClose,
  onBack,
}) => {
  const renderBackButton = (clickEvent) => (
    <FEIBIconButton
      className="backButton"
      $fontSize={1.6}
      onClick={clickEvent}
    >
      <ArrowBackIcon />
    </FEIBIconButton>
  );

  const handleClickBubble = () => {
    store.dispatch(setDrawerVisible(false));
  };

  return (
    <DrawerWrapper
      className={className}
      open={isOpen}
      onClose={onClose}
      $contentNoScrollable={noScrollable}
    >
      <div className="drawerTitle">
        { !!onBack && renderBackButton(onBack) }
        <h3 className="title">{title}</h3>
        <FEIBIconButton
          className="closeButton"
          onClick={onClose}
        >
          <CrossIcon />
        </FEIBIconButton>
      </div>
      <div className="content" onClick={handleClickBubble}>
        {content}
      </div>
    </DrawerWrapper>
  );
};

export default BottomDrawer;
