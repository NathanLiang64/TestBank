import styled from 'styled-components';

const AvatarWrapper = styled.div`
  
  .photo {
    padding: ${({ $small }) => ($small ? '.2rem' : '.4rem')};
    border-radius: 50%;
    width: ${({ $small }) => ($small ? '4.4rem' : '8.8rem')};
    height: ${({ $small }) => ($small ? '4.4rem' : '8.8rem')};
    background: ${({ theme }) => theme.colors.primary.gradient};
    overflow: hidden;
  }
  
  img, .default {
    border-radius: 50%;
  }
  
  .default {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.background.lighterBlue};

    span {
      font-size: ${({ $small }) => ($small ? '2.4rem' : '4rem')};
      color: ${({ theme }) => theme.colors.primary.light};
    }

    .MuiSvgIcon-root {
      font-size: ${({ $small }) => ($small ? '2.8rem' : '4.8rem')};
      color: ${({ theme }) => theme.colors.primary.light};
    }
  }

  .editButton {
    position: absolute;
    top: 6rem;
    left: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    border: .2rem solid ${({ theme }) => theme.colors.basic.white};
    background: ${({ theme }) => theme.colors.primary.light};
    
    .MuiSvgIcon-root {
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.basic.white};
    }
  }
`;

export default AvatarWrapper;
