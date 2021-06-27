import styled from 'styled-components';
import Layout from 'components/Layout';

const LossReissueWrapper = styled(Layout)`
  form button[type=submit] {
    margin-top: 4rem;
    margin-bottom: 4rem;
  }
  
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
