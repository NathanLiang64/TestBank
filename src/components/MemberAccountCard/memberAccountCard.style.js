import styled from 'styled-components';

const MemberAccountCardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1.6rem 1.2rem;
  border-radius: .6rem;
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  
  .memberInfo {
    margin-left: 1.2rem;
    h3 {
      font-size: 1.6rem;
      font-weight: 500;
    }

    p {
      font-size: 1.2rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
  
  .changeMemberButton {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
`;

export default MemberAccountCardWrapper;
