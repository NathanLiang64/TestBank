import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding-bottom: 6rem;

  .badMargin {
    margin-block-end: -2.4rem;
  }

  .flex {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ml-4 {
    margin-inline-start: 3rem;
  }

  .mt-4 {
    margin-block-start: 3rem;
  }
`;

const PopUpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  gap: 1rem;

  .note {
    text-align: center;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }
`;

export default PageWrapper;
export { PopUpWrapper };
