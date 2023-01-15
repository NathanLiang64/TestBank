import InformationTapeWrapper from './informationTape.style';

/*
* ==================== InformationTape 組件說明 ====================
* InformationTape 組件用於 2 欄的條列內容
* ==================== InformationTape 可傳參數 ====================
* 1. title -> 顯示左側之標題文字
* 2. content -> 顯示於右側內容文字，與標題同水平高度
* 3. remark -> 顯示於右側內容文字下方的備註文字
* 4. noShadow -> 卡片不帶陰影樣式
* 5. customHeader -> 若有特殊的 Header 想要顯示，可提供 customHeader 取代 img
* */

const InformationTape = ({
  img,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  onClick,
  noShadow,
  customHeader,
  className,
}) => {
  const renderContent = (content) => {
    if (typeof content === 'string') return content.trim();
    return content;
  };
  return (
    <InformationTapeWrapper
      className={className}
      onClick={onClick}
      $noShadow={noShadow}
    >
      {customHeader || (
        <img src={img} alt="" style={{ display: img ? 'block' : 'none' }} />
      )}
      <div className="dataContainer">
        <div className="top">
          <div className="left">{renderContent(topLeft)}</div>
          <div className="right">{renderContent(topRight)}</div>
        </div>
        <div className="bottom">
          <div className="left">{renderContent(bottomLeft)}</div>
          <div className="right">{renderContent(bottomRight)}</div>
        </div>
      </div>
    </InformationTapeWrapper>
  );
};

export default InformationTape;
