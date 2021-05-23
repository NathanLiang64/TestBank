import styled from 'styled-components';
import { Tab as MaterialTab } from '@material-ui/core';

/*
* ==================== FEIBTab 可用選項 ====================
* */
const FEIBTab = styled(MaterialTab)`
  flex: 1 1 auto;
  &.MuiTab-root {
    font-size: 100%;
  }
`;

export default FEIBTab;
