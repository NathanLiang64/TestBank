import React, { useCallback, useEffect } from 'react';
import { useController } from 'react-hook-form';
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBErrorMessage,
} from 'components/elements';
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
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        prefix={symbol ?? '$'}
      />
    );
  }, []);

  useEffect(() => {
    const number = field.value ? field.value.toString().replace(/[^\d]/g, '') : ''; // 將所有(g)非數字(^\d)字元，全部移除。
    const formater = new Intl.NumberFormat('en-US');
    const newValue = formater.format(number);
    if (newValue !== '0') {
      field.onChange(parseInt(number, 10));
    } else {
      field.onChange('');
    }
  }, [field.value]);

  return (
    <TextInputFieldWrapper>
      <FEIBInputLabel htmlFor={name}>{labelName}</FEIBInputLabel>
      <FEIBInput
        inputProps={inputProps}
        onChange={onChange}
        onBlur={onBlur}
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
