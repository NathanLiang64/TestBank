import styled from 'styled-components';
import Layout from 'components/Layout';

const T00300Wrapper = styled(Layout)`
  padding: 2.4rem 1.6rem;
  .setting_switch {
    height: 10rem;
    display: flex;
    background-color: ${({theme}) => theme.colors.background.lighterBlue};
    padding-left: 2rem;
    align-items: center;
    border-radius: .8rem .8rem 0 0;
    border-bottom: 1.5px dashed ${({theme}) => theme.colors.border.light};
  }
  .phone_number {
    height: 12rem;
    padding: 2rem;
    background-color: ${({theme}) => theme.colors.background.lighterBlue};
    border-radius: 0 0 .8rem .8rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .text {
        .mobile_number_text {
            margin-top: 2rem;
            color: ${({theme}) => theme.colors.text.lightGray};
        }
    }
    .edit {
        width: 3rem;
        height: 3rem;
    }
  }
`;

export default T00300Wrapper;
