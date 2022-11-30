/* eslint-disable no-unused-vars */
import React from 'react';
import {useController} from 'react-hook-form';
import {
  FEIBOption, FEIBSelect, FEIBInputLabel, FEIBErrorMessage,
} from 'components/elements';

export const DropdownField = ({
  options,
  labelName,
  disabled,
  $color,
  resetOnChange,
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

  const onChangeHandler = (selectedValue) => {
    if (resetOnChange && typeof resetOnChange === 'function') resetOnChange();
    field.onChange(selectedValue);
  };
  return (
    <>
      <FEIBInputLabel htmlFor={field.name}>{labelName}</FEIBInputLabel>
      <FEIBSelect
        MenuProps={MenuProps}
        onChange={onChangeHandler}
        onBlur={field.onBlur}
        id={field.name}
        name={field.name}
        value={field.value}
        disabled={disabled}
        $space="bottom"
        $color={$color}
      >
        {options.map(({ label, value, disabledOption }) => (
          <FEIBOption key={label} value={value} disabled={disabledOption}>
            {label}
          </FEIBOption>
        ))}
      </FEIBSelect>

      {/* <FEIBErrorMessage>
        {fieldState.error ? fieldState.error.message : ''}
      </FEIBErrorMessage> */}
      {!!fieldState.error
        && <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>}
    </>
  );
};
