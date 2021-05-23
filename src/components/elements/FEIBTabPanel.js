import styled from 'styled-components';
import { TabPanel as MaterialTabPanel } from '@material-ui/lab';

/*
* ==================== FEIBTabPanel 可用選項 ====================
* */
const FEIBTabPanel = styled(MaterialTabPanel)`
  &.MuiTabPanel-root {
    padding: 0;
  }
`;

export default FEIBTabPanel;
