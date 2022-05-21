import styled from 'styled-components';

const EmptySlideWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text.light};
  text-align: center;
  padding-top: 112px;

  .title {
    font-size: 2rem;
    margin-bottom: 56px;
  }
`;

export default EmptySlideWrapper;
