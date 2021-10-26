import styled from 'styled-components';
import Layout from 'components/Layout';
// import theme from 'themes/theme';

const RegularPwdModifyWrapper = styled(Layout)`
  z-index: 1001;
  height: 100vh;
  background: ${({ theme }) => theme.colors.basic.white};
  padding-bottom: 4rem;
  .stateArea {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.4rem;

    .stateImage {
      width: 14.4rem;
    }

    .stateText {
      font-size: 2.4rem;
      font-weight: 500;
      margin-bottom: 2.4rem;

      &.success {
        color: ${({ theme }) => theme.colors.secondary.brand};
      }
      &.error {
        color: ${({ theme }) => theme.colors.state.error};
      }
    }

    .stateContent {
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
      text-align: center;
      p {
        color: ${({ theme }) => theme.colors.text.lightGray};
      }
    }
  }
`;

export default RegularPwdModifyWrapper;
