import styled from 'styled-components';

const PageWrapper = styled.div`
  .addMemberButtonArea {
    display: flex;
    align-items: center;
    padding: 1.2rem .8rem;
    border-top: .1rem solid ${({ theme }) => theme.colors.border.lighter};
    border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lighter};
    width: 100%;
  }

  .addMemberButtonIcon {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 4.4rem;
    height: 4.4rem;
    background: ${({ theme }) => theme.colors.primary.light};

    .Icon {
      font-size: 2rem;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ theme }) => theme.colors.basic.white};
    }
  }

  .addMemberButtonText {
    margin-left: 1.2rem;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.primary.light};
  }
`;

const DrawerWrapper = styled.div`
  display: grid;
  align-content: flex-start;
  grid-gap: 2.4rem;
  padding: 0 1.6rem 2.4rem;

  .flex-col {
    display: grid;
    align-content: flex-start;
    grid-gap: 2.4rem;
  }

  .self-center {
    align-self: center;
  }

  .text-blue {
    color: ${({ theme }) => theme.colors.text.darker};
    margin-top: 1rem;
    text-align: center;

    .editButton {
      padding: 0;
      padding-bottom: .5rem;
      margin-left: 1rem;
    }
  }

  .goBack {
    position: absolute;
    left: 1rem;
    top: -6rem;
  }
`;

export default PageWrapper;
export { DrawerWrapper };
