import styled from 'styled-components';
import grey from 'assets/images/cardWatermarks/grey.svg';

const AccountCardGreyWrapper = styled.div`
  display: grid;
  align-content: flex-start;
  grid-gap: 0.7rem;
  padding: 1.2rem;

  background-color: ${({ theme }) => theme.colors.basic.white};
  background-image: url(${grey});
  background-position: 105% 30%;
  background-size: 231px 167px;
  background-repeat: no-repeat;

  // box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  width: 100%;
  min-height: 117px;

  text-align: left;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text.lightGray};

  .justify-between {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .card_content {
    font-size: 1.2rem;
  }

  .flex-end {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 117px;
  }

  .plusWrapper {
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.background.disable};
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      padding: 10px;
    }
  }
`;

export default AccountCardGreyWrapper;
