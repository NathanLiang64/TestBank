import styled from 'styled-components';

const EmptyPlanWrapper = styled.div`
  padding: 0.6rem 1.6rem;
  
  hr {
    border-color: ${({ theme }) => theme.colors.border.lightest};
    margin: 0.5rem 0;
    border-width: 0.5px;
  }
  
  h2 {
    color: ${({ theme }) => theme.colors.primary.light};
    font-size: 1.6rem;
    margin: 1rem 0;
  }
  
  p {
    margin-bottom: 0.5rem;
    margin-left: 2rem;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.dark};
  }

  button {
    margin-top: 2rem;
  }
`;

export default EmptyPlanWrapper;
