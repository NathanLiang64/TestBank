import styled from 'styled-components';
import Layout from 'components/Layout';

const DepositOverviewWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lightest};
  display: flex;
  flex-direction: column;
  
  .userCardArea {
    ${({ $multipleCardsStyle }) => $multipleCardsStyle && (`
      left: -1.6rem;
      width: 100vw;
    `)}

    .swiper-container {
      padding-bottom: 1.6rem;
    }

    .swiper-pagination {
      left: -.8rem;
    }
  }
  
  .infoPanel {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    
    .panelItem {
      text-align: center;
      letter-spacing: .1rem;
      width: 100%;
      
      h3 {
        font-size: 1.4rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
        
        // sync icon
        .MuiSvgIcon-root {
          top: .3rem;
          font-size: 1.8rem;
          color: ${({ theme }) => theme.colors.primary.light};
        }
      }
      
      p {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        color: ${({ theme }) => theme.colors.primary.light};
      }
      
      &.customPosition {
        margin-top: -.3rem;
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
