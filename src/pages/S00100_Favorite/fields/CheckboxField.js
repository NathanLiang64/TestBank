// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BlockSelectedIcon } from 'assets/images/icons';
import FavoriteBlockButtonStyle from 'components/FavoriteBlockButton/favoriteBlockButton.style';
import { useController } from 'react-hook-form';
import { iconGenerator } from '../favoriteGenerator';

// import "./CheckBox.css";

export const CheckBoxField = ({
  disabled, isEditAction, immdlySubmit, setShowTip, label, ...props
}) => {
  const { field } = useController(props);
  const {onChange, name, value} = field;

  const onChangeHandler = () => {
    if (disabled) {
      setShowTip(true);
    } else {
      onChange(!value);
      if (!isEditAction) immdlySubmit();
    }
  };

  return (
    <FavoriteBlockButtonStyle
      className={value && !disabled ? 'selected' : ''}
      disabled={disabled}
    >
      <label htmlFor={name} style={{width: '100%', height: '100%'}}>
        {iconGenerator(name.split('.')[1])}
        <p>{label}</p>
        <input
          type="checkbox"
          onChange={onChangeHandler}
          id={name}
          style={{display: 'none'}}
          checked={!!value}
        />
        <BlockSelectedIcon className="selectedIcon" />
      </label>
    </FavoriteBlockButtonStyle>

  );
};
