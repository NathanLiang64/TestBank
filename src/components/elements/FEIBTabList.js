import styled from 'styled-components';
import { TabList as MaterialTabList } from '@material-ui/lab';

/*
* ==================== FEIBTabList 可用選項 ====================
* 1. $trackColor -> 目前頁面指示 bar 的顏色
* */
const FEIBTabList = styled(MaterialTabList).attrs({
  variant: 'scrollable',
})`
  margin-bottom: 1rem;
  .MuiTabs-indicator {
    background-color: ${({ theme, $color }) => $color || theme.colors.primary.brand};
    height: 5px;
    border-radius: 2.5px;
  }
`;

export default FEIBTabList;
