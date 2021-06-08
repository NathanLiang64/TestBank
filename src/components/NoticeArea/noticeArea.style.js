import styled from 'styled-components';

const handleSpaceType = (position) => {
  switch (position) {
    case 'top':
      return '2.4rem 0 0 0';
    case 'bottom':
      return '0 0 2.4rem 0';
    case 'both':
      return '2.4rem 0';
    default:
      return '0';
  }
};

const NoticeAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 32rem;
  margin: ${({ $space }) => handleSpaceType($space)};
  overflow-y: auto;
  
  h3 {
    font-size: 1.4rem;
  }

  div {
    max-height: calc(32rem - .8rem);
    margin: .8rem 0;
    padding: 1.2rem;
    border: .1rem solid ${({ theme }) => theme.colors.border.lighter};
    border-radius: .4rem;
    width: 100%;
    font-size: 1.4rem;
    font-weight: 300;
    text-align: ${({ $textAlign }) => $textAlign || 'center'};
    color: ${({ theme }) => theme.colors.text.light};
    overflow: auto;
    
    * {
      color: ${({ theme }) => theme.colors.text.light};
    }
    
    p {
      margin-bottom: .8rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
`;

export default NoticeAreaWrapper;
