import React from 'react';
import { useController } from 'react-hook-form';
import { FEIBErrorMessage, FEIBInputLabel, FEIBTextarea } from 'components/elements';
import theme from 'themes/theme';
import { CommonFieldWrapper, LimitedTextWrapper } from './fields.style';

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
    <CommonFieldWrapper>
      <FEIBInputLabel htmlFor={name}>{labelName}</FEIBInputLabel>
      <FEIBTextarea
        onChange={(e) => onChange(e.target.value.trim())}
        onBlur={onBlur}
        value={value}
        id={name}
        placeholder={placeholder || ''}
        $borderColor={!!fieldState.error && theme.colors.state.danger}
        minRows={3}
        maxRows={10}
      />

      {!!fieldState.error && <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>}
      <LimitedTextWrapper showError={!!(value?.length > limit)}>
        {`字數限制（${value?.length}/${limit}）`}
      </LimitedTextWrapper>
    </CommonFieldWrapper>
  );
};
