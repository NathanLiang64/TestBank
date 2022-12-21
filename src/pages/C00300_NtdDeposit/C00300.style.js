import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lightest};
  display: flex;
  flex-direction: column;
  padding-left: 0;
  padding-right: 0; 

  // 使畫面可上下捲動
  height: 100vh;
  overflow: auto;

  .interestRatePanel {
    display: flex;
    justify-content: space-evenly;
    align-items: baseline;
    margin-bottom: 1.6rem;
    
    .panelItem {
      text-align: center;
      letter-spacing: .1rem;
      width: 30%;
      
      h3 {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 1.3rem;
        white-space: nowrap;
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
`;

export default PageWrapper;
