import styled from 'styled-components';

const ArrowNextButtonWrapper = styled.div`
  text-align: ${({ $align }) => $align};
  width: 100%;

  button {
    color: ${({ theme }) => theme.colors.text.dark};
    font-size: 1.4rem;
    line-height: 2.1rem;
  }

  .Icon {
    display: inline;
    vertical-align: -0.3rem;
  }
`;

export default ArrowNextButtonWrapper;
