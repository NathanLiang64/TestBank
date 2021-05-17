import styled from 'styled-components';
import Layout from 'components/Layout';

const CardLessATM = styled(Layout)`
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between
  // grid-template-columns: repeat(3, 1fr);
}
.withdrawal-btn-container {
  margin-bottom: 1rem;
  .withdrawal-btn {
    width: 10rem;
  }
}
.withdrawal-info {
  margin: 1rem 0;
  span {
    color: red;
  }
}
`;

export default CardLessATM;
