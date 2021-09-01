import styled from 'styled-components';

const FavoriteDrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0 1.6rem;
  
  .editButton {
    display: inline-flex;
    align-items: center;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.dark};
    
    .MuiSvgIcon-root {
      margin-left: .4rem;
      font-size: 2rem;
      color: ${({ theme }) => theme.colors.primary.light};
    }
  }
  
  .favoriteArea {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1.6rem;
    margin-top: 1.6rem;
    margin-bottom: 4rem;
    width: 100%;
    
    button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 1.2rem;
      height: 14.8rem;
      border-radius: .8rem;
      font-size: 1.6rem;
      user-select: none;
      
      img {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
      }
      
      .icon {
        font-size: 3.2rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
      }
      
      .removeButton {
        position: absolute;
        top: .8rem;
        left: .8rem;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 2.4rem;
        height: 2.4rem;
        background: ${({ theme }) => theme.colors.primary.light};
        animation: scaleUp .4s backwards;
        transform-origin: center;
        
        .MuiSvgIcon-root {
          font-size: 2.4rem;
          color: ${({ theme }) => theme.colors.basic.white};
        }
      }
    }
  }
  
  @keyframes scaleUp {
    0% { transform: scale(0); opacity: 0; }
    30% {opacity: 1; }
    50% {transform: scale(1.4); }
    65% {transform: scale(1); }
    80% {transform: scale(1.2); }
    100% {transform: scale(1); }
  }
`;

export default FavoriteDrawerWrapper;
