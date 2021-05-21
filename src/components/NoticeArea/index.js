import NoticeAreaWrapper from './noticeArea.style';

/*
* ==================== NoticeArea 組件說明 ====================
* 注意事項
* ==================== NoticeArea 可傳參數 ====================
* 1. className -> 若需在某些頁面更動樣式，可加上 className 參數傳入 class 名稱
* 2. title -> 可傳入標題，若不傳入預設為 "注意事項"
* 3. noSpace -> 上下無留白，放置於 Dialog 內適用
* 4. textAlign -> 接收的值同 text-align 可用的所有值，預設為 "center"
* 5. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字
* */

const NoticeArea = ({
  className, title, textAlign, children, noSpace,
}) => (
  <NoticeAreaWrapper className={className} $textAlign={textAlign} $noSpace={noSpace}>
    <h3>{title || '注意事項'}</h3>
    <div>
      {children}
    </div>
  </NoticeAreaWrapper>
);

export default NoticeArea;
