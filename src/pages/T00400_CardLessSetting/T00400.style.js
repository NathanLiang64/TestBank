import styled from 'styled-components';
import Layout from 'components/Layout';

const CardLessSettingWrapper = styled(Layout)`
  .controlContainer {
    padding: 1.2rem 0;
    border-top: 1px solid ${({ theme }) => theme.colors.background.lightness};
    border-bottom: 1px solid ${({ theme }) => theme.colors.background.lightness};
  }
  .mainBlock {
    justify-content: space-between;
    &.toChangePwd {
      height: 6.8rem;
      margin-top: 2.4rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
      padding: 1.6rem 1.2rem;
      svg {
        font-size: 2rem;
      }
    }
  }
  .switchContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .labelContainer {
      min-height: 6rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .phoneNum {
        color: ${({ theme }) => theme.colors.text.light};
      }
    }
  }

  #withdrawPwdForm {
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;
  }
`;

export default CardLessSettingWrapper;
