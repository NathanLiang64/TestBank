import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';
import { FEIBInputLabel, FEIBInput, FEIBErrorMessage } from 'components/elements';
import CurrencyInput from 'react-currency-input-field';
import { TextInputFieldWrapper } from './fields.style';

export const CurrencyInputField = ({
  labelName,
  $color,
  fontSize = 1.6,
  symbol,
  inputProps,
  ...controlProps
}) => {
  const { field, fieldState } = useController(controlProps);

  const {
    onChange, onBlur, value, name,
  } = field;

  const CurrencyInputCustom = useCallback((prop) => {
    const { inputRef, ...other } = prop;
    return (
      <CurrencyInput
        {...other}
        ref={(ref) => inputRef(ref ? ref.inputElement : null)}
        prefix={symbol ?? '$'}
        onValueChange={(e) => onChange(e ?? '')}
        onBlur={onBlur}
      />
    );
  }, [symbol]);

  return (
    <TextInputFieldWrapper>
      <FEIBInputLabel htmlFor={name}>{labelName}</FEIBInputLabel>
      <FEIBInput
        inputProps={inputProps}
        value={value ?? ''}
        id={name}
        error={!!fieldState.error}
        $color={$color}
        $fontSize={fontSize}
        inputComponent={CurrencyInputCustom}
      />

      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}
    </TextInputFieldWrapper>
  );
};
