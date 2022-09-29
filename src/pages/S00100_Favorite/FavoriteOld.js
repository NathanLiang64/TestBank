/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { EditRounded, RemoveRounded } from '@material-ui/icons';
import BottomDrawer from 'components/BottomDrawer';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import uuid from 'react-uuid';
import Favorite1 from './favorite_1';
import Favorite2 from './favorite_2';
import { setFavoriteDrawer, setFavoriteList, setCustomFavoriteList } from './stores/actions';
import { blockBackgroundGenerator, iconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper from './favorite.style';
import { mockFavoriteList } from './mockData';

const grid = 8;
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const reorder = (list, startIndex, endIndex) => {
  const updatedItems = Array.from(list.items);
  const [removed] = updatedItems.splice(startIndex, 1);
  updatedItems.splice(endIndex, 0, removed);
  return {...list, items: updatedItems};
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source.items);
  const destClone = Array.from(destination.items);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  if (source.id === 'left') return [{...source, items: sourceClone}, {...destination, items: destClone}];
  return [{...destination, items: destClone}, {...source, items: sourceClone}];
};

const Favorite = () => {
  const favoriteDrawer = useSelector(({ favorite }) => favorite.favoriteDrawer);
  const favoriteList = useSelector(({ favorite }) => favorite.favoriteList);
  const customFavoriteList = useSelector(({ favorite }) => favorite.customFavoriteList);
  const [dndLists, setDndLists] = useState([]);
  const dispatch = useDispatch();

  const handleCloseDrawer = () => {
    dispatch(setFavoriteDrawer({ ...favoriteDrawer, open: false }));
  };

  const renderBlockElement = () => {
    if (!dndLists.length) return null;
    return dndLists.map((dndItem) => (
      <Droppable key={dndItem.id} droppableId={dndItem.id}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            style={getListStyle(droppableSnapshot.isDraggingOver)}
          >
            {dndItem.items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style,
                    )}
                  >
                    {item.label}
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    ));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const foundList = dndLists.find(({id}) => id === source.droppableId);
      const updatedList = reorder(
        foundList,
        source.index,
        destination.index,
      );
      const patchedList = dndLists.reduce((acc, cur) => {
        if (cur.id === updatedList.id) acc.push(updatedList);
        else acc.push(cur);
        return acc;
      }, []);
      setDndLists(patchedList);
    } else {
      const sourceList = dndLists.find(({id}) => id === source.droppableId);
      const destinationList = dndLists.find(({id}) => id === destination.droppableId);
      const moveResult = move(
        sourceList,
        destinationList,
        source,
        destination,
      );

      setDndLists(moveResult);
    }
  };
  // 預設的彈窗頁面 - 已設置的最愛項目
  const defaultContent = () => (
    <div className="defaultPage">
      <button type="button" className="editButton">
        編輯
        <EditRounded />
      </button>
      <div style={{display: 'flex', height: '80vh'}}>
        {customFavoriteList.length ? (
          <DragDropContext onDragEnd={onDragEnd}>

            { renderBlockElement() }
          </DragDropContext>

        ) : null}

      </div>
    </div>
  );

  useEffect(() => {
    const blocks = [];
    customFavoriteList.forEach((block) => {
      blocks[block.selectedOrder - 1] = block;
    });
    const left = [];
    const right = [];
    blocks.forEach((el, index) => {
      const content = el.id ? el : {id: uuid(), label: index + 100};
      if (!(index % 2)) {
        left.push(content);
      } else {
        right.push(content);
      }
    });

    setDndLists([{id: 'left', items: left}, {id: 'right', items: right}]);
  }, [customFavoriteList.length]);

  useEffect(() => {
    dispatch(setFavoriteList(mockFavoriteList.favoriteList));
  }, []);

  useEffect(() => {
    const customList = [];
    favoriteList?.forEach((group) => group.blocks.forEach((item) => item.selected && customList.push(item)));
    dispatch(setCustomFavoriteList(customList));
  }, [favoriteList?.length]);

  console.log(dndLists);

  return (
    <BottomDrawer
      noScrollable
      title={favoriteDrawer.title}
      isOpen
      onClose={handleCloseDrawer}
      onBack={favoriteDrawer.back}
      content={(
        <FavoriteDrawerWrapper>
          {defaultContent() }
        </FavoriteDrawerWrapper>
      )}
    />
  );
};

export default Favorite;
