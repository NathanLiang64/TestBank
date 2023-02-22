import styled from 'styled-components';
import Layout from 'components/Layout';

const CardLessATMWrapper = styled(Layout)`
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
&.result-wrapper {
  padding: 0;
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  .section1 {
    margin-bottom: .8rem;
    padding: 1.5rem 3.2rem 2.4rem;
    background: ${({ theme }) => theme.colors.basic.white};
    .accountInfo {
      font-size: 2.4rem;
      color: ${({ theme }) => theme.colors.primary.dark};
      font-weight: 400;
      margin: 2.4rem 0 1.6rem;
      .withdrawNo {
        font-weight: bold;
      }
    }
    .withdrawalInfo {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.text.darkGray};
      span {
        color: ${({ theme }) => theme.colors.text.point};
      }
    }
  }
  .section2 {
    padding: 2.4rem 1.6rem;
    background: ${({ theme }) => theme.colors.basic.white};
  }
}

#withdrawAmount {
  text-align: center;
  &:disabled{
    opacity:1;
  }
}
.addMinusIcons {
  transform: translateY(calc(-100% - 0.8rem));
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.primary.light};
  svg {
    font-size: 2rem;
  }
}
.limit-label {
  transform: translateY(-100%);
  height: 1.8rem;
  line-height: 1.8rem;
}
`;

export default CardLessATMWrapper;
