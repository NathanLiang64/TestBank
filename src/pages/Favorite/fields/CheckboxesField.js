/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import { BlockSelectedIcon } from 'assets/images/icons';
import FavoriteBlockButtonStyle from 'components/FavoriteBlockButton/favoriteBlockButton.style';
import { useController } from 'react-hook-form';
// import "./CheckBox.css";

export const CheckboxesField = ({
  options,
  selectedLength, icon, setShowTip, ...control
}) => {
  const { field } = useController(control);
  const [value, setValue] = React.useState(field.value || []);
  //   console.log(value);
  console.log(field.value);
  //   const shouldDisabled = selectedLength >= 10 && !field.value;
  return (
    <>
      {options.map((option, index) => (

        <FavoriteBlockButtonStyle
          key={option.actKey}
          className={`favoriteBlockButton ${field.value ? 'selected' : ''}`}
        >
          {/* <label htmlFor={option.actKey} style={{width: '100%', height: '100%', position: 'relative'}}> */}
          {/* {icon} */}
          <p>{option.name}</p>
          <input
            onChange={(e) => {
              const valueCopy = [...value];
              // update checkbox value
              valueCopy[index] = e.target.checked ? e.target.value : null;
              // send data to react hook form
              field.onChange(valueCopy);
              // update local state
              setValue(valueCopy);
            }}
            // name={option.actKey}
            value={option.actKey}
            type="checkbox"
            checked={value.includes(option)}
          />
          <BlockSelectedIcon className="selectedIcon" />
          {/* </label> */}
        </FavoriteBlockButtonStyle>
      ))}
    </>

  //   <FavoriteBlockButtonStyle
  //     className={`favoriteBlockButton ${field.value ? 'selected' : ''}`}
  //   //   onClick={() => { if (shouldDisabled) setShowTip(true); }}
  //   >
  //     <label htmlFor={field.name} style={{width: '100%', height: '100%', position: 'relative'}}>
  //       {icon}
  //       <p>{label}</p>
  //       <input
  //         {...field}
  //         type="checkbox"
  //       //   disabled={shouldDisabled}
  //         id={field.name}
  //         style={{display: 'none'}}
  //         checked={!!field.value}
  //       />
  //       <BlockSelectedIcon className="selectedIcon" />
  //     </label>
  //   </FavoriteBlockButtonStyle>

  );
};
