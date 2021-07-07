import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { FEIBInput, FEIBInputLabel, FEIBErrorMessage } from 'components/elements';

/*
* ==================== PasswordInput 組件說明 ====================
* 帶有顯示、隱藏 icon 的文字輸入框
* ==================== PasswordInput 可傳參數 ====================
* 1. label -> label 標題文字，若不傳預設為 "網銀密碼"
* 2. id -> label 的 htmlFor、input 的 id 和 name、Controller 的 name 皆會代入該值
*    註: Controller 為 react-hook-form 套件提供之功能，方便取值和驗證表單時使用
* 3. placeholder -> FEIBInput 的 placeholder 文字，若不傳預設為 "請輸入網銀密碼"
* 4. control -> 取 input 的值時可傳入 control 內容 (react-hook-form 套件的 Controller)
*    註: Controller 為 react-hook-form 套件提供之功能，方便取值和驗證表單時使用
* 5. onBlur -> 該 input 的 onBlur 事件
* 6. color -> 該 input 的文字顏色，若不傳預設為主色
* 7. borderColor -> 該 input 的 border 顏色，若不傳預設為主色
* 8. errorMessage -> 驗證後的錯誤訊息
* */

const PasswordInput = ({
  label,
  id,
  placeholder,
  control,
  onBlur,
  color,
  borderColor,
  errorMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const renderControllerWithInput = (controlId, controlProps, inputPlaceholder, inputColor, inputBorderColor, inputOnBlur, inputErrorMessage) => (
    <>
      <Controller
        name={controlId}
        control={controlProps}
        defaultValue=""
        render={({ field }) => (
          <FEIBInput
            {...field}
            id={controlId}
            name={controlId}
            placeholder={inputPlaceholder || '請輸入網銀密碼(8-20位英數字)'}
            type={showPassword ? 'text' : 'password'}
            onBlur={inputOnBlur}
            error={!!inputErrorMessage}
            $color={inputColor}
            $borderColor={inputBorderColor}
            $icon={showPassword ? <Visibility /> : <VisibilityOff />}
            $iconFontSize={2}
            $iconOnClick={handleClickShowPassword}
          />
        )}
      />
      <FEIBErrorMessage>{inputErrorMessage}</FEIBErrorMessage>
    </>
  );

  const renderInput = (inputId, inputPlaceholder, inputColor, inputBorderColor, inputOnBlur) => (
    <FEIBInput
      id={inputId}
      name={inputId}
      placeholder={inputPlaceholder || '請輸入網銀密碼(8-20位英數字)'}
      type={showPassword ? 'text' : 'password'}
      onBlur={inputOnBlur}
      $color={inputColor}
      $borderColor={inputBorderColor}
      $icon={showPassword ? <Visibility /> : <VisibilityOff />}
      $iconFontSize={2}
      $iconOnClick={handleClickShowPassword}
    />
  );

  return (
    <>
      <FEIBInputLabel
        htmlFor={id}
        $color={color}
      >
        {label || '網銀密碼'}
      </FEIBInputLabel>
      {
        control
          ? renderControllerWithInput(id, control, placeholder, color, borderColor, onBlur, errorMessage)
          : renderInput(id, placeholder, color, borderColor, onBlur)
      }
    </>
  );
};

export default PasswordInput;
