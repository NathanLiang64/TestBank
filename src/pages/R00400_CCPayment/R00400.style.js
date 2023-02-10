import Layout from 'components/Layout';
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
    display: grid;
    align-content: flex-start;
    grid-gap: 1rem;
  }

  .ml-4 {
    margin-inline-start: 3rem;
    bottom: 2rem;
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

export const ResultWrapper = styled(Layout)`
  padding: 2.4rem 0;

  .resultContainer {
    display: flex;
    flex-direction: column;
    gap: 3rem;

    .mb-2 {
      margin-block-end: 1rem;
    }

    .deduct {
      background-color: ${({ theme }) => theme.colors.background.lighterBlue};
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-radius: 0.8rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
      margin: 1rem 0;
    }

    .text-gray {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }

    .auto {
      margin-block-start: 3rem;
      text-align: center;

      button {
        color: ${({ theme }) => theme.colors.text.dark};
        margin-block-start: 0.8rem;
      }

      .circle {
        border: 2px solid ${({ theme }) => theme.colors.text.dark};
        display: inline-block;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 100%;
        margin-right: 0.4rem;
        vertical-align: -0.2rem;
      }
    }

    .bluelineBottom {
      border-top: 0.8rem solid
        ${({ theme }) => theme.colors.background.lighterBlue};
      padding: 2.4rem 1.6rem 0;
    }
  }
`;

export default PageWrapper;
export { PopUpWrapper };
