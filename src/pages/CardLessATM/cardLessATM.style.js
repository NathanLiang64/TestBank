import styled from 'styled-components';
import Layout from 'components/Layout';

const CardLessATMWrapper = styled(Layout)`
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
    color: ${({ theme }) => theme.colors.text.point};
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
