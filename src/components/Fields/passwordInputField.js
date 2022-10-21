import { useState } from 'react';
import { useController } from 'react-hook-form';
import { VisibilityIcon, VisibilityOffIcon } from 'assets/images/icons';
import { FEIBInput, FEIBInputLabel, FEIBErrorMessage } from 'components/elements';

/*
* ==================== PasswordInput 組件說明 ====================
* 帶有顯示、隱藏 icon 的文字輸入框
* ==================== PasswordInput 可傳參數 ====================
* 1. labelName -> labelName 標題文字，若不傳預設為 "網銀密碼"
* 2. placeholder -> FEIBInput 的 placeholder 文字，若不傳預設為 "請輸入網銀密碼"
* 3. color -> 該 input 的文字顏色，若不傳預設為主色
* 4. borderColor -> 該 input 的 border 顏色，若不傳預設為主色
* 5. control -> 取 input 的值時可傳入 control 內容 (react-hook-form 套件的 Controller)
* 6. name -> 該欄位的名稱
     NOTE: control 以及 name 直接包成 formProps 當作 arg 傳入 useController
* */

export const PasswordInputField = ({
  labelName,
  placeholder,
  color,
  borderColor,
  ...formProps
}) => {
  const {field, fieldState} = useController(formProps);
  const {
    onChange, onBlur, name, value,
  } = field;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <>
      <FEIBInputLabel htmlFor={name} $color={color}>
        {labelName || '網銀密碼'}
      </FEIBInputLabel>

      <FEIBInput
        placeholder={placeholder || '請輸入網銀密碼(8-20位英數字)'}
        type={showPassword ? 'text' : 'password'}
        id={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        error={!!fieldState.error}
        $color={color}
        $borderColor={borderColor}
        $icon={showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        $iconFontSize={2}
        $iconOnClick={(handleClickShowPassword)}
      />
      <FEIBErrorMessage>{fieldState.error ? fieldState.error.message : ''}</FEIBErrorMessage>

    </>
  );
};
