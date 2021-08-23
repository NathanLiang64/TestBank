import styled from 'styled-components';

const MemberAccountCardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1.2rem .8rem;
  overflow: hidden;
  border-bottom: ${({ $noBorder, theme }) => ($noBorder ? '' : `.1rem solid ${theme.colors.border.lighter}`)};
  &:first-child {
    border-top: ${({ $noBorder, theme }) => ($noBorder ? '' : `.1rem solid ${theme.colors.border.lighter}`)};
  }
  
  .memberInfo {
    margin-left: 1.2rem;

    h3 {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 1.8;
    }

    p {
      font-size: 1.2rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
  
  .changeMemberButton {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  .moreActionMenu {
    display: flex;
    position: absolute;
    top: 0;
    right: -100%;
    height: 100%;
    color: ${({ theme }) => theme.colors.basic.white};
    transition: all .3s ease-out;

    &.show {
      right: 0;
    }

    button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 6.8rem;

      &.edit {
        background: ${({ theme }) => theme.colors.primary.light};
      }
      &.remove {
        background: ${({ theme }) => theme.colors.state.danger};
      }

      .MuiSvgIcon-root {
        margin-bottom: .4rem;
        font-size: 2.4rem;
      }

      span {
        font-size: 1.2rem;
      }
    }
  }
`;

export default MemberAccountCardWrapper;
