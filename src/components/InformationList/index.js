import InformationListWrapper from './informationList.style';

/*
* ==================== InformationList 組件說明 ====================
* InformationList 組件用於 2 欄的條列內容
* ==================== InformationList 可傳參數 ====================
* 1. title -> 顯示左側之標題文字
* 2. content -> 顯示於右側內容文字，與標題同水平高度
* 3. caption -> 顯示於左側內容文字下方的備註文字
* 4. remark -> 顯示於右側內容文字下方的備註文字
* 5. extra -> 顯示於右側內容文字之內
* 6. textColor -> content顏色： text-dark | text-primary
* */

const InformationList = ({
  title,
  content,
  caption,
  remark,
  extra,
  textColor = 'text-dark',
}) => (
  <InformationListWrapper>
    {/* 沒有 remark 時，將主要內容對齊下方 */}
    {!remark && (<div className="flex text-remark" />)}
    <div className="flex text-title">
      <div className="text-gray">{title}</div>
      <div className={textColor}>
        {content}
        {extra && <span className="text-green">{extra}</span>}
      </div>
    </div>
    {remark && (
      <div className="flex text-remark">
        <div className="text-light">{caption}</div>
        <div className="text-light">{remark}</div>
      </div>
    )}
  </InformationListWrapper>
);

export default InformationList;
