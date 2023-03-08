import { useHistory } from 'react-router';
import Layout from 'components/Layout/Layout';
import ManagedPaper from './components/ManagedPaper';
import PageWrapper from './LedgerManagement.style';

export default () => {
  const history = useHistory();
  return (
    <Layout title="帳本管理" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <ManagedPaper />
      </PageWrapper>
    </Layout>
  );
};
