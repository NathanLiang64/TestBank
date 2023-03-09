import styled from 'styled-components';
import Layout from 'components/Layout';

const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  display: flex;
  flex-direction: column;
  padding: 0;

  .drawer {
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    width: 100%;
    background: ${({ theme }) => theme.colors.basic.white};
    margin-top: 3rem;

    ul {
      li:first-child {
        .invoice-title {
          border-radius: 3rem 3rem 0 0;
        }
      }

      li {
        .invoice-title {
          background-color: ${({ theme }) => theme.colors.card.purple};
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .invoice-content {
          margin: 2rem 0;
          & > div {
            display: grid;
            grid-gap: 0.5rem; 
            grid-template-columns: 1fr 1fr 1fr;
            border-bottom: 0.5px solid gray;
            margin: 0.5rem auto;
            padding: 1rem 2rem;
            width: 95%;
            font-size: 1.4rem;

            &:first-of-type {
              border-top: 0.5px solid gray;
            }

            .btn {
              min-width: unset;
              min-height: unset;
              height: auto;
              width: 65%;
              font-size: 1rem;
              margin: 0;
            }
          }
        }
      }
    }
  }
`;

export default PageWrapper;
