import store from '../stores/store';
import {
  setModal, setModalVisible,
  setDrawer, setDrawerVisible,
  setAnimationModal, setAnimationModalVisible,
} from '../stores/reducers/ModalReducer';

export const closePopup = () => {
  store.dispatch(setModalVisible(false));
};

export const closeDrawer = () => {
  store.dispatch(setDrawerVisible(false));
};

export const showPrompt = async (message, action) => {
  store.dispatch(setModal({
    title: '溫馨提醒',
    content: message,
    onOk: action ?? closePopup,
  }));
  store.dispatch(setModalVisible(true));
};

export const showError = async (message, action) => {
  store.dispatch(setModal({
    title: '重要訊息',
    content: message,
    onOk: action ?? closePopup,
  }));
  store.dispatch(setModalVisible(true));
};

export const showInfo = async (message, action) => {
  store.dispatch(setModal({
    title: 'Bankee 通知',
    content: message,
    onOk: action ?? closePopup,
  }));
  store.dispatch(setModalVisible(true));
};

export const showCustomPrompt = async ({
  title,
  message,
  onOk,
  onCancel,
  okContent,
  cancelContent,
  noDismiss, // 如果有需要接續 modal 得操作，可以設定為 true 避免點擊ok按鈕後，下個 modal 遭關閉。
}) => {
  store.dispatch(setModal({
    title,
    content: message,
    onOk: onOk ?? closePopup,
    onCancel,
    okContent,
    cancelContent,
    noDismiss: noDismiss ?? false,
  }));
  store.dispatch(setModalVisible(true));
};

export const customPopup = async (title, message, onOk, onCancel, okContent, cancelContent) => {
  store.dispatch(setModal({
    title,
    content: message,
    onOk: onOk ?? closePopup,
    onCancel,
    okContent,
    cancelContent,
  }));
  store.dispatch(setModalVisible(true));
};

/**
 * 在 Layout 下方彈出抽屜。
 * @param {*} title 上方的標題文字。
 * @param {*} content 要呈現的內容。
 * @param {*} onCloseBtnPressed 當右上角 X 按下時的處理方式。
 */
export const showDrawer = async (title, content, onCloseBtnPressed) => {
  store.dispatch(setDrawer({
    title,
    content,
    onClose: onCloseBtnPressed,
  }));
  store.dispatch(setDrawerVisible(true));
};

export const showAnimationModal = async (content) => {
  store.dispatch(setAnimationModal({
    ...content,
  }));
  store.dispatch(setAnimationModalVisible(true));
};
