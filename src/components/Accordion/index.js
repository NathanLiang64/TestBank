import { useState } from 'react';
import { FEIBCollapse } from 'components/elements';
import { ExpandMoreOutlined } from '@material-ui/icons';
import AccordionWrapper from './accordion.style';

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
      <button type="button" className={show ? 'open' : ''} onClick={handleOpen}>
        <h3>{title || '注意事項'}</h3>
        <ExpandMoreOutlined style={{ fontSize: '3.8rem', color: '#AC8CE8' }} />
      </button>
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
