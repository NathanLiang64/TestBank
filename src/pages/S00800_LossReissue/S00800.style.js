import styled from 'styled-components';
import Layout from 'components/Layout';

const LossReissueWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;

  .lossReissueContent {
    // flex-grow: 1; //下方會留白
  }

  .Button {
    margin-top: 2.4rem;
    margin-bottom: 4rem;
  }

  .notice {
    margin-top: 2.4rem;
    padding: 0 1.6rem;
    font-size: 1.4rem;
    
    .section_1 {
      color: ${({ theme }) => theme.colors.primary.dark};
    }

    .section_2 {
      color: ${({ theme }) => theme.colors.text.light};
    }
    
  }

  .point {
    color: ${({ theme }) => theme.colors.text.point};
  }

  .mainBlock {
    display: flex;
    flex-direction: column;
    padding-top: 1.2rem;
    padding-bottom: 1.2rem;

    li {
      display: flex;
      align-items: center;
      padding: 1.6rem 0.8rem;
      width: 100%;

      &:not(:last-child) {
        border-bottom: 0.1rem dashed ${({ theme }) => theme.colors.text.light};
      }

      .blockLeft {
        flex-grow: 1;

        .label {
          font-weight: 500;

          &.debitCardStatusLabel {
            color: ${({ theme }) => theme.colors.text.lightGray};
          }
        }

        .content {
          margin-top: 0.2rem;
          display: inline-block;
          font-size: 1.2rem;
          line-height: 1.6;
          color: ${({ theme }) => theme.colors.text.light};
        }
      }

      .blockRight {
        width: 7rem;
        text-align: right;

        .debitState {
          color: ${({ theme }) => theme.colors.primary.dark};
        }

        .Icon {
          font-size: 2rem;
        }
      }
    }
  }
`;

export const LossReissueDialogWrapper = styled.div`
  p {
    text-align: center;
  }

  form {
    gap: 2rem;
    padding: 4rem 2rem;
  }

  .formElementGroup {
    display: flex;
    gap: 1.8rem;
    div {
      flex-grow: 1;
    }
  }
`;

export default LossReissueWrapper;
