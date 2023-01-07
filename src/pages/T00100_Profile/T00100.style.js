import styled from 'styled-components';
import Layout from 'components/Layout';

const ProfileWrapper = styled(Layout)`
  .avatarContainer {
    width: 8.8rem;
    height: 8.8rem;
    margin: 0 auto 1.2rem;
    position: relative;

    img {
      border-radius: 50%;
    }

    label {
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
    }

    #avatar-input {
      display: none;
    }

    .penIconContainer {
      position: absolute;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3.2rem;
      height: 3.2rem;
      background: ${({ theme }) => theme.colors.basic.white};
      border-radius: 1.6rem;

      .penIconBackground {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.8rem;
        height: 2.8rem;
        border-radius: 1.4rem;
        background: ${({ theme }) => theme.colors.primary.light};
        
        svg {
          color: ${({ theme }) => theme.colors.basic.white};
          font-size: 1.87rem;
        }
      }
    }
  }

  .nickname {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;

    span {
      color: ${({ theme }) => theme.colors.text.dark};
      font-size: 1.8rem;
      font-weight: 500;
    }

    svg {
      color: ${({ theme }) => theme.colors.primary.light};
      font-size: 2.13rem;
      margin-left: .8rem;
    }
  }

  .entryList {
    border-top: .1rem solid #999;
    padding: 1.6rem .8rem 1.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    svg {
      position: absolute;
      right: 0;
      font-size: 4.4rem;
      color: ${({ theme }) => theme.colors.primary.light};

      path {
        transform: translateX(.2rem);
      }
    }
  }
`;

export default ProfileWrapper;
