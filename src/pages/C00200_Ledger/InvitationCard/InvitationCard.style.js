import styled from 'styled-components';

const PageWrapper = styled('div')`
  min-height: fit-content;
  margin: 2rem 1rem;

  .ledger_name_container {
    margin-bottom: 2rem;
    font-size: 1.8rem;
    display: flex;
    justify-content: center;
  }

  .image_container {
    display: flex;
    justify-content: center;
  }
  .hint_container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }

  .info_container {
    margin: 3rem;
    .info_row {
      display: grid;
      grid-auto-flow: column;
      gap: 4rem;
      justify-content: start;
    }
  }

  
`;

export default PageWrapper;
