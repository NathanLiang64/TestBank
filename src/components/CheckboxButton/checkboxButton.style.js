import styled from 'styled-components';

const CheckboxButtonWrapper = styled.div`
  display: inline-block;
  margin-right: .8rem;
  margin-bottom: ${({ $unclickable }) => ($unclickable ? '0' : '1.6rem')};
  cursor: pointer;

  input[type=checkbox] {
    display: none;

    & + span {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding-top: .3rem;
      padding-left: 1.6rem;
      padding-right: 1.6rem;
      border: .1rem solid #825DC7;
      border-radius: 1.4rem;
      height: 2.5rem;
      font-size: 1.4rem;
      color: #825DC7;
      background: white;
      user-select: none;
    }

    ${({ $unclickable }) => !$unclickable && (`
      &:checked + span {
        color: white;
        background: #AC8DE8;
        border-color: #AC8DE8;
      }
    `)};
  }
`;

export default CheckboxButtonWrapper;
