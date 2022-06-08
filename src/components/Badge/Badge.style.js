import styled from 'styled-components';

const BadgeWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  padding: 1.6rem;
  color: ${({ theme, $color }) => $color || theme.colors.primary.brand};
  text-align: center;
  box-radius: 0.8rem;
  min-height: 9.8rem;

  .label {
    color: ${({ theme }) => theme.colors.text.lightGray};
    font-size: 1.4rem;
    line-height: 2.1rem;
  }

  .value {
    font-weight: 500;
    font-size: 3rem;
    line-height: 4.5rem;
  }
`;

export default BadgeWrapper;
