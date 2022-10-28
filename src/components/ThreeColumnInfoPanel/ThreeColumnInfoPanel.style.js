import styled from 'styled-components';

const ThreeColumnInfoPanelWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
  width: 100%;

  & > * {
    flex: 1 1 33%;
    text-align: center;
  }

  .label {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    gap: 0.5rem;
    height: 1.6rem;
    margin-block-end: 0.3rem;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  .value {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary.light};
  }

  .Icon {
    display: block;
    height: 1.4rem;
  }
`;

export default ThreeColumnInfoPanelWrapper;
