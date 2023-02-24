/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import Layout from 'components/Layout';

const TransferPageWrapper = styled(Layout)`
  // background: ${({ theme }) => theme.colors.background.lighterBlue};
  min-height: fit-content;

  .transfer_form {
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;

    .transout_info_wrapper {
      display: flex;
      justify-content: space-between;
      color: ${({ theme }) => theme.colors.text.lightGray};
      font-size: 1.4rem;
    }
  }

  .warning_text {
    color: ${({ theme }) => theme.colors.text.point};
    font-size: 1.4rem;
  }
`;

export default TransferPageWrapper;
