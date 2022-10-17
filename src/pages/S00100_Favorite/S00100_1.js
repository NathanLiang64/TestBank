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
import { getFavoriteSettingList, modifyFavoriteItem } from './api';
import { CustomCheckBoxField } from './fields/customCheckboxField';
import {
  calcSelectedLength, extractGroupItems, generateReorderList, findExistedValue, generateTrimmedList, cardLessOptions,
} from './utils';
import { validationSchema } from './validationSchema';

const Favorite2New = ({
  favoriteList, updateFavoriteList, back2MyFavorite, isEditAction,
}) => {
  const [favoriteSettingList, setFavoriteSettingList] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [tabId, setTabId] = useState('C');
  const [showTip, setShowTip] = useState(false);
  const sectionsRef = useRef([]);
  const mainContentRef = useRef();
  const dispatch = useDispatch();

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

  const patchAndRedirect = async (patchedList) => {
    dispatch(setWaittingVisible(true));
    await Promise.all(patchedList.map((actKey, position) => (
      modifyFavoriteItem({actKey, position: parseInt(position, 10)})
    )));
    await updateFavoriteList();
    dispatch(setWaittingVisible(false));
    back2MyFavorite();
  };

  // 編輯完成送出表單
  const onSubmit = async ({editedBlockList}) => {
    const orderedList = generateReorderList(favoriteList, editedBlockList);
    const trimmedList = generateTrimmedList(orderedList, 10, '');
    // 應該從 cardLess API 得知是否已有設定值，並以此決定是否要設置無卡提款
    // 目前尚未拿到 cardless API，先透過是否已經存在無卡提款服務來避開
    const alreadyExistedCardLess = findExistedValue(initialValues, 'D00300');
    if (trimmedList.includes('D00300') && !alreadyExistedCardLess) {
      await showCustomPrompt({
        title: '無卡提款',
        message: (
          <DropdownField
            options={cardLessOptions}
            labelName="快速提領金額"
            name="cardLessCredit"
            control={cardLessControl}
          />
        ),
        onOk: cardLessHandleSubmit(async (values) => {
          console.log('values', values); // 待 無卡提款設定 API 開發完畢
          dispatch(setModalVisible(false));
          patchAndRedirect(trimmedList);
        }),
        onClose: () => {
          if (isEditAction) return;
          reset({editedBlockList: initialValues}); // 新增模式情況下，按下 X 按鈕時需要取消勾選
        },
        noDismiss: true,
      });
    } else {
      patchAndRedirect(trimmedList);
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
            key={actKey}
            control={control}
            name={`editedBlockList.${actKey}`}
            defaultValue={false}
            label={name}
            disabled={checkDisabled(actKey)}
            immdlySubmit={handleSubmit(onSubmit)}
            isEditAction={isEditAction}
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
        { renderBlockGroup() }
        {isEditAction && (
        <BottomAction position={0}>
          <button
            type="button"
            style={{cursor: 'pointer'}}
            onClick={handleSubmit(onSubmit)}
          >
            {`編輯完成(${selectedLength})`}
          </button>
        </BottomAction>
        )}
      </form>
      { showTip && <SnackModal text="最愛已選滿" /> }
    </div>
  );
};

export default Favorite2New;
