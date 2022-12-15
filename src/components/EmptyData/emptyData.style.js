import styled from 'styled-components';

const EmptyDataWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
