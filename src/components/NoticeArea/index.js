import NoticeAreaWrapper from './notice.style';

const NoticeArea = ({ title, children, textAlign }) => (
  <NoticeAreaWrapper $textAlign={textAlign}>
    <h3>{title || '注意事項'}</h3>
    <div>
      {children}
    </div>
  </NoticeAreaWrapper>
);

export default NoticeArea;
