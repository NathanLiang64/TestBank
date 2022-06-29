import styled from 'styled-components';

import CardBackground from 'assets/images/debitCardBackground.png';

const AccountCardWrapper = styled.div`
  display: flex;
  justify-content: flex-begen;
  flex-direction: column;
  gap: 0.7rem;
  background-color: ${({ theme, $cardColor }) => theme.colors.card[$cardColor]};
  background-image: url(${CardBackground});
  background-position: right center;
  background-repeat: no-repeat;
  border-radius: 8px;
  width: 100%;
  min-height: 117px;
  padding: 1.2rem;
  text-align: left;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text.lightGray};

  .justify-between {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .items-center {
    align-items: center;
  }

  .balance {
    text-align: right;
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.text.darkGray};
  }
  
  .moreIconButton {
    position: absolute;
    top: 0;
    right: 0;
  }

  .MuiIconButton-root{
    padding:0;
  }

  .w-full{
    width: 100%;
  }

  .functionList{
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
      
      button {
        font-size: 1.6rem;
      }
    }
    
`;

export default AccountCardWrapper;
