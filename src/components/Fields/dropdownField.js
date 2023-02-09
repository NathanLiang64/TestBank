/* eslint-disable object-curly-newline */
import React from 'react';
import {useController} from 'react-hook-form';
import {
  FEIBOption, FEIBSelect, FEIBInputLabel, FEIBErrorMessage,
} from 'components/elements';
import { DropdownFieldWrapper } from './fields.style';

export const DropdownField = ({
  options,
  labelName,
  $color,
  inputProps,
  onChange,
  ...controlProps
}) => {
  const {field, fieldState} = useController(controlProps);

  const MenuProps = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    getContentAnchorEl: null,
  };

  const onChangeHandler = (event) => {
    if (onChange) onChange(event.target.value);
    else field.onChange(event);
  };
  return (
    <DropdownFieldWrapper>
      <FEIBInputLabel htmlFor={field.name}>{labelName}</FEIBInputLabel>
      <FEIBSelect
        MenuProps={MenuProps}
        inputProps={inputProps}
        onChange={onChangeHandler}
        onBlur={field.onBlur}
        id={field.name}
        name={field.name}
        value={field.value}
        $color={$color}
      >
        {options.map(({ key, label, value, disabledOption }) => (
          <FEIBOption key={key ?? label} value={value} disabled={disabledOption}>
            {label}
          </FEIBOption>
        ))}
      </FEIBSelect>

      {!!fieldState.error && (
        <FEIBErrorMessage
          style={{
            margin: 0,
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
        >
          {fieldState.error.message}
        </FEIBErrorMessage>
      )}
    </DropdownFieldWrapper>
  );
};
