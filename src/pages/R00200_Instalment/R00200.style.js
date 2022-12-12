import styled from 'styled-components';
import Layout from 'components/Layout';

/** background: ${({ theme }) => theme.colors.background.lighterBlue}; */
const InstalmentWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.white};
  padding: 16;

  .InstalmentWrapper {
    .InstalmentWrapperText {
      font-size: 1.8rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
  }

  .closeIconButton {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
  }

  .MuiFormGroup-root {
    label {
      margin: 0;

      .left-section {
        flex: 1;

        .name {
          font-size: 1.8rem;
        }
        .date {
          font-size: 1.4rem;
          color: ${({ theme }) => theme.colors.text.light};
        }
      }
    }
  }

  .checkbox {
    margin: 0.8rem 0 0.8rem 0;
    padding: 1rem;
    border-radius: 0.8rem;
    box-shadow: 0px 4px 10px 0px #0000001f;
    display: flex;
    justify-content: space-between;
  }

  .messageBox {
    margin: 2rem;
    p {
      font-size: 1.6rem;
      text-align: center;
    }
  }

  .messageBox2 {
    background: ${({ theme }) => theme.colors.background.lighterBlue};
    border-radius: 0.8rem;
    padding: 2rem;
    margin: 1rem;

    p{
      width: 100%;
      text-align: center;
    }
    
    .titleText {
      color: ${({ theme }) => theme.colors.primary.light};
      text-align: center;
      font-size: 3.6rem;
    }
  }

`;

export default InstalmentWrapper;
