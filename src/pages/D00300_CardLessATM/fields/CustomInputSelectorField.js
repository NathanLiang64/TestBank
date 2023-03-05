/* eslint-disable no-unused-vars */
import React from 'react';
import { useController } from 'react-hook-form';
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBErrorMessage,
  FEIBBorderButton,
} from 'components/elements';
import { AddCircleRounded, RemoveCircleRounded } from '@material-ui/icons';
import { toCurrency } from 'utilities/Generator';
import theme from 'themes/theme';

export const CustomInputSelectorField = ({
  labelName,
  type = 'text',
  placeholder,
  $color,
  ...controlProps
}) => {
  const amountArr = [1000, 2000, 3000, 5000, 10000, 20000];

  const { field, fieldState } = useController(controlProps);
  const { onChange, value, name } = field;

  const changeAmount = (isAdd) => {
    if (isAdd && value < 20000) onChange(value + 1000);
    if (!isAdd && value > 1000) onChange(value - 1000);
  };

  return (
    <>
      <FEIBInputLabel htmlFor={name}>{labelName}</FEIBInputLabel>
      <FEIBInput
        value={`＄${toCurrency(value)}`}
        id={name}
        error={!!fieldState.error}
        inputProps={{ placeholder: placeholder || '', disabled: true }} // 只做顯示，不具輸入功能
        $color={theme.colors.primary.dark}
      />
      <div className="addMinusIcons">
        <RemoveCircleRounded onClick={() => changeAmount(false)} />
        <AddCircleRounded onClick={() => changeAmount(true)} />
      </div>
      <FEIBErrorMessage>
        {fieldState.error ? fieldState.error.message : ''}
      </FEIBErrorMessage>

      <FEIBInputLabel className="limit-label">
        以千元為單位，單日單次上限＄20,000
      </FEIBInputLabel>

      <div className="amountButtonsContainer">
        {amountArr.map((item) => (
          <div key={item} className="withdrawalBtnContainer">
            <FEIBBorderButton
              type="button"
              className="withdrawal-btn customSize"
              onClick={() => onChange(item)}
              isSelected={value === item}
            >
              {`＄${toCurrency(item)}`}
            </FEIBBorderButton>
          </div>
        ))}
      </div>
    </>
  );
};
