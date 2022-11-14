/* eslint-disable no-unused-vars */
import React from 'react';
import { useController } from 'react-hook-form';
import {
  FEIBOption,
  FEIBSelect,
  FEIBInputLabel,
  FEIBErrorMessage,
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
} from 'components/elements';
import { defaultValues } from '../constants';

export const TabField = ({
  options,
  labelName,
  resetOnChange,
  ...controlProps
}) => {
  const { field, fieldState } = useController(controlProps);

  return (
    <>
      <FEIBTabContext value={field.value}>
        <FEIBTabList
          $size="small"
          $type="fized"
          onChange={(_, id) => {
            resetOnChange();
            field.onChange(id);
          }}
        >
          {options.map(({ label, value }) => (
            <FEIBTab label={label} value={value} />
          ))}
        </FEIBTabList>
      </FEIBTabContext>

      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}
    </>
  );
};
