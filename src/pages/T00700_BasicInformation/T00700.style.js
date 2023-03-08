import styled from 'styled-components';
import Layout from 'components/Layout';

const BasicInformationWrapper = styled(Layout)`
  form {
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;
  }

  .selectContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
  }
`;

export const VerifyPrompt = styled.div`
font-size: 1.6rem;

table {
  margin-top: 1rem;
  text-align: center;
    thead,
    tbody {
      font-size: 1.4rem;
      tr td {
        padding: 0.5rem 0;
      }
    }

    thead {
      tr {
        .name {
          min-width: 6rem;
        }
      }
    }

    tbody {
      tr {
        .name {
          font-weight: bold;
        }

        .radiogroup {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
        }
      }
    }
  }
`;

export default BasicInformationWrapper;
