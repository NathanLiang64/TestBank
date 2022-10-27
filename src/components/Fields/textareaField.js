import React from 'react';
import { useController } from 'react-hook-form';
import { FEIBInputLabel, FEIBTextarea } from 'components/elements';
import theme from 'themes/theme';

export const TextareaField = ({
  labelName,
  placeholder,
  rowsMin,
  rowsMax,
  limit = 200,
  ...controlProps
}) => {
  const { field, fieldState } = useController(controlProps);
  const {
    onChange, onBlur, value, name,
  } = field;

  return (
    <>
      <FEIBInputLabel htmlFor={name}>{labelName}</FEIBInputLabel>
      <FEIBTextarea
        onChange={(e) => onChange(e.target.value.trim())}
        onBlur={onBlur}
        value={value}
        id={name}
        placeholder={placeholder || ''}
        $borderColor={!!fieldState.error && theme.colors.state.danger}
        rowsMin={3}
        rowsMax={10}
      />
      <span
        className={`limitText ${value.length > limit ? 'warningColor' : ''}`}
      >
        {`字數限制（${value.length}/${limit}）`}
      </span>
    </>
  );
};
