import styled from 'styled-components';

import purple from 'assets/images/cardWatermarks/purple.png';
import yellow from 'assets/images/cardWatermarks/yellow.png';
import blue from 'assets/images/cardWatermarks/blue.png';
import green from 'assets/images/cardWatermarks/green.png';
import lightPurple from 'assets/images/cardWatermarks/lightPurple.png';
import orange from 'assets/images/cardWatermarks/orange.png';

const getWatermark = (color) => {
  switch (color) {
    case 'blue': return blue;
    case 'yellow': return yellow;
    case 'green': return green;
    case 'lightPurple': return lightPurple;
    case 'orange': return orange;
    default:
    case 'purple': return purple;
  }
};

const AccountCardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  // gap: 0.7rem;
  background-color: ${({ theme, $cardColor }) => theme.colors.card[$cardColor]};
  background-image: url(${({ $cardColor }) => getWatermark($cardColor)});
  background-position: right top;
  background-size: 231px 167px;
  background-repeat: no-repeat;
  ${({ $hasShadow }) => $hasShadow && 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);'}
  border-radius: 8px;
  width: 100%;
  min-height: 151.66px;
  padding: 1.2rem;
  text-align: left;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text.lightGray};

  .justify-start {
    display: flex;
    justify-content: flex-start;
    width: 100%;
  }

  .justify-between {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .justify-end {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  .items-start {
    align-items: flex-start;
  }

  .items-center {
    align-items: center;
  }

  .items-end {
    align-items: flex-end;
  }

  .items-baseline {
    align-items: baseline;
  }

  .balance {
    text-align: right;
    font-size: 2.8rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.darkGray};
  }
  .small {
    font-size: 2.5rem;
  }

  .gap-4 { gap: 1rem; }
  .gap-6 { gap: 1.6rem; }
  .mt-4 { margin-top: 1rem; }
  .-mt-5 { margin-top: -12px; }
  .-mr-5 { margin-right: -12px; }
  .text-16 { font-size: 1.6rem; }

  .divider > *:not(:first-child) {
    border-inline-start: 1px solid ${({ theme }) => theme.colors.border.light};
    padding-inline-start: 0.8rem;
    margin-inline-start: -0.8rem;
  }

  .divider > button {
    font-size: 1.6rem;
    color: #042C5C;
    font-weight: 300;
  }

  div.justify-between.items-start > div > div:nth-child(2) {
    font-size: 1.5rem;
  }
`;

export default AccountCardWrapper;
