import styled from 'styled-components';
import Layout from 'components/Layout';

const DepositOverviewWrapper = styled(Layout)`
   background: ${({ theme }) => theme.colors.background.lightest};
  
  .measuredHeight {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .debitCard {
    margin-bottom: 1.6rem;
  }
  
  .infoPanel {
    display: flex;
    justify-content: space-between;
    padding: 0 .8rem;
    
    .panelItem {
      text-align: center;
      letter-spacing: .1rem;
      
      h3 {
        font-size: 1.4rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
      }
      
      p {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        color: ${({ theme }) => theme.colors.primary.light};
      }
    }
  }
  
  .transactionDetail {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-grow: 1;
    margin: 1.6rem 0;

    .moreButton {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin-top: .4rem;
      font-size: 1.4rem;
      letter-spacing: .1rem;
      
      .MuiSvgIcon-root {
        margin-left: .2rem;
        font-size: 1.4rem;
      }
    }
  }
`;

export default DepositOverviewWrapper;
