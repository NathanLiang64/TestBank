import styled from 'styled-components';
import Layout from 'components/Layout';

const ExchangeWrapper = styled(Layout)`
  table {
    margin-bottom: 2rem;
  }
  section {
    &.barcodeArea {
      padding: 2.4rem;
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
      width: calc(100% - 2rem);
      
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
      padding-right: .4rem;
    }
    
    .customTopSpace {
      margin-top: 0;
    }
  }
  .formAreaTitle {
    display: flex;
    justify-content: space-between;

    h2 {
      margin-right: 1.6rem;
      margin-bottom: .8rem;
    }
  }
  ol {
    padding-left: 2.4rem;
  }
  li {
    list-style-type: decimal;
    margin-bottom: 1rem;
    &:first-child {
      color: ${({ theme }) => theme.colors.text.point};
    }
  }
  .MuiFormHelperText-root.Mui-error {
    &.balance {
      position: absolute;
      color: ${({ theme }) => theme.colors.text.dark};
      text-align: left;
      transform: translateY(calc(-100% - 3px));
    }
  }
`;

export default ExchangeWrapper;
