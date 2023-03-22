import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.white};
  display: flex;
  flex-direction: column;
  padding: 0 20;

  // 使畫面可上下捲動
  overflow: auto;

  .formFileds {
    display: grid;
    grid-gap: 1.6rem;
  }
`;

export default PageWrapper;
