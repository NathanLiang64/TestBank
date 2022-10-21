import styled from 'styled-components';

const areaStyle = `
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1.6rem;
  margin-top: 1.6rem;
  margin-bottom: 6rem;
  width: 100%;
  height:65vh;
  overflow-y: auto;
`;

const blockStyle = `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1.2rem;
  height: 14.8rem;
  border-radius: .8rem;
  font-size: 1.6rem;
  user-select: none;
`;

const FavoriteDrawerWrapper = styled.div`
  margin-top: 2rem;
  margin-bottom:2rem;
  user-select:none;
  .defaultPage {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0 1.6rem 4rem 1.6rem;
  }
  
  .editButton {
    display: inline-flex;
    align-items: center;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.dark};
    user-select: none;
    
    .Icon {
      margin-left: .4rem;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.primary.light};
    }
  }
  
  .favoriteArea {
    ${() => areaStyle}
    
    button {
      ${() => blockStyle}
      color: ${({ theme }) => theme.colors.text.lightGray};
      
      img {
        position: absolute;
        height:100%;
        top: 0;
        left: 0;
        z-index: -1;
      }
      
      .Icon {
        margin-bottom: 1.2rem;
        font-size: 3.2rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
      }
      
    }
  }
  .dndArea {
    ${() => areaStyle}
    grid-template-rows: repeat(2, 14.8rem);

    .dndItem {  
        ${() => blockStyle}
        color: ${({ theme }) => theme.colors.text.lightGray};
        margin-bottom:1.6rem;
        user-select:none;
        
        img {
          position: absolute;
          height:100%;
          top: 0;
          left: 0;
          z-index: -1;
        }
        
        .Icon {
          margin-bottom: 1.2rem;
          font-size: 3.2rem;
          color: ${({ theme }) => theme.colors.text.lightGray};
        }
        
        .removeButton {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          width: 2.4rem;
          height: 2.4rem;
          background: ${({ theme }) => theme.colors.primary.light};
          animation: scaleUp .4s backwards;
          transform-origin: center;
          
          svg{
            width: 1.5em;
            height: 1.5em;
            color: white;
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
  
  // 新增 or 編輯 我的最愛頁面
  .editFavoritePage {
    padding: 0 1.6rem 1.6rem 1.6rem;
    
    .MuiTab-root {
      padding: 0 .8rem;
    }
    
    .mainContent {
      height:60vh;
      overflow-y: auto;
      
      section {
        margin-bottom: 2.4rem;
        &:last-of-type{
          margin-bottom:8rem;
        }
        > .title {
          margin-bottom: 1.2rem;
          font-size: 1.6rem;
          font-weight: 500;
          text-align: center;
        }
      }
    }
    
    .blockGroup {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: .8rem;
    }
    
    .tipArea {
      margin-bottom: 2.4rem;
      padding: 1.6rem;
      border-radius: .8rem;
      text-align: center;
      font-size: 1.4rem;
      background: ${({ theme }) => theme.colors.background.lighterBlue};
    }
    
  }
  
`;

export const DndItemContainer = styled.div`
  min-height: ${({ containerLength }) => `${containerLength * 16.4}rem`
};
`;

export const Aaa = styled('div')(() => ({
  '.test': {
    color: 'red',
  },
}));

export default FavoriteDrawerWrapper;
