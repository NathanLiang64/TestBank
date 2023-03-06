import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.light};
  display: flex;
  flex-direction: column;
  padding: 0 20;

  .form{
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;

    margin-top: 2rem;
  }
`;

export default PageWrapper;
