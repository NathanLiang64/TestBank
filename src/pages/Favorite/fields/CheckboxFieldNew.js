// eslint-disable-next-line no-unused-vars
import { BlockSelectedIcon } from 'assets/images/icons';
import FavoriteBlockButtonStyle from 'components/FavoriteBlockButton/favoriteBlockButton.style';
import React from 'react';
import { useController } from 'react-hook-form';
// import "./CheckBox.css";

export const CheckBoxFieldNew = ({
  disabledObj, icon, setShowTip, label, value, ...props
}) => {
  const { field } = useController(props);
  const onChangeHandler = (e) => {
    if (disabledObj.disabled && disabledObj.message) {
      setShowTip(disabledObj.message);
    } else if (!disabledObj.disabled) {
      field.onChange(e.target.checked ? value : false);
    }
  };

  return (
    <FavoriteBlockButtonStyle
      className={`favoriteBlockButton ${field.value ? 'selected' : ''}`}
    >
      <label htmlFor={field.name} style={{width: '100%', height: '100%'}}>
        {icon}
        <p>{label}</p>
        <input
          type="checkbox"
          onChange={onChangeHandler}
          id={field.name}
          style={{display: 'none'}}
          checked={!!field.value}
        />
        <BlockSelectedIcon className="selectedIcon" />
      </label>
    </FavoriteBlockButtonStyle>

  );
};
