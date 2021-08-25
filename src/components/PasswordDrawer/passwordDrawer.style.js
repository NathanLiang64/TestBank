import styled from 'styled-components';

const PasswordDrawerWrapper = styled.div`
  margin: 0 1.6rem 4rem 1.6rem;
  
  .countDownArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.4rem;
    padding: 1.6rem 1.2rem;
    border-radius: .8rem;
    background: ${({ theme }) => theme.colors.background.lighterBlue};
    
    .resendButton {
      min-height: 3.2rem;
      margin: 0;
      padding: .4rem 1.2rem;
      width: unset;
      height: 3.2rem;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.text.dark};
      background: ${({ theme }) => theme.colors.background.lightBlue};
      
      &:disabled {
        background: #B5C1D4;
      }
    }
  }
  
  .prefixCode {
    display: flex;
    padding-top: .16rem;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.primary.dark};
    
    &::after {
      content: '-';
      display: inline-block;
      margin: 0 .2rem;
    }
  }
`;

export default PasswordDrawerWrapper;
