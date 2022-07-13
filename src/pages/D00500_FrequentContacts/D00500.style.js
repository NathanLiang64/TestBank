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
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 0 1.6rem 2.4rem;

  .flex-col {
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
  }

  .text-blue {
    color: ${({ theme }) => theme.colors.text.darker};
    margin-block-start: 1rem;
  }
`;

export default PageWrapper;
export { DrawerWrapper };
