import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import Box from '@material-ui/core/Box';
import Layout from 'components/Layout/Layout';
import MemberList from './components/MemberList';
import PageWrapper from './MemberManagement.style';
import AddMemberButton from './components/AddMemberButton';
import { getAll } from './api';

export default () => {
  const history = useHistory();
  const location = useLocation();
  // 狀態設定
  const { state } = location;
  const [viewModel] = useState(state || {});
  const [memberListViewModel, setMemberListViewModel] = useState([]);
  // 初始設定
  const init = async () => {
    const resFromGetAll = await getAll({ inviting: viewModel.owner }); // itviting: true 包含邀請中的成員
    setMemberListViewModel(resFromGetAll || []);
    console.log('resFromGetAll', resFromGetAll);
  };
  useEffect(() => {
    init();
  }, []);

  const goBackFunc = () => {
    history.goBack();
  };

  // 點擊 - 新增成員
  const onAddMemberClick = () => {
    history.push('/MemberInvitation');
  };

  return (
    <Layout
      title={viewModel.owner ? '成員管理' : '成員'}
      goBackFunc={goBackFunc}
    >
      <PageWrapper>
        {viewModel.owner ? (
          <>
            <MemberList
              title="已加入"
              isLedgerOwner
              list={memberListViewModel.filter(
                (member) => member.memberInviteStatus === 3,
              )}
            />
            <MemberList
              title="待審核"
              isLedgerOwner
              list={memberListViewModel.filter(
                (member) => member.memberInviteStatus === 2,
              )}
            />
            <MemberList
              title="邀請中"
              isLedgerOwner
              list={memberListViewModel.filter(
                (member) => member.memberInviteStatus === 1,
              )}
            />
          </>
        ) : (
          <MemberList
            title="所有成員"
            isLedgerOwner={false}
            list={memberListViewModel.filter(
              (member) => member.memberInviteStatus === 3,
            )}
          />
        )}
        <Box display={viewModel.owner ? 'block' : 'none'} mx="auto" my={3}>
          <AddMemberButton callback={onAddMemberClick} />
        </Box>
      </PageWrapper>
    </Layout>
  );
};
