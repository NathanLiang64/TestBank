/* eslint-disable no-unused-vars */
import React from 'react';
import {useController} from 'react-hook-form';
import { FEIBInputLabel, FEIBInput, FEIBErrorMessage} from 'components/elements';

export const TextInputField = ({
  labelName, type = 'text', placeholder, ...controlProps
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
        value={value}
        type={type}
        id={name}
        error={!!fieldState.error}
        placeholder={placeholder || ''}
      />
      <FEIBErrorMessage>
        {fieldState.error ? fieldState.error.message : ''}
      </FEIBErrorMessage>
    </>
  );
};
