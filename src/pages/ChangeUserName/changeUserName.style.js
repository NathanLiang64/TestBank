import styled from 'styled-components';
import Layout from 'components/Layout';

const ChangeUserNameWrapper = styled(Layout)`
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
      text-align: center;
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
    }
  }
`;

export default ChangeUserNameWrapper;
