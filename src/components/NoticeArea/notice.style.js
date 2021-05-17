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
    width: 100%;
    border: .1rem solid ${({ theme }) => theme.colors.border.lighter};
    font-size: 1.4rem;
    text-align: center;
  }
`;

export default NoticeAreaWrapper;
