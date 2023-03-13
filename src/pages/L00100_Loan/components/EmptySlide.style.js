import styled from 'styled-components';

const EmptySlideWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text.light};
  text-align: center;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background.lightBlue};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .Icon {
    width: fit-content;
    height: fit-content;
  }

  .title {
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 2rem;
    line-height: 3rem;
  }
`;

export default EmptySlideWrapper;
