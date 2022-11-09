import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  // gap: 2rem;
  padding-bottom: 13.6rem;
  & > div {
    margin-bottom: 2rem;
  }
  .fixed-bottom {
    position: fixed;
    bottom: 6rem;
    inset-inline: 0;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.basic.white};
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 1.4rem;
    line-height: 2.1rem;
  }
`;

export default PageWrapper;
