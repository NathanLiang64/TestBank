import styled from 'styled-components';

const DetailCardWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  padding: 1.2rem;
  border-radius: .8rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.basic.white};
  box-shadow: ${({ $noShadow }) => ($noShadow ? '0' : '0 .4rem 1rem rgba(0, 0, 0, .12);')};

  .badIcon {
    display: block;
    margin: -1.1rem;
    height: fit-content;
  }
  
  .defaultAvatar,
  .avatar {
    margin-right: .8rem;
    width: 4rem;
    height: 4rem;
  }

  .defaultAvatar {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background.light};
    
    .Icon {
      top: -.2rem;
      left: -.2rem;
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
      margin-top: .2rem;
      margin-bottom: -.2rem;
      letter-spacing: .1rem;
    }

    p {
      margin-bottom: .2rem;
      font-size: 1.2rem;
      letter-spacing: .05rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }

  .amount {
    text-align: right;
    position: absolute;
    right: 1.2rem;
    
    h4 {
      font-weight: 500;
    }
  }

  .remark {
    display: flex;
    justify-content: right;
    align-items: center;

    span {
      margin-bottom: .2rem;
      font-size: 1.2rem;
      letter-spacing: .05rem;
      color: ${({ theme }) => theme.colors.text.light};
    }

    svg {
      color: ${({ theme }) => theme.colors.primary.light};
      font-size: 2.13rem;
      margin-left: .4rem;
      width:16px;
    }
  }
`;

const DetailDialogContentWrapper = styled.div`
.panel {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
`;

const DetailDialogErrorMsg = styled.div`
.errorMsg {
  visibility:hidden;
}
.errorBorder{
  &:before,
  &:hover:not(.Mui-disabled):before {
    border-color:#FF5F5F !important;
  }
}

`;

export default DetailCardWrapper;
export { DetailDialogContentWrapper, DetailDialogErrorMsg };
