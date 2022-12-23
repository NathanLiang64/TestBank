import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lightest};
  display: flex;
  flex-direction: column;
  padding-left: 0;
  padding-right: 0; 

  // 使畫面可上下捲動
  height: 100vh;
  overflow: auto;

  .panel {
    margin-bottom: 1.6rem;
  }
`;

export default PageWrapper;
