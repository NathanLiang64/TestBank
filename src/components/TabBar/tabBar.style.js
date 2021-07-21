import styled from 'styled-components';

const TabBarWrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 6rem;
  box-shadow: 0 -.3rem 2rem rgba(45, 45, 45, .14);
  display: flex;
  align-items: center;

  .buttons {
    display: flex;
    align-items: center;
    width: calc(100vw - 6.3rem - 1.6rem);
    overflow: auto;
    padding: 1rem 1.2rem;

    .button-item {
      flex: 1 0 auto;
      width: 7.2rem;
      height: 4rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .label {
        font-size: 1rem;
        color: ${({ theme }) => theme.colors.primary.light};
        white-space: nowrap;
      }
    }
  }

  .arrow-container {
    width: 1.6rem;
    height: 6rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-left: .4rem;
    }
  }

  .avatar {
    background: #fff;
    width: 6.3rem;
    height: 6rem;
  }
`;

export default TabBarWrapper;
