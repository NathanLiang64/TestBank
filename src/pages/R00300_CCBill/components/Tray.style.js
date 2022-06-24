import styled from 'styled-components';

const TrayWrapper = styled.div`
  .badFlex {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    padding-block: 1.6rem;

    & > * {
      border-left: 1px solid ${({ theme }) => theme.colors.basic.white};
    }
    & > *:first-child {
      border-left-color: transparent;
    }
    .download {
      height: 2rem;
      width: 2rem;
      font-size: 2rem;
    }
  }
`;

export default TrayWrapper;
