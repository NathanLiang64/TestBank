import styled from 'styled-components';

const BottomActionWrapper = styled.div.attrs({
  className: 'BottomAction',
})`
  position: fixed;
  bottom: 6rem;
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
    width: 16rem;
    font-size: 1.8rem;
    line-height: 1.43;

    .MuiSvgIcon-root {
      margin-right: .2rem;
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
