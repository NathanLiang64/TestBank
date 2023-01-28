/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-max-props-per-line */
import { FEIBTab, FEIBTabContext, FEIBTabList } from 'components/elements';
import {
  useEffect, useReducer, useRef, useState,
} from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { showCustomPrompt } from 'utilities/MessageModal';
import BottomAction from 'components/BottomAction';
import SnackModal from 'components/SnackModal';
import FavoriteBlockButtonStyle from 'components/FavoriteBlockButton/favoriteBlockButton.style';
import { FuncIcons, BlockSelectedIcon } from 'assets/images/icons';
import { FuncID } from 'utilities/FuncID';

import D00300Wrapper from './D003_Support/D00300.style';
import { AmountSetting } from './D003_Support/AmountSetting';

/**
 * 選擇單元功能頁面。
 * @param {{
 *   mode: Number, // 1.單選模式, 2.多選模式
 *   funcPool: [{ groupKey, groupName, items: [{funcCode, name, locked, params}]}],
 *   selections: [{ key, func}],
 *   onFinish: Function<T>,
 * }} param0 參數說明：
 * - mode : 1.單選模式, 2.多選模式
 * - funcPool[] : 所有可以提供用戶選擇加入最愛的單元功能
 * - selections[] : 目前所有選擇項目。
 * - onFinish : 當使用者完成選取後的Callback方法。
 */
const S00101_1 = ({
  mode, funcPool, selections, onFinish,
}) => {
  const MAX_FUNC_COUNT = 12; // 預設最多 12 個項目。
  const mainContentRef = useRef();
  const groupRef = useRef([]);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [currGroup, setCurrGroup] = useState(funcPool[0].groupKey);
  const [showOverflowTip, setShowOverflowTip] = useState();

  /** 取得在 FuncPool 中已選取的功能清單 */
  const getSelectedItems = () => funcPool.flatMap((group) => group.items).filter((item) => item?.isSelected);

  /** 計算在 FuncPool 中已選取的功能數量 */
  const getSelectedCount = () => getSelectedItems().length;

  /**
   * 建構式，初始化單元功能。
   */
  useEffect(() => {
    funcPool.forEach((group) => group.items.forEach((item) => {
      // 從目前選集中，找出指定功能代碼的項目；並在 FuncPool 中註記為已選取。
      const selectedItem = selections.find((btn) => btn.func?.funcCode === item.funcCode);
      item.isSelected = !!selectedItem;
    }));
    forceUpdate();

    return () => {
      funcPool.forEach((group) => group.items.forEach((item) => {
        delete item.isSelected;
      }));
    };
  }, []);

  /**
   * 控制顯示「最愛已選滿」1秒後自動消失。
   */
  useEffect(() => {
    let timer = null;
    if (showOverflowTip) timer = setTimeout(() => setShowOverflowTip(false), 1000);
    return () => clearTimeout(timer);
  }, [showOverflowTip]);

  /**
   * 點擊 功能群組Tab 時，將群組拉進可視範圍。
   * @param {*} value 選取的功能群組的 groupKey
   */
  const handleChangeTabs = (_, value) => {
    const groupKey = value;
    const scrollTarget = groupRef.current.find((el) => el.getAttribute('data-group') === groupKey);
    scrollTarget.scrollIntoView();

    // 若是在最下方，因為只能看到群組名稱，所以要再往上拉出來。
    const { scrollHeight, scrollTop, offsetHeight } = mainContentRef.current;
    if ((scrollHeight - (scrollTop + offsetHeight) <= 0)) {
      setCurrGroup(groupKey);
    }
  };

  /**
   * 處理在捲動清單時，自動切換上方的 功能群組Tab
   */
  const handleScrollContent = (event) => {
    const { scrollHeight, scrollTop, offsetHeight } = event.target;

    if ((scrollHeight - (scrollTop + offsetHeight) > 0)) {
      const foundSection = groupRef.current.find((el) => {
        const top = el.offsetTop - 1;
        const bottom = el.offsetTop + el.offsetHeight;
        return (scrollTop >= top && scrollTop < bottom);
      });

      const groupKey = foundSection?.getAttribute('data-group');
      if (groupKey && groupKey !== currGroup) setCurrGroup(groupKey);
    }
  };

  const {control, handleSubmit } = useForm({
    resolver: yupResolver(yup.object().shape({
      wdAmount: yup
        .number()
        .max(20000, '提款金額上限為$20,000')
        .min(1000, '請輸入提款金額')
        .required('請輸入提款金額'),
    })),
  });

  /**
   * 設定無卡提款預設金額（即:執行參數)
   * @param {*} model
   * @returns {Promise<Boolean>} 傳回值表示使用者是否按下確認鍵。
   */
  const setCarlessWDparams = async (model) => {
    const result = await showCustomPrompt({
      title: '設定無卡提款預設金額',
      message: (
        <D00300Wrapper>
          <AmountSetting
            control={control}
            name="wdAmount"
            placeholder="快速提領金額"
            labelName="您想提領多少錢呢？"
            defaultValue={model.params ?? 1000}
            inputProps={{ maxLength: 5, inputMode: 'numeric' }}
          />
        </D00300Wrapper>
      ),
      onOk: handleSubmit((values) => {
        model.params = values.wdAmount;
      }),
    });

    return !!result;
  };

  /**
   * 單元功能按鈕
   * @param {{model}} param0 功能按鈕的資料。
   */
  const FuncButton = ({model}) => {
    const {funcCode, name, isSelected} = model;

    const handleFuncClick = async () => {
      // 設定無卡提款預設金額（即:執行參數)
      if (funcCode === FuncID.D00300_無卡提款) {
        if (mode === 1 || (mode === 2 && !isSelected)) {
          const amountSet = await setCarlessWDparams(model); // 設定執行參數（即:金額)
          if (!amountSet) return;
        }
      }

      if (mode === 1) {
        onFinish(model); // 單選模式：立即傳回
      } else {
        model.isSelected = !isSelected;
        forceUpdate();

        if (getSelectedCount() > MAX_FUNC_COUNT) {
          model.isSelected = false;
          setShowOverflowTip(true);
        }
      }
    };

    const className = isSelected ? 'selected' : ''; // 會有反紫的效果
    // 當已選滿了，或是固定項目；或是在單選模式中，已選取的項目，也都不可以再選。
    const disabled = (getSelectedCount() > MAX_FUNC_COUNT || model.locked || (mode === 1 && isSelected));
    return (
      <FavoriteBlockButtonStyle className={className} disabled={disabled}
        onClick={handleFuncClick}
      >
        <label htmlFor={name}
          style={{
            width: '100%', height: '100%', cursor: 'pointer', userSelect: 'none',
          }}
        >
          {FuncIcons[funcCode.substring(0, 4)]()}
          <p>{name}</p>

          {/* 多選模式：顯示[已選取]的圖示 */}
          {(mode === 2) && (<BlockSelectedIcon className="selectedIcon" />)}
        </label>
      </FavoriteBlockButtonStyle>
    );
  };

  /**
   * 列出所有功能群組及其單元功能。
   */
  const renderBlockGroup = () => funcPool.map(({groupKey, groupName, items}, index) => (
    // 因為 section 沒有其他其屬性可以用來記groupKey，所以用自訂屬性 data-group 記下來提供來判斷
    <section key={groupKey} className="groupSession" data-group={groupKey} ref={(el) => { groupRef.current[index] = el; }}>
      <h3 className="title">{groupName}</h3>
      <div className="blockGroup">
        {items.map((btnModel) => (
          <FuncButton key={btnModel.funcCode} model={btnModel} />
        ))}
      </div>
    </section>
  ));

  return (
    <div className="selectorPage">
      {/* 功能群組 */}
      <FEIBTabContext value={currGroup}>
        <FEIBTabList $size="small" onChange={handleChangeTabs}>
          {funcPool.map((group) => (
            <FEIBTab key={group.groupKey} label={group.groupName} value={group.groupKey} />
          ))}
        </FEIBTabList>
      </FEIBTabContext>

      <div className="tipArea">
        <p>{`${(mode === 2) ? '您最多可以自選10項服務' : '請選取1項服務'}加入我的最愛!`}</p>
      </div>

      <form className="mainContent" ref={mainContentRef} onScroll={handleScrollContent}>
        {renderBlockGroup()}

        {/* 多選模式時，在頁面下方顯示完成編輯的按鈕；單選模式則是在功能按鈕按下時即完成選取，立即CB傳回 */}
        {(mode === 2) && (
          <BottomAction position={0}>
            <button type="button" disabled={getSelectedCount() > MAX_FUNC_COUNT}
              // 多選模式：傳回新的選集。
              onClick={() => onFinish(getSelectedItems())}
            >
              {`編輯完成 (${getSelectedCount()})`}
            </button>
          </BottomAction>
        )}
      </form>

      {(mode === 2 && getSelectedCount() >= MAX_FUNC_COUNT && showOverflowTip) && (
        <SnackModal text="最愛已選滿" />
      )}
    </div>
  );
};

export default S00101_1;
