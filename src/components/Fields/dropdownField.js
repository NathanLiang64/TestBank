/* eslint-disable no-unused-vars */
import React from 'react';
import {useController} from 'react-hook-form';
import {
  FEIBOption, FEIBSelect, FEIBInputLabel, FEIBErrorMessage,
} from 'components/elements';

export const DropdownField = ({options, labelName, ...controlProps}) => {
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

  return (

    <>
      <FEIBInputLabel htmlFor={field.name}>{labelName}</FEIBInputLabel>
      <FEIBSelect MenuProps={MenuProps} onChange={field.onChange} id={field.name} name={field.name} value={field.value}>
        {options.map(({label, value}) => (
          <FEIBOption key={label} value={value}>
            {label}
          </FEIBOption>
        ))}
      </FEIBSelect>

      <FEIBErrorMessage>{fieldState.error ? fieldState.error.message : ''}</FEIBErrorMessage>
      {/* {!!fieldState.error
        && <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>} */}
    </>

  );
};
