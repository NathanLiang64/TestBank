/* eslint-disable no-unused-vars */
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
  callback,
  ...controlProps
}) => {
  const { field, fieldState } = useController(controlProps);

  return (
    <>

      <FEIBTabList
        $size="small"
        $type="fized"
        onChange={(_, id) => {
          field.onChange(id);
          if (callback) callback();
        }}
      >
        {options.map(({ label, value }) => (
          <FEIBTab label={label} value={value} />
        ))}
      </FEIBTabList>

      {!!fieldState.error && (
        <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>
      )}
    </>
  );
};
