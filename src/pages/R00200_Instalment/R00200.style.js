import styled from 'styled-components';
import Layout from 'components/Layout';

/** background: ${({ theme }) => theme.colors.background.lighterBlue}; */
const InstalmentWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.white};
  
  .InformSection{
    color: ${({ theme }) => theme.colors.primary.dark};
    text-align: center;
    padding:2rem;
    font-size: 1.8rem;
  }

  &.ConfirmResultPage{
    padding:0;
  }

  .closeIconButton {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
  }

  .InformationTape {
    &.checkedtape {
      border: ${({ theme }) => `1px solid ${theme.colors.primary.dark}`};
    }
    border: 1px solid transparent;
    .checkbox {
      pointer-events: none;
      .Icon {
        width: auto;
        height: auto;
        color: ${({ theme }) => theme.colors.text.dark};
      }

      &.Mui-checked {
        .Icon {
          color: ${({ theme }) => theme.colors.primary.dark};
        }
      }
    }
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
    margin: 1rem 0 2rem;

    p {
      width: 100%;
      text-align: center;
    }
    .titleText {
      color: ${({ theme }) => theme.colors.primary.light};
      text-align: center;
      font-size: 3.6rem;
    }
  }

  .staging-table {
    margin: 1rem auto;
    thead,
    tbody {
      td {
        font-size: 1.4rem;
        text-align: right;
        vertical-align: middle;
        .principalText {
          font-size: 1.2rem;
          color: ${({ theme }) => theme.colors.text.light};
        }
      }
    }

    thead {
      td {
        font-size: 1.2rem;
        color: ${({ theme }) => theme.colors.primary.light};
      }
    }
  }

  .formula-hint {
    p {
      font-size: 1.2rem;
      color: ${({ theme }) => theme.colors.state.error};
    }
  }

  .note {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.text.light};
  }

  .ConfirmForm{
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;
    padding: 0 2rem;
          
  }
`;

export default InstalmentWrapper;
