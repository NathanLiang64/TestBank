import styled from 'styled-components';

const DetailCardWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  padding: 1.2rem;
  border-radius: .8rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.basic.white};
  box-shadow: 0 .2rem .8rem rgba(0, 0, 0, .08);
  
  .defaultAvatar,
  .avatar {
    margin-right: 1.2rem;
    width: 4rem;
    height: 4rem;
  }
  
  .defaultAvatar {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background.light};
    
    // 預設頭像的 icon 樣式
    .MuiSvgIcon-root {
      font-size: 2.4rem;
      color: ${({ theme }) => theme.colors.primary.light};
    }
  }

  .avatar {

    .type {
      position: absolute;
      right: -.2rem;
      bottom: -.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: .2rem solid ${({ theme }) => theme.colors.basic.white};
      border-radius: 50%;
      width: 44%;
      height: 44%;

      &.income {
        background: ${({ theme }) => theme.colors.state.success};
      }
      &.spend {
        background: ${({ theme }) => theme.colors.state.danger};
      }

      // 頭像右下角圓點內的 icon 樣式
      .MuiSvgIcon-root {
        font-size: 1.2rem;
        color: ${({ theme }) => theme.colors.basic.white};
      }
    }

    img {
      border-radius: 50%;
    }
  }

  .description,
  .amount {

    h4 {
      font-size: 1.5rem;
      font-weight: bold;
    }

    p {
      font-size: 1.2rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }

  .amount {
    text-align: right;
    position: absolute;
    right: 1.2rem;
  }
`;

export default DetailCardWrapper;
