import { Close } from '@material-ui/icons';
import { FEIBIconButton } from 'components/elements';
import theme from 'themes/theme';
import DrawerWrapper from './bottomDrawer.style';

/*
* ==================== BottomDrawer 組件說明 ====================
* BottomDrawer 組件封裝了 Material UI 的抽屜組件
* ==================== BottomDrawer 可傳參數 ====================
* 1. title -> 標題文字
* 2. className -> class 名稱
* 3. isOpen -> 根據此布林值判斷抽屜是否彈出 (true 開啟、false 關閉)
* 4. onClose -> 點擊抽屜背景遮罩時所觸發的事件 (通常點擊遮罩要關閉抽屜，建議傳入觸發抽屜關閉的事件)
* 5. content -> 顯示於抽屜之內容
* */

const BottomDrawer = ({
  title,
  className,
  isOpen,
  onClose,
  content,
}) => (
  <DrawerWrapper
    className={className}
    open={isOpen}
    onClose={onClose}
  >
    <div className="drawerTitle">
      <h3 className="title">{title}</h3>
      <FEIBIconButton
        className="closeButton"
        $fontSize={2}
        $iconColor={theme.colors.text.lightGray}
        onClick={onClose}
      >
        <Close />
      </FEIBIconButton>
    </div>
    <div className="content">
      {content}
    </div>
  </DrawerWrapper>
);

export default BottomDrawer;
