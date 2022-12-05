/* eslint-disable no-unused-vars */
import React from 'react';
import {useController} from 'react-hook-form';
import { FEIBInputLabel, FEIBInput, FEIBErrorMessage} from 'components/elements';

export const TextInputField = ({
  labelName,
  type = 'text',
  placeholder,
  disabled,
  $color,
  ...controlProps
}) => {
  const {field, fieldState } = useController(controlProps);
  const {
    onChange, onBlur, value, name,
  } = field;

  return (
    <>
      <FEIBInputLabel htmlFor={name}>{labelName}</FEIBInputLabel>
      <FEIBInput
        onChange={(e) => onChange(e.target.value.trim())}
        onBlur={onBlur}
        value={value ?? ''}
        type={type}
        id={name}
        disabled={disabled}
        error={!!fieldState.error}
        placeholder={placeholder || ''}
        $color={$color}
        $space="bottom"
      />
      {/* <FEIBErrorMessage>
        {fieldState.error ? fieldState.error.message : ''}
      </FEIBErrorMessage> */}
      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}
    </>
  );
};
