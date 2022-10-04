/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from 'react';
import BottomDrawer from 'components/BottomDrawer';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import { EditIcon } from 'assets/images/icons';
import { showCustomPrompt } from 'utilities/MessageModal';
import Layout from 'components/Layout/Layout';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { closeFunc } from 'utilities/AppScriptProxy';
import { useHistory } from 'react-router';
import { RemoveRounded } from '@material-ui/icons';
import S00100_1 from './S00100_1';
import { blockBackgroundGenerator, iconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper from './S00100.style';
import {
  generateTrimmedList, reorder, move, combineLeftAndRight,
} from './utils';
import { deleteFavoriteItem, getFavoriteList, modifyFavoriteItem } from './api';

const Favorite = () => {
  const initialViewControl = {
    title: '我的最愛',
    content: 'home',
  };
  const [viewControl, setViewControl] = useState(initialViewControl);
  const [pressTimer, setPressTimer] = useState(0);
  const [favoriteList, setFavoriteList] = useState([]);
  const [dndList, setDndList] = useState([]);
  const history = useHistory();

  const isEditOrAddMode = useMemo(() => {
    if (viewControl.content === 'edit' || viewControl.content === 'add') return true;
    return false;
  }, [viewControl]);

  // 產生有序的列表
  const orderedList = useMemo(() => {
    if (!favoriteList.length) return [];
    const blocks = favoriteList.reduce((acc, block) => {
      const position = parseInt(block.position, 10);
      // position + 2 -> 前 2 個是固定的，從陣列第三筆開始排序
      if (position < 0) acc.push(block);
      if (position >= 0) acc[position + 2] = block;
      return acc;
    }, []);
    const trimmedList = generateTrimmedList(blocks, 12, BlockEmpty);
    return trimmedList;
  }, [favoriteList]);

  // 取得用戶我的最愛清單
  const updateFavoriteList = async () => {
    try {
      const res = await getFavoriteList();
      if (!res) throw new Error('updateFavortieList response is empty');
      setFavoriteList(res);
    } catch (err) {
      console.log(err);
    }
  };

  // 控制顯示畫面
  const handleOpenView = (viewName) => {
    let title = '新增我的最愛';
    if (viewName === 'edit') title = '編輯我的最愛';
    if (viewName === 'remove') title = '移除我的最愛';
    setViewControl({
      title,
      content: viewName,
    });
  };

  // 點擊移除按鈕
  const handleClickRemoveBlock = async ({actKey, name}) => {
    await showCustomPrompt({
      message: `確定要從我的最愛刪除 ${name} 嗎?`,
      onOk: async () => {
        await deleteFavoriteItem(actKey);
        updateFavoriteList();
      },
      cancelContent: '取消',
    });
  };

  // 處理拖曳事件
  const handleOnDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    let updatedDndList;
    if (source.droppableId === destination.droppableId) {
      const foundList = dndList.find(({id}) => id === source.droppableId);
      const reorderedList = reorder(
        foundList,
        source.index,
        destination.index,
      );
      updatedDndList = dndList.reduce((acc, cur) => {
        if (cur.id === reorderedList.id) acc.push(reorderedList);
        else acc.push(cur);
        return acc;
      }, []);
    } else {
      const sourceList = dndList.find(({id}) => id === source.droppableId);
      const destinationList = dndList.find(({id}) => id === destination.droppableId);
      updatedDndList = move(
        sourceList,
        destinationList,
        source,
        destination,
      );
    }

    const combinedList = combineLeftAndRight(updatedDndList[0].items, updatedDndList[1].items);
    const trimmedList = generateTrimmedList(combinedList, 10, '');
    setDndList(updatedDndList);
    await Promise.all(trimmedList.map((item, position) => (
      modifyFavoriteItem({actKey: item.actKey || '', position: parseInt(position, 10)})
    )));
    await updateFavoriteList();
  };

  // 點擊空白處離開移除模式
  const handleCloseRemoveMode = async (e) => {
    if (viewControl.content !== 'remove') return;
    if (e.target.className === 'dndItemContainer' || e.target.className === 'defaultPage') {
      setViewControl(initialViewControl);
    }
  };

  // 長按編輯
  const handleEditBlock = () => handleOpenView('remove');
  const handleTouchStart = () => setPressTimer(setTimeout(handleEditBlock, 800));
  const handleTouchEnd = () => pressTimer && clearTimeout(pressTimer);

  // 渲染我的最愛列表
  const renderBlocksElement = () => {
    if (!orderedList.length) return null;
    return orderedList.map((block, index) => (
      <button
        type="button"
        key={block.actKey || index - 2}
        onTouchStart={block.actKey ? handleTouchStart : null}
        onTouchEnd={block.actKey ? handleTouchEnd : null}
        onClick={block.actKey ? () => history.push(`/${block.actKey}`) : () => handleOpenView('add')}
      >
        {
        block.actKey
          ? (
            <>
              <img src={blockBackgroundGenerator(index)} alt="block" />
              {iconGenerator(block.actKey)}
              {block.name}
            </>
          )
          : <img src={block} alt="empty" />
        }
      </button>
    ));
  };

  // 渲染移除模式可拖曳的列表
  const renderDndBlocksElement = () => {
    if (!dndList.length || !favoriteList.length) return null;
    const fixedList = favoriteList.filter((el) => el.position === '-1');
    return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
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
           <div
             className="dndItemContainer"
             ref={droppableProvided.innerRef}
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
                     <span
                       className="removeButton"
                       onClick={() => handleClickRemoveBlock({actKey: item.actKey, name: item.name})}
                     >
                       <RemoveRounded />
                     </span>
                     <img src={blockBackgroundGenerator((2 * index) + (parentIndex + 2))} alt="block" />
                     {iconGenerator(item.actKey)}
                     {item.name}
                   </div>
                 )}
               </Draggable>
             ))}
             {droppableProvided.placeholder}
           </div>
         )}
       </Droppable>
     ))
        }
      </DragDropContext>
    );
  };

  const drawerController = () => {
    const {content} = viewControl;
    if (content === 'edit' || content === 'add') {
      return (
        <S00100_1
          updateFavoriteList={updateFavoriteList}
          back2MyFavorite={() => setViewControl(initialViewControl)}
          isEditAction={viewControl.content === 'edit'}
          favoriteList={favoriteList}
        />
      );
    }
    return (
      <div className="defaultPage">
        <button type="button" className="editButton" onClick={() => handleOpenView('edit')}>
          編輯
          <EditIcon />
        </button>
        <div className={content === 'remove' ? 'dndArea' : 'favoriteArea'}>
          {content === 'remove' ? renderDndBlocksElement() : renderBlocksElement()}
        </div>
      </div>
    );
  };

  useEffect(() => {
    updateFavoriteList();
  }, []);

  useEffect(() => {
    if (!orderedList.length) return;
    const left = [];
    const right = [];
    const draggableList = orderedList.filter((el) => el.position !== '-1' && !!el.actKey);
    draggableList.forEach((el, index) => {
      if (!(index % 2)) left.push(el);
      else right.push(el);
    });
    setDndList([{id: 'left', items: left}, {id: 'right', items: right}]);
  }, [favoriteList, orderedList]);

  return (
    <Layout>
      <BottomDrawer
        noScrollable
        title={viewControl.title}
        isOpen
        onClose={() => closeFunc()}
        onBack={isEditOrAddMode ? () => setViewControl(initialViewControl) : null}
        content={(
          <FavoriteDrawerWrapper onClick={handleCloseRemoveMode}>
            { drawerController() }
          </FavoriteDrawerWrapper>
        )}
      />
    </Layout>
  );
};

export default Favorite;
