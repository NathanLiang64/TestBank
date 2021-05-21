import { useCheckLocation, usePageInfo } from 'hooks';

/* Styles */
// import theme from 'themes/theme';
import NoticeWrapper from './notice.style';

const Notice = () => {
  const title = 'notice';

  useCheckLocation();
  usePageInfo('/api/notice');

  return (
    <NoticeWrapper>
      <div>
        {title}
      </div>
    </NoticeWrapper>
  );
};

export default Notice;
