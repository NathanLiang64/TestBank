import styled from 'styled-components';
import Layout from 'components/Layout';

const DepositInquiryWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  overflow: hidden;
  
  .measuredHeight {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .debitCard {
    margin-bottom: .8rem;
  }

  .inquiryArea {
    left: -1.6rem;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    width: 100vw;
    background: ${({ theme }) => theme.colors.basic.white};
  }
  
  .transactionDetail {
    padding: 0 .4rem 13.3rem .4rem;
    overflow-y: auto;
  }

  .searchBar {
    display: flex;
    align-items: center;
    
    p {
      margin: 0 -.4rem;
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.primary.light};
    }

    .selectedKeywords {
      display: flex;
      align-items: center;
    }
  }
  
  .tabsArea {
    padding: 0 1.6rem;
  }
  
  .customPosition {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
`;

export default DepositInquiryWrapper;
