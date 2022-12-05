import styled from 'styled-components';
import Layout from 'components/Layout';

const T00300Wrapper = styled(Layout)`
  padding: 2.4rem 1.6rem;
  .info_container {
    border-top: 1px solid ${({ theme }) => theme.colors.text.placeholder};
    border-bottom: 1px solid ${({ theme }) => theme.colors.text.placeholder};
    padding: 1rem 0rem;
  }
  .setting_switch {
    height: 6rem;
    display: flex;
    background-color: ${({theme}) => theme.colors.basic.white};
    padding-left: 2rem;
    align-items: center;
  }
  .phone_number {
    height: 12rem;
    width: 100%;
    padding: 2rem;
    margin-top: 2rem;
    background-color: ${({theme}) => theme.colors.background.lighterBlue};
    border-radius: .8rem;
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
