import styled from 'styled-components';
import Layout from 'components/Layout';

const CardLessATM = styled(Layout)`
.tip {
  text-align: center;
  margin: 1.8rem 0;
  font-size: 1.6rem;
  font-weight: bold;
  span {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary.brand};
  }
}
.account-info {
  text-align: center;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary.dark};
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
  margin: 1.8rem 0;
  span {
    color: red;
  }
}
.result-table {
  table {
    border-left: 1px solid ${({ theme }) => theme.colors.border.light};
    border-top: 1px solid ${({ theme }) => theme.colors.border.light};
    border-right: 1px solid ${({ theme }) => theme.colors.border.light};
    width: 100%;
    tr {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
      td {
        padding: .8rem;
        &:first-child {
          font-weight: bold;
          text-align: center;
          width: 30%;
          border-right: 1px solid ${({ theme }) => theme.colors.border.light};
        }
      }
    }
  }
  &.withdraw {
    table {
      tr {
        td:last-child {
          font-weight: bold;
          color: ${({ theme }) => theme.colors.primary.dark};
        }
      }
    }
  }
}
`;

export default CardLessATM;
