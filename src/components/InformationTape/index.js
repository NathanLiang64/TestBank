import InformationTapeWrapper from './informationTape.style';

/*
* ==================== InformationTape 組件說明 ====================
* InformationTape 組件用於 2 欄的條列內容
* ==================== InformationTape 可傳參數 ====================
* 1. title -> 顯示左側之標題文字
* 2. content -> 顯示於右側內容文字，與標題同水平高度
* 3. remark -> 顯示於右側內容文字下方的備註文字
* 4. noShadow -> 卡片不帶陰影樣式
* */

const InformationTape = ({
  img,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  onClick,
  noShadow,
}) => (
  <InformationTapeWrapper onClick={onClick} $noShadow={noShadow}>
    <img src={img} alt="" style={{ display: img ? 'block' : 'none' }} />
    <div className="dataContainer">
      <div className="top">
        <div className="left">{ topLeft?.trim() }</div>
        <div className="right">{ topRight?.trim() }</div>
      </div>
      <div className="bottom">
        <div className="left">{ bottomLeft?.trim() }</div>
        <div className="right">{ bottomRight }</div>
      </div>
    </div>
  </InformationTapeWrapper>
);

export default InformationTape;
