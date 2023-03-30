/* eslint-disable object-curly-newline */
import React from 'react';
import {useController} from 'react-hook-form';
import {
  FEIBOption, FEIBSelect, FEIBInputLabel, FEIBErrorMessage, FEIBHintMessage,
} from 'components/elements';
import theme from 'themes/theme';
import { CommonFieldWrapper } from './fields.style';

export const DropdownField = ({
  options,
  labelName,
  $color,
  inputProps,
  onChange,
  annotation,
  ...controlProps
}) => {
  const {field, fieldState} = useController(controlProps);

  const MenuProps = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    getContentAnchorEl: null,
  };

  const onChangeHandler = (event) => {
    if (onChange) onChange(event.target.value);
    else field.onChange(event);
  };

  const generateColor = () => {
    const currentOption = options.find(({value}) => field.value === value);
    if (currentOption && currentOption.disabledOption) return theme.colors.text.placeholder;
    return $color;
  };

  return (
    <CommonFieldWrapper>
      <FEIBInputLabel htmlFor={field.name}>{labelName}</FEIBInputLabel>
      <FEIBSelect
        MenuProps={MenuProps}
        inputProps={inputProps}
        onChange={onChangeHandler}
        onBlur={field.onBlur}
        id={field.name}
        name={field.name}
        value={field.value}
        $color={generateColor()}
      >
        {options.map(({ key, label, value, disabledOption }) => (
          <FEIBOption key={key ?? label} value={value} disabled={disabledOption}>
            {label}
          </FEIBOption>
        ))}
      </FEIBSelect>

      {!!fieldState.error && <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>}
      {!!annotation && <FEIBHintMessage>{annotation}</FEIBHintMessage>}
    </CommonFieldWrapper>
  );
};
