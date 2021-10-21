import styled from 'styled-components';
import Layout from 'components/Layout';

const LoginWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1001;
  margin-top: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.colors.basic.white};

  //.MuiFormLabel-root,
  //.MuiIconButton-root,
  //.MuiFormControlLabel-label {
    //opacity: .6;
  //}
  
  // .MuiIconButton-root {
  //   color: ${({ theme }) => theme.colors.basic.white};
  // }
  
  //.Mui-checked {
  //  opacity: 1;
  //}
  
  .head {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 3;
    padding-bottom: 2vh;
    //height: 20vh;
    background: ${({ theme }) => theme.colors.card.purple};
    
    img {
      margin-bottom: 1.2rem;
      width: 18.6rem;
      z-index: 1;
    }

    span {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
  }
  
  .formItems {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 6;
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    border-bottom-left-radius: 3.2rem;
    //height: 60vh;
    background: ${({ theme }) => theme.colors.card.purple};
    
    > div {
      width: 100%;
    }

    .MuiInput-input::placeholder {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
    
    .MuiInput-root .MuiIconButton-root {
      color: ${({ theme }) => theme.colors.primary.light};
      
      .MuiSvgIcon-root {
        font-size: 2rem;
      }
    }
    
    .MuiCheckbox-root .MuiIconButton-label {
      font-size: 2.4rem;
    }
    
    .rememberAccountArea {
      display: flex;
      justify-content: space-between;
      
      .MuiFormControlLabel-root {
        margin-right: 0;
        color: #333;

        .MuiFormControlLabel-label {
          top: .1rem;
        }
      }
    }
  }
  
  .controlButtons {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    padding: .8rem 0;
    flex-grow: 3;
    //height: 12vh;
    
    .login {
      display: flex;
      width: 100%;
      
      .fastLogin .Icon {
        font-size: 2.4rem;
        color: ${({ theme }) => theme.colors.primary.dark};
      }
      
      button {
        flex-grow: 1;
        
        &[type=submit] {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          border: 0;
          font-size: 2rem;
          color: ${({ theme }) => theme.colors.primary.dark};
          
          &:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            display: inline-block;
            width: .1rem;
            height: 3.4rem;
            background: #C0C7D2;
            transform: translateY(-50%);
          }

          .Icon {
            margin-left: .8rem;
            color: ${({ theme }) => theme.colors.primary.dark};
            transform: rotate(180deg);
          }
        }
      }
    }
    
    .signup {
      display: flex;
      align-items: baseline;
      color: ${({ theme }) => theme.colors.text.light};
      
      span {
        top: -.1rem;
      }
      
      button {
        font-size: 1.6rem;
      }
    }
  }
  
  form {
    padding-bottom: 0;
    width: 100%;
    height: 100%;
    
    .backgroundImage {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }
  }
  
  .forgot,
  .forgot button {
    top: -.05rem;
    display: flex;
    align-items: center;
    padding: 0;
    
    .MuiSvgIcon-root {
      margin-left: .4rem;
      color: ${({ theme }) => theme.colors.primary.light};
    }
  }
`;

export default LoginWrapper;
