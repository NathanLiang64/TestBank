import styled from 'styled-components';
import Layout from 'components/Layout';

const LossReissueWrapper = styled(Layout)`
  .notice {
    margin-top: 0;
    
    p {
      text-align: left;
    }
  }
  
  .point {
    color: ${({ theme }) => theme.colors.text.point};
  }
`;

export default LossReissueWrapper;
