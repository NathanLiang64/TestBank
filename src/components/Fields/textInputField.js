import React from 'react';
import {useController} from 'react-hook-form';
import {
  FEIBInputLabel, FEIBInput, FEIBErrorMessage, FEIBHintMessage,
} from 'components/elements';
import { CommonFieldWrapper } from './fields.style';

export const TextInputField = ({
  labelName,
  type = 'text',
  $color,
  fontSize = 1.6,
  inputProps,
  annotation,
  ...controlProps
}) => {
  const {field, fieldState } = useController(controlProps);
  const {
    onChange, onBlur, value, name,
  } = field;

  return (
    <CommonFieldWrapper>
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

      {!!fieldState.error && <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>}
      {!!annotation && <FEIBHintMessage>{annotation}</FEIBHintMessage>}
    </CommonFieldWrapper>
  );
};
