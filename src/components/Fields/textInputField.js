/* eslint-disable no-unused-vars */
import React from 'react';
import {useController} from 'react-hook-form';
import { FEIBInputLabel, FEIBInput, FEIBErrorMessage} from 'components/elements';

export const TextInputField = ({
  labelName,
  type = 'text',
  $color,
  fontSize = 1.6,
  inputProps,
  ...controlProps
}) => {
  const {field, fieldState } = useController(controlProps);
  const {
    onChange, onBlur, value, name,
  } = field;

  return (
    // TODO style移至css
    <div style={{margin: '0 0 2rem 0'}}>
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
      {/* <FEIBErrorMessage>
        {fieldState.error ? fieldState.error.message : ''}
      </FEIBErrorMessage> */}
      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}
    </div>
  );
};
