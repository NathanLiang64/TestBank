import styled from 'styled-components';

const EmptySlideWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text.light};
  text-align: center;

  .bg-gray {
    padding-top: 112px;
    background-color: ${({ theme }) => theme.colors.background.lightBlue};
    height: 252px;
  }

  .title {
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 2rem;
    line-height: 3rem;
  }

  .slogan {
    color: ${({ theme }) => theme.colors.text.light};
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 2.4rem;
    margin-top: 3rem;
  }
`;

export default EmptySlideWrapper;
