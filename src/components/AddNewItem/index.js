import AddIcon from 'assets/images/icons/addItemIcon.svg';
import AddNewItemWrapper from './addNewItem.style';

/*
* ==================== AddNewItem 組件說明 ====================
* 新增各類設定選項
* ==================== AddNewItem 可傳參數 ====================
* 1. addLabel: 新增項目說明
* 2. onClick: 點擊事件呼叫函式
* */

const AddNewItem = ({ addLabel, onClick }) => (
  <AddNewItemWrapper onClick={onClick}>
    <img src={AddIcon} alt="" />
    <div className="addLabel">{ addLabel }</div>
  </AddNewItemWrapper>
);

export default AddNewItem;
