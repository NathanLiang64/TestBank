import CheckboxButtonWrapper from './checkboxButton.style';
/*
* ==================== CheckboxButton 組件說明 ====================
* 此組件封裝了 label + checkbox
* ==================== CheckboxButton 可傳參數 ====================
* 1. label -> 按鈕顯示文字
* 2. id -> label 的 htmlFor 和 input 的 id 皆會代入該值
* 3. register -> 可透過綁定此參數取值，輸入字串，例：'account'
* 4. onChange -> input 上的 onChange 事件
* 5. unclickable -> 不可點擊
* */

const CheckboxButton = ({
  label,
  id,
  register,
  onChange,
  unclickable,
}) => (
  <CheckboxButtonWrapper className="checkboxButton" $unclickable={unclickable}>
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
