import styled from 'styled-components';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const DateRangePickerWrapper = styled.div`

  .rdrDefinedRangesWrapper {
    display: none;
  }
  
  .dateRangePickerMask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.background.mask};
    z-index: 10;
  }

  .dateRangePickerWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    width: 100%;
    top: 50%;
    left: 50%;
    padding: 0 2.4rem;
    transform: translate(-50%, -50%);
    z-index: 20;
  }
  
  .buttons {
    display: flex;
    justify-content: flex-end;
    padding: .8rem 1.2rem;
    border-bottom-left-radius: .8rem;
    border-bottom-right-radius: .8rem;
    width: 100%;
    background: ${({ theme }) => theme.colors.basic.white};
    box-shadow: 0 .8rem 4rem rgb(0 0 0 / 24%);

    .MuiButton-root {
      font-size: 1.4rem;
      
      &.cancel {
        color: ${({ theme }) => theme.colors.text.lightGray};
      }
      
      &.apply {
        color: ${({ theme }) => theme.colors.primary.dark};
      }
    }
  }

  .rdrDateRangePickerWrapper {
    border-top-left-radius: .8rem;
    border-top-right-radius: .8rem;
    width: 100%;
    overflow: hidden;
    z-index: 1;
  }
  
  .rdrDateRangeWrapper {
    width: 100%;
    //border-radius: .8rem;
    //overflow: hidden;
  }
  
  .rdrMonths .rdrMonth {
    width: 100%;
  }

  .rdrDay .rdrInRange {
    opacity: .6;
  }

  .rdrDayToday .rdrDayNumber span:after {
    background: ${({ theme }) => theme.colors.primary.light};
  }

  .rdrDateDisplayWrapper {
    background: ${({ theme }) => theme.colors.primary.brand};
  }
  
  .rdrDateDisplay {
    margin: 3.2rem 1.6rem;
  }

  .rdrDateDisplayItem {
    background-color: transparent;
    border: 0;
    box-shadow: none;
    
    &.rdrDateDisplayItemActive {
      input {
        opacity: 1;
      }
    }
    
    input,
    input::placeholder {
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.basic.white};
      opacity: .6;
    }
  }
`;

export default DateRangePickerWrapper;
