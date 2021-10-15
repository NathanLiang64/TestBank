import styled from 'styled-components';

const InformationTapeWrapper = styled.div`
  padding: 1.2rem;
  box-shadow: 0 .4rem 1rem rgba(0, 0, 0, 0.12);
  border-radius: .6rem;
  display: flex;
  justfy-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;

  img {
    width: 2.8rem;
    height: 2.8rem;
    margin-right: 1.2rem;
  }
  .dataContainer {
    flex-grow: 1;
    .top, .bottom {
      display: flex;
      justify-content: space-between;
    }
    .top {
      font-size: 1.6rem;
      line-height: 2.4rem;
      color: ${({ theme }) => theme.colors.text.dark};
    }
    .bottom {
      font-size: 1.2rem;
      line-height: 1.8rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
`;

export default InformationTapeWrapper;
