import styled from 'styled-components';
import Layout from 'components/Layout';

const LoginWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .MuiIconButton-root,
  .MuiFormControlLabel-label {
    opacity: .6;
  }
  
  .Mui-checked {
    opacity: 1;
  }
  
  .title {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 2vh;
    height: 20vh;
    background: ${({ theme }) => theme.colors.primary.light};

    h3, p {
      font-weight: 300;
      letter-spacing: .1rem;
      color: ${({ theme }) => theme.colors.basic.white};
      opacity: .6;
    }

    h3 {
      margin-bottom: .4rem;
      font-size: 3.6rem;
    }

    p {
      font-size: 1.4rem;
    }
  }
  
  .formItems {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    border-bottom-left-radius: 3.2rem;
    height: 48vh;
    background: ${({ theme }) => theme.colors.primary.light};
  }
  
  .controlButtons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 24vh;
    
    .login {
      button[type=submit] {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        border: 0;
        font-size: 2.4rem;
        font-weight: bold;
        // color: ${({ theme }) => theme.colors.primary.dark};
        //background: transparent;
      }
      .MuiSvgIcon-root {
        margin-left: .4rem;
        font-size: 2.4rem;
        color: ${({ theme }) => theme.colors.primary.dark};
      }
    }
    
    .signup {
      margin-top: 1.2rem;
      margin-bottom: .8rem;
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.text.light};

      .boldLink {
        font-weight: bold;
      }
    }
  }
  
  form {
    width: 100%;
    height: 100%;
  }
  
  .forgot {
    display: flex;
    
    button {
      opacity: .6;
      
      &:hover {
        opacity: 1;
      }
    }
  }
`;

export default LoginWrapper;
