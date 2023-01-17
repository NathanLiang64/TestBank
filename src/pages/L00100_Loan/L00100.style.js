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
`;

export const RewardPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding-bottom: 6rem;

  .text-red {
    color: ${({ theme }) => theme.colors.state.error};
  }
`;

export const DetailPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding-bottom: 6rem;

  hr {
    border: none;
  }

  .text-14 {
    font-size: 1.4rem;
  }

  .remark {
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 1.4rem;
    line-height: 2.1rem;
  }
`;

export default PageWrapper;
export { ContentWrapper };
