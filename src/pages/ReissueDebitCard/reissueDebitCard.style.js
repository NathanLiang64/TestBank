import styled from 'styled-components';
import Layout from 'components/Layout';

const ReissueDebitCardWrapper = styled(Layout)`
  .noticeArea {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2.4rem 0;
    
    .noticeTitle {
      font-size: 1.6rem;
      font-weight: bold;
    }

    .noticeContent {
      margin: .8rem 0;
      padding: 1.2rem;
      border: .1rem solid ${({ theme }) => theme.colors.border.lighter};
      font-size: 1.4rem;
      text-align: center;
    }
  }
`;

export default ReissueDebitCardWrapper;
