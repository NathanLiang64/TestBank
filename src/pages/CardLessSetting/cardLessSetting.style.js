import styled from 'styled-components';
import Layout from 'components/Layout';

const CardLessSettingWrapper = styled(Layout)`
  .mainBlock {
    justify-content: space-between;
    &.switchContainer {
      .labelContainer {
        min-height: 6rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .labelTxt {
          color: ${({ theme }) => theme.colors.text.lightGray};
        }
        .phoneNum {
          color: ${({ theme }) => theme.colors.text.light};
        }
      }
    }
    &.toChangePwd {
      margin-top: 2rem;
    }
  }
`;

export default CardLessSettingWrapper;
