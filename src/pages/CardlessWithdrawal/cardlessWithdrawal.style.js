import styled from 'styled-components';
import Layout from 'components/Layout';

const CardlessWithdrawal = styled(Layout)`
.tip {
  text-align: center;
  margin: 1rem 0;
}
.account-info {
  text-align: center;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary.light};
  margin-bottom: 1rem;
  h1 {
    font-size: 2rem;
    margin: 1rem 0;
    color: ${({ theme }) => theme.colors.basic.white};
  }
}
.money-buttons-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.withdrawal-btn-container {
  // padding: 1rem;
  .withdrawal-btn {
    min-width: unset;
  }
}
`;

export default CardlessWithdrawal;
