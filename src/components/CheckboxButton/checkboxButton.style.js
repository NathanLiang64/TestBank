import styled from 'styled-components';

const CheckboxButtonWrapper = styled.div`
  display: inline-block;
  margin-right: .8rem;
  margin-bottom: 1.6rem;
  cursor: pointer;

  input[type=checkbox] {
    display: none;

    & + span {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding-left: 16px;
      padding-right: 16px;
      border: 1px solid #825DC7;
      border-radius: 14px;
      height: 25px;
      font-size: 14px;
      color: #825DC7;
      background: white;
      user-select: none;
    }

    &:checked + span {
      color: white;
      background: #AC8DE8;
      border-color: #AC8DE8;
    }
  }
`;

export default CheckboxButtonWrapper;
