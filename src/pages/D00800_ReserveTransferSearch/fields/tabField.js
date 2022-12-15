import React from 'react';
import { useController } from 'react-hook-form';
import { FEIBTabList, FEIBTab } from 'components/elements';

export const TabField = ({ options, ...controlProps}) => {
  const { field } = useController(controlProps);

  return (
    <>
      <FEIBTabList
        $size="small"
        $type="fixed"
        onChange={(_, id) => {
          field.onChange(id);
        }}
      >
        {options.map(({ label, value }) => (
          <FEIBTab key={value} label={label} value={value} />
        ))}
      </FEIBTabList>
    </>
  );
};
