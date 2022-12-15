/* eslint-disable */
import React from 'react';
import { BlockSelectedIcon } from 'assets/images/icons';
import FavoriteBlockButtonStyle from 'components/FavoriteBlockButton/favoriteBlockButton.style';
import { useController } from 'react-hook-form';
import { iconGenerator } from '../favoriteGenerator';

export const CustomCheckBoxField = ({
  disabled,
  isEditAction,
  immdlySubmit,
  setShowTip,
  label,
  checkedArray,
  actKey,
  changeCallback,
  ...props
}) => {
  const { field } = useController(props);
  const { onChange, name, value } = field;
  const onChangeHandler = (event) => {
    const changedActKey = event.target.getAttribute('data-actkey');

    // 若 checkedArray 裡已存有勾選項目, 就先刪除掉 以方便後續處理
    const changedIndex = checkedArray.indexOf(changedActKey);
    if (changedIndex !== -1) {
      checkedArray.splice(changedIndex, 1);
    }

    // 把已勾選的項目存進 checkedArray
    const ele = document.getElementById(`favoriteBlockButton.${changedActKey}`);

    if ( ele.getAttribute('class').indexOf('selected') === -1 ) {

        if (checkedArray.length < 10) { 
            
          checkedArray.push(changedActKey);

          ele.setAttribute('class', ele.getAttribute('class') + ' selected' );

          event.target.checked = true;

        }else{

          event.target.checked = false;
        }
      
    }else{

        const classRemoveSelected = ele.getAttribute('class').replace(' selected', ' ');

        ele.setAttribute('class', classRemoveSelected);
    }
   
    if (checkedArray.length >= 10) {// 假如已選滿 10個, 停用未選項目的按鈕功能 並 顯示已滿提示
      let index;
      const list = document.getElementsByClassName('favorite_btn');

      for (index = 0; index < list.length; ++index) {
        if ( list[index].getAttribute('class').indexOf('selected') === -1 ) {

          list[index].setAttribute('disabled', 'disabled');
        }
      }
      setShowTip(true);

    } else {// 假如未選滿, 啟用全部停用項目的按鈕功能 並 取消已滿提示
      let index;
      const list = document.getElementsByClassName('favorite_btn');

      for (index = 0; index < list.length; ++index) {
        if ( list[index].getAttribute('disabled') === 'disabled' ) {

          list[index].removeAttribute('disabled');
        }
      }
      setShowTip(false);
    }

    // 觸發下方欄 "編輯完成(數字)" 的改變
    changeCallback(checkedArray.length);

    /* for debug
    console.log('========= checkbox changed ============');
    console.log(changedActKey);
    console.log(checkedArray);
    console.log('=======================================');
    */
  };

  // let fSize = checkedArray.length;
  // console.log('fSize');
  // console.log(fSize);

  // 針對已存在於 checkedArray 的項目, 做項目按鈕的反紫處理,
  // class參數: selected = 反紫, disabled = 反白
  let classValue = checkedArray.indexOf(actKey) !== -1 ? 'selected' : '';
  classValue += ' favorite_btn';

  return (
    <FavoriteBlockButtonStyle
      id={`favoriteBlockButton.${actKey}`}
      data-actkey={actKey}
      className={classValue}
      disabled={(checkedArray.indexOf(actKey) === -1 && checkedArray.length == 10) ? 'disabled' : ''}
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
          data-actkey={actKey}
          onChange={onChangeHandler}
          checked={!!value}
        />
        <BlockSelectedIcon className="selectedIcon" />
      </label>
    </FavoriteBlockButtonStyle>

  );
};
