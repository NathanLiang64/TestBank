import styled from 'styled-components';
import Layout from 'components/Layout';

const ProvisioningWrapper = styled(Layout)`
  z-index: 1001;
  height: 100%;
  background: ${({ theme }) => theme.colors.basic.white};
  .tip {
    text-align: center;
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: 400;
  }
  .dealContent {
    text-align: justify;
  }
`;

export default ProvisioningWrapper;
