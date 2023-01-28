import styled from 'styled-components';

const D00300Wrapper = styled.div`
.withdrawAmount {
  &.MuiInput-underline.Mui-disabled:before {
    border-bottom-style: solid;
  }
  margin-left: 2.5rem;
  width: calc(100% - 5rem);
}

#withdrawAmount {
  text-align: center;
}

.addMinusIcons {
  transform: translateY(calc(-100% - 0.8rem));
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.primary.light};
  svg {
    font-size: 2rem;
  }
}

.limit-label {
  transform: translateY(-85%);
  height: 1.8rem;
  line-height: 1.8rem;
}

.amountButtonsContainer {
  margin: 0 0 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .withdrawalBtnContainer {
    margin-bottom: 1rem;
    .customSize {
      min-height: unset;
      padding-left: 1.2rem;
      padding-right: 1.2rem;
      padding-bottom: .1rem;
      width: unset;
      height: 2.8rem;
      font-size: 1.4rem;
    }

    .withdrawal-btn {
      width: 10rem;
    }
  }
}
`;

export default D00300Wrapper;
