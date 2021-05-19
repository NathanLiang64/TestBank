import styled from 'styled-components';
import Layout from 'components/Layout';

const BillPayWrapper = styled(Layout)`
  
  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1.6rem;
  }
  
  .formAreaTitle {
    display: flex;
    
    h2 {
      margin-right: 1.6rem;
      margin-bottom: .8rem;
    }
  }
  
  .smallFontSize {
    display: inline-block;
    margin-right: .4rem;
    font-size: 1.3rem;
  }

  section {
    margin-bottom: 2.4rem;
    
    h2 {
      margin-bottom: 1.6rem;
      font-weight: bold;
    }
    
    .customSize {
      min-height: unset;
      padding-left: 1.2rem;
      padding-right: 1.2rem;
      padding-bottom: .1rem;
      width: unset;
      height: 2.8rem;
      font-size: 1.4rem;
    }
    
    .customStyles {
      margin: 0;
      width: 10rem;
      
      .MuiInputBase-input {
        padding: .4rem 0;
      }
    }
    
    .customBottomSpace {
      margin-bottom: 1.6rem;
    }
    
    .customPadding {
      padding-top: .4rem;
      padding-bottom: .4rem;
    }
    
    .customTopSpace {
      margin-top: 0;
    }
  }
`;

export default BillPayWrapper;
