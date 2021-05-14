import styled from 'styled-components';
import Layout from 'components/Layout';

const AccountMaintenanceWrapper = styled(Layout)`
  
  .cards {
    padding: 1.6rem 0;
  }
  
  .card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2rem;
    padding: 1.2rem 1.6rem;
    border: .1rem solid ${({ theme }) => theme.colors.border.lighter};
    border-radius: .8rem;
    background: ${({ theme }) => theme.colors.basic.white};
    
    .cardInfo {
      display: flex;
      flex-direction: column;
      
      .title {
        display: flex;
        align-items: center;
      }
      
      .name {
        margin-right: 1.2rem;
        font-size: 2rem;
        font-weight: bold;
      }
      
      .account {
        margin-top: .4rem;
        font-size: 1.4rem;
        color: ${({ theme }) => theme.colors.text.light};
      }
    }
    
    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: .8rem;
    }
  }
`;

export default AccountMaintenanceWrapper;
