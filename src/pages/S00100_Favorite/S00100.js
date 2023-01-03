/* eslint-disable */
import { useEffect, useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RemoveRounded } from '@material-ui/icons';

import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import { EditIcon } from 'assets/images/icons';
import BottomDrawer from 'components/BottomDrawer';
import Layout from 'components/Layout/Layout';
import { showCustomPrompt } from 'utilities/MessageModal';
import { closeFunc, startFunc } from 'utilities/AppScriptProxy';
import { FuncID } from 'utilities/FuncID';


import S00100_1 from './S00100_1';
import { blockBackgroundGenerator, iconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper, { DndItemContainer } from './S00100.style';
import {
  generateTrimmedList, reorder, move, combineLeftAndRight,
} from './utils';
import { deleteFavoriteItem, getFavoriteList, modifyFavoriteItem } from './api';

const triggerEvent = (values) => {
  
    const event = new CustomEvent('triggerEvent_S00100', {
      detail: values
    });

    document.dispatchEvent( event ) ;
};

const Favorite = () => {
  
  const [cardLessMoneyLabel, setCardLessMoneyLabel] = useState('');
  const [pressTimer, setPressTimer] = useState(0);

  const [viewComponentMain, setViewComponentMain] = useState('');
  const [viewCloseBtnFunction, setViewCloseBtnFunction] = useState(() => {});
  const [viewTitle, setViewTitle] = useState('我的最愛');


  // 長按編輯
  const handleEditBlock = () => triggerEvent({eventName:'renderDndFavoriteList'});
  const handleTouchStart = () => setPressTimer(setTimeout(handleEditBlock, 800));
  const handleTouchEnd = () => pressTimer && clearTimeout(pressTimer);



  useMemo(() => {

    let memoFavoriteList = [];

    const memoArray = {
      left: [], 
      right:[] 
    };

    const controller = (() => {

      const deepCopy = value => JSON.parse(JSON.stringify(value));

      const emptyBlock = (position) => {

        return {
          "actKey": "emptyBlock_"+ btoa(Math.random().toString()).substring(10,16),
          "alterMsg": null,
          "groupType": null,
          "icon": null,
          "isFavorite": null,
          "name": "",
          "position": `${position}`,
          "url": BlockEmpty
        }
      };

      const componentMain = (className = 'favoriteArea', renderData = []) => {

        let ele = null;

        if( className == 'dndArea' ){

          ele = DndBlocksElement(memoFavoriteList, renderData);

        }else{

          ele = blockElement(renderData);
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

      // 點擊空白處離開移除模式
      const handleCloseRemoveMode = async () => {

        if( document.querySelector(".dndArea") === null ){

          return;
        }

        const list = [];

        const copyLeftSideItems = deepCopy(memoArray.left);
        const copyRightSideItems = deepCopy(memoArray.right);

        for (let i = 0; i < 10; i++) {

          let data = (i%2 == 0) ? copyLeftSideItems.shift() : copyRightSideItems.shift();

          data.position = i;

          list[i] = data;
        };
        
        setViewComponentMain(componentMain('favoriteArea', [
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
          ].concat(list)));
      };

      // 處理拖曳事件
      const handleOnDragEnd = async (event) => {

        const beforeUpdateArraySideLeft = [];
        const beforeUpdateArraySideRight = [];
        const alreadyCheckedItemBeforeEdit = [];

        memoArray.right.map((ele) => {

          beforeUpdateArraySideRight.push(ele.actKey);

          if( ele.actKey.indexOf('emptyBlock_') === -1 ){

            alreadyCheckedItemBeforeEdit.push(ele.actKey);
          }
        });

        memoArray.left.map((ele) => {

          beforeUpdateArraySideLeft.push(ele.actKey);

          if( ele.actKey.indexOf('emptyBlock_') === -1 ){

            alreadyCheckedItemBeforeEdit.push(ele.actKey);
          }
        });

        if( event.destination == null ){
          return;
        }

        //  判斷從哪邊拖到哪邊
        if( event.source.droppableId == 'left' ){

          beforeUpdateArraySideLeft.splice(event.source.index, 1);
        }else{

          beforeUpdateArraySideRight.splice(event.source.index, 1);
        }

        if( event.destination.droppableId == 'left' ){

          //  item into arr at the specified index
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


        // 確認左邊右邊 只要有單邊超過5個 就排到另一邊 
        if(right.length > 5){

          let a = right.pop();
          left.push(a);

        }
        if(left.length > 5){

          let a = left.pop();
          right.push(a);
        }


        // set correct position
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

        setViewComponentMain(componentMain('dndArea', [{id: 'left', items: left}, {id: 'right', items: right}]));

        await Promise.all(
          alreadyCheckedItemBeforeEdit.map((actKey) => {

              return deleteFavoriteItem(actKey);
          }),
        );


        const copyLeftItems = deepCopy(left);
        const copyRightItems = deepCopy(right);


        const toModify = [];

        for (let i = 0; i < 10; i++) {

          let data = (i%2 == 0) ? copyLeftItems.shift() : copyRightItems.shift();

          toModify[i] = data;
        };


        await Promise.all(toModify.map((item, position) => (
          modifyFavoriteItem({actKey: item.actKey || '', position: parseInt(position, 10)})
        )));

      };

      // 渲染移除模式可拖曳的列表
      const DndBlocksElement = (favoriteList, dndList) => {

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
                           onClick={() => {
                  
                            const left = deepCopy(memoArray.left);
                            const right = deepCopy(memoArray.right);

                            // replace empty block at position
                            let j = 0;
                            for (let i = 0; i < 10; i++) {

                              if(i%2 == 0){

                                if( i == item.position ) left[j] = emptyBlock(i);

                              }else{

                                if( i == item.position ) right[j] = emptyBlock(i);

                                j++;
                              }  
                            };

                            showCustomPrompt({
                              message: `確定要從我的最愛刪除 ${item.name} 嗎?`,
                              onOk: async () => {

                                memoArray.left = deepCopy(left);
                                memoArray.right = deepCopy(right);

                                await deleteFavoriteItem(item.actKey);

                                setViewComponentMain(componentMain('dndArea', [{id: 'left', items: left}, {id: 'right', items: right}]));
                              },
                              cancelContent: '取消',
                            });
                            
                           }}
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

      // 渲染我的最愛列表
      const blockElement = (favoriteList) => {

        let cardLessLabel = '';
        let list = [];

        const hasItemBlockArray = [];

        favoriteList.map((block) => {

            if(block.position !== '-1' && block.actKey.indexOf('emptyBlock_') === -1 ){

              hasItemBlockArray[block.position] = block;
            }
        });

        const fixedList = favoriteList.filter((el) => el.position === '-1');

        fixedList.map((fixedItem, fixedIndex) => {

          list.push(
            <button
                type="button"
                key={fixedItem.actKey}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => startFunc(fixedItem.actKey === 'B00200' ? FuncID.M00100 : fixedItem.actKey)}
              >
            <>
              <img src={blockBackgroundGenerator(fixedIndex)} alt="block" />
              {iconGenerator(fixedItem.actKey)}
              <span>
                {fixedItem.name}
              </span>
            </>
            </button>);
        });

        for (let i = 0; i < 10; i++) {

          if( typeof hasItemBlockArray[i] !== 'undefined' ){

            let block = hasItemBlockArray[i];

            if( block.actKey == FuncID.D00300 ){// 用來顯示無卡存摺 的 設定金額
              cardLessLabel = (<span>
                  <br/>
                  {cardLessMoneyLabel}
                </span>);
            }

            list.push(
              <button
                  type="button"
                  key={block.actKey}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => startFunc(block.actKey === 'B00200' ? FuncID.M00100 : block.actKey)}
                >
              <>
                <img src={blockBackgroundGenerator(i+2)} alt="block" />
                {iconGenerator(block.actKey)}
                <span>
                  {block.name}
                  {cardLessLabel}
                </span>
              </>
              </button>);

          }else{

            list.push(
              <button
                  type="button"
                  key={i - 2}
                  onTouchStart={null}
                  onTouchEnd={null}
                  onClick={() => {

                    triggerEvent({eventName:'addFavorite', params:{position:i}}) ;
                  }}
                >
                <img src={BlockEmpty} alt="empty" />
              </button>
           );
          }
        };

        return list;
      };
 
      const renderFavoriteList = async () => {

        const rows = await getFavoriteList();

        memoFavoriteList = deepCopy(rows);

        setViewCloseBtnFunction(() => {return () => {
          closeFunc()
        }});

        setViewComponentMain(componentMain('favoriteArea', rows));
      };

      

      const renderDndFavoriteList = async () => {

        const rows = await getFavoriteList();

        memoFavoriteList = deepCopy(rows);

        const left = [];
        const right = [];
        const draggableList = rows.filter((el) => el.position !== '-1' && !!el.actKey);
   
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

        setViewComponentMain(componentMain('dndArea', [{id: 'left', items: left}, {id: 'right', items: right}]));
      };

      const addFavorite = async ({position}) => {

        try {

          const res = await getFavoriteList();
          if (!res) throw new Error('getFavoriteList response is empty');

          setViewComponentMain(
            <S00100_1
              addPoposition={position} 
              back2MyFavorite={() => { triggerEvent({eventName:'renderFavoriteList'}) }}
              isEditAction={false}
              favoriteList={res} />
          );

          setViewCloseBtnFunction(() => {return () => {
              triggerEvent({eventName:'renderFavoriteList'});
          }});

        } catch (err) {
          console.log('getFavoriteList', err);
        }
      };

      const editFavorite = async () => {

        try {

          const res = await getFavoriteList();
          if (!res) throw new Error('getFavoriteList response is empty');

          setViewComponentMain(
            <S00100_1
              back2MyFavorite={() => { triggerEvent({eventName:'renderFavoriteList'}) }}
              isEditAction={true}
              favoriteList={res} />
          );

          setViewCloseBtnFunction(() => {return () => {
              triggerEvent({eventName:'renderFavoriteList'});
          }});

        } catch (err) {
          console.log('getFavoriteList', err);
        }
      };


      return {
        renderFavoriteList : renderFavoriteList,
        renderDndFavoriteList : renderDndFavoriteList,
        handleOnDragEnd : handleOnDragEnd,
        handleCloseRemoveMode : handleCloseRemoveMode,
        addFavorite : addFavorite,
        editFavorite : editFavorite,
      };
    })();

    document.addEventListener('triggerEvent_S00100', (e) => {

      const {eventName, params} = e.detail;

      if(typeof controller[eventName] == 'undefined'){

        alert('no controller');
        return;
      }

      if( params == 'undefined'){
        params = {};
      }

      controller[eventName](params);
    }); 

  }, []);

  useEffect(() => {

    triggerEvent({eventName:'renderFavoriteList'}) ;
  }, []);

  return (
    <Layout>
      <BottomDrawer
        noScrollable
        title={viewTitle}
        isOpen
        onClose={viewCloseBtnFunction}
        onBack={null}
        content={(
          <FavoriteDrawerWrapper onClick={() => {triggerEvent({eventName:'handleCloseRemoveMode'})}}>
            {viewComponentMain}
          </FavoriteDrawerWrapper>
        )}
      />
    </Layout>
  );
};

export default Favorite;
