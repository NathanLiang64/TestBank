/* eslint-disable */
import React, {
  useEffect, useRef, useState, useMemo,
} from 'react';
import { useForm } from 'react-hook-form';
import BottomAction from 'components/BottomAction';
import SnackModal from 'components/SnackModal';
import {
  FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import { showCustomPrompt } from 'utilities/MessageModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useDispatch } from 'react-redux';
import { DropdownField } from 'components/Fields';
import { FuncID } from 'utilities/FuncID';
import { getFavoriteSettingList, modifyFavoriteItem, deleteFavoriteItem } from './api';
import { CustomCheckBoxField } from './fields/customCheckboxField';
import {
  calcSelectedLength, extractGroupItems, generateReorderList, findExistedValue, generateTrimmedList, cardLessOptions,
} from './utils';
import { validationSchema } from './validationSchema';

const Favorite2New = ({
  favoriteList, back2MyFavorite, isEditAction, addPoposition
}) => {
  const [favoriteSettingList, setFavoriteSettingList] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [tabId, setTabId] = useState('C');
  const [showTip, setShowTip] = useState(false);
  const sectionsRef = useRef([]);
  const mainContentRef = useRef();
  const dispatch = useDispatch();

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => { 
      mountedRef.current = false
    }
  }, []);

  // 為了在使用者勾選項目變動時, 即時更新下方欄位的編輯完成括號裡的數字
  const [checkedArrayLength, setcheckedArrayLength] = useState(0);
 

  // 在進入編輯頁面時, 將使用者先前就已加入最愛的項目先紀錄下來, 用於提交清單時 RESET 這些項目
  const alreadyCheckedItemBeforeEdit = useMemo(() => ([]), []);
  const usedPostions = useMemo(() => ([]), []);
  const hasExistedCardLess = useRef(false); 

  useEffect(() => {

    console.log('======== favoriteList========');
    console.log(favoriteList);
    console.log('=============================');

    hasExistedCardLess.current = false;

    favoriteList.map((obj, index) => {

          alreadyCheckedItemBeforeEdit.push(obj['actKey']);

          if( obj['actKey'] == FuncID.D00300 ){
            hasExistedCardLess.current = true;
          }


          if( obj['position'] != -1 ){ 
            usedPostions[obj['position']] = obj['actKey'];
          }
    });

    console.log('======== usedPostions========');
    console.log(usedPostions);
    console.log('=============================');
    
    // console.log('======== alreadyCheckedItemBeforeEdit ===========');
    // console.log(alreadyCheckedItemBeforeEdit);
    // console.log('=================================================');
  }, []);

  // 我的最愛表單
  const {
    control, watch, reset, handleSubmit,
  } = useForm();
  const watchedValues = watch('editedBlockList');
  const selectedLength = useMemo(() => calcSelectedLength(watchedValues), [watchedValues]);

  // 無卡提款表單
  const {
    control: cardLessControl,
    handleSubmit: cardLessHandleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: {cardLessCredit: ''}, resolver: yupResolver(validationSchema) });

  // 已選取 10 項不可被選取 & 新增模式下僅能選取未被加入的選項
  const checkDisabled = (key) => {
    const alreadyExisted = findExistedValue(initialValues, key);
    const isSelected = findExistedValue(watchedValues, key);
    const isMaximum = selectedLength >= 10;
    if (isEditAction) {
      if (isMaximum && !isSelected) return true; // 編輯模式: 超出數量無法被選取
      return false;
    }
    if (alreadyExisted) return true; // 新增模式: 項目若已存在於 initialValues，需要被 disabled
    return false;
  };

                
  const patchOneAndRedirect = async (actKey, addPoposition) => {
    dispatch(setWaittingVisible(true));

    await modifyFavoriteItem({ actKey, position: parseInt(addPoposition, 10) });

    dispatch(setWaittingVisible(false));
    back2MyFavorite();
  };


  const patchAndRedirect = async (patchedList=[]) => {
    dispatch(setWaittingVisible(true));

    const itemsSkipFixTwo = JSON.parse(JSON.stringify(alreadyCheckedItemBeforeEdit)).splice(2);

    // 判斷編輯頁的勾選項目如果沒變動就不重新 submit
    // if( JSON.stringify(trueArray.checkedArray) != JSON.stringify(itemsSkipFixTwo) ){

      // RESET 使用者在進入編輯頁面時 就已加入最愛的項目, 除了預設寫死的前 2 個項目
      alreadyCheckedItemBeforeEdit.shift();
      alreadyCheckedItemBeforeEdit.shift();
      await Promise.all(
        alreadyCheckedItemBeforeEdit.map((actKey, position) => {
   
            return deleteFavoriteItem(actKey);
        }),
      );

      // 加入所有勾選的項目
      await Promise.all(
        usedPostions.map((actKey, position) => {

              return modifyFavoriteItem({ actKey, position: parseInt(position, 10) })
        }),
      );
    // }

    dispatch(setWaittingVisible(false));
    back2MyFavorite();
  };

  const handleCardlessSubmit = (okCallback) => {
    showCustomPrompt({
      title: '無卡提款',
      message: (
        <DropdownField
          options={cardLessOptions}
          labelName="快速提領金額"
          name="cardLessCredit"
          control={cardLessControl}
        />
      ),
      onOk:cardLessHandleSubmit(async (values) => {
        console.log('values', values); // 待 無卡提款設定 API 開發完畢

        dispatch(setModalVisible(false));

        // patchAndRedirect(trimmedList); //原寫法棄用

        // if( isEditAction ){

        //   patchAndRedirect();
        // }else{

        //   patchOneAndRedirect(actKey, addPoposition);
        // }
        
        okCallback();
      }),
      onClose: () => {
        if (isEditAction) return;
        back2MyFavorite(); // 新增模式情況下，按下 X 按鈕時 回到上一頁
      },
      noDismiss: true,
    });
  };

  // 編輯完成送出表單
  const onSubmit = ({ editedBlockList }) => {

    if( usedPostions.indexOf(FuncID.D00300) !== -1 && !hasExistedCardLess.current ){

      handleCardlessSubmit(() => {
                    
        patchAndRedirect();
      });

    }else{

      patchAndRedirect();
    }
  };

  // 點擊 tab 時
  const handleChangeTabs = (_, value) => {
    const scrollTarget = sectionsRef.current.find((el) => el.className === value);
    scrollTarget.scrollIntoView();
    const { scrollHeight, scrollTop, offsetHeight } = mainContentRef.current;
    if ((scrollHeight - (scrollTop + offsetHeight) <= 1)) {
      setTabId(value);
    }
  };

  const handleScrollContent = (event) => {
    const { scrollHeight, scrollTop, offsetHeight } = event.target;

    if (!(scrollHeight - (scrollTop + offsetHeight) <= 1)) {
      const foundSection = sectionsRef.current.find((el) => {
        const top = el.offsetTop - 1;
        const bottom = el.offsetTop + el.offsetHeight;
        return (scrollTop >= top && scrollTop < bottom);
      });
      if (foundSection && foundSection.className !== tabId) setTabId(foundSection.className);
    }
  };

  const renderBlockGroup = () => favoriteSettingList.map(({groupKey, groupName, items}, index) => (
    <section
      ref={(el) => { sectionsRef.current[index] = el; }}
      key={groupKey}
      className={groupKey}
    >
      <h3 className="title">{groupName}</h3>
      <div className="blockGroup">
        {items.map(({actKey, name}) => (
          <CustomCheckBoxField
            doSubmit={() => {

              if( !isEditAction ){

                if( actKey == FuncID.D00300 ){

                  handleCardlessSubmit(() => {

                    patchOneAndRedirect(actKey, addPoposition);
                  });

                }else{

                  patchOneAndRedirect(actKey, addPoposition);
                }
              }
            }}
            key={actKey}
            control={control}
            name={`editedBlockList.${actKey}`}
            defaultValue={false}
            label={name}
            disabled={checkDisabled(actKey)}
            immdlySubmit={handleSubmit(onSubmit)}
            isEditAction={isEditAction}
            setShowTip={setShowTip}
            usedPostions={usedPostions}
            actKey={actKey}
            changeCallback={(checkedSize) => {setcheckedArrayLength(checkedSize)}}
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

      // mountedRef is used here to indicate if the component is still mounted. And if so, continue the async call to update component state, otherwise, skip them.
      if (!mountedRef.current) return null;
      
      if (Array.isArray(res) && res?.length) setFavoriteSettingList(res);
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
    if (!favoriteSettingList.length) return;
    const initValue = extractGroupItems(favoriteSettingList);

    

    setInitialValues(initValue);
    reset({editedBlockList: initValue});
  }, [favoriteSettingList]);

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
      >
        {renderBlockGroup()}
        {
          isEditAction && 
          (
          <BottomAction position={0}>
            <button
              type="button"
              style={{ cursor: 'pointer' }}
              onClick={handleSubmit(onSubmit)}
            >
              {`編輯完成(${checkedArrayLength})`}
            </button>
          </BottomAction>
        )}
      </form>
      { showTip && <SnackModal text="最愛已選滿" /> }
    </div>
  );
};

export default Favorite2New;
