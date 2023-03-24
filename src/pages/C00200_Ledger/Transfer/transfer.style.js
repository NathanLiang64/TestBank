/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import Layout from 'components/Layout';

export const TransferPageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.light};
  min-height: fit-content;
  overflow-y: scroll;
  padding-bottom: 2rem;

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

export const TransferConfirmWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.light};
  min-height: fit-content;
  overflow-y: scroll;
  padding-bottom: 2rem;

  .banner {
    background: ${({ theme }) => theme.colors.basic.white};
    display: flex;
    align-items: center;
    justify-content: center;

    margin-left: -1.6rem;
    height: 4rem;
    width: 100vw;

    .banner_image {
      height: 1.8rem;
      width: 1.8rem;
      margin-left: .6rem;
    }
  }

  .transfer_form {
    margin-top: 2rem;
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;

    .transout_info_wrapper {
      display: flex;
      justify-content: flex-end;
      color: ${({ theme }) => theme.colors.text.lightGray};
      font-size: 1.4rem;
    }

    .otp_container {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: 50% 30%;
      justify-content: space-between;
      margin: 1rem;

      .timer_wrapper {
        .timer_text {
          font-size: 1.4rem;
          line-height: 1;
        }
      }
    }
  }
`;

export const TransferFinishWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.light};
  min-height: fit-content;
  overflow-y: scroll;
  padding-bottom: 2rem;

  .banner {
    background: ${({ theme }) => theme.colors.basic.white};
    display: flex;
    align-items: center;
    justify-content: center;

    margin-left: -1.6rem;
    height: 4rem;
    width: 100vw;

    .banner_image {
      height: 1.8rem;
      width: 1.8rem;
      margin-left: .6rem;
    }
  }

  .transfer_form {
    margin: 2rem 0;
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;
    min-height: fit-content;

    .transout_info_wrapper {
      display: flex;
      justify-content: flex-end;
      color: ${({ theme }) => theme.colors.text.lightGray};
      font-size: 1.4rem;
    }
  }
`;
