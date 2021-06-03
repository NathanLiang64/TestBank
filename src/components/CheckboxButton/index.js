import CheckboxButtonWrapper from './checkboxButton.style';
/*
* ==================== CheckboxButton 組件說明 ====================
* 此組件封裝了 label + checkbox
* ==================== CheckboxButton 可傳參數 ====================
* 1. label -> 按鈕顯示文字
* 2. id -> label 的 htmlFor 和 input 的 id 皆會代入該值
* 3. register -> 可透過 {...register('id')} 取值
* 4. onChange -> input 上的 onChange 事件
* */

const CheckboxButton = ({
  label,
  id,
  register,
  onChange,
}) => (
  <CheckboxButtonWrapper>
    <label htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        onChange={onChange}
        {...register}
      />
      <span>{label}</span>
    </label>
  </CheckboxButtonWrapper>
);

export default CheckboxButton;
