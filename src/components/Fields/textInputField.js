import React from 'react';
import {useController} from 'react-hook-form';
import { FEIBInputLabel, FEIBInput, FEIBErrorMessage} from 'components/elements';
import { currencySymbolGenerator, numberToChinese } from 'utilities/Generator';
import { TextInputFieldWrapper } from './fields.style';

export const TextInputField = ({
  labelName,
  type = 'text',
  $color,
  fontSize = 1.6,
  inputProps,
  currency,
  ...controlProps
}) => {
  const {field, fieldState } = useController(controlProps);
  const {
    onChange, onBlur, value, name,
  } = field;

  return (
    <TextInputFieldWrapper currencyType={!!currency}>
      <FEIBInputLabel htmlFor={name}>{labelName}</FEIBInputLabel>
      <FEIBInput
        inputProps={inputProps}
        onChange={(e) => onChange(e.target.value.trim())}
        onBlur={onBlur}
        value={value ?? ''}
        type={type}
        id={name}
        error={!!fieldState.error}
        $color={$color}
        $fontSize={fontSize}
      />

      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}

      {currency && (
        <div className="balanceLayout">
          {`${currencySymbolGenerator(
            currency,
            value ?? 0,
            false,
          )} ${numberToChinese(value)}`}
        </div>
      )}
    </TextInputFieldWrapper>
  );
};
