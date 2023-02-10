import styled from 'styled-components';
import Layout from 'components/Layout';

const RegularBasicInformationWrapper = styled(Layout)`
  z-index: 1001;
  background: ${({ theme }) => theme.colors.basic.white};
  .description {
    padding: 0 1.6rem;
    font-size: 1.4rem;
    line-height: 2.1rem;
    margin-bottom: 2.4rem;
  }
  &.confirmWrapper {
    padding: 0;
  }
  .section {
    padding: 1.6rem;
  }
`;

export default RegularBasicInformationWrapper;
