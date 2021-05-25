import styled from 'styled-components';
import Layout from 'components/Layout';
// eslint-disable-next-line no-unused-vars
import { ArrowBack, ArrowForward } from '@material-ui/icons';

const DepositOverviewWrapper = styled(Layout)`
   background: ${({ theme }) => theme.colors.background.lightest};
  
  .infoPanel {
    display: flex;
    justify-content: space-between;
    padding: 0 .8rem;
    
    .panelItem {
      font-weight: bold;
      text-align: center;
      
      h3 {
        font-size: 1.5rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
      }
      
      p {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.colors.primary.light};
      }
    }
  }
  
  .transactionDetail {
    margin: 1.6rem 0;
  }
`;

export default DepositOverviewWrapper;
