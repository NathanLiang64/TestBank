/* eslint-disable no-unused-vars */
import React from 'react';
import {useController} from 'react-hook-form';
import { FEIBInputLabel, FEIBInput, FEIBErrorMessage} from 'components/elements';

export const TextInputField = ({ labelName, ...controlProps}) => {
  const {field, fieldState } = useController(controlProps);
  const {onChange, value} = field;

  return (
    <>
      <FEIBInputLabel htmlFor={field.name}>{labelName}</FEIBInputLabel>
      <FEIBInput onChange={onChange} value={value} placeholder="請輸入" />
      <FEIBErrorMessage>{fieldState.error ? fieldState.error.message : ''}</FEIBErrorMessage>
    </>

  );
};
