import React from 'react';
import { useController } from 'react-hook-form';
import {
  FEIBErrorMessage,
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
} from 'components/elements';

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
            if (resetOnChange)resetOnChange();
            field.onChange(id);
          }}
        >
          {options.map(({ label, value }) => (
            <FEIBTab key={value} label={label} value={value} />
          ))}
        </FEIBTabList>
      </FEIBTabContext>

      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}
    </>
  );
};
