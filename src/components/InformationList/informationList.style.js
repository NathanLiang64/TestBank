import styled from 'styled-components';

const InformationListWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.6rem .8rem;
  border-bottom: .1rem dashed ${({ theme }) => theme.colors.text.light};

  &:last-child {
    border-bottom: 0;
  }

  p.title {
    font-size: 1.6rem;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  > div {
    max-height: 4.2rem;
    text-align: right;

    .content {
      font-size: 1.6rem;
      line-height: 1.3;
      color: ${({ theme }) => theme.colors.text.dark};
    }

    .remark {
      display: inline-block;
      height: 1.8rem;
      line-height: 1.3;
      font-size: 1.2rem;
      font-weight: 300;
      color: ${({ theme }) => theme.colors.text.light};
    }
`;

export default InformationListWrapper;
