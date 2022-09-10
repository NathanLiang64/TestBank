import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lightest};
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 0;
  padding-right: 0; 
`;

export default PageWrapper;
