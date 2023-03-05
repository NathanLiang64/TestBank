import Box from '@material-ui/core/Box';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import ResultAnimation from 'components/SuccessFailureAnimations/ResultAnimation';
import PageWrapper from './CreateLedgerSuccess.style';

export default () => {
  const CONFIG = [
    { id: 1, label: '帳本名稱', value: '' },
    { id: 2, label: '暱稱', value: '' },
    { id: 3, label: '類型', value: '' },
    { id: 4, label: '連結帳號', value: '' },
    { id: 5, label: '與成員分享明細', value: '' },
  ];

  // 點擊 - 邀請好友
  const onInvitationClick = () => {
    console.log('邀請好友');
  };

  // 點擊 - 進入帳本明細
  const onEnterLedgerDetailClick = () => {
    console.log('進入帳本明細');
  };

  return (
    <Layout title="建立帳本" goBackFunc={() => {}}>
      <PageWrapper>
        <ResultAnimation isSuccess subject="設定完成" />
        {CONFIG.map((item) => (
          <InformationList
            key={item.id}
            title={item.label}
            content={item.value}
          />
        ))}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Box width="49%" onClick={onInvitationClick}>
            <FEIBButton>邀請好友</FEIBButton>
          </Box>
          <Box width="49%" onClick={onEnterLedgerDetailClick}>
            <FEIBButton>進入帳本明細</FEIBButton>
          </Box>
        </Box>
      </PageWrapper>
    </Layout>
  );
};
