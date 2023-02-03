/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
// /* eslint-disable */
import {
  useEffect, useState, useMemo, createContext,
} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RemoveRounded } from '@material-ui/icons';

import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import { EditIcon } from 'assets/images/icons';
import BottomDrawer from 'components/BottomDrawer';
import Layout from 'components/Layout/Layout';
import { showCustomPrompt } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import { useNavigation } from 'hooks/useNavigation';

import S00100_1 from './S00100_1';
import { getFuncButtonBackground, iconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper, { DndItemContainer } from './S00100.style';
import {
  generateTrimmedList, reorder, move, combineLeftAndRight, EventContext,
} from './utils';
import {
  getAllFunc, getMyFuncs, saveMyFuncs, modifyFavoriteItem, deleteFavoriteItem,
} from './api';

// 用來觸發 EventCenter 中介層的方法
const triggerEvent = (values) => {
  const event = new CustomEvent('triggerEvent_S00100', {
    detail: values,
  });

  document.dispatchEvent(event);
};

// 用來初始化 EventCenter(做資料跟UI分離的中介層) 的方法, 可讓所有事件都透過triggerEvent 去存取
const initEventCenter = (eventCenter) => {
  // TODO Listener 何時移除？
  document.addEventListener('triggerEvent_S00100', (e) => {
    const {eventName, params} = e.detail;

    if (eventCenter[eventName] === undefined) {
      console.log('event is not public at eventCenter');
      return;
    }

    // if (params === undefined) { // BUG 'undefined' 永遠不會成立！
    //   params = {};
    // }

    eventCenter[eventName](params ?? {});
  });
};

const Favorite = () => {
  const { startFunc, closeFunc } = useNavigation();

  const [cardLessMoneyLabel, setCardLessMoneyLabel] = useState('');
  const [pressTimer, setPressTimer] = useState(0);

  const [viewComponentMain, setViewComponentMain] = useState('');
  const [viewCloseBtnFunction, setViewCloseBtnFunction] = useState(() => {});
  const [viewTitle, setViewTitle] = useState('我的最愛');

  // 這個HOOK是專門設計來讓模組內所有子元件共享事件, 用來取代callback function當props傳來傳去的做法
  // shareEvent: 用來監聽觸發
  // callShareEvent: 用來觸發
  const [shareEvent, callShareEvent] = useState([]);

  // 內部所有變數不會因page的任何re-render出現無法預期的重置及更新
  useMemo(() => {
    let memoIsClickRemove = false;
    let memoIsAnyItemMove = false;
    let memoCheckedItemsBeforeDnd = [];

    // list cache
    let hasLoadedFavoriteList = false;
    let hasLoadedFavoriteSettingList = false;
    let memoFavoriteList = [];
    let memoFavoriteSettingList = [];

    const memoArray = {
      left: [],
      right: [],
    };

    // ======== EventCenter(將資料處理與UI更新做分離控制的中介層) code block start ========
    const eventCenter = (() => {
      const deepCopy = (value) => JSON.parse(JSON.stringify(value));

      const emptyBlock = (position) => ({
        funcCode: `emptyBlock_${btoa(Math.random().toString()).substring(10, 16)}`, // 生成亂數KEY
        alterMsg: null,
        icon: null,
        isFavorite: null,
        name: '',
        position: `${position}`,
        url: BlockEmpty,
      });

      // 長按編輯
      const handleEditBlock = () => triggerEvent({eventName: 'renderDndFavoriteList'});
      const handleTouchStart = () => setPressTimer(setTimeout(handleEditBlock, 800));
      const handleTouchEnd = () => pressTimer && clearTimeout(pressTimer);

      // 處理拖曳後的結果, 呼叫API把結果存起來
      const saveResultAfterDnd = async (callback) => {
        if (!memoIsAnyItemMove) { // 判斷若沒有作任何更動, 就不呼叫API
          if (callback.constructor === Function) {
            callback();
          }

          return;
        }

        memoCheckedItemsBeforeDnd = [];
        memoIsAnyItemMove = false;

        const copyLeftSideItems = deepCopy(memoArray.left);
        const copyRightSideItems = deepCopy(memoArray.right);

        const toModify = sideDataToOrderList(copyLeftSideItems, copyRightSideItems);

        // // 後面這一段是用來呼叫API, 刪除所有操作前已選取的項目, 再更新上新的結果
        // await Promise.all(
        //   memoCheckedItemsBeforeDnd.map((funcCode) => deleteFavoriteItem(funcCode)),
        // );

        // await Promise.all(toModify.map((item) => (
        //   // modifyFavoriteItem({funcCode: item.funcCode || '', position: item.position})
        //   modifyFavoriteItem(item)
        // )));

        memoFavoriteList = deepCopy(toModify);

        // NOTE 前面做過了！
        // if (callback.constructor === Function) {
        //   callback();
        // }
      };

      // 點擊空白處離開移除模式
      const handleCloseRemoveMode = async () => {
        if (memoIsClickRemove || document.querySelector('.dndArea') === null) {
          return;
        }

        const copyLeftSideItems = deepCopy(memoArray.left);
        const copyRightSideItems = deepCopy(memoArray.right);

        saveResultAfterDnd();

        const list = [];

        for (let i = 0; i < 10; i++) {
          const data = (i % 2 === 0) ? copyLeftSideItems.shift() : copyRightSideItems.shift();

          data.position = i;

          list[i] = data;
        }

        setViewComponentMain(<MainComponent
          className="favoriteArea"
          renderData={[
            {
              funcCode: Func.B00200.id,
              name: '推薦碼分享',
              url: null,
              icon: null,
              alterMsg: null,
              isFavorite: null,
              position: '-1',
            },
            {
              funcCode: Func.B00500.id,
              name: '優惠',
              url: null,
              icon: null,
              alterMsg: null,
              isFavorite: null,
              position: '-1',
            },
          ].concat(list)}
        />);
      };

      // 處理拖曳事件
      const handleOnDragEnd = async (event) => {
        const beforeUpdateArraySideLeft = [];
        const beforeUpdateArraySideRight = [];

        memoArray.right.forEach((ele) => {
          beforeUpdateArraySideRight.push(ele.funcCode);

          if (ele.funcCode.indexOf('emptyBlock_') === -1) {
            memoCheckedItemsBeforeDnd.push(ele.funcCode);
          }
        });

        memoArray.left.forEach((ele) => {
          beforeUpdateArraySideLeft.push(ele.funcCode);

          if (ele.funcCode.indexOf('emptyBlock_') === -1) {
            memoCheckedItemsBeforeDnd.push(ele.funcCode);
          }
        });

        if (event.destination == null) {
          return;
        }

        // 判斷從哪邊拖到哪邊, 替換項目到對應的位置
        if (event.source.droppableId === 'left') {
          beforeUpdateArraySideLeft.splice(event.source.index, 1);
        } else {
          beforeUpdateArraySideRight.splice(event.source.index, 1);
        }

        if (event.destination.droppableId === 'left') {
          beforeUpdateArraySideLeft.splice(event.destination.index, 0, event.draggableId);
        } else {
          beforeUpdateArraySideRight.splice(event.destination.index, 0, event.draggableId);
        }

        // 取得先前選取的全部項目
        const eleTmp = {};

        const draggableList = memoFavoriteList.filter((el) => el.position !== '-1' && !!el.funcCode);
        draggableList.forEach((el, index) => {
          eleTmp[el.funcCode] = el;
        });

        const emptyBlock2 = (key) => ({
          funcCode: key,
          alterMsg: null,
          icon: null,
          isFavorite: null,
          name: '',
          position: '',
          url: BlockEmpty,
        });

        // 把先前選取的全部項目 分成左欄 &右欄
        const left = [];
        const right = [];
        beforeUpdateArraySideLeft.forEach((funcCode, i) => {
          if (funcCode.indexOf('emptyBlock_') !== -1) {
            left[i] = emptyBlock2(funcCode);
          } else {
            left[i] = eleTmp[funcCode];
          }
        });
        beforeUpdateArraySideRight.forEach((funcCode, i) => {
          if (funcCode.indexOf('emptyBlock_') !== -1) {
            right[i] = emptyBlock2(funcCode);
          } else {
            right[i] = eleTmp[funcCode];
          }
        });

        // 確認左欄右欄內項目的數量平衡, 只要有單邊超過5個, 就排到另一邊
        if (right.length > 5) {
          const a = right.pop();
          left.push(a);
        }
        if (left.length > 5) {
          const a = left.pop();
          right.push(a);
        }

        // 將已分開的左右欄項目的 position 依序設定回去並記錄
        let j = 0;
        for (let i = 0; i < 10; i++) {
          if (i % 2 === 0) {
            left[j].position = i;
          } else {
            right[j].position = i;

            j++;
          }
        }
        memoArray.left = deepCopy(left);
        memoArray.right = deepCopy(right);

        // 更新拖拉項目後的畫面
        setViewComponentMain(<MainComponent className="dndArea" renderData={[{id: 'left', items: left}, {id: 'right', items: right}]} />);

        memoIsAnyItemMove = true;
      };

      const sideDataToOrderList = (left, right) => {
        const orderList = deepCopy(memoFavoriteList);
        const copyLeftItems = deepCopy(left);
        const copyRightItems = deepCopy(right);

        orderList.splice(2);

        for (let i = 0; i < 10; i++) {
          const data = (i % 2 === 0) ? copyLeftItems.shift() : copyRightItems.shift();

          if (data.funcCode.indexOf('emptyBlock_') === -1) {
            orderList.push(data);
          }
        }

        return orderList;
      };

      // 處理刪除事件
      const removeItem = (position, name, funcCode) => {
        // 避免點擊刪除按鈕的時候, 也觸發到"點擊空白處離開移除模式"
        memoIsClickRemove = true;

        const left = deepCopy(memoArray.left);
        const right = deepCopy(memoArray.right);

        // 對應刪除的position, 用 emptyBlock 塞回去
        let j = 0;
        for (let i = 0; i < 10; i++) {
          if (i % 2 === 0) {
            if (i === position) left[j] = emptyBlock(i);
          } else {
            if (i === position) right[j] = emptyBlock(i);

            j++;
          }
        }

        showCustomPrompt({
          message: `確定要從我的最愛刪除 ${name} 嗎?`,
          onOk: async () => {
            memoArray.left = deepCopy(left);
            memoArray.right = deepCopy(right);

            // 將更動後的結果存回list快取
            const orderList = sideDataToOrderList(left, right);
            memoFavoriteList = deepCopy(orderList.filter((item) => item.funcCode !== funcCode));

            await deleteFavoriteItem(funcCode);

            setViewComponentMain(<MainComponent className="dndArea" renderData={[{id: 'left', items: left}, {id: 'right', items: right}]} />);
          },
          cancelContent: '取消',
        });

        // 避免點擊刪除按鈕的時候, 也觸發到"點擊空白處離開移除模式"
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));// sleep 1 sec

          memoIsClickRemove = false;
        })();
      };

      // 我的最愛主元件, 用來切換普通模式 / 拖拉模式
      const MainComponent = ({className, renderData}) => {
        className = className || 'favoriteArea';
        renderData = renderData || [];

        let ele = null;

        // NOTE 不需要用這種做法，控制 Draggable.isDragDisabled 即可。
        if (className === 'dndArea') { // NOTE className 是 UI元件 使用的，不應一個變數做二種用途；這也是一種耦合。
          ele = <DndBlocksElements favoriteList={memoFavoriteList} dndList={renderData} />;
        } else {
          ele = <BlockElements favoriteList={renderData} />;
        }

        return (
          <div className="defaultPage">
            <button type="button" className="editButton" onClick={() => { triggerEvent({eventName: 'editFavorite'}); }}>
              編輯
              <EditIcon />
            </button>
            <div className={className}>
              {ele}
            </div>
          </div>
        );
      };

      // 移除模式可拖曳的列表元件
      const DndBlocksElements = ({favoriteList, dndList}) => {
        const fixedList = favoriteList.filter((el) => el.locked); // el.position === '-1');

        return (
          <DragDropContext onDragEnd={(event) => { triggerEvent({eventName: 'handleOnDragEnd', params: event}); }}>
            {fixedList.map((fixedItem, fixedIndex) => (
              <div
                className="dndItem"
                key={fixedItem.funcCode}
              >
                <img src={getFuncButtonBackground(fixedIndex)} alt="block" />
                {iconGenerator(fixedItem.funcCode)}
                {fixedItem.name}
              </div>
            ))}
            {
         dndList.map((dndItem, parentIndex) => (
           <Droppable key={dndItem.id} droppableId={dndItem.id}>
             {(droppableProvided) => (
               <DndItemContainer
                 className="dndItemContainer"
                 data-containerside={dndItem.id}
                 ref={droppableProvided.innerRef}
                 containerLength={dndItem.items.length}
               >
                 {dndItem.items.map((item, index) => (
                   <Draggable
                     key={item.funcCode}
                     draggableId={item.funcCode}
                     index={index}
                     // BUG 空格及固定項 均不可移動！
                     isDragDisabled={item.locked || item.funcCode.startsWith('emptyBlock_')} // TODO 要改用 position=null 判斷
                   >
                     {(provided) => (
                       <div
                         className="dndItem"
                         ref={provided.innerRef}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                       >
                         {item.funcCode.indexOf('emptyBlock_') !== -1
                           ? (<img src={BlockEmpty} alt="block" />)
                           : (
                             <>
                               <span
                                 className="removeButton"
                                //  hidden={item.locked}
                                 onClick={() => { removeItem(item.position, item.name, item.funcCode); }}
                               >
                                 <RemoveRounded />
                               </span>
                               <img src={getFuncButtonBackground((2 * index) + (parentIndex + 2))} alt="block" />
                               {iconGenerator(item.funcCode)}
                               {item.name}
                             </>
                           )}
                       </div>
                     )}
                   </Draggable>
                 ))}
                 {droppableProvided.placeholder}
               </DndItemContainer>
             )}
           </Droppable>
         ))
            }
          </DragDropContext>
        );
      };

      // 我的最愛列表內的單一項目元件
      const BlockComponent = ({
        funcCode, itemName, imgIndex, onTouchStart, onTouchEnd, handleClick,
      }) => {
        let cardLessLabel = '';

        if (funcCode === Func.D00300_無卡提款.id) { // 用來顯示無卡存摺 的 設定金額
          cardLessLabel = (
            <span>
              <br />
              {cardLessMoneyLabel}
            </span>
          );
        }

        return (
          <button
            type="button"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={handleClick}
          >
            <>
              { imgIndex !== null ? <img src={getFuncButtonBackground(imgIndex)} alt="block" /> : <img src={BlockEmpty} alt="empty" /> }
              { imgIndex !== null ? iconGenerator(funcCode) : '' }
              { itemName !== null ? (
                <span>
                  {itemName}
                  {cardLessLabel}
                </span>
              ) : '' }
            </>
          </button>
        );
      };

      // 組成我的最愛列表元件
      const BlockElements = ({favoriteList}) => {
        const list = [];

        const hasItemBlockArray = [];

        favoriteList.forEach((block) => {
          if (block.position !== '-1' && block.funcCode.indexOf('emptyBlock_') === -1) {
            hasItemBlockArray[block.position] = block;
          }
        });

        // 前兩個寫死的項目元件
        const fixedList = favoriteList.filter((el) => el.position === '-1');

        fixedList.forEach((fixedItem, fixedIndex) => {
          list.push(<BlockComponent
            key={fixedItem.funcCode}
            funcCode={fixedItem.funcCode}
            itemName={fixedItem.name}
            imgIndex={fixedIndex}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            handleClick={() => startFunc(fixedItem.funcCode === 'B002' ? Func.M00100.id : fixedItem.funcCode)}
          />);
        });

        // 其他非寫死的項目元件
        for (let i = 0; i < 10; i++) {
          if (typeof hasItemBlockArray[i] !== 'undefined') { // 已加入最愛的項目區塊
            const block = hasItemBlockArray[i];

            list.push(<BlockComponent
              key={block.funcCode}
              funcCode={block.funcCode}
              itemName={block.name}
              imgIndex={i + 2}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              handleClick={() => startFunc(block.funcCode === 'B002' ? Func.M00100.id : block.funcCode)}
            />);
          } else { // 未加入最愛的項目區塊
            list.push(<BlockComponent
              key={i - 2}
              funcCode={null}
              itemName={null}
              imgIndex={null}
              onTouchStart={null}
              onTouchEnd={null}
              handleClick={() => triggerEvent({eventName: 'addFavorite', params: {position: i}})}
            />);
          }
        }

        return list;
      };

      // 渲染我的最愛列表
      const renderFavoriteList = async () => {
        try {
          let data = [];

          // 判斷如有呼叫過API, 就把list cache起來, 節省成本
          if (hasLoadedFavoriteList === false) {
            const rows = await getMyFuncs();

            memoFavoriteList = deepCopy(rows);

            hasLoadedFavoriteList = true;
          }

          data = deepCopy(memoFavoriteList);

          setViewComponentMain(<MainComponent className="favoriteArea" renderData={data} />);

          // 設定點擊關閉的處理事件
          setViewCloseBtnFunction(() => () => {
            if (document.querySelector('.dndArea') !== null) {
              // 在已拖拉更動的情況下, 如果沒有回到普通模式就點擊右上方X離開, 也要將結果存起來
              saveResultAfterDnd(() => {
                closeFunc();
              });
            } else {
              closeFunc();
            }
          });
        } catch (err) {
          console.log('getFavoriteList', err);
        }
      };

      // 渲染移除模式可拖曳的列表
      const renderDndFavoriteList = async () => {
        const left = [];
        const right = [];
        const draggableList = memoFavoriteList.filter((el) => el.position !== '-1' && !!el.funcCode);

        draggableList.forEach((el, index) => {
          if (el.position % 2 === 0) {
            left[Math.floor(el.position / 2)] = el;
          } else {
            right[Math.floor(el.position / 2)] = el;
          }
        });

        for (let i = 0; i < 5; i++) {
          if (typeof left[i] === 'undefined') {
            left[i] = emptyBlock(i * 2);
          }
        }

        for (let i = 0; i < 5; i++) {
          if (typeof right[i] === 'undefined') {
            right[i] = emptyBlock(i * 2 + 1);
          }
        }

        memoArray.left = deepCopy(left);
        memoArray.right = deepCopy(right);

        setViewComponentMain(<MainComponent className="dndArea" renderData={[{id: 'left', items: left}, {id: 'right', items: right}]} />);
      };

      // 渲染新增我的最愛畫面
      const addFavorite = async ({position}) => {
        try {
          // 判斷如有呼叫過API, 就把list cache起來, 節省成本
          if (hasLoadedFavoriteSettingList === false) {
            const res = await getAllFunc();
            if (!res) throw new Error('getFavoriteSettingList response is empty');

            memoFavoriteSettingList = deepCopy(res);

            hasLoadedFavoriteSettingList = true;
          }

          setViewComponentMain(
            <S00100_1
              addPoposition={position}
              isEditAction={false}
              favoriteList={deepCopy(memoFavoriteList)}
              favoriteSettingList={deepCopy(memoFavoriteSettingList)}
            />,
          );

          // 設定點擊關閉的處理事件
          setViewCloseBtnFunction(() => () => {
            triggerEvent({eventName: 'renderFavoriteList'});
          });
        } catch (err) {
          console.log('getFavoriteList', err);
        }
      };

      // 渲染編輯我的最愛畫面
      const editFavorite = async () => {
        // 在拖曳模式下, 不進入編輯頁
        if (document.querySelector('.dndArea') !== null) {
          return;
        }

        try {
          // 判斷如有呼叫過API, 就把list cache起來, 節省成本
          if (hasLoadedFavoriteSettingList === false) {
            const res = await getAllFunc();
            if (!res) throw new Error('getFavoriteSettingList response is empty');

            memoFavoriteSettingList = deepCopy(res);

            hasLoadedFavoriteSettingList = true;
          }

          setViewComponentMain(
            <S00100_1
              isEditAction
              favoriteList={deepCopy(memoFavoriteList)}
              favoriteSettingList={deepCopy(memoFavoriteSettingList)}
            />,
          );

          // 設定點擊關閉的處理事件
          setViewCloseBtnFunction(() => () => {
            triggerEvent({eventName: 'renderFavoriteList'});
          });
        } catch (err) {
          console.log('getFavoriteList', err);
        }
      };

      // 更新cache memoFavoriteList
      const updateMemoFavoriteList = (updatedData) => {
        memoFavoriteList = deepCopy(updatedData);
      };

      // 開放讓 triggerEvent 存取的中介層方法
      return {
        renderFavoriteList,
        renderDndFavoriteList,
        handleOnDragEnd,
        handleCloseRemoveMode,
        addFavorite,
        editFavorite,
        updateMemoFavoriteList,
      };
    })();

    // this page's core
    initEventCenter(eventCenter);

    // ======== EventCenter(將資料處理與UI更新做分離控制的中介層) code block end ========
  }, []);

  // 一進入此頁就先呼叫渲染我的最愛頁面
  useEffect(() => {
    triggerEvent({eventName: 'renderFavoriteList'});

    // NOTE EventListener一定要清除！
    // TODO 移除 EventListener
    // return () => {
    //   document.removeEventListener('triggerEvent_S00100', ...);
    // };
  }, []);

  // 監聽模組內其他頁面的跨頁面事件呼叫
  useEffect(() => {
    const [type, params] = shareEvent;

    // eslint-disable-next-line default-case
    switch (type) { // NOTE type 是HardCode，只要有大小寫的錯誤，不易
      case 'S00100_back2MyFavorite':

        triggerEvent({eventName: 'renderFavoriteList'});
        break;

      case 'S00100_updateMemoFavoriteList': // NOTE 從 S00100_1 發出！造成不同頁面的流程耦合，不是好做法

        triggerEvent({eventName: 'updateMemoFavoriteList', params});
        break;
    }
  }, [shareEvent]);

  return (
    <Layout>
      <BottomDrawer
        noScrollable
        title={viewTitle}
        isOpen
        onClose={viewCloseBtnFunction}
        onBack={null}
        content={(
          <EventContext.Provider value={{shareEvent, callShareEvent}}>
            <FavoriteDrawerWrapper onClick={() => { triggerEvent({eventName: 'handleCloseRemoveMode'}); }}>
              {viewComponentMain}
            </FavoriteDrawerWrapper>
          </EventContext.Provider>
        )}
      />
    </Layout>
  );
};

export default Favorite;
