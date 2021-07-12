import styled from 'styled-components';

const ShakeShakeWrapper = styled.div`
  padding: 0 1.6rem 4rem 1.6rem;
  text-align: center;

  .cardName {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary.dark};
  }

  .accountInfo {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 1.6rem;  // 視覺對齊
    color: ${({ theme }) => theme.colors.text.darkGray};

    .account {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.text.light};
    }

    .MuiIconButton-root {
      margin-left: -.8rem;
    }
  }

  .codeArea {
    margin-top: .8rem;

    .customSpace {
      padding-bottom: 4rem;
    }

    .shareIconButton {
      margin-right: -.4rem;
    }

    .shareButtonArea {
      display: flex;
      justify-content: center;
      align-items: center;
      left: -.8rem;
    }
  }

  .scanArea {
    margin-top: 2.4rem;
    height: 29rem;
    border-radius: .8rem;
    overflow: hidden;

    .maskArea {
      position: absolute;
      top: 0;
      left: 0;
      display: grid;
      grid-template-rows: 1fr 20rem 1fr;
      grid-template-columns: 1fr 20rem 1fr;
      width: 100%;
      height: 100%;

      .mask {
        width: 100%;
        background: rgba(255, 255, 255, .5);

        &.empty {
          background: transparent;
        }

        .MuiSvgIcon-root {
          position: absolute;
          font-size: 4.8rem;
          color: ${({ theme }) => theme.colors.primary.light};

          &.topLeft {
            top: -1.5rem;
            left: -1.5rem;
            transform: rotate(-135deg);
          }

          &.topRight {
            top: -1.5rem;
            right: -1.5rem;
            transform: rotate(-45deg);
          }

          &.bottomLeft {
            left: -1.5rem;
            bottom: -1.5rem;
            transform: rotate(135deg);
          }

          &.bottomRight {
            right: -1.5rem;
            bottom: -1.5rem;
            transform: rotate(45deg);
          }
        }
      }
    }
  }

  .buttonArea {
    padding: 2rem 0;
    border-top: .1rem solid ${({ theme }) => theme.colors.border.lighter};
    width: 100%;
  }

  .loadingArea {
    padding: 4rem 0;
  }
`;

export default ShakeShakeWrapper;
