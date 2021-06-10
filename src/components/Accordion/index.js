import { useState } from 'react';
/* eslint-disable */
import { AddRounded, RemoveRounded } from '@material-ui/icons';
import { FEIBCollapse, FEIBIconButton } from 'components/elements';
import AccordionWrapper from './accordion.style';
import theme from 'themes/theme';

/*
* ==================== Accordion 組件說明 ====================
* 注意事項
* ==================== Accordion 可傳參數 ====================
* 1. className -> 若需在某些頁面更動樣式，可加上 className 參數傳入 class 名稱
* 2. title -> 可傳入標題，若不傳入預設為 "注意事項"
* 3. space -> 此組件預設無 margin，可傳入 "top"、"bottom"、"both" 字串來產生固定高度的 margin
* 4. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字
* 5. open -> 傳入 open 參數則預設開啟狀態
* */

const Accordion = ({
  className, title, space, children, open,
}) => {
  const [show, setShow] = useState(open);

  const handleOpen = () => {
    setShow(!show);
  };

  return (
    <AccordionWrapper className={className} $space={space}>
      <div className={`title ${show ? 'open' : ''}`} onClick={handleOpen}>
        <h3>{title || '注意事項'}</h3>
        <FEIBIconButton $fontSize={2.4} $iconColor={theme.colors.primary.light}>
          { show ? <RemoveRounded /> : <AddRounded /> }
        </FEIBIconButton>
        {/*<ExpandMoreOutlined style={{ fontSize: '3.8rem', color: '#AC8CE8' }} />*/}
      </div>
      <FEIBCollapse in={show}>
        <div className="content">
          <div className="line" />
          {children}
        </div>
      </FEIBCollapse>
    </AccordionWrapper>
  );
};

export default Accordion;
