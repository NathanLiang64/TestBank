import styled from 'styled-components';
import { MenuItem as MaterialOption } from '@material-ui/core';

const FEIBOption = styled(MaterialOption)`
  
  &.MuiMenuItem-root {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.lightGray};
    
    &.Mui-selected {
      color: ${({ theme }) => theme.colors.primary.brand};
    }
  }
`;

export default FEIBOption;
