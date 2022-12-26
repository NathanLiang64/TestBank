import styled from 'styled-components';

const EmptyDataWrapper = styled.div`
  height: fit-content;
  text-align: center;
  margin-top: 1rem;
  
  img {
    margin-bottom: .4rem;
    width: 6rem;
  }
  
  p {
    color: ${({ $color, theme }) => $color || theme.colors.text.light};
  }
`;

export default EmptyDataWrapper;
