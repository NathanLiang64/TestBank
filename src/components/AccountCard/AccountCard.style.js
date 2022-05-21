import styled from 'styled-components';

import CardBackground from 'assets/images/debitCardBackground.png';

/*
 * 1. 母帳戶(深紫)
 * 2. 社群圈(粉)
 * 3. 存錢計劃(黃)
 * 4. 證卷交割帳戶(藍)
 * 5. 外幣帳戶(橘)
 * 6. 信用卡(綠)
 * 7. 貸款卡(淺紫)
 * 8. 社群帳本卡(粉)
*/

const AccountCardWrapper = styled.button`
  display: flex;
  justify-content: flex-begen;
  flex-direction: column;
  gap: 0.7rem;
  background-color: ${({ theme, $cardColor }) => theme.colors.card[$cardColor]};
  background-image: url(${CardBackground});
  background-position: right center;
  background-repeat: no-repeat;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  width: 100%;
  min-height: 117px;
  padding: 1.2rem;
  text-align: left;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text.lightGray};

  .justify-between {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .balance {
    text-align: right;
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.text.darkGray};
  }
`;

export default AccountCardWrapper;
