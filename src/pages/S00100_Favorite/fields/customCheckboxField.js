import React from 'react';
import { BlockSelectedIcon } from 'assets/images/icons';
import FavoriteBlockButtonStyle from 'components/FavoriteBlockButton/favoriteBlockButton.style';
import { useController } from 'react-hook-form';
import { iconGenerator } from '../favoriteGenerator';

export const CustomCheckBoxField = ({
  disabled, isEditAction, immdlySubmit, setShowTip, label, ...props
}) => {
  const { field } = useController(props);
  const {onChange, name, value} = field;
  const onChangeHandler = () => {
    if (disabled) setShowTip(true);
    else {
      onChange(!value);
      if (!isEditAction) immdlySubmit();
    }
  };

  return (
    <FavoriteBlockButtonStyle
      className={value && !disabled ? 'selected' : ''}
      disabled={isEditAction ? false : disabled}
    >
      <label
        htmlFor={name}
        style={{
          width: '100%', height: '100%', cursor: 'pointer', userSelect: 'none',
        }}
      >
        {iconGenerator(name.split('.')[1])}
        <p>{label}</p>
        <input
          type="checkbox"
          id={name}
          style={{display: 'none'}}
          onChange={onChangeHandler}
          checked={!!value}
        />
        <BlockSelectedIcon className="selectedIcon" />
      </label>
    </FavoriteBlockButtonStyle>

  );
};
