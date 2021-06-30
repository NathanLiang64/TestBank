import InformationListWrapper from './informationList.style';

/*
* ==================== InformationList 組件說明 ====================
* InformationList 組件用於 2 欄的條列內容
* ==================== InformationList 可傳參數 ====================
* 1. title -> 顯示左側之標題文字
* 2. content -> 顯示於右側內容文字，與標題同水平高度
* 3. remark -> 顯示於右側內容文字下方的備註文字
* */

const InformationList = ({
  title,
  content,
  remark,
}) => (
  <InformationListWrapper>
    <p className="title">{title}</p>
    <div>
      <p className="content">{content}</p>
      <span className="remark">{remark}</span>
    </div>
  </InformationListWrapper>
);

export default InformationList;
