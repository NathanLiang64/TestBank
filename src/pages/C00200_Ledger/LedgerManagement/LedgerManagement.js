import Layout from 'components/Layout/Layout';
import ManagedPaper from './components/ManagedPaper';
import PageWrapper from './LedgerManagement.style';

export default () => (
  <Layout title="帳本管理" goBackFunc={() => {}}>
    <PageWrapper>
      <ManagedPaper />
    </PageWrapper>
  </Layout>
);
