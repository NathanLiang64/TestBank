import styled from 'styled-components';

const DebitCardWrapper = styled.div`
  margin-bottom: 2rem;
  padding: 1.2rem;
  border-radius: .8rem;
  background: ${({ theme }) => theme.colors.card.purple};

  .cardTitle {
    
    .cardName {
      font-size: 1.8rem;
      color: ${({ theme }) => theme.colors.text.darkGray};
    }
    
    .accountInfo {
      display: flex;
      align-items: center;
      margin-top: -.8rem;
      color: ${({ theme }) => theme.colors.text.darkGray};

      .MuiIconButton-root {
        margin-left: -.4rem;
      }
      
      .copiedMessage {
        position: absolute;
        top: 50%;
        right: -112%;
        padding: .2rem .4rem;
        font-size: 1.2rem;
        border-radius: .4rem;
        background: ${({ theme }) => theme.colors.background.mask};
        color: ${({ theme }) => theme.colors.basic.white};
        transform: translateY(-50%);
        transition: all .2s;
        opacity: 0;
        
        &.showMessage {
          opacity: 1;
        }
      }
      
      p {
        font-size: 1.5rem;
        color: ${({ theme }) => theme.colors.text.darkGray};
      }
      
      .branch {
        margin-right: .8rem;
      }
      
      .account {
        font-weight: bold;
      }
    }
  }

  .cardBalance {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    
    &.grow {
      margin-top: .8rem;
      margin-bottom: 1.2rem;
    }

    .balance {
      font-size: 2.8rem;
      font-weight: bold;
    }
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
      
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        width: .1rem;
        height: 1.6rem;
        background: ${({ theme }) => theme.colors.border.light};
        transform: translateY(-50%);
      }
      
      &:last-child {
        padding-right: .2rem;
        
        :after {
          width: 0;
        }
      }
      
      a {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.text.darkGray};
      }
    }
  }
`;

export default DebitCardWrapper;
