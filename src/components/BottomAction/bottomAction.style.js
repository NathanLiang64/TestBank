import styled from 'styled-components';

const BottomActionWrapper = styled.div.attrs({
  className: 'BottomAction',
})`
  position: fixed;
  left: 0;
  bottom: ${({ $bottomPosition }) => {
    if ($bottomPosition === 0) return '0';
    if ($bottomPosition) return `${$bottomPosition / 10}rem`;
    return '6rem';
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1.6rem;
  width: 100%;
  height: 6rem;
  border-top-left-radius: 3rem;
  border-top-right-radius: 3rem;
  background: ${({ theme }) => theme.colors.primary.light};

  * {
    color: ${({ theme }) => theme.colors.basic.white};
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 1.8rem;
    line-height: 1.43;

    .Icon {
      top: -.2rem;
      margin-right: .4rem;
      font-size: 2.4rem;
    }
  }

  .divider {
    display: block;
    width: .1rem;
    height: 3.6rem;
    margin: 0 1.2rem;
    background: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

export default BottomActionWrapper;
