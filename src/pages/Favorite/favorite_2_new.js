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
import { CheckBoxField } from './fields/CheckboxField';
import {
  calcSelectedLength, extractGroupItems, filterAddItem,
} from './utils';

const Favorite2New = ({
  // eslint-disable-next-line no-unused-vars
  favoriteList, updateFavoriteList, back2MyFavorite, specifiedLocation, actionType,
}) => {
  const [favoriteSettingList, setFavoriteSettingList] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [tabId, setTabId] = useState('C');
  const [showTip, setShowTip] = useState(false);
  const mainContentRef = useRef();
  const sectionsRef = useRef([]);

  // react-hook-form 設定
  const {
    control, watch, reset, handleSubmit,
  } = useForm();
  const watchedValues = watch('editedBlockList');
  const selectedLength = useMemo(() => {
    let count = 0;
    for (const key in watchedValues) {
      if (watchedValues[key]) count++;
    }
    return count;
  }, [watchedValues]);

  // 最多可選取服務數量
  const maxSelectedLength = useMemo(() => {
    if (actionType === 'edit') return 10;
    const selectedItems = calcSelectedLength(initialValues);
    return selectedItems + 1;
  }, [favoriteSettingList, initialValues]);

  const checkDisabled = (key) => {
    if (!watchedValues) return false;
    if (actionType === 'edit') return selectedLength >= maxSelectedLength && !watchedValues[key];
    // actionTYPE === 'add'
    // 當被點選的項目已存在於 initialValues 時，需要被 disabled
    if (initialValues[key]) return true;
    // 只有後來被勾選的項目才可以被允許勾選
    if (watchedValues[key]) return false;
    return selectedLength >= maxSelectedLength;
  };

  // 點擊編輯完成
  const handleClickEditCompleted = async (values) => {
    const {editedBlockList} = values;
    // =======================================================
    if (actionType === 'add') {
      // TODO: previousList應該由 favoriteSettingList 得到，
      const updatedList = favoriteList.filter((item) => item.position !== '-1');
      const addedKey = filterAddItem(initialValues, editedBlockList);
      if (addedKey) updatedList.push({actKey: addedKey, position: specifiedLocation});
      // 更新我的最愛項目
      await Promise.all(updatedList.map(({actKey, position}) => modifyFavoriteItem({actKey, position: parseInt(position, 10)})));
    } else if (actionType === 'edit') {
      const selectedItems = [];
      Object.keys(editedBlockList).forEach((key) => {
        if (editedBlockList[key]) selectedItems.push(key);
      });
      // 更新我的最愛項目
      await Promise.all(selectedItems.map((actKey, position) => modifyFavoriteItem({actKey, position})));
    }
    // 重新拿取我的最愛列表
    await updateFavoriteList();
    // 回到我的最愛總覽頁
    back2MyFavorite();
  };

  // 點擊 tab 時
  const handleChangeTabs = (event, value) => {
    if (event.target) {
      const scrollTarget = sectionsRef.current.find((el) => el.className === value);
      scrollTarget.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollContent = () => {
    const { scrollTop } = mainContentRef.current;
    const currentSection = sectionsRef.current.find((el) => el.offsetTop >= scrollTop);
    if (currentSection.className !== tabId) setTabId(currentSection.className);
  };

  const renderBlockGroup = () => favoriteSettingList.map((group, index) => (
    <section
      ref={(el) => { sectionsRef.current[index] = el; }}
      key={group.groupKey}
      className={group.groupKey}
    >
      <h3 className="title">{group.groupName}</h3>
      <div className="blockGroup">
        {group.items.map((item) => (
          <CheckBoxField
            key={item.actKey}
            control={control}
            name={`editedBlockList.${item.actKey}`}
            label={item.name}
            icon={iconGenerator(item.actKey)}
            defaultValue={false}
            disabled={checkDisabled(item.actKey)}
            setShowTip={setShowTip}
          />
        ))}
      </div>
    </section>
  ));

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
      const initValue = extractGroupItems(favoriteSettingList);
      setInitialValues(initValue);
      reset({editedBlockList: initValue});
    }
  }, [favoriteSettingList]);

  // console.log('favoriteSettingList', favoriteSettingList);
  return (
    <div className="editFavoritePage">
      <FEIBTabContext value={tabId}>
        <FEIBTabList $size="small" onChange={handleChangeTabs}>
          { renderTabList() }
        </FEIBTabList>
      </FEIBTabContext>

      <div className="tipArea">
        {actionType === 'add' ? <p>請選取1項服務加入我的最愛！</p>
          : <p>您最多可以選取10項服務加入我的最愛！</p>}
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
            {`${actionType === 'edit' ? '編輯' : '新增'}完成(${selectedLength})`}
          </button>
        </BottomAction>
      </form>

      { showTip && <SnackModal text="最愛已選滿" /> }
    </div>
  );
};

export default Favorite2New;
