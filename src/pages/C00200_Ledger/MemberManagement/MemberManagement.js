import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import Box from '@material-ui/core/Box';
import Layout from 'components/Layout/Layout';
import { Func } from 'utilities/FuncID';
import MemberList from './components/MemberList';
import PageWrapper from './MemberManagement.style';
import AddMemberButton from './components/AddMemberButton';
import { getAll } from './api';
// import { getAll } from './constants/mockData';

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
    <Layout title={viewModel.owner ? '成員管理' : '成員'} fid={Func.C002} goBackFunc={goBackFunc}>
      <PageWrapper>
        {viewModel.owner ? (
          <>
            <MemberList
              title="已加入"
              listType={3}
              isLedgerOwner
              list={memberListViewModel}
              setList={setMemberListViewModel}
            />
            <MemberList
              title="待審核"
              listType={2}
              isLedgerOwner
              list={memberListViewModel}
              setList={setMemberListViewModel}
            />
            <MemberList
              title="邀請中"
              listType={1}
              isLedgerOwner
              list={memberListViewModel}
              setList={setMemberListViewModel}
            />
          </>
        ) : (
          <MemberList
            title="所有成員"
            listType={3}
            isLedgerOwner={false}
            list={memberListViewModel}
            setList={setMemberListViewModel}
          />
        )}
        <Box display={viewModel.owner ? 'block' : 'none'} mx="auto" my={3}>
          <AddMemberButton callback={onAddMemberClick} />
        </Box>
      </PageWrapper>
    </Layout>
  );
};
