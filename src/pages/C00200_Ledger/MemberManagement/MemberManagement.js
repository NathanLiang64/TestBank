import { useHistory, useLocation } from 'react-router';
import Box from '@material-ui/core/Box';
import Layout from 'components/Layout/Layout';
import MemberList from './components/MemberList';
import PageWrapper from './MemberManagement.style';
import AddMemberButton from './components/AddMemberButton';

const CREATE_MOCK_DATA = (size = 3, showDeleteIcon = true) => Array.from(Array(size), (i, id) => ({
  label: `好友名稱${id}`,
  callback: () => console.log(id),
  showDeleteIcon,
}));

export default () => {
  const history = useHistory();
  const { state = {} } = useLocation();
  const { isHost = true } = state;

  const goBackFunc = () => {
    history.goBack();
  };

  // 點擊 - 新增成員
  const onAddMemberClick = () => {
    history.push('/MemberInvitation');
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
          <MemberList
            title="所有成員"
            list={CREATE_MOCK_DATA(undefined, false)}
          />
        )}
        <Box display={isHost ? 'block' : 'none'} mx="auto" my={3}>
          <AddMemberButton callback={onAddMemberClick} />
        </Box>
      </PageWrapper>
    </Layout>
  );
};
