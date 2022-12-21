import styled from 'styled-components';

const PageWrapper = styled.div`
  padding-top: 5.4rem;

  .toolbar {
    width: fit-content;
    margin-left: auto;
  }

  .btn-icon {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    width: fit-content;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-inline: 1.6rem;
  padding-bottom: 6rem;
  margin-top: 2.5rem;

  .emptydata-wrapper {
    width: 100%;
    height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default PageWrapper;
export { ContentWrapper };
