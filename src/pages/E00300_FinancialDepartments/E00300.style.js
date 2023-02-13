import styled from 'styled-components';
import Layout from 'components/Layout';

const FinancialDepartmentsWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  
  .financialCard {
    border-radius: .6rem;
    background: ${({ theme }) => theme.colors.basic.white};
    padding: 2.4rem;
    box-shadow: 0 .4rem 1rem rgb(0 0 0 / 12%);
    margin-bottom: 1.6rem;

    .imgContainer {
      display: flex;
      justify-content: center;
      position: relative;
      height: 3.4rem;
      margin-bottom: 1.6rem;
      img {
        width: auto;
        height: 3.4rem;
      }
    }

    .contentContainer {
      color: ${({ theme }) => theme.colors.text.light};
      font-size: 1.2rem;
      line-height: 1.8rem;
      text-align: justify;
    }
  }
`;

export default FinancialDepartmentsWrapper;
