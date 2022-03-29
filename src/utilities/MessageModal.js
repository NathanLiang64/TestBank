import store from '../stores/index';
import { setModal, setModalVisible } from '../stores/reducers/ModalReducer';

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
