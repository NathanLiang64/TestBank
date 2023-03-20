import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import Box from '@material-ui/core/Box';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import ResultAnimation from 'components/SuccessFailureAnimations/ResultAnimation';
import PageWrapper from './CreateLedgerSuccess.style';
import { getLedgerTypeName } from '../utils/lookUpTable';

export default () => {
  const history = useHistory();
  const location = useLocation();
  const { state } = location;
  // 狀態設定
  const [viewModel] = useState(state || {});
  // 欄位設定
  const CONFIG = [
    { id: 1, label: '帳本名稱', value: viewModel?.name },
    { id: 2, label: '暱稱', value: viewModel?.nickname },
    { id: 3, label: '類型', value: getLedgerTypeName(viewModel?.type) },
    {
      id: 4,
      label: '連結帳號',
      value: viewModel?.account !== 'new' ? viewModel?.account : '',
    },
    { id: 5, label: '與成員分享明細', value: viewModel?.isShare ? '是' : '否' },
  ];

  // 點擊 - 邀請好友
  const onInvitationClick = () => {
    history.push('/MemberInvitation');
  };

  // 點擊 - 進入帳本明細
  const onEnterLedgerDetailClick = () => {
    history.push('/LedgerDetail');
  };

  return (
    <Layout title="建立帳本" goBackFunc={() => history.push('/C00200')}>
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
