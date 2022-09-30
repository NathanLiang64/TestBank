/* eslint-disable no-unused-vars */
import React from 'react';
import {useController} from 'react-hook-form';
import { FEIBOption, FEIBSelect, FEIBInputLabel} from 'components/elements';
import { FormControl } from 'themes/styleModules';

export const CardLessSettingFields = (props) => {
  const {field, fieldState} = useController(props);
  const options = [
    {label: '$1,000', value: 1000},
    {label: '$2,000', value: 2000},
    {label: '$3,000', value: 3000},
    {label: '$5,000', value: 5000},
    {label: '$10,000', value: 10000},
    {label: '$20,000', value: 20000},
  ];

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

    <FormControl>
      <FEIBInputLabel>請選擇</FEIBInputLabel>
      <FEIBSelect MenuProps={MenuProps} onChange={field.onChange} name={field.name} value={field.value}>
        {options.map(({label, value}) => (
          <FEIBOption key={label} value={value}>
            {label}
          </FEIBOption>
        ))}
      </FEIBSelect>
      {fieldState.error && '請提供金額'}
    </FormControl>

  );
};
