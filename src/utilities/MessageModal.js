import store from '../stores/store';
import {
  setModal, setModalVisible,
  setDrawer, setDrawerVisible,
  setAnimationModal, setAnimationModalVisible,
} from '../stores/reducers/ModalReducer';

export const closePopup = () => {
  store.dispatch(setModalVisible(false));
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

export const showDrawer = async (title, content) => {
  store.dispatch(setDrawer({
    title,
    content,
  }));
  store.dispatch(setDrawerVisible(true));
};

export const showAnimationModal = async (content) => {
  store.dispatch(setAnimationModal({
    ...content,
  }));
  store.dispatch(setAnimationModalVisible(true));
};
