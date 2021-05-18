import styled from 'styled-components';

const NoticeAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 32rem;
  margin: 2.4rem 0;
  overflow-y: scroll;
  
  h3 {
    font-size: 1.6rem;
    font-weight: bold;
  }

  div {
    margin: .8rem 0;
    padding: 1.2rem;
    border: .1rem solid ${({ theme }) => theme.colors.border.lighter};
    width: 100%;
    font-size: 1.3rem;
    text-align: ${({ $textAlign }) => $textAlign || 'center'};
    max-height: calc(32rem - .8rem);
    overflow: auto;
    
    p {
      margin-bottom: .8rem;
    }
  }
`;

export default NoticeAreaWrapper;
