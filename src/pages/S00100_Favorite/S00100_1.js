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
import { setModalVisible } from 'stores/reducers/ModalReducer';
import { useDispatch } from 'react-redux';
import { getFavoriteSettingList, modifyFavoriteItem } from './api';
import { CheckBoxField } from './fields/CheckboxField';
import {
  calcSelectedLength, extractGroupItems, generateReorderList, findExistedValue, generateTrimmedList,
} from './utils';
import { CardLessSettingFields } from './fields/cardLessSettingField';
import { validationSchema } from './validationSchema';

const Favorite2New = ({
  favoriteList, updateFavoriteList, back2MyFavorite, isEditAction,
}) => {
  const [favoriteSettingList, setFavoriteSettingList] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [tabId, setTabId] = useState('C');
  const [showTip, setShowTip] = useState(false);
  const mainContentRef = useRef();
  const sectionsRef = useRef([]);
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
      if (isMaximum && !isSelected) return true;
      return false;
    }
    // 當被點選的項目已存在於 initialValues 時，需要被 disabled
    if (alreadyExisted) return true;
    return false;
  };

  // 編輯完成送出表單
  const handleClickEditCompleted = async ({editedBlockList}) => {
    const orderedList = generateReorderList(favoriteList, editedBlockList);
    const trimmedList = generateTrimmedList(orderedList, 10, '');
    // 應該從 cardLess API 得知是否已有設定值，並以此決定是否要設置無卡提款
    // 目前尚未拿到 cardless API，先透過是否已經存在無卡提款服務來避開
    const alreadyExistedCardLess = findExistedValue(initialValues, 'D00300');
    if (trimmedList.includes('D00300') && !alreadyExistedCardLess) {
      await showCustomPrompt({
        title: '無卡提款',
        message: (
          <form>
            快速提領金額
            <CardLessSettingFields name="cardLessCredit" control={cardLessControl} />
          </form>
        ),
        onOk: cardLessHandleSubmit(async (values) => {
          // 待 無卡提款設定 API 開發完畢
          console.log('values', values);
          dispatch(setModalVisible(false));
          await Promise.all(trimmedList.map((actKey, position) => (
            modifyFavoriteItem({actKey, position: parseInt(position, 10)})
          )));
          // 送出修改後的名單，隨後再次更新最愛列表，並回到我的最愛首頁
          await updateFavoriteList();
          back2MyFavorite();
        }),
        onClose: () => {
          if (isEditAction) return;
          // 若是新增模式情況下，離開 modal 時需要取消勾選
          reset({editedBlockList: initialValues});
        },
        noDismiss: true,

      });
    } else {
      try {
        await Promise.all(trimmedList.map((actKey, position) => (
          modifyFavoriteItem({actKey, position: parseInt(position, 10)})
        )));
        await updateFavoriteList();
        back2MyFavorite();
      } catch (err) {
        await showCustomPrompt({
          title: '錯誤',
          message: err.message,
        });
      }
    }
  };

  // 點擊 tab 時
  const handleChangeTabs = (_, value) => {
    const scrollTarget = sectionsRef.current.find((el) => el.className === value);
    scrollTarget.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollContent = () => {
    const { scrollTop } = mainContentRef.current;
    const currentSection = sectionsRef.current.find((el) => el.offsetTop >= scrollTop);
    if (currentSection.className !== tabId) setTabId(currentSection.className);
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
          <CheckBoxField
            key={actKey}
            control={control}
            name={`editedBlockList.${actKey}`}
            defaultValue={false}
            label={name}
            disabled={checkDisabled(actKey)}
            immdlySubmit={handleSubmit(handleClickEditCompleted)}
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
            onClick={handleSubmit(handleClickEditCompleted)}
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
