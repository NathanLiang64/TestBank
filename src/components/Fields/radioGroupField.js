import React from 'react';
import { useController } from 'react-hook-form';
import {
  FEIBInputLabel,
  FEIBErrorMessage,
  FEIBRadio,
  FEIBRadioLabel,
} from 'components/elements';
import { RadioGroup } from '@material-ui/core';
import { RadioGroupFieldWrapper } from './fields.style';

export const RadioGroupField = ({
  options,
  labelName,
  disabled,
  hideDefaultButton,
  onChange,
  row = false,
  ...controlProps
}) => {
  const { field, fieldState } = useController(controlProps);

  const onChangeHandler = (event) => {
    if (onChange) onChange(event.target.value);
    else field.onChange(event);
  };

  // eslint-disable-next-line no-unused-vars
  const radioStyle = { display: hideDefaultButton ? 'none' : 'inline-flex' };

  return (
    <RadioGroupFieldWrapper row={row}>
      {labelName && (
        <FEIBInputLabel htmlFor={field.name}>{labelName}</FEIBInputLabel>
      )}

      <RadioGroup
        onChange={onChangeHandler}
        onBlur={field.onBlur}
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
    </RadioGroupFieldWrapper>
  );
};
