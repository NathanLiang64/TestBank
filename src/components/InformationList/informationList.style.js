import styled from 'styled-components';

const InformationListWrapper = styled.div`
  padding: 1.6rem 0.8rem;
  border-bottom: .1rem dashed ${({ theme }) => theme.colors.text.light};

  &:last-child {
    border-bottom: 0;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .text-title {
    font-size: 1.6rem;
    line-height: 2.4rem;
    min-height: 2.4rem;
  }

  .text-remark {
    font-size: 1.2rem;
    line-height: 1.8rem;
    min-height: 1.8rem;
  }

  .text-gray {
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  .text-dark {
    color: ${({ theme }) => theme.colors.text.dark};
  }

  .text-light {
    color: ${({ theme }) => theme.colors.text.light};
  }

  .text-green {
    color: ${({ theme }) => theme.colors.state.success};
    margin-inline-start: 1rem;
  }
`;

export default InformationListWrapper;
