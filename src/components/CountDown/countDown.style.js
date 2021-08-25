import styled from 'styled-components';

const CountDownWrapper = styled.p.attrs({
  className: 'CountDown',
})`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.state.danger};
`;

export default CountDownWrapper;
