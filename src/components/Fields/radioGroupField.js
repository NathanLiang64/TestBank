/* eslint-disable no-unused-vars */
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
  ...controlProps
}) => {
  const { field, fieldState } = useController(controlProps);

  return (
    <>
      <FEIBInputLabel htmlFor={field.name}>{labelName}</FEIBInputLabel>
      <RadioGroup
        // MenuProps={MenuProps}
        onChange={field.onChange}
        onBlur={field.onBlur}
        id={field.name}
        name={field.name}
        value={field.value}
        disabled={disabled}
      >
        {options.map(({ label, value, disabledOption }) => (
          <FEIBRadioLabel
            control={<FEIBRadio />}
            label={label}
            value={value.toString()}
            // disabled={disabledOption}
          />
        ))}
      </RadioGroup>

      {/* <FEIBErrorMessage>
        {fieldState.error ? fieldState.error.message : ''}
      </FEIBErrorMessage> */}
      {!!fieldState.error
        && <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>}
    </>
  );
};
