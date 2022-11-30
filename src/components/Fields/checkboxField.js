// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useController } from 'react-hook-form';
import {
  FEIBCheckbox, FEIBCheckboxLabel, FEIBErrorMessage,
} from 'components/elements';

export const CheckboxField = ({
  disabled, label, ...props
}) => {
  const { field, fieldState} = useController(props);
  const {onChange, value} = field;

  return (
    <>
      <FEIBCheckboxLabel
        control={<FEIBCheckbox onChange={onChange} value={value} />}
        label={label}
      />
      {/* <FEIBErrorMessage>{fieldState.error ? fieldState.error.message : ''}</FEIBErrorMessage> */}
      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}
    </>
  );
};
