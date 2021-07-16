import styled from 'styled-components';
import Layout from 'components/Layout';

const LoanInquiryWrapper = styled(Layout)`
  .resultTable {
    margin-top: 2.4rem;
  }
  ol {
    padding-left: 1.2rem;
  }
  li {
    list-style-type: decimal
  }

  form {
    margin-bottom: 1rem;
  }
`;

export default LoanInquiryWrapper;
