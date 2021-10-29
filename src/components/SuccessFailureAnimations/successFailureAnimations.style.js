import styled from 'styled-components';

const SuccessFailureAnimationsWrapper = styled.div`

  .stateText {
    margin-top: 1.6rem;
    font-size: 2.4rem;
    text-align: center;
    font-weight: 500;

    &.success {
      color: ${({ theme }) => theme.colors.secondary.brand};
    }
    &.error {
      color: ${({ theme }) => theme.colors.state.error};
    }
  }
  
  section.errorInfo {
    text-align: center;
    
    &.horizontalSpacing {
      padding: 0 3.2rem;
    }

    .errorCode {
      margin: 1.6rem 0;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }

    .errorText {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
`;

export default SuccessFailureAnimationsWrapper;
