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

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  width: 100%;
  min-height: 60px;

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
`;

export default AccountCardGreyWrapper;
