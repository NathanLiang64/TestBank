import styled from 'styled-components';
import Layout from 'components/Layout';

const DeductWrapper = styled(Layout)`
  .titleLabel {
    margin-bottom: 1rem;
  }
  .checkBoxContainer {
    margin-bottom: 1rem;
  }
  .inputContainer {
    margin-bottom: 2rem;
  }
  .fc-r {
    color: ${({ theme }) => theme.colors.text.point};
  }
  .tableContainer {
    margin: 1rem 0;
  }
  ol {
    padding-left: 2.4rem;
  }
  li {
    list-style-type: decimal;
    margin-bottom: 1rem;
  }
`;

export default DeductWrapper;
