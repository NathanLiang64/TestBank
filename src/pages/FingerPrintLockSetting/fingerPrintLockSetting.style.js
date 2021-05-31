import styled from 'styled-components';
import Layout from 'components/Layout';
// import theme from 'themes/theme';

const FingerPrintLockSettingWrapper = styled(Layout)`
  .checkBoxContainer {
    margin-bottom: 1rem;
    .MuiFormControlLabel-root {
      align-items: flex-start;
      .MuiButtonBase-root {
        padding-top: 4px;
      }
    }
  }
`;

export default FingerPrintLockSettingWrapper;
