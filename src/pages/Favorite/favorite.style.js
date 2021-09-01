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
      padding: 0;
      height: 14.8rem;
      border: .2rem dashed #CCC;
      border-radius: .8rem;
      font-size: 1.6rem;
      
      .icon {
        font-size: 3.2rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
      }
    }
  }
`;

export default FavoriteDrawerWrapper;
