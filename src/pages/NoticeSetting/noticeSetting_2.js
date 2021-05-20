/* Elements */
import NoticeArea from 'components/NoticeArea';
import { FEIBButton } from 'components/elements';
import { useHistory } from 'react-router';

/* Styles */
// import theme from 'themes/theme';
import NoticeSettingWrapper from './noticeSetting.style';

const noticeSetting2 = () => {
  const history = useHistory();

  const toSettingPage = () => {
    history.push('/noticeSetting1');
  };

  return (
    <NoticeSettingWrapper>
      <NoticeArea title="設定成功">
        <p>
          您的訊息通知設定啟用成功囉 !!
        </p>
        <p>
          (實際文案待Final確認)
        </p>
      </NoticeArea>
      <FEIBButton onClick={toSettingPage}>
        確認完成
      </FEIBButton>
    </NoticeSettingWrapper>
  );
};

export default noticeSetting2;
