import styled from 'styled-components';
import { MenuItem as MaterialOption } from '@material-ui/core';

const FEIBOption = styled(MaterialOption)`
  
  &.MuiMenuItem-root {
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text.lightGray};
    
    &.Mui-selected {
      color: ${({ theme }) => theme.colors.primary.dark};
    }
    &.Mui-disabled {
      color: ${({ theme }) => theme.colors.border.light};
    }
  }
`;

export default FEIBOption;
