/* eslint-disable no-unused-vars */
import React, {
  useEffect, useRef, useState, useMemo,
} from 'react';
import {useForm} from 'react-hook-form';
import BottomAction from 'components/BottomAction';
import SnackModal from 'components/SnackModal';
import { FEIBTab, FEIBTabContext, FEIBTabList } from 'components/elements';
import { iconGenerator } from './favoriteGenerator';
// eslint-disable-next-line no-unused-vars
import { getFavoriteSettingList, modifyFavoriteItem } from './api';
import { CheckBoxFieldNew } from './fields/CheckboxFieldNew';
import { extractGroupItemsNew, findExistedValue} from './utils';

const Favorite3 = ({
  // eslint-disable-next-line no-unused-vars
  updateFavoriteList, back2MyFavorite, specifiedLocation, isEditAction,
}) => {
  const [favoriteSettingList, setFavoriteSettingList] = useState([]);
  const [initialValues, setInitialValues] = useState([]);
  const [tabId, setTabId] = useState('C');
  const [showTip, setShowTip] = useState('');
  const mainContentRef = useRef();
  const sectionsRef = useRef([]);

  // react-hook-form 設定
  const {
    control, watch, reset, handleSubmit,
  } = useForm({defaultValues: {editedBlockList: []}});
  const watchedValues = watch('editedBlockList');
  const selectedLength = watchedValues.filter((value) => !!value).length;

  // 最多可選取服務數量
  const maxSelectedLength = useMemo(() => {
    if (isEditAction) return 10;
    const selectedItems = initialValues.filter((el) => !!el).length;
    return selectedItems + 1;
  }, [favoriteSettingList, initialValues]);

  // Checkbox 是否被 disabled
  const checkDisabled = (key) => {
    const isExisted = findExistedValue(watchedValues, key);
    const alreadyExisted = findExistedValue(initialValues, key);
    const isMaximum = selectedLength >= maxSelectedLength;
    if (isEditAction) {
      if (isMaximum && !isExisted) return {disabled: true, message: '最愛已選滿'};
      return {disabled: false, message: ''};
    }
    // 當被點選的項目已存在於 initialValues 時，需要被 disabled
    if (alreadyExisted) return {disabled: true, message: ''};
    // 只有後來被勾選的項目才可以被允許勾選
    if (isExisted) return {disabled: false, message: ''};
    if (isMaximum) return {disabled: true, message: '已選取 1 項服務'};
    return {disabled: false, message: ''};
  };

  // 點擊編輯完成
  const handleClickEditCompleted = async ({editedBlockList}) => {
    if (isEditAction) {
      // 編輯模式時
      const updatedList = editedBlockList.reduce((acc, cur) => {
        if (cur) {
          if (cur.position) {
            acc.push(cur);
          } else {
            acc.push({actKey: cur.actKey, position: specifiedLocation});
          }
        }
        return acc;
      }, []);
      // // 更新我的最愛項目
      // await Promise.all(updatedList.map(({actKey, position}) => modifyFavoriteItem({actKey, position: parseInt(position, 10)})));
    } else {
      // 新增模式時
      const orderedList = editedBlockList.reduce((acc, cur) => {
        if (cur && cur.position) acc[cur.position] = cur.actKey;
        return acc;
      }, Array(10).fill(undefined));
      const unorderedList = editedBlockList.filter((item) => item && !item.position);
      orderedList.forEach((el, index) => {
        if (!el) {
          const [value] = unorderedList.splice(0, 1);
          if (value) orderedList[index] = value.actKey;
        }
      });
      console.log(orderedList);
      // // 更新我的最愛項目
      // await Promise.all(selectedItems.map((actKey, position) => modifyFavoriteItem({actKey, position})));
    }
    // // 重新拿取我的最愛列表
    // await updateFavoriteList();
    // // 回到我的最愛總覽頁
    // back2MyFavorite();
  };

  const handleChangeTabs = (_, value) => {
    const scrollTarget = sectionsRef.current.find((el) => el.className === value);
    scrollTarget.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollContent = () => {
    const { scrollTop } = mainContentRef.current;
    const currentSection = sectionsRef.current.find((el) => el.offsetTop >= scrollTop);
    if (currentSection.className !== tabId) setTabId(currentSection.className);
  };

  const renderBlockGroup = () => {
    let count = 0;
    return favoriteSettingList.map((group, index) => (
      <section
        ref={(el) => { sectionsRef.current[index] = el; }}
        key={group.groupKey}
        className={group.groupKey}
      >
        <h3 className="title">{group.groupName}</h3>
        <div className="blockGroup">
          {group.items.map(({actKey, name, position}) => (
            <CheckBoxFieldNew
              key={actKey}
              control={control}
              name={`editedBlockList.${count++}`}
              label={name}
              value={{actKey, position}}
              icon={iconGenerator(actKey)}
              disabledObj={checkDisabled(actKey)}
              setShowTip={setShowTip}
            />
          ))}
        </div>
      </section>
    ));
  };

  const renderTabList = () => favoriteSettingList.map((group) => (
    <FEIBTab key={group.groupKey} label={group.groupName} value={group.groupKey} />
  ));

  // 拿取 favoriteSettingList
  useEffect(async () => {
    try {
      const res = await getFavoriteSettingList();
      if (Array.isArray(res) && res?.length) {
        setFavoriteSettingList(res);
      }
    } catch (err) {
      console.log('編輯我的最愛 err', err);
    }
  }, []);

  //  當 Tip 出現後 1 秒將其取消
  useEffect(() => {
    let timer = null;
    if (showTip) timer = setTimeout(() => setShowTip(false), 1000);
    return () => clearTimeout(timer);
  }, [showTip]);

  // 更新 react-hook-form 的 defaultValues
  useEffect(() => {
    if (favoriteSettingList.length) {
      const initValue = extractGroupItemsNew(favoriteSettingList);
      setInitialValues(initValue);
      reset({editedBlockList: initValue});
    }
  }, [favoriteSettingList]);

  // console.log('initialValues', initialValues);
  return (
    <div className="editFavoritePage">
      <FEIBTabContext value={tabId}>
        <FEIBTabList $size="small" onChange={handleChangeTabs}>
          { renderTabList() }
        </FEIBTabList>
      </FEIBTabContext>

      <div className="tipArea">
        <p>{`${isEditAction ? '您最多可以選取10項服務' : '請選取1項服務'}加入我的最愛!`}</p>
      </div>

      <form
        className="mainContent"
        ref={mainContentRef}
        onScroll={handleScrollContent}
        onSubmit={handleSubmit(handleClickEditCompleted)}
      >
        { renderBlockGroup() }
        <BottomAction position={0}>
          <button type="submit">
            {`${isEditAction ? '編輯' : '新增'}完成(${selectedLength})`}
          </button>
        </BottomAction>
      </form>

      { showTip && <SnackModal text={showTip} /> }
    </div>
  );
};

export default Favorite3;
