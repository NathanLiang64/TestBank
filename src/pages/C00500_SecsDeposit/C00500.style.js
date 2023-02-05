import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lightest};
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 0;
  padding-right: 0; 

  .panel {
    margin-bottom: 1.6rem;
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
`;

export default PageWrapper;
