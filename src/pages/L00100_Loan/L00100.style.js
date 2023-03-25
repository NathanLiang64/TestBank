import styled from 'styled-components';

export const ContentWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  padding: 0 1.6rem 6rem;

  .panel {
    padding-top: 0.8rem;
    padding-bottom: 1.6rem;
  }

  .toolbar {
    width: fit-content;
    margin-left: auto;
  }

  .remark {
    margin: 1rem;
    text-align: left;
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 1.4rem;
    line-height: 2.1rem;
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

export const RewardPageWrapper = styled.div`
  display: grid;
  align-content: flex-start;
  grid-gap: 2.4rem;
  padding-bottom: 6rem;

  .text-red {
    color: ${({ theme }) => theme.colors.state.error};
  }
`;
