/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import Layout from 'components/Layout';

const EmailConfirmWrapper = styled(Layout)`
  .page_container {
    height: 90vh;
    position: relative;

    .header_text {
      color:${({theme}) => theme.colors.text.mediumGray};
    }
    .highlight_text {
      color:${({theme}) => theme.colors.text.point};
    }
    .underline_text {
      text-decoration: underline;
    }
    .email_showcase {
      padding-left: 1rem;
    }
    .footer_text {
      margin-top: 3rem;
      margin-bottom: auto;
      color:${({theme}) => theme.colors.text.mediumGray};
    }
    .btn_container {
      position: absolute;
      bottom: 0;
      left: 0;

      width: 100%;
      display: -webkit-flex;
      display: flex;
      justify-content: space-between;
  
      .btn {
        margin: 0;
      }
    }
  }
`;

export default EmailConfirmWrapper;
