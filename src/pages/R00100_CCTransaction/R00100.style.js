import styled from 'styled-components';

const PageWrapper = styled.div`
  // padding-block: 4.4rem;
  padding: 4.4rem 0;

  .bg-gray {
    background-color: ${({ theme }) => theme.colors.background.lighterBlue};
    padding: 1.6rem;
    // padding-block-end: 4.6rem;
    padding-bottom: 4.6rem;
  }

  .txn-wrapper {
    background-color: ${({ theme }) => theme.colors.basic.white};
    padding-inline: 1.6rem;
    // margin-block-start: -3rem;
    // padding-block-start: 3rem;
    margin-top: -3rem;
    padding-top: 3rem;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
  }

  .note {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.light};
    // margin-block-start: 1.6rem;
    margin-top: 1.6rem;
    margin-inline: 1.6rem;
  }

  .loader {
    height: 9.2rem;
  }
`;

const DetailDialogErrorMsg = styled.div`
.errorMsg {
  visibility:hidden;
}
.errorBorder{
  &:before,
  &:hover:not(.Mui-disabled):before {
    border-color:#FF5F5F !important;
  }
}

.badIcon {
  margin: -1.1rem;
  height: fit-content;
}

.remark {
  display: flex;
  justify-content: right;
  align-items: center;

  span {
    margin-bottom: .2rem;
    font-size: 1.2rem;
    letter-spacing: .05rem;
    color: ${({ theme }) => theme.colors.text.light};
  }

  svg {
    color: ${({ theme }) => theme.colors.primary.light};
    font-size: 2.13rem;
    margin-left: .4rem;
    width:16px;
  }
}
`;

export default PageWrapper;
export { DetailDialogErrorMsg };
