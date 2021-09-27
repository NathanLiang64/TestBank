import styled from 'styled-components';

const AddNewItemWrapper = styled.div`
  border-top: ${({ theme }) => `.1rem solid ${theme.colors.border.lighter}`};
  height: 7rem;
  padding: 1.2rem .8rem;
  display: flex;
  align-items: center;

  &:last-child {
    border-bottom: ${({ theme }) => `.1rem solid ${theme.colors.border.lighter}`};
  }
  
  img {
    width: 4.4rem;
    height: 4.4rem;
    margin-right: 1.2rem;
  }

  .addLabel {
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 2.4rem;
    color: ${({ theme }) => theme.colors.primary.light}
  }
`;

export default AddNewItemWrapper;
