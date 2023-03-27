import { useHistory } from 'react-router';
import Layout from 'components/Layout/Layout';
import { Func } from 'utilities/FuncID';
import { InvitationList } from './components/InvitationList';
import PageWrapper from './MemberInvitation.style';

export default () => {
  const history = useHistory();
  return (
    <Layout title="邀請好友" fid={Func.C002} goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <InvitationList />
      </PageWrapper>
    </Layout>
  );
};
