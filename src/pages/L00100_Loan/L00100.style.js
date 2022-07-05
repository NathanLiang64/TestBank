import styled from 'styled-components';

const PageWrapper = styled.div`
  padding-block: 4.4rem 6rem;

  .toolbar {
    display: flex;
    justify-content: end;
    width: 100%;
  }

  .btn-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    width: fit-content;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding-inline: 1.6rem;
  padding-bottom: 6rem;
`;

export default PageWrapper;
export { ContentWrapper };
