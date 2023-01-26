import React, {
  useContext,
} from 'react';
import { BlockSelectedIcon } from 'assets/images/icons';
import FavoriteBlockButtonStyle from 'components/FavoriteBlockButton/favoriteBlockButton.style';
import { useController } from 'react-hook-form';
import { iconGenerator } from '../favoriteGenerator';
import { EventContext } from '../utils';

export const CustomCheckBoxField = ({
  isEditAction,
  setShowTip,
  label,
  funcCode,
  usedPostions, // 是上一層 (S00100_1)傳過來的 reference, 用來記錄已勾選的項目, 用來在 S00100_1提交表單時使用
  ...props
}) => {
  // 這個HOOK是專門設計來讓模組內所有子元件共享事件, 用來取代callback function當props傳來傳去的做法
  // shareEvent: 用來監聽觸發
  // callShareEvent: 用來觸發
  const {callShareEvent} = useContext(EventContext);

  const { field } = useController(props);
  const { name, value } = field;

  const getRealCheckedCount = () => {
    let realArrayCount = 0;
    for (let i = 0; i < 10; i++) {
      if (typeof usedPostions[i] !== 'undefined') {
        realArrayCount++;
      }
    }

    return realArrayCount;
  };

  const onChangeHandler = (event) => {
    const changedActKey = event.target.getAttribute('data-actkey');

    const ele = document.getElementById(`favoriteBlockButton.${changedActKey}`);

    if (!isEditAction) { // 新增模式
      // 新增模式下僅能選取未被加入的選項
      if (ele.getAttribute('class').indexOf('selected') === -1) {
        ele.setAttribute('class', `${ele.getAttribute('class')} selected`);

        callShareEvent(['S00100_1_doSubmit', changedActKey]);
      }
    } else { // 編輯模式
      // console.log(usedPostions);
      // console.log( usedPostions.indexOf(changedActKey));

      // 把使用者已勾選的項目存進
      if (ele.getAttribute('class').indexOf('selected') === -1) {
        if (getRealCheckedCount() < 10) {
          // 依序從前面的空位開始塞
          for (let i = 0; i < 10; i++) {
            if (typeof usedPostions[i] === 'undefined') {
              usedPostions[i] = changedActKey;
              break;
            }
          }

          ele.setAttribute('class', `${ele.getAttribute('class')} selected`);
        }
      } else {
        // 若已存有勾選項目, 就刪除掉
        if (usedPostions.indexOf(changedActKey) !== -1) {
          delete usedPostions[usedPostions.indexOf(changedActKey)];
        }

        const classRemoveSelected = ele.getAttribute('class').replace(' selected', ' ');

        ele.setAttribute('class', classRemoveSelected);
      }

      // 假如使用者已選滿 10個, 停用未選項目的按鈕功能 並 顯示已滿提示
      if (getRealCheckedCount() >= 10) {
        let index;
        const list = document.getElementsByClassName('favorite_btn');

        for (index = 0; index < list.length; ++index) {
          if (list[index].getAttribute('class').indexOf('selected') === -1) {
            list[index].setAttribute('disabled', 'disabled');
          }
        }
        setShowTip(true);
      } else { // 假如未選滿, 啟用所有 disabled項目的按鈕功能 並 取消已滿提示
        let index;
        const list = document.getElementsByClassName('favorite_btn');

        for (index = 0; index < list.length; ++index) {
          if (list[index].getAttribute('disabled') === 'disabled') {
            list[index].removeAttribute('disabled');
          }
        }
        setShowTip(false);
      }

      // 觸發下方欄 "編輯完成(數字)" 括號內數字的改變更新
      callShareEvent(['S00100_1_setCheckedSize', getRealCheckedCount()]);
    }
  };

  return (
    <FavoriteBlockButtonStyle
      id={`favoriteBlockButton.${funcCode}`}
      data-actkey={funcCode}
      className={(() => {
        // 透過設定class屬性, 針對已存在於 checkedArray 的項目, 做項目按鈕的反紫處理,
        // class參數: selected = 反紫, disabled = 反白
        const classValue = usedPostions.indexOf(funcCode) !== -1 ? 'selected' : '';
        return `${classValue} favorite_btn`;
      })()}
      disabled={(getRealCheckedCount() >= 10 && usedPostions.indexOf(funcCode) === -1) ? 'disabled' : ''}
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
          data-actkey={funcCode}
          onChange={onChangeHandler}
          checked={!!value}
        />
        {isEditAction && (<BlockSelectedIcon className="selectedIcon" />)}
      </label>
    </FavoriteBlockButtonStyle>

  );
};
