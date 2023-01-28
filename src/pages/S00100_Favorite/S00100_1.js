/* eslint-disable no-unused-vars */
// /* eslint-disable */
import React, {
  useEffect, useRef, useState, useMemo, useContext,
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
import {
  getMyFuncs, saveMyFuncs, modifyFavoriteItem, deleteFavoriteItem,
} from './api';
import { CustomCheckBoxField } from './fields/customCheckboxField';
import {
  calcSelectedLength, extractGroupItems, generateReorderList, findExistedValue, generateTrimmedList, cardLessOptions,
  EventContext,
} from './utils';
import { validationSchema } from './validationSchema';

const Favorite2New = ({
  favoriteList, isEditAction, addPoposition, favoriteSettingList,
}) => {
  const [tabId, setTabId] = useState('C');
  const [showTip, setShowTip] = useState(false);
  const sectionsRef = useRef([]);
  const mainContentRef = useRef();
  const dispatch = useDispatch();

  // 這個HOOK是專門設計來讓模組內所有子元件共享事件, 用來取代callback function當props傳來傳去的做法
  // shareEvent: 用來監聽觸發
  // callShareEvent: 用來觸發
  const {shareEvent, callShareEvent} = useContext(EventContext);

  // 為了在使用者勾選項目變動時, 即時更新下方欄位的編輯完成括號裡的數字
  const [checkedArrayLength, setcheckedArrayLength] = useState(0);

  // 在進入編輯頁面時, 將使用者先前就已加入最愛的項目先紀錄下來, 用於提交清單時 RESET 這些項目
  const alreadyCheckedItemBeforeEdit = useMemo(() => ([]), []);
  const usedPostions = useMemo(() => ([]), []);
  const hasExistedCardLess = useRef(false);

  useEffect(() => {
    // console.log('======== favoriteList========');
    // console.log(favoriteList);
    // console.log('=============================');

    hasExistedCardLess.current = false;

    favoriteList.forEach((obj, index) => {
      alreadyCheckedItemBeforeEdit.push(obj.funcCode);

      if (obj.funcCode === FuncID.D00300_無卡提款) {
        hasExistedCardLess.current = true;
      }

      if (obj.position !== -1) {
        usedPostions[obj.position] = obj.funcCode;
      }
    });

    // 更新下方欄位的編輯完成括號裡的數字
    setcheckedArrayLength(alreadyCheckedItemBeforeEdit.length - 2);

    // console.log('======== usedPostions========');
    // console.log(usedPostions);
    // console.log('=============================');

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
    formState: { errors },
  } = useForm({ defaultValues: {cardLessCredit: ''}, resolver: yupResolver(validationSchema) });

  const patchOneAndRedirect = async (funcCode, position) => {
    await modifyFavoriteItem({ funcCode, position });

    const rows = await getMyFuncs();

    // 在處理好無卡提款跳窗後 把跳窗關掉
    if (funcCode === FuncID.D00300_無卡提款) {
      dispatch(setModalVisible(false));
    }

    // 將項目更新的結果 傳回S00100頁面 更新list cache
    callShareEvent(['S00100_updateMemoFavoriteList', rows]);

    // 觸發S00100頁面的數字的back2MyFavorite事件
    callShareEvent(['S00100_back2MyFavorite']);
  };

  const patchAndRedirect = async (patchedList = []) => {
    dispatch(setWaittingVisible(true));

    const itemsSkipFixTwo = JSON.parse(JSON.stringify(alreadyCheckedItemBeforeEdit)).splice(2);

    // 判斷編輯頁的勾選項目如果沒變動就不重新 submit
    // if( JSON.stringify(trueArray.checkedArray) != JSON.stringify(itemsSkipFixTwo) ){

    const changedItems = [];

    // RESET 使用者在進入編輯頁面時 就已加入最愛的項目, 除了預設寫死的前 2 個項目
    alreadyCheckedItemBeforeEdit.shift();
    alreadyCheckedItemBeforeEdit.shift();
    await Promise.all(
      alreadyCheckedItemBeforeEdit.map((funcCode, position) => deleteFavoriteItem(funcCode)),
    );

    let isAddCardless = false;

    // 加入所有勾選的項目
    // await Promise.all(
    //   usedPostions.map((funcCode, position) => {
    //     if (funcCode === FuncID.D00300) {
    //       isAddCardless = true;
    //     }
    const addItems = usedPostions.map((funcCode, position) => {
      if (funcCode === FuncID.D00300_無卡提款) isAddCardless = true;
      return {funcCode, position};
    });
    await saveMyFuncs(addItems);
    //     return modifyFavoriteItem({ funcCode, position });
    //   }),
    // );

    const rows = await getMyFuncs();

    // 將項目更新的結果 傳回S00100頁面 更新list cache
    callShareEvent(['S00100_updateMemoFavoriteList', rows]);
    // }

    dispatch(setWaittingVisible(false));

    // 在處理好無卡提款跳窗後 把跳窗關掉
    if (isAddCardless) {
      dispatch(setModalVisible(false));
    }

    // 觸發S00100頁面的數字的back2MyFavorite事件
    callShareEvent(['S00100_back2MyFavorite']);
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
      onOk: cardLessHandleSubmit(async (values) => {
        console.log('values', values); // 待 無卡提款設定 API 開發完畢

        okCallback();
      }),
      onClose: () => {
        if (isEditAction) return;

        // 觸發S00100頁面的數字的back2MyFavorite事件
        callShareEvent(['S00100_back2MyFavorite']);// 新增模式情況下，按下 X 按鈕時 回到上一頁
      },
      noDismiss: true,
    });
  };

  // 編輯完成送出表單
  const onSubmit = ({ editedBlockList }) => {
    if (usedPostions.indexOf(FuncID.D00300_無卡提款) !== -1 && !hasExistedCardLess.current) {
      // TODO 不是在Submit時才要求輸入金額，是在選取當下。
      handleCardlessSubmit(() => {
        patchAndRedirect();
      });
    } else {
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
        {items.map(({funcCode, name}) => (
          <CustomCheckBoxField
            key={funcCode}
            control={control}
            name={`editedBlockList.${funcCode}`}
            defaultValue={false}
            label={name}
            isEditAction={isEditAction}
            setShowTip={setShowTip}
            usedPostions={usedPostions}
            funcCode={funcCode}
          />
        ))}
      </div>
    </section>
  ));

  const renderTabList = () => favoriteSettingList.map((group) => (
    <FEIBTab key={group.groupKey} label={group.groupName} value={group.groupKey} />
  ));

  // 跳白畫面0.5s 防止多次點擊
  const preventMultiSubmit = (callback) => {
    (async () => {
      callback();

      dispatch(setWaittingVisible(true));
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(setWaittingVisible(false));
    })();
  };

  //  當 Tip 出現後 1 秒將其取消
  useEffect(() => {
    let timer = null;
    if (showTip) timer = setTimeout(() => setShowTip(false), 1000);
    return () => clearTimeout(timer);
  }, [showTip]);

  // 監聽模組內其他頁面的跨頁面事件呼叫
  useEffect(() => {
    const [type, params] = shareEvent;

    // eslint-disable-next-line default-case
    switch (type) {
      case 'S00100_1_doSubmit': {
        const funcCode = params;

        if (!isEditAction) {
          if (funcCode === FuncID.D00300_無卡提款) {
            handleCardlessSubmit(() => {
              preventMultiSubmit(() => {
                patchOneAndRedirect(funcCode, addPoposition);
              });
            });
          } else {
            preventMultiSubmit(() => {
              patchOneAndRedirect(funcCode, addPoposition);
            });
          }
        }
        break;
      }

      case 'S00100_1_setCheckedSize':

        setcheckedArrayLength(params);
        break;
    }
  }, [shareEvent]);

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
          isEditAction
          && (
          <BottomAction position={0}>
            <button
              type="button"
              style={{ cursor: 'pointer' }}
              onClick={handleSubmit(onSubmit)}
            >
              {`編輯完成(${checkedArrayLength})`}
            </button>
          </BottomAction>
          )
}
      </form>
      { showTip && <SnackModal text="最愛已選滿" /> }
    </div>
  );
};

export default Favorite2New;
