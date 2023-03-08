import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lightest};
  display: flex;
  flex-direction: column;
  padding: 0 20;

  // 使畫面可上下捲動
  height: 100vh;
  overflow: auto;
`;

export default PageWrapper;
