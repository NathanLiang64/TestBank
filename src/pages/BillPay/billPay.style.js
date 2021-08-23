import styled from 'styled-components';
import Layout from 'components/Layout';

const BillPayWrapper = styled(Layout)`
  
  .debitCard {
    margin-bottom: .8rem;
  }
  
  .accordion {
    margin-bottom: 4rem;
  }
  
  .buttons {
    margin-top: .6rem;
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
  
  .tip {
    margin: 1.8rem 0;
    text-align: center;
    font-weight: bold;
  }
  
  .smallFontSize {
    display: inline-block;
    margin-right: .4rem;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.dark};
  }

  section {
    margin-bottom: 2.4rem;

    &.barcodeArea {
      padding: 2rem 2.4rem 0;
    }
    
    .place {
      margin-bottom: 2.4rem;
    }
    
    .barcode {
      width: 100%;
    }

    h2 {
      margin-bottom: 1.6rem;
      font-weight: bold;
    }
    
    .customSize {
      top: -.3rem;
      min-height: unset;
      margin-left: 0;
      padding-left: 1.2rem;
      padding-right: 1.2rem;
      padding-bottom: .1rem;
      width: unset;
      height: 2.8rem;
      font-size: 1.4rem;
    }
    
    .customStyles {
      font-size: 1.6rem;
      //margin: 0;
      //width: calc(100% - 2rem);
      
      .MuiInputBase-input {
        padding-left: .8rem;
      }
    }
    
    .customBottomSpace {
      margin-bottom: 1.6rem;
    }
    
    .customPadding {
      //padding-top: .4rem;
      //padding-bottom: .4rem;
      //padding-right: .4rem;
    }
    
    .customTopSpace {
      margin-top: 0;
    }
  }
`;

export default BillPayWrapper;
