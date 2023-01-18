import styled from 'styled-components';

const DebitCardWrapper = styled.div`
  margin-bottom: 2rem;
  padding: 1.2rem;
  border-radius: .8rem;
  background: ${({ theme, $cardColor }) => theme.colors.card[$cardColor]};

  .backgroundImage {
    position: absolute;
    top: 50%;
    right: 0;
    width: 56%;
    transform: translateY(-50%);
  }

  .cardTitle {
    
    .cardName {
      font-size: 1.8rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
    
    .accountInfo {
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.colors.text.lightGray};

      .MuiIconButton-root {
        margin: -.8rem;
      }
      
      .branch,
      .account {
        font-size: 1.5rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
        white-space: nowrap;
        flex: 1;
      }
      
      .branch {
        margin-right: .8rem;
      }
      
      .account {
        font-weight: 500;
      }

      .noDisplay {
        display: none;
      }
    }
  }

  .cardBalance {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    
    &.grow {
      margin-bottom: .4rem;
    }
    
    .MuiIconButton-root {
      top: -.1rem;
      margin-right: -.4rem;
    }

    .balance {
      font-size: 2.8rem;
      font-weight: 500;
      letter-spacing: .05rem;
      color: ${({ theme }) => theme.colors.text.darkGray};
    }
  }

  .freeTransferInfo {
    padding-top: .4rem;
    padding-bottom: .2rem;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }
  
  .moreIconButton {
    position: absolute;
    top: 0;
    right: 0;
  }
  
  .functionList {
    display: flex;
    justify-content: flex-end;
    
    li {
      padding: .4rem 1.2rem;
      font-weight: 300;
      letter-spacing: .1rem;
      
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        width: .1rem;
        height: 1.6rem;
        background: ${({ theme }) => theme.colors.text.lightGray};
        transform: translateY(-50%);
        opacity: .3;
      }
      
      &:last-child {
        padding-right: .2rem;
        
        :after {
          width: 0;
        }
      }
      
      a {
        color: ${({ theme }) => theme.colors.text.lightGray};
      }
    }
  }
`;

export default DebitCardWrapper;
