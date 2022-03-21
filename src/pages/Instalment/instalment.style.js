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
      top: .8rem;
      right: .8rem;
    }

    .selectList {
      flex-direction: column;
    }

    .checkbox {
      margin: .8rem 0 .8rem 0;
      padding: .5rem;
      border-radius: .8rem;
      box-shadow: 0px 4px 10px 0px #0000001F;
      display: flex;
      justify-content: space-between;
    }

    .messageBox {
      margin: 2rem;
    }

    .messageBox2 {
      background: ${({ theme }) => theme.colors.background.lighterBlue};
      border-radius: .8rem;
      padding: 2rem;
      margin: 1rem;
    }

    .titleText {
      color: ${({ theme }) => theme.colors.primary.light};
      text-align: center;
      font-size: 3.6rem;
    }
`;

export default InstalmentWrapper;
