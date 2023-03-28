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
    case 'purple': return purple;
    default:
    case 'lightPurple': return lightPurple;
  }
};

const AccountCardWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  background-color: ${({ theme, $cardColor }) => theme.colors.card[$cardColor]};
  background-image: url(${({ $cardColor }) => getWatermark($cardColor)});
  background-position: right top;
  background-size: 231px 167px;
  background-repeat: no-repeat;
  border-radius: 8px;
  width: 100%;
  min-height: ${({ fixHeight }) => (fixHeight ? '114px !important' : '150px;')};
  padding: 1.2rem;
  text-align: left;
  font-size: 1.6rem;

  & * {
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  .cardName {
    height: 24px;
    line-height: 24px;
  }

  .accountNo {
    display: flex;
    font-size: 1.5rem;
    color: #666;
    height: 24px;
    line-height: 28px;
  }

  .justify-between {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .items-center {
    align-items: center;
  }

  .balance {
    text-align: right;
    font-size: 2.8rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.darkGray};
    height: 42px;
    line-height: 45px;
  }

  .moreIconButton {
    position: absolute;
    top: 0;
    right: 0;
    top: -5px;
  }

  .MuiIconButton-root {
    padding: 0;
  }

  .w-full {
    width: 100%;
    margin-top: auto;

    & ul li button {
      color: #042c5c;
      font-weight: 300;
    }
  }

  .functionList {
    display: flex;
    justify-content: flex-end;
    button {
      padding: 0;
    }

    li {
      padding: 0.4rem 1.2rem;
      font-weight: 300;
      letter-spacing: 0.1rem;

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        width: 0.1rem;
        height: 1.6rem;
        background: ${({ theme }) => theme.colors.text.lightGray};
        transform: translateY(-50%);
        opacity: 0.3;
      }

      &:last-child {
        padding-right: 0.2rem;

        :after {
          width: 0;
        }
      }

      a {
        color: ${({ theme }) => theme.colors.text.lightGray};
      }

      button {
        font-size: 1.6rem;
      }
    }
  }
`;

export default AccountCardWrapper;
