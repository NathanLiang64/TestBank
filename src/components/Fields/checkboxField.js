import React from 'react';
import { useController } from 'react-hook-form';
import {
  FEIBInputLabel,
  FEIBErrorMessage,
  FEIBCheckbox,
  FEIBCheckboxLabel,
} from 'components/elements';
import { CommonFieldWrapper } from './fields.style';

// 若有特殊樣式的 checkbox 要取代原本的 checkbox，可以將 hideFaultCheckbox = true ，並以
export const CheckboxField = ({
  options,
  labelName,
  disabled,
  hideDefaultCheckbox,
  ...controlProps
}) => {
  const { field, fieldState } = useController(controlProps);

  //
  const inputLabelStyle = {
    flex: hideDefaultCheckbox ? '1' : 'none',
    order: hideDefaultCheckbox ? '0' : '1',
  };
  const checkboxLableStyle = { display: hideDefaultCheckbox ? 'none' : 'inline-flex' };

  return (
    <CommonFieldWrapper>
      {labelName && (
        <FEIBInputLabel style={inputLabelStyle} checked htmlFor={field.name}>
          {labelName}
        </FEIBInputLabel>
      )}

      <FEIBCheckboxLabel
        style={checkboxLableStyle}
        control={(
          <FEIBCheckbox
            checked={field.value}
            onChange={field.onChange}
            id={field.name}
            disabled={disabled}
          />
        )}
      />

      {!!fieldState.error && <FEIBErrorMessage>{fieldState.error.message}</FEIBErrorMessage>}
    </CommonFieldWrapper>
  );
};
