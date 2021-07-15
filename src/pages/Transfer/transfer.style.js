import styled from 'styled-components';
import Layout from 'components/Layout';

const TransferWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  padding-top: 1.6rem;
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  
  .transferServicesArea {
    left: -1.6rem;
    flex-grow: 1;
    padding: 2.4rem 1.6rem;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    width: 100vw;
    background: ${({ theme }) => theme.colors.basic.white};
  }
  
  .userCardArea {
    left: -1.6rem;
    width: 100vw;
    
    .swiper-container {
      padding-bottom: 1.6rem;
    }
    
    .swiper-pagination {
      left: -.8rem;
    }
  }
  
  .memberAccountCardArea {
    margin-top: .8rem;
    margin-bottom: 2.4rem;
  }
  
  .notice {
    margin-bottom: 2rem;
    font-size: 1.4rem;
    font-weight: 300;
  }
  
  .transferType {
    margin-bottom: 1.6rem;
  }
  
  .transferButtonArea {
    padding-top: 1.2rem;
    padding-bottom: 1.6rem;

    .notice {
      margin-top: 1.6rem;
      margin-bottom: 0;
      text-align: center;
    }
  }
  
  .memberAccountCard {
    display: flex;
    
    .avatar {
      width: 4.4rem;
      height: 4.4rem;
    }
  }
  
  .customWidth {
    width: 50%;
  }
  
  .customSpace {
    .MuiFormHelperText-root {
      margin-bottom: 0;
    }
    
    .MuiInputBase-input {
      width: 26%;
    }
    
    .adornment {
      margin-right: .4rem;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.primary.dark};
      
      &.chinese {
        flex-grow: 1;
        margin-right: 0;
        font-size: 1.5rem;
        text-align: right;
      }

      &.empty {
        color: ${({ theme }) => theme.colors.text.placeholder};
      }
    }
  }
  
  .reserveOption {
    .datePickerLabel {
      margin-top: 1.8rem;
      margin-bottom: 1.8rem;
      top: 1.8rem;
    }
    
    .MuiFormControl-root {
      width: 100%;
    }
    
    .MuiInputLabel-root {
      color: transparent;
    }
    
    .MuiInputBase-input {
      font-size: 1.6rem;
    }

    .MuiFormControl-marginNormal {
      width: 100%;
    }
    
    .MuiInput-underline {
      opacity: 1;
      
      &:before,
      &:hover:not(.Mui-disabled):before {
        border-color: ${({ theme, $borderColor }) => $borderColor || theme.colors.border.light};
        opacity: 1;
      }
      &:after {
        border-width: .1rem;
        border-color: ${({ theme, $borderColor, $focusBorderColor }) => $focusBorderColor || $borderColor || theme.colors.border.light};
      }

      &.Mui-error:after {
        border-width: .1rem;
        border-color: ${({ theme }) => theme.colors.state.danger};
      }
    }
  }
`;

export default TransferWrapper;
