import styled from 'styled-components';

const AvatarWrapper = styled.div.attrs({
  className: 'Avatar',
})`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1.2rem;
  width: fit-content;
  .photo {
    // padding: ${({ $small }) => ($small ? '.2rem' : '.4rem')};
    border-radius: 50%;
    width: ${({ $small }) => ($small ? '4.4rem' : '8.8rem')};
    height: ${({ $small }) => ($small ? '4.4rem' : '8.8rem')};
    background: ${({ theme }) => theme.colors.primary.gradient};
    // overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  img,
  .default {
    border-radius: 50%;
  }

  img {
    width: 92%;
    height: 92%;
    object-fit: cover;
  }

  .default {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 100%;
    // height: 100%;
    width: 92%;
    height: 92%;
    background: ${({ theme }) => theme.colors.background.lighterBlue};

    span {
      font-size: ${({ $small }) => ($small ? '2rem' : '3.6rem')};
      font-weight: 700;
      color: ${({ theme }) => theme.colors.primary.light};
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      // padding-left: 0.2rem;

      &.Icon {
        // top: -.2rem;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${({ $small }) => ($small ? '2rem' : '3.2rem')};
      }
    }

    .MuiSvgIcon-root {
      font-size: ${({ $small }) => ($small ? '2.8rem' : '4.8rem')};
      color: ${({ theme }) => theme.colors.primary.light};
    }
  }

  .editButton {
    position: absolute;
    top: 5.6rem;
    left: 5.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 3.2rem;
    height: 3.2rem;
    border: 0.2rem solid ${({ theme }) => theme.colors.basic.white};
    background: ${({ theme }) => theme.colors.primary.light};

    .Icon {
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.basic.white};
      display: flex;
      align-items: center;
      justify-content: center;
    }

    input {
      display: none;
    }
  }
`;

export default AvatarWrapper;
