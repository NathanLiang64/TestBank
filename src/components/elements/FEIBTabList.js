import styled from 'styled-components';
import { TabList as MaterialTabList } from '@material-ui/lab';

/*
* ==================== FEIBTabList 可用選項 ====================
* 1. $size -> List 內的 Tab 大小
*    預設不傳入參數為常規大小，可輸入 "small" 字串
* */
const FEIBTabList = styled(MaterialTabList).attrs({
  variant: 'scrollable',
})`
  margin-bottom: 1.6rem;

  .MuiTabs-indicator {
    background-color: ${({ theme }) => theme.colors.primary.dark};
    border-radius: .1rem;
  }
  
  ${({ $size }) => (
    $size === 'small'
      ? (`
        &.MuiTabs-root {
          min-height: 2.8rem;
          
          &::after {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            width: 3.6rem;
            height: 100%;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
            pointer-events: none;
          }
        }
        .MuiTabs-scroller {
          height: 3rem;
        }
        .MuiTab-root {
          min-width: 5rem;
          min-height: 2.8rem;
          padding: 0;
          height: 2.8rem;
          font-size: 1.4rem;
        }
      `)
      : (`
        .MuiTab-root {
          font-size: 1.6rem;
        }
      `)
  )}
`;

export default FEIBTabList;
