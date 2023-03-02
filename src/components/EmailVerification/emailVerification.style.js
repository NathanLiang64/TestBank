/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import Layout from 'components/Layout';

const EmailConfirmWrapper = styled('div')`
  padding: 1.6rem;
  .page_container {
    position: relative;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text.dark};
    
    .email_showcase {
      padding-left: 1rem;
    }

    .footer_text {
      margin: 1rem 2rem 2rem;
      font-size: 1.4rem;
      list-style: auto;
      color: ${({ theme }) => theme.colors.text.light};

      li{
        border:none;
        margin-bottom: .5rem;
      }
    }
    
    .btn_container {
      width: 100%;
      display: -webkit-flex;
      display: flex;
      justify-content: space-between;
    }
  }
`;

export default EmailConfirmWrapper;
