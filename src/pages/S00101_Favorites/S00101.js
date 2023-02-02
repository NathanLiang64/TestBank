/* eslint-disable consistent-return */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-max-props-per-line */
import {
  useEffect, useReducer, useState, useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { RemoveRounded } from '@material-ui/icons';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import BottomDrawer from 'components/BottomDrawer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useNavigation } from 'hooks/useNavigation';

import { EditIcon, FuncIcons } from 'assets/images/icons';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import { getAllFunc, getMyFuncs, saveMyFuncs } from './api';
import { getFuncButtonBackground } from './utils';
import FavoriteDrawerWrapper from './S00101.style';
import S00101_1 from './S00101_1';

/**
 * 我的最愛
 */
const S00101 = () => {
  const dispatch = useDispatch();
  const { startFunc, closeFunc } = useNavigation();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const MAX_FUNC_COUNT = 12; // 預設最多 12 個項目。
  const [model] = useState({
    myFuncs: Array(MAX_FUNC_COUNT),
    selectedIndex: null, // 記錄在非拖曳模式中，所要執行的空按鈕，提供單選模式時使用。
    startTouch: NaN, // 記錄長按事件的開始時間
  });
  const [selectionMode, setSelectionMode] = useState(0); // 0.一般操作, 1.單選模式, 2.多選模式
  const [dragMode, setDragMode] = useState(false); // 長按畫面時，進入拖曳模式；輕點畫面後，結束拖曳模式
  const [funcPool, setFuncPool] = useState();

  /**
   * 建構式，初始化單元功能。
   */
  useEffect(() => {
    dispatch(setWaittingVisible(true));

    const {myFuncs} = model;
    for (let index = 0; index < myFuncs.length; index++) {
      myFuncs[index] = {
        key: uuid(),
        func: null,
      };
    }

    getMyFuncs().then((funcs) => {
      // 將之前保存的功能還原。
      funcs.forEach((func) => {
        myFuncs[func.position].func = func;
      });
      forceUpdate();
    }).finally(() => {
      dispatch(setWaittingVisible(false));
    });
  }, []);

  /**
   * 主畫面。
   * @ param {{items}} items 畫面上所有功能按鈕的資訊。
   */
  const MainView = ({items}) => {
    let isLeftSide;

    // 為了修正e.destination索引計算錯誤的Bug，用游標位罝偵測調整。
    const getLocation = (e) => {
      const viewWidth = e.target.parentElement.scrollWidth;
      isLeftSide = e.clientX < (viewWidth / 2);
    };

    const handleDrag = (e) => {
      if (!e.destination) return; // 有時會發生，無法預期！
      const startIdx = e.source.index;
      const targetIdx = e.destination.index - (e.destination.index % 2) + (isLeftSide ? 0 : 1); // NOTE Bug Fixed!
      const source = model.myFuncs[startIdx].func;
      const target = model.myFuncs[targetIdx].func;
      if (startIdx !== targetIdx && !target?.locked) {
        const dir = Math.sign(targetIdx - startIdx);
        for (let index = startIdx; index !== targetIdx; index += dir) {
          model.myFuncs[index].func = model.myFuncs[index + dir].func;
        }
        model.myFuncs[targetIdx].func = source;
      }
    };

    return (
      <div className="mainView">
        <button type="button" className="editButton" onClick={() => setSelectionMode(2)}>
          編輯
          <EditIcon />
        </button>
        <div onPointerMove={getLocation}>
          <DragDropContext onDragEnd={handleDrag}>
            {/* 配置可被拖入的區塊 */}
            <Droppable droppableId="dropContainer" isDropDisabled={!dragMode}>
              {(provided) => (
                <div
                  className="dropContainer"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                >
                  {/* 建立可被拖移的元件清單 */}
                  {items.map((func, index) => (
                    <FuncButton key={func.key} index={index} btnModel={func} />
                  ))}

                  {/* ??? 用途為何 ??? */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  };

  /**
   * 單元功能按鈕，以及拖曳、刪除...等動做的處理。
   * @param {{index: Number, btnModel}} param0
   */
  const FuncButton = ({index, btnModel}) => {
    const {func} = btnModel;
    const isFixed = (!dragMode || func === null || func.locked); // 空格及固定項 均不可移動！
    const isEmpty = (func === null);
    const isClickRemoveNow = useRef(0);// 用來判斷在點擊移除項目時, 不同時觸發"點擊空白處離開拖曳模式"  0.未點擊移除項目時, 1.點擊移除項目時

    const executeFunc = () => {
      if (!dragMode) {
        if (!isEmpty) startFunc(func.funcCode, func.params);
        else {
          model.selectedIndex = index; // 提供單選模式時使用。
          setSelectionMode(1); // TODO 結束後，回到原本畫面位置
        }
      }
    };

    const removeFunc = () => {
      isClickRemoveNow.current = 1;

      btnModel.func = null;
      forceUpdate();

      setTimeout(() => {
        isClickRemoveNow.current = 0;
      }, 1000);
    };

    const handleStartDrag = (e) => {
      model.startTouch = e.timeStamp;
    };

    const handleEndDrag = (e) => {
      const pressTime = e.timeStamp - model.startTouch;
      if ((e.changedTouches.length === 1) && !dragMode) { // 只接受單點觸擊
        if (pressTime >= 300 && e.cancelable) { // 長按超過 0.5秒，而且不是在拖曳畫面時，才能啟動拖曳模式
          e.preventDefault(); // 避免觸發 Click 事件
          setDragMode(true);
        }
      }
    };

    return (
      <Draggable key={btnModel.key} draggableId={btnModel.key} index={index}
        isDragDisabled={isFixed}
      >
        {(provided) => (
          <div
            className="dndItem"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            //
            onClick={() => {
              if (isClickRemoveNow.current === 1) {
                return;
              }

              if (!dragMode && isClickRemoveNow.current === 0) {
                return executeFunc(index);
              }
              setDragMode(false);
            }}
            // 監控長按事件，以開啟拖曳模式。
            onTouchStart={handleStartDrag}
            onTouchEnd={handleEndDrag}
          >
            {isEmpty ? (<img src={BlockEmpty} alt="block" />) : (
              <>
                {/* 只有在拖曳模式時，才需要顯示移除按鈕 */}
                {dragMode && !isFixed && (
                  <span className="removeButton" onClick={removeFunc}>
                    <RemoveRounded />
                  </span>
                )}
                <img src={getFuncButtonBackground(index)} alt="block" />
                {FuncIcons[func.funcCode.substring(0, 4)]()}
                {`${func.name} (${index})`}
                {func.params && (<br />)}
                {func.params && (`${func.params}`)}
              </>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  /**
   * 選擇單元功能
   * @param {Number} mode 單選模式。（0.一般操作, 1.單選模式, 2.多選模式）
   */
  const renderSelector = (mode) => {
    if (!funcPool) getAllFunc().then((funcs) => setFuncPool(funcs));

    const {myFuncs, selectedIndex} = model;
    const onFinish = (result) => {
      if (mode === 1) {
        // 將 S00101_1 傳回的選取項目加入目前選集中。
        myFuncs[selectedIndex].func = {
          ...result,
          position: selectedIndex,
        };
      } else if (mode === 2) {
        myFuncs.filter((item) => item.func).forEach((item) => {
          const {func} = item;
          const newItem = result.find((f) => f.funcCode === func.funcCode);
          if (newItem) { // 變更
            func.params = newItem.params;
          } else { // 移除
            item.func = null;
          }
        });

        myFuncs.filter((item) => !item.func).forEach((item) => {
          // 只要是否包含在目前選集中的項目，都屬於新增項目。
          const newItem = result.find((f) => !myFuncs.find((m) => m.func?.funcCode === f.funcCode));
          if (newItem) item.func = {...newItem};
        });
      }

      // 將 myFuncs 調整後的結果寫回DB
      const request = myFuncs.filter(({func}) => func).map(({func}, index) => ({
        position: index,
        funcCode: func.funcCode,
        params: func.params,
      }));
      saveMyFuncs(request);

      // 結束選取模式，並刷新畫面。
      setSelectionMode(0);
    };

    if (!funcPool) dispatch(setWaittingVisible(true));
    else {
      dispatch(setWaittingVisible(false));
      return (
        <S00101_1 mode={mode} funcPool={funcPool} selections={myFuncs} onFinish={onFinish} />
      );
    }
    return <div />;
  };

  return (
    <Layout>
      <BottomDrawer
        title="我的最愛"
        isOpen
        noScrollable
        onClose={selectionMode ? null : closeFunc}
        onBack={selectionMode ? () => setSelectionMode(0) : null}
        content={(
          <FavoriteDrawerWrapper>
            {selectionMode ? (
              renderSelector(selectionMode)
            ) : (
              <MainView items={model.myFuncs} />
            )}
          </FavoriteDrawerWrapper>
      )}
      />
    </Layout>
  );
};

export default S00101;
