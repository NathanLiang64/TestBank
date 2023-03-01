import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.light};
  display: flex;
  flex-direction: column;
  padding: 0 20;

  // 使畫面可上下捲動
  height: 100vh;
  overflow: auto;

  .pageTitle {
    font-size: 2rem;
    padding: 1rem 0.8rem;
    color: ${({ theme }) => theme.colors.text.lightGray};
    border-bottom: 1px dashed ${({ theme }) => theme.colors.text.light};
  }
`;

export default PageWrapper;
