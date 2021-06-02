import styled from 'styled-components';
import { Tab as MaterialTab } from '@material-ui/core';

/*
* ==================== FEIBTab 可用選項 ====================
* */

const FEIBTab = styled(MaterialTab)`
  flex: 1 1 auto;

  &.MuiTab-textColorInherit {
    opacity: 1;
  }
  
  &.Mui-selected {
    .MuiTab-wrapper {
      color: ${({ theme }) => theme.colors.primary.dark};
    }
  }
  
  .MuiTab-wrapper {
    color: ${({ theme }) => theme.colors.primary.light};
  }
`;

export default FEIBTab;
