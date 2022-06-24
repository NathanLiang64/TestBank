import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 13.6rem;

  .fixed-bottom {
    position: fixed;
    bottom: 12rem;
    inset-inline: 0;
    margin-inline: auto;
    padding-inline: 0.2rem;
    width: fit-content;
    background-color: ${({ theme }) => theme.colors.basic.white};
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 1.4rem;
    line-height: 2.1rem;
  }
`;

export default PageWrapper;
