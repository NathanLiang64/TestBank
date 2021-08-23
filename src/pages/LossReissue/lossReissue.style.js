import styled from 'styled-components';
import Layout from 'components/Layout';

const LossReissueWrapper = styled(Layout)`
  form button[type=submit] {
    margin-top: 4rem;
  }
  
  .notice {
    margin-top: 0;
    
    p {
      text-align: left;
    }
  }
  
  .point {
    color: ${({ theme }) => theme.colors.text.point};
  }
`;

const LossReissueResultWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .stateImage {
    width: 14.4rem;
  }

  .stateText,
  .bank,
  .account {
    font-size: 2.4rem;
    text-align: center;
  }
  
  .stateText {
    font-weight: 500;
    
    &.success {
      color: ${({ theme }) => theme.colors.secondary.brand};
    }
    &.error {
      color: ${({ theme }) => theme.colors.state.error};
    }
  }

  .accountArea {
    margin: 2.4rem 1.6rem 3.2rem 1.6rem;
    text-align: center;

    .bank,
    .account {
      color: ${({ theme }) => theme.colors.primary.dark};
    }
    
    .errorCode {
      margin-bottom: .8rem;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }

    .errorText {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }

  
  .divider {
    display: block;
    width: 100vw;
    height: .8rem;
    background: ${({ theme }) => theme.colors.background.lighterBlue};
  }
  
  .list {
    padding: 1.6rem .8rem;
    width: 100%;
  }
`;

export default LossReissueWrapper;
export { LossReissueResultWrapper };
