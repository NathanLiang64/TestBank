import Layout from 'components/Layout/Layout';
import { InvitationList } from './components/InvitationList';
import PageWrapper from './MemberInvitation.style';

export default () => (
  <Layout title="邀請好友" goBackFunc={() => {}}>
    <PageWrapper>
      <InvitationList />
    </PageWrapper>
  </Layout>
);
