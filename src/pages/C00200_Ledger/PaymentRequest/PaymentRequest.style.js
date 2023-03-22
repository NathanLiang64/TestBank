import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.light};
  display: flex;
  flex-direction: column;
  padding: 0 20;

  .content_wrapper {
    margin: 2rem 0;
  }

  .step1_form {
    margin: 2rem 0;

    .form_input_container {
      display: grid;
      align-content: flex-start;
      grid-gap: 2rem;
      margin-top: 2rem;
    }
  }

  .step2_form {
    // margin: 2rem 0;
    min-height: fit-content;

    .search_form {
      display: flex;
      flex-direction: row;
      align-items: flex-end;

      .search_input {
        width: 80vw;
      }
      .search_submit {
        width: 20vw;
      }
    }
    
    .select_form {
      margin: 2rem 0;

      .checkbox_label {
        display: grid;
        align-items: center;
        grid-auto-flow: column;
        gap: 1rem;
      }
    }
  }

  .step3_form {
    input {
      text-align: end;
    }
    .amount_mode_select {
      display: grid;
      grid-auto-flow: column;
      gap: 3rem;

      .separate_field {
        display: grid;
        grid-auto-flow: column;
        gap: 1rem;
        align-items: end;
      }
    }
    .member_amount_table {
      display: grid;
      grid-gap: 1rem;

      .title {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
      }
      .member_amount_column {
        margin-bottom: 1rem;
        display: grid;
        grid-auto-flow: column;
        gap: 1rem;
        grid-template-columns: auto 5rem;

        .member_info {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .member_image {
            width: 3.6rem;
            margin-right: 2rem;
          }
        }
      }
    }
  }
`;

export default PageWrapper;
