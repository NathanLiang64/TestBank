import styled from 'styled-components';
import Layout from 'components/Layout';

export const T00300Wrapper = styled(Layout)`
  padding: 2.4rem 1.6rem;
  .info_container {
    border-top: 1px solid ${({ theme }) => theme.colors.text.placeholder};
    border-bottom: 1px solid ${({ theme }) => theme.colors.text.placeholder};
    padding: 1.2rem 0rem;
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

export const DrawerContentWrapper = styled.div`
  padding: 1rem;

  .hint_container {
    margin: 2rem 0 4rem 0;
    color: ${({theme}) => theme.colors.text.dark};
    font-size: 14px;

    .hint_link_text {
      color: ${({theme}) => theme.colors.text.light};
    }
  }

  .btns {
    margin: 2rem 0;
  }
`;
