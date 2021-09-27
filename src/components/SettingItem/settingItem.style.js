import styled from 'styled-components';

const SettingItemWrapper = styled.div`
  postition: relative;
  padding: 1.2rem;
  height: 7rem;
  border-top: ${({ theme }) => `.1rem solid ${theme.colors.border.lighter}`};

  &:last-child {
    border-bottom: ${({ theme }) => `.1rem solid ${theme.colors.border.lighter}`};
  }

  .mainLabel {
    font-size: 1.8rem;
    font-weight: 400;
    line-height: 2.7rem;
    color: ${({ theme }) => theme.colors.text.dark};
  }

  .subLabel {
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1.8rem;
    color: ${({ theme }) => theme.colors.text.light};
  }

  .actionsContainer {
    top: 0;
    right: 0;
    position: absolute;
    display: flex;
    height: 100%;
    color: ${({ theme }) => theme.colors.basic.white};
    transform: translateX(calc(100% + 1.6rem));
    transition: all .3s ease-out;

    &.show {
      transform: translateX(1.6rem);
    }

    .actionBtn {
      width: 6.8rem;
      height: 6.8rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &.edit {
        background-color: ${({ theme }) => theme.colors.primary.light};
      }
      &.delete {
        background-color: ${({ theme }) => theme.colors.state.danger};
      }

      svg {
        font-size: 2rem;
        margin-bottom: .5rem;
      }

      span {
        font-size: 1.2rem;
        font-weight: 400;
        line-height: 1.8rem;
      }
    }
  }
`;

export default SettingItemWrapper;
