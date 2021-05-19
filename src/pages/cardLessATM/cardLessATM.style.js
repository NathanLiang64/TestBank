import styled from 'styled-components';
import Layout from 'components/Layout';

const CardLessATMWrapper = styled(Layout)`
.noticeTopFixed {
  transform: translateY(-2.4rem);
}
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
.accountInfo {
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
.amountButtonsContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between
  // grid-template-columns: repeat(3, 1fr);
}
.withdrawalBtnContainer {
  margin-bottom: 1rem;
  .withdrawal-btn {
    width: 10rem;
  }
}
.withdrawalInfo {
  margin: 1.8rem 0;
  span {
    color: red;
  }
}
.resultTable {
  table {
    width: 100%;
    tr {
      td {
        &:first-child {
          text-align: center;
          width: 30%;
        }
      }
    }
  }
  &.withdraw {
    table {
      tr {
        td:last-child {
          font-weight: bold;
        }
      }
    }
  }
}
`;

export default CardLessATMWrapper;
