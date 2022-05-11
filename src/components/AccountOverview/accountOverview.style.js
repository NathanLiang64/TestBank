import styled from 'styled-components';
import Layout from 'components/Layout';

const AccountOverviewWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lightest};
  display: flex;
  flex-direction: column;
  height: 100%;
  
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
  
  .interestRatePanel {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1.6rem;
    
    .panelItem {
      text-align: center;
      letter-spacing: .1rem;
      width: 100%;
      
      h3 {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
        
        .Icon {
          top: -.2rem;
          font-size: 1.6rem;
          
          &.switchIcon {
            margin-left: .2rem;
          }
        }
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
    margin-bottom: 1.6rem;

    .moreButton {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin-top: .4rem;
      font-size: 1.4rem;
      letter-spacing: .1rem;
      
      .Icon {
        top: -.2rem;
        margin-left: .2rem;
        font-size: 1.6rem;
      }
    }
  }
`;

export default AccountOverviewWrapper;
