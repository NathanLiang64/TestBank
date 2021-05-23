import { useEffect, useState } from 'react';

/* Styles */
// import theme from 'themes/theme';
import NoticeWrapper from './notice.style';

const Notice1 = ({ location }) => {
  const [noticeContent, setNoticeContent] = useState({});
  useEffect(() => {
    setNoticeContent(location.state.data);
  }, []);

  return (
    <NoticeWrapper className="contentWrapper">
      <p className="noticeTitle">信用卡消費 39 元通知</p>
      <p className="dateStr">{ noticeContent.date }</p>
      <p>卡別：eTag聯名卡</p>
      <p>卡號：末 4 碼 5566（正卡）</p>
      <p>
        授權時間：
        { noticeContent.date }
      </p>
      <p>消費金額：39 元</p>
      <p>授權碼：385601</p>
      <p>商店名稱：xxx停車場</p>
      <p className="reminder">提醒您～</p>
    </NoticeWrapper>
  );
};

export default Notice1;
