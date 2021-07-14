import styled from 'styled-components';
import Layout from 'components/Layout';

const CardLessATMWrapper = styled(Layout)`
.checkBoxContainer {
  margin-bottom: 1rem;
}
.tip {
  text-align: center;
  margin: 1.8rem 0;
  font-size: 1.6rem;
  span {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary.light};
  }
}
.amountButtonsContainer {
  margin: 0 0 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .withdrawalBtnContainer {
    margin-bottom: 1rem;
    .customSize {
      min-height: unset;
      padding-left: 1.2rem;
      padding-right: 1.2rem;
      padding-bottom: .1rem;
      width: unset;
      height: 2.8rem;
      font-size: 1.4rem;
    }
    .withdrawal-btn {
      width: 10rem;
    }
  }
}
.withdrawalInfo {
  margin: 1.8rem 0;
  color: ${({ theme }) => theme.colors.text.darkGray};
  span {
    color: ${({ theme }) => theme.colors.text.point};
  }
}
.withdrawTimesInfo {
  font-size: 1.4rem;
}
.toChangePwd {
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  svg {
    margin-left: 0.5rem;
    font-size: 1.9rem;
  }
}
.amountInfo {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  border-radius: .8rem;
  svg {
    font-size: 5rem;
    color: ${({ theme }) => theme.colors.primary.light};
    margin: 1rem 0;
  }
  .label {
    color: ${({ theme }) => theme.colors.text.darkGray};;
  }
  .amount {
    margin-top: 1rem;
    color: ${({ theme }) => theme.colors.primary.light};
    font-size: 3rem;
  }
  .countDown {
    color: ${({ theme }) => theme.colors.primary.light};
  }
}
.resultTable {
  table {
    width: 100%;
    tr {
      td {
        color: ${({ theme }) => theme.colors.text.darkGray};;
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
          color: ${({ theme }) => theme.colors.primary.light};
        }
      }
    }
  }
}
`;

export default CardLessATMWrapper;
