import { useHistory, useLocation } from 'react-router';
import Layout from 'components/Layout/Layout';
import MemberList from './components/MemberList';
import PageWrapper from './MemberManagement.style';

const CREATE_MOCK_DATA = (size = 3) => Array.from(Array(size), (i, id) => ({
  label: `好友名稱${id}`,
  callback: () => console.log(id),
}));

export default () => {
  const history = useHistory();
  const { state = {} } = useLocation();
  const { isHost = false } = state;

  const goBackFunc = () => {
    history.goBack();
  };
  return (
    <Layout title={isHost ? '成員管理' : '成員'} goBackFunc={goBackFunc}>
      <PageWrapper>
        {isHost ? (
          <>
            <MemberList title="已加入" list={CREATE_MOCK_DATA()} />
            <MemberList title="待審核" list={CREATE_MOCK_DATA()} />
            <MemberList title="邀請中" list={CREATE_MOCK_DATA()} />
          </>
        ) : (
          <MemberList title="所有成員" list={CREATE_MOCK_DATA()} />
        )}
      </PageWrapper>
    </Layout>
  );
};
