/* eslint-disable */
import { useEffect, useState, useMemo, createContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RemoveRounded } from '@material-ui/icons';

import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import { EditIcon } from 'assets/images/icons';
import BottomDrawer from 'components/BottomDrawer';
import Layout from 'components/Layout/Layout';
import { showCustomPrompt } from 'utilities/MessageModal';
import { FuncID } from 'utilities/FuncID';
import { useNavigation } from 'hooks/useNavigation';

import S00100_1 from './S00100_1';
import { blockBackgroundGenerator, iconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper, { DndItemContainer } from './S00100.style';
import {
  generateTrimmedList, reorder, move, combineLeftAndRight, EventContext
} from './utils';
import { deleteFavoriteItem, getFavoriteList, modifyFavoriteItem, getFavoriteSettingList } from './api';


// 用來觸發 EventCenter 中介層的方法
const triggerEvent = (values) => {
  
    const event = new CustomEvent('triggerEvent_S00100', {
      detail: values
    });

    document.dispatchEvent( event ) ;
};

// 用來初始化 EventCenter(做資料跟UI分離的中介層) 的方法, 可讓所有事件都透過triggerEvent 去存取 
const initEventCenter = (eventCenter) => {
  
  document.addEventListener('triggerEvent_S00100', (e) => {

    const {eventName, params} = e.detail;

    if(typeof eventCenter[eventName] == 'undefined'){

      console.log('event is not public at eventCenter');
      return;
    }

    if( params == 'undefined'){
      params = {};
    }

    eventCenter[eventName](params);
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
      right:[] 
    };

    // ======== EventCenter(將資料處理與UI更新做分離控制的中介層) code block start ========
    const eventCenter = (() => {

      const deepCopy = value => JSON.parse(JSON.stringify(value));

      const emptyBlock = (position) => {

        return {
          "actKey": "emptyBlock_"+ btoa(Math.random().toString()).substring(10,16),// 生成亂數KEY
          "alterMsg": null,
          "groupType": null,
          "icon": null,
          "isFavorite": null,
          "name": "",
          "position": `${position}`,
          "url": BlockEmpty
        }
      };

      // 長按編輯
      const handleEditBlock = () => triggerEvent({eventName:'renderDndFavoriteList'});
      const handleTouchStart = () => setPressTimer(setTimeout(handleEditBlock, 800));
      const handleTouchEnd = () => pressTimer && clearTimeout(pressTimer);


      // 處理拖曳後的結果, 呼叫API把結果存起來
      const saveResultAfterDnd = async (callback) => {

        if( !memoIsAnyItemMove ){// 判斷若沒有作任何更動, 就不呼叫API

          if( typeof callback === "function" ){

            callback();
          }
          
          return;
        }

        memoCheckedItemsBeforeDnd = [];
        memoIsAnyItemMove = false;


        const copyLeftSideItems = deepCopy(memoArray.left);
        const copyRightSideItems = deepCopy(memoArray.right);

        const toModify = sideDataToOrderList(copyLeftSideItems, copyRightSideItems);

        // 後面這一段是用來呼叫API, 刪除所有操作前已選取的項目, 再更新上新的結果
        await Promise.all(
          memoCheckedItemsBeforeDnd.map((actKey) => {

              return deleteFavoriteItem(actKey);
          }),
        );

        await Promise.all(toModify.map((item) => (
          modifyFavoriteItem({actKey: item.actKey || '', position: parseInt(item.position, 10)})
        )));

        memoFavoriteList = deepCopy(toModify);
        

        if( typeof callback === "function" ){

          callback();
        }
      };

      // 點擊空白處離開移除模式
      const handleCloseRemoveMode = async () => {

        if( memoIsClickRemove || document.querySelector(".dndArea") === null ){

          return;
        }

        const copyLeftSideItems = deepCopy(memoArray.left);
        const copyRightSideItems = deepCopy(memoArray.right);

        saveResultAfterDnd();


        const list = [];

        for (let i = 0; i < 10; i++) {

          let data = (i%2 == 0) ? copyLeftSideItems.shift() : copyRightSideItems.shift();

          data.position = i;

          list[i] = data;
        };
        
        setViewComponentMain(<MainComponent className={'favoriteArea'} renderData={[
            {
              "actKey": "B00200",
              "name": "推薦碼分享",
              "url": null,
              "icon": null,
              "groupType": null,
              "alterMsg": null,
              "isFavorite": null,
              "position": "-1"
            },
            {
              "actKey": "B00500",
              "name": "優惠",
              "url": null,
              "icon": null,
              "groupType": null,
              "alterMsg": null,
              "isFavorite": null,
              "position": "-1"
            }
          ].concat(list)} />);
      };

      // 處理拖曳事件
      const handleOnDragEnd = async (event) => {

        const beforeUpdateArraySideLeft = [];
        const beforeUpdateArraySideRight = [];

        memoArray.right.map((ele) => {

          beforeUpdateArraySideRight.push(ele.actKey);

          if( ele.actKey.indexOf('emptyBlock_') === -1 ){

            memoCheckedItemsBeforeDnd.push(ele.actKey);
          }
        });

        memoArray.left.map((ele) => {

          beforeUpdateArraySideLeft.push(ele.actKey);

          if( ele.actKey.indexOf('emptyBlock_') === -1 ){

            memoCheckedItemsBeforeDnd.push(ele.actKey);
          }
        });

        if( event.destination == null ){
          return;
        }

        // 判斷從哪邊拖到哪邊, 替換項目到對應的位置
        if( event.source.droppableId == 'left' ){

          beforeUpdateArraySideLeft.splice(event.source.index, 1);
        }else{

          beforeUpdateArraySideRight.splice(event.source.index, 1);
        }
        
        if( event.destination.droppableId == 'left' ){

          beforeUpdateArraySideLeft.splice(event.destination.index, 0, event.draggableId);
        }else{

          beforeUpdateArraySideRight.splice(event.destination.index, 0, event.draggableId);
        }


        // 取得先前選取的全部項目
        const eleTmp = {};

        const draggableList = memoFavoriteList.filter((el) => el.position !== '-1' && !!el.actKey);
        draggableList.forEach((el, index) => {
          eleTmp[el.actKey] = el;
        });

        const emptyBlock = (key) => {

          return {
            "actKey": key,
            "alterMsg": null,
            "groupType": null,
            "icon": null,
            "isFavorite": null,
            "name": "",
            "position": "",
            "url": BlockEmpty
          }
        };

        // 把先前選取的全部項目 分成左欄 &右欄
        const left = [];
        const right = [];
        beforeUpdateArraySideLeft.map((actKey, i) => {
         
            if( actKey.indexOf('emptyBlock_') !== -1 ){

              left[i] = emptyBlock(actKey);

            }else{

              left[i] = eleTmp[actKey];
            }
        });
        beforeUpdateArraySideRight.map((actKey, i) => {

            if( actKey.indexOf('emptyBlock_') !== -1 ){

              right[i] = emptyBlock(actKey);
              
            }else{

              right[i] = eleTmp[actKey];
            }
        });


        // 確認左欄右欄內項目的數量平衡, 只要有單邊超過5個, 就排到另一邊 
        if(right.length > 5){

          let a = right.pop();
          left.push(a);

        }
        if(left.length > 5){

          let a = left.pop();
          right.push(a);
        }


        // 將已分開的左右欄項目的 position 依序設定回去並記錄
        let j = 0;
        for (let i = 0; i < 10; i++) {

          if(i%2 == 0){

            left[j].position = i;

          }else{

            right[j].position = i;

            j++;
          }  
        };
        memoArray.left = deepCopy(left);
        memoArray.right = deepCopy(right);


        // 更新拖拉項目後的畫面
        setViewComponentMain(<MainComponent className={'dndArea'} renderData={[{id: 'left', items: left}, {id: 'right', items: right}]} />);


        memoIsAnyItemMove = true;
      };

      const sideDataToOrderList = (left, right) => {

        const orderList = deepCopy(memoFavoriteList);
        const copyLeftItems = deepCopy(left);
        const copyRightItems = deepCopy(right);

        orderList.splice(2);

        for (let i = 0; i < 10; i++) {

          let data = (i%2 == 0) ? copyLeftItems.shift() : copyRightItems.shift();

          if(data.actKey.indexOf('emptyBlock_') === -1){

            orderList.push(data);
          }
        };

        return orderList;
      };

      // 處理刪除事件
      const removeItem = (position, name, actKey) => {

        // 避免點擊刪除按鈕的時候, 也觸發到"點擊空白處離開移除模式"
        memoIsClickRemove = true;

        const left = deepCopy(memoArray.left);
        const right = deepCopy(memoArray.right);

        // 對應刪除的position, 用 emptyBlock 塞回去
        let j = 0;
        for (let i = 0; i < 10; i++) {

          if(i%2 == 0){

            if( i == position ) left[j] = emptyBlock(i);

          }else{

            if( i == position ) right[j] = emptyBlock(i);

            j++;
          }  
        };

        showCustomPrompt({
          message: `確定要從我的最愛刪除 ${name} 嗎?`,
          onOk: async () => {

            memoArray.left = deepCopy(left);
            memoArray.right = deepCopy(right);

            // 將更動後的結果存回list快取
            const orderList = sideDataToOrderList(left,right);
            memoFavoriteList = deepCopy(orderList.filter(item => item.actKey != actKey));


            await deleteFavoriteItem(actKey);

            setViewComponentMain(<MainComponent className={'dndArea'} renderData={[{id: 'left', items: left}, {id: 'right', items: right}]} />);
          },
          cancelContent: '取消',
        });

        // 避免點擊刪除按鈕的時候, 也觸發到"點擊空白處離開移除模式"
        (async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));// sleep 1 sec

          memoIsClickRemove = false;
        })(); 
      };

      // 我的最愛主元件, 用來切換普通模式 / 拖拉模式
      const MainComponent = ({className, renderData}) => {

        className = className || 'favoriteArea';
        renderData = renderData || [];

        let ele = null;

        if( className == 'dndArea' ){

          ele = <DndBlocksElements favoriteList={memoFavoriteList} dndList={renderData} />;

        }else{

          ele = <BlockElements favoriteList={renderData} />;
        }

        return (<div className="defaultPage">
          <button type="button" className="editButton" onClick={() => { triggerEvent({eventName:'editFavorite'}) }}>
            編輯
            <EditIcon />
          </button>
          <div className={className}>
            {ele}
          </div>
        </div>);
      };

      // 移除模式可拖曳的列表元件
      const DndBlocksElements = ({favoriteList, dndList}) => {

        const fixedList = favoriteList.filter((el) => el.position === '-1');

        return (
          <DragDropContext onDragEnd={ (event) => {triggerEvent({eventName:'handleOnDragEnd', params: event})} }>
            {fixedList.map((fixedItem, fixedIndex) => (
              <div
                className="dndItem"
                key={fixedItem.actKey}
              >
                <img src={blockBackgroundGenerator(fixedIndex)} alt="block" />
                {iconGenerator(fixedItem.actKey)}
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
                     key={item.actKey}
                     draggableId={item.actKey}
                     index={index}
                   >
                     {(provided) => (
                       <div
                         className="dndItem"
                         ref={provided.innerRef}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                       >
                        {item.actKey.indexOf('emptyBlock_') !== -1 ?   
                          (<img src={BlockEmpty} alt="block" />) :
                          (<>
                          <span
                           className="removeButton"
                           onClick={() => {removeItem(item.position, item.name, item.actKey)}}
                         >
                           <RemoveRounded />
                         </span>
                         <img src={blockBackgroundGenerator((2 * index) + (parentIndex + 2))} alt="block" />
                         {iconGenerator(item.actKey)}
                         {item.name}
                            </>)
                        }
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
      const BlockComponent = ({actKey, itemName, imgIndex, handleTouchStart, handleTouchEnd, handleClick}) => {

        let cardLessLabel = '';

        if( actKey == FuncID.D00300 ){// 用來顯示無卡存摺 的 設定金額
          cardLessLabel = (<span>
              <br/>
              {cardLessMoneyLabel}
            </span>);
        }

        return (<button
                  type="button"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={handleClick}
                >
              <>
                { imgIndex !== null ? <img src={blockBackgroundGenerator(imgIndex)} alt="block" /> : <img src={BlockEmpty} alt="empty" /> }
                { imgIndex !== null ? iconGenerator(actKey) : '' }
                { itemName !== null ? (<span>
                  {itemName}
                  {cardLessLabel}
                </span>) : '' }
              </>
              </button>);
      };


      // 組成我的最愛列表元件
      const BlockElements = ({favoriteList}) => {

        let list = [];

        const hasItemBlockArray = [];

        favoriteList.map((block) => {

            if(block.position !== '-1' && block.actKey.indexOf('emptyBlock_') === -1 ){

              hasItemBlockArray[block.position] = block;
            }
        });

        // 前兩個寫死的項目元件
        const fixedList = favoriteList.filter((el) => el.position === '-1');

        fixedList.map((fixedItem, fixedIndex) => {

          list.push(<BlockComponent 
            key={fixedItem.actKey}
            actKey={fixedItem.actKey} 
            itemName={fixedItem.name} 
            imgIndex={fixedIndex} 
            handleTouchStart={handleTouchStart} 
            handleTouchEnd={handleTouchEnd} 
            handleClick={() => startFunc(fixedItem.actKey === 'B00200' ? FuncID.M00100 : fixedItem.actKey)} />);
        });

        // 其他非寫死的項目元件
        for (let i = 0; i < 10; i++) {

          if( typeof hasItemBlockArray[i] !== 'undefined' ){// 已加入最愛的項目區塊

            let block = hasItemBlockArray[i];

            list.push(<BlockComponent 
              key={block.actKey}
              actKey={block.actKey} 
              itemName={block.name} 
              imgIndex={i+2} 
              handleTouchStart={handleTouchStart} 
              handleTouchEnd={handleTouchEnd} 
              handleClick={() => startFunc(block.actKey === 'B00200' ? FuncID.M00100 : block.actKey)} />);

          }else{// 未加入最愛的項目區塊

            list.push(<BlockComponent 
              key={i - 2}
              actKey={null} 
              itemName={null} 
              imgIndex={null} 
              handleTouchStart={null} 
              handleTouchEnd={null} 
              handleClick={() => triggerEvent({eventName:'addFavorite', params:{position:i}})} />);
          }
        };

        return list;
      };
      

      // 渲染我的最愛列表
      const renderFavoriteList = async () => {

        try {

          let data = [];

          // 判斷如有呼叫過API, 就把list cache起來, 節省成本
          if( hasLoadedFavoriteList === false ){

            const rows = await getFavoriteList();

            memoFavoriteList = deepCopy(rows);

            hasLoadedFavoriteList = true;
          }

          data = deepCopy(memoFavoriteList);

          setViewComponentMain(<MainComponent className={'favoriteArea'} renderData={data} />);

          // 設定點擊關閉的處理事件
          setViewCloseBtnFunction(() => {return () => {

            if( document.querySelector(".dndArea") !== null ){

              // 在已拖拉更動的情況下, 如果沒有回到普通模式就點擊右上方X離開, 也要將結果存起來
              saveResultAfterDnd(() => {

                closeFunc();
              });
            }else{

              closeFunc();
            }
            
          }});

        } catch (err) {
          console.log('getFavoriteList', err);
        }
      };

      // 渲染移除模式可拖曳的列表
      const renderDndFavoriteList = async () => {

        const left = [];
        const right = [];
        const draggableList = memoFavoriteList.filter((el) => el.position !== '-1' && !!el.actKey);
   
        draggableList.map((el, index) => {
          if(el.position % 2 == 0){

            left[Math.floor(el.position/2)] = el;
          }else{

            right[Math.floor(el.position/2)] = el;
          }
        });


        for (let i = 0; i < 5; i++) {
          if( typeof left[i] === 'undefined' ){

            left[i] = emptyBlock(i*2);
          }
        };

        for (let i = 0; i < 5; i++) {
          if( typeof right[i] === 'undefined' ){

            right[i] = emptyBlock(i*2+1);
          }
        };

        memoArray.left = deepCopy(left);
        memoArray.right = deepCopy(right);

        setViewComponentMain(<MainComponent className={'dndArea'} renderData={[{id: 'left', items: left}, {id: 'right', items: right}]} />);
      };

      // 渲染新增我的最愛畫面
      const addFavorite = async ({position}) => {

        try {

          // 判斷如有呼叫過API, 就把list cache起來, 節省成本
          if( hasLoadedFavoriteSettingList === false ){

            const res = await getFavoriteSettingList();
            if (!res) throw new Error('getFavoriteSettingList response is empty');

            memoFavoriteSettingList = deepCopy(res);

            hasLoadedFavoriteSettingList = true;
          }

          setViewComponentMain(
            <S00100_1
              addPoposition={position} 
              isEditAction={false}
              favoriteList={ deepCopy(memoFavoriteList) } 
              favoriteSettingList={ deepCopy(memoFavoriteSettingList) } />
          );

          // 設定點擊關閉的處理事件
          setViewCloseBtnFunction(() => {return () => {
              triggerEvent({eventName:'renderFavoriteList'});
          }});

        } catch (err) {
          console.log('getFavoriteList', err);
        }
      };

      // 渲染編輯我的最愛畫面
      const editFavorite = async () => {

        // 在拖曳模式下, 不進入編輯頁
        if( document.querySelector(".dndArea") !== null ){

          return;
        }

        try {

          // 判斷如有呼叫過API, 就把list cache起來, 節省成本
          if( hasLoadedFavoriteSettingList === false ){

            const res = await getFavoriteSettingList();
            if (!res) throw new Error('getFavoriteSettingList response is empty');

            memoFavoriteSettingList = deepCopy(res);

            hasLoadedFavoriteSettingList = true;
          }

          setViewComponentMain(
            <S00100_1
              isEditAction={true}
              favoriteList={ deepCopy(memoFavoriteList) } 
              favoriteSettingList={ deepCopy(memoFavoriteSettingList) } />
          );

          // 設定點擊關閉的處理事件
          setViewCloseBtnFunction(() => {return () => {
              triggerEvent({eventName:'renderFavoriteList'});
          }});

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
        renderFavoriteList : renderFavoriteList,
        renderDndFavoriteList : renderDndFavoriteList,
        handleOnDragEnd : handleOnDragEnd,
        handleCloseRemoveMode : handleCloseRemoveMode,
        addFavorite : addFavorite,
        editFavorite : editFavorite,
        updateMemoFavoriteList : updateMemoFavoriteList
      };
    })();
    
    // this page's core
    initEventCenter(eventCenter);

    // ======== EventCenter(將資料處理與UI更新做分離控制的中介層) code block end ========
  }, []);

  
  // 一進入此頁就先呼叫渲染我的最愛頁面
  useEffect(() => {

    triggerEvent({eventName:'renderFavoriteList'}) ;
  }, []);


  // 監聽模組內其他頁面的跨頁面事件呼叫
  useEffect(() => {
 
    const [type, params] = shareEvent;
   
    switch(type){

      case 'S00100_back2MyFavorite' : 

        triggerEvent({eventName:'renderFavoriteList'});
        break;

      case 'S00100_updateMemoFavoriteList' : 

        triggerEvent({eventName:'updateMemoFavoriteList', params: params});
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
            <FavoriteDrawerWrapper onClick={() => {triggerEvent({eventName:'handleCloseRemoveMode'})}}>
              {viewComponentMain}
            </FavoriteDrawerWrapper>
          </EventContext.Provider>
        )}
      />
    </Layout>
  );
};

export default Favorite;
