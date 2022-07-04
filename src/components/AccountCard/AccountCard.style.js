import styled from 'styled-components';

import purple from 'assets/images/cardWatermarks/purple.png';
import yellow from 'assets/images/cardWatermarks/yellow.png';
import blue from 'assets/images/cardWatermarks/blue.png';
import green from 'assets/images/cardWatermarks/green.png';
import lightPurple from 'assets/images/cardWatermarks/lightPurple.png';

const getWatermark = (color) => {
  switch (color) {
    case 'blue': return blue;
    case 'yellow': return yellow;
    case 'green': return green;
    case 'lightPurple': return lightPurple;
    default:
    case 'purple': return purple;
  }
};

const AccountCardWrapper = styled.div`
  display: flex;
  justify-content: flex-begen;
  flex-direction: column;
  gap: 0.7rem;
  background-color: ${({ theme, $cardColor }) => theme.colors.card[$cardColor]};
  background-image: url(${({ $cardColor }) => getWatermark($cardColor)});
  background-position: right top;
  background-size: 231px 167px;
  background-repeat: no-repeat;
  ${({ $hasShadow }) => $hasShadow && 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);'}
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

  .items-end {
    align-items: flex-end;
  }

  .balance {
    text-align: right;
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.text.darkGray};
  }
`;

export default AccountCardWrapper;
