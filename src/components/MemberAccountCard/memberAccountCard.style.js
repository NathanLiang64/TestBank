import styled from 'styled-components';

const MemberAccountCardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ $listType }) => ($listType ? '1.2rem .8rem' : '1.6rem 1.2rem')};
  ${({ $listType, theme }) => (
    $listType
      ? (`
        border-bottom: .1rem solid ${theme.colors.border.lighter};
        &:first-child {
          border-top: .1rem solid ${theme.colors.border.lighter};
        };
        overflow: hidden;
      `)
      : (`
        border-radius: .6rem;
        background: ${theme.colors.background.lighterBlue};
      `)
  )};
  
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
`;

const MemberDrawerContentWrapper = styled.div`
  padding: 0 1.6rem 4rem 1.6rem;
  
  .addMemberButtonArea {
    display: flex;
    align-items: center;
    padding: 1.2rem .8rem;
    border-top: .1rem solid ${({ theme }) => theme.colors.border.lighter};
  }
  
  .addMemberButtonIcon {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 4.4rem;
    height: 4.4rem;
    background: ${({ theme }) => theme.colors.primary.light};
    
    .MuiSvgIcon-root {
      font-size: 3.2rem;
      color: ${({ theme }) => theme.colors.basic.white};
    }
  }
  
  .addMemberButtonText {
    margin-left: 1.2rem;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.primary.light};
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
  
  .addFrequentlyUsedAccountArea {
    text-align: center;

    .Avatar {
      display: inline-block;
      margin-bottom: 1.6rem;
    }
    
    label {
      text-align: left;
    }
  }
`;

export default MemberAccountCardWrapper;
export { MemberDrawerContentWrapper };
