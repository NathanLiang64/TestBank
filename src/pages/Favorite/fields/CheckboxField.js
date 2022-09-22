// eslint-disable-next-line no-unused-vars
import { BlockSelectedIcon } from 'assets/images/icons';
import FavoriteBlockButtonStyle from 'components/FavoriteBlockButton/favoriteBlockButton.style';
import React from 'react';
import { useController } from 'react-hook-form';
// import "./CheckBox.css";

export const CheckBoxField = ({
  selectedLength, icon, setShowTip, label, ...control
}) => {
  const { field } = useController(control);
  const shouldDisabled = selectedLength >= 10 && !field.value;
  return (
    <FavoriteBlockButtonStyle
      className={`favoriteBlockButton ${field.value ? 'selected' : ''}`}
      onClick={() => { if (shouldDisabled) setShowTip(true); }}
    >
      <label htmlFor={field.name} style={{width: '100%', height: '100%', position: 'relative'}}>
        {icon}
        <p>{label}</p>
        <input
          {...field}
          type="checkbox"
          disabled={shouldDisabled}
          id={field.name}
          style={{display: 'none'}}
          checked={!!field.value}
        />
        <BlockSelectedIcon className="selectedIcon" />
      </label>
    </FavoriteBlockButtonStyle>

  );
};
