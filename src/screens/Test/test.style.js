import styled from 'styled-components';

const TestWrapper = styled.div`
  margin: 0 auto;
  padding-top: 4rem;
  width: 40rem;

  section {
    margin-bottom: 6rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  h2 {
    font-weight: bold;
    margin-bottom: 1.2rem;
  }
  
  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1.6rem;
  }
`;

export default TestWrapper;
