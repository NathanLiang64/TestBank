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
  hideDefaultButton,
  row = false,
  ...controlProps
}) => {
  const { field, fieldState } = useController(controlProps);

  const onChangeHandler = (selectedValue) => {
    field.onChange(selectedValue);
  };

  // eslint-disable-next-line no-unused-vars
  const radioStyle = { display: hideDefaultButton ? 'none' : 'inline-flex' };

  return (
    <>
      {labelName && (
        <FEIBInputLabel htmlFor={field.name}>{labelName}</FEIBInputLabel>
      )}

      <RadioGroup
        onChange={onChangeHandler}
        onBlur={field.onBlur}
        style={{flexDirection: row ? 'row' : 'column'}}
        id={field.name}
        name={field.name}
        value={field.value}
      >
        {options.map(({ label, value }) => (
          <FEIBRadioLabel
            key={value}
            control={<FEIBRadio style={radioStyle} disabled={disabled} />}
            label={label}
            value={value.toString()}
          />
        ))}
      </RadioGroup>

      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}
    </>
  );
};
