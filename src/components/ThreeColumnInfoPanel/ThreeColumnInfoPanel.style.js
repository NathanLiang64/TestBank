import styled from 'styled-components';

const ThreeColumnInfoPanelWrapper = styled.div`
  display: flex;
  gap: 1rem;
 
  & > * {
    flex: 1 1 auto;
    text-align: center;
  }

  .label {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  .value {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary.light};
  }

  .Icon {
    display: block;
    margin-inline-start: 0.2rem;
  }
`;

export default ThreeColumnInfoPanelWrapper;
