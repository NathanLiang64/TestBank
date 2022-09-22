/* eslint-disable no-unused-vars */
import React, {
  useEffect, useRef, useState, useMemo,
} from 'react';
import {useForm} from 'react-hook-form';

import { useSelector, useDispatch } from 'react-redux';
import BottomAction from 'components/BottomAction';
import SnackModal from 'components/SnackModal';
import { FEIBTab, FEIBTabContext, FEIBTabList } from 'components/elements';
import { iconGenerator, favIconGenerator } from './favoriteGenerator';
import { setFavoriteList } from './stores/actions';
import { getFavoriteSettingList, modifyFavoriteItem } from './api';
import { CheckBoxField } from './fields/CheckboxField';
import { CheckboxesField } from './fields/CheckboxesField';

const Favorite2New = ({updateFavoriteList}) => {
  const {favoriteDrawer, favoriteList} = useSelector(({ favorite }) => favorite);
  const [tabId, setTabId] = useState('C');
  const [showTip, setShowTip] = useState(false);
  const mainContentRef = useRef();
  const sectionsRef = useRef([]);
  const dispatch = useDispatch();

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

  // 點擊編輯完成
  const handleClickEditCompleted = async (values) => {
    console.log(values);
    // const {editedBlockList} = values;
    // const selectedItems = [];
    // Object.keys(editedBlockList).forEach((key) => {
    //   if (editedBlockList[key]) selectedItems.push(key);
    // });
    // // 更新用戶我的最愛項目
    // await Promise.all(selectedItems.map((actKey, position) => modifyFavoriteItem({actKey, position})));
    // // 重新拿取我的最愛列表
    // await updateFavoriteList();
    // // 回到我的最愛總覽頁
    // favoriteDrawer.back();
  };

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

  const renderBlockGroup = (groups) => groups.map((group, index) => (
    <section
      ref={(el) => { sectionsRef.current[index] = el; }}
      key={group.groupKey}
      className={group.groupKey}
    >
      <h3 className="title">{group.groupName}</h3>
      <div className="blockGroup">
        <CheckboxesField options={group.items} control={control} name="editedBlockList" defaultValue={false} />
        {/* {group.items.map((item) => (
          <CheckBoxField
            key={item.actKey}
            label={item.name}
            name={`editedBlockList.${item.actKey}`}
            icon={iconGenerator(item.actKey)}
            defaultValue={false}
            selectedLength={selectedLength}
            setShowTip={setShowTip}
            control={control}
          />
        ))} */}
      </div>
    </section>
  ));

  const renderTabList = (tabs) => tabs.map((tab) => (
    <FEIBTab key={tab.groupKey} label={tab.groupName} value={tab.groupKey} />
  ));

  // 拿取 favoriteList
  useEffect(() => {
    getFavoriteSettingList().then((response) => {
      if (Array.isArray(response) && response?.length) {
        dispatch(setFavoriteList(response));
      }
    });
  }, []);

  //   當 Tip 出現後 1 秒將其取消
  useEffect(() => {
    let timer = null;
    if (showTip) timer = setTimeout(() => setShowTip(false), 1000);
    return () => clearTimeout(timer);
  }, [showTip]);

  // 更新 react-hook-form 的 defaultValues
  // useEffect(() => {
  //   if (favoriteList.length) {
  //     const initialValues = favoriteList.reduce((acc, group) => {
  //       group.items.forEach((item) => {
  //         const isFavorite = !!parseInt(item.isFavorite, 10);
  //         acc[item.actKey] = isFavorite;
  //       });
  //       return acc;
  //     }, {});
  //     reset({editedBlockList: initialValues});
  //   }
  // }, [favoriteList]);

  return (
    <div className="editFavoritePage">
      <FEIBTabContext value={tabId}>
        <FEIBTabList $size="small" onChange={handleChangeTabs}>
          { renderTabList(favoriteList) }
        </FEIBTabList>
      </FEIBTabContext>

      <div className="tipArea">
        <p>您最多可以選取10項服務加入我的最愛！</p>
      </div>

      <form
        className="mainContent"
        ref={mainContentRef}
        onScroll={handleScrollContent}
        onSubmit={handleSubmit(handleClickEditCompleted)}
      >
        { renderBlockGroup(favoriteList) }
        <BottomAction position={0}>
          <button type="submit">
            {`編輯完成(${selectedLength})`}
          </button>
        </BottomAction>
      </form>

      { showTip && <SnackModal text="最愛已選滿" /> }
    </div>
  );
};

export default Favorite2New;
