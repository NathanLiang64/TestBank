/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import Layout from 'components/Layout';

export const PageWrapper = styled(Layout)`
    height: fit-content;
    .form {
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;
    margin-bottom: 2rem;

    .phone_num_verify {
      display: grid;
      grid-auto-flow: column;
      gap: 1rem;
    }

    .otp_code_identifier {
      display: grid;
      grid-auto-flow: column;
      gap: 1rem;
    }
  }
`;
