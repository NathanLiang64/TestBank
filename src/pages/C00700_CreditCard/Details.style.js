import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding-bottom: 6rem;

  .heading {
    font-size: 1.8rem;
    margin-top: 1.6rem;
  }

  hr {
    border: none;
  }

  .mb-4 {
    margin-block: 1.6rem 3.2rem;
  }
`;

export default PageWrapper;
