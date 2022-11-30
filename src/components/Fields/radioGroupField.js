import React from 'react';
import { useController } from 'react-hook-form';
import {
  FEIBInputLabel,
  FEIBErrorMessage,
  FEIBRadio,
  FEIBRadioLabel,
} from 'components/elements';
import { RadioGroup } from '@material-ui/core';

export const RadioGroupField = ({
  options,
  labelName,
  disabled,
  resetOnChange,
  ...controlProps
}) => {
  const { field, fieldState } = useController(controlProps);

  const onChangeHandler = (selectedValue) => {
    if (resetOnChange && typeof resetOnChange === 'function') resetOnChange();
    field.onChange(selectedValue);
  };

  return (
    <>
      <FEIBInputLabel htmlFor={field.name}>{labelName}</FEIBInputLabel>
      <RadioGroup
        onChange={onChangeHandler}
        onBlur={field.onBlur}
        id={field.name}
        name={field.name}
        value={field.value}
        disabled={disabled}
      >
        {options.map(({ label, value }) => (
          <FEIBRadioLabel
            key={value}
            control={<FEIBRadio />}
            label={label}
            value={value.toString()}
          />
        ))}
      </RadioGroup>

      {/* <FEIBErrorMessage>
        {fieldState.error ? fieldState.error.message : ''}
      </FEIBErrorMessage> */}
      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}
    </>
  );
};
