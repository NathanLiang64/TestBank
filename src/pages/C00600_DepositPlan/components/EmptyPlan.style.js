import styled from 'styled-components';

const EmptyPlanWrapper = styled.div`
  padding: 0.6rem 1.6rem;

  h2 {
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text.dark};
    font-weight: 500;
    margin-bottom: 1.6rem;
  }

  p {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.light};
    margin-bottom: 1.2rem;
  }

  button {
    margin-top: 5.4rem;
  }
`;

export default EmptyPlanWrapper;
