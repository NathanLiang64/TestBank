import store from '../stores/store';
import {
  setResult,
  setModal, setModalVisible,
  setDrawer, setDrawerVisible,
  setAnimationModal, setAnimationModalVisible,
} from '../stores/reducers/ModalReducer';

const closePopup = () => {
  store.dispatch(setModalVisible(false));
};

export const closeDrawer = () => {
  store.dispatch(setDrawerVisible(false));
};

export const showPrompt = async (message, action) => {
  const promise = new Promise((resolve) => {
    store.dispatch(setModal({
      title: '溫馨提醒',
      content: message,
      onOk: action ?? closePopup,
    }));
    store.dispatch(setResult((value) => resolve(value)));
    store.dispatch(setModalVisible(true));
  });

  // result 是由 AppJavaScriptCallback 接收，並嘗試用 JSON Parse 轉為物件，轉不成功則以原資料內容傳回。
  const result = await promise;
  return result;
};

export const showError = async (message, action) => {
  const promise = new Promise((resolve) => {
    store.dispatch(setModal({
      title: '重要訊息',
      content: message,
      onOk: action ?? closePopup,
    }));
    store.dispatch(setResult((value) => resolve(value)));
    store.dispatch(setModalVisible(true));
  });

  // result 是由 AppJavaScriptCallback 接收，並嘗試用 JSON Parse 轉為物件，轉不成功則以原資料內容傳回。
  const result = await promise;
  return result;
};

export const showInfo = async (message, action) => {
  const promise = new Promise((resolve) => {
    store.dispatch(setModal({
      title: 'Bankee 通知',
      content: message,
      onOk: action ?? closePopup,
    }));
    store.dispatch(setResult((value) => resolve(value)));
    store.dispatch(setModalVisible(true));
  });

  // result 是由 AppJavaScriptCallback 接收，並嘗試用 JSON Parse 轉為物件，轉不成功則以原資料內容傳回。
  const result = await promise;
  return result;
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
  const promise = new Promise((resolve) => {
    store.dispatch(setModal({
      title,
      content: message,
      onOk: onOk ?? closePopup,
      onCancel,
      okContent,
      cancelContent,
      noDismiss: noDismiss ?? false,
    }));
    store.dispatch(setResult((value) => resolve(value)));
    store.dispatch(setModalVisible(true));
  });

  // result 是由 AppJavaScriptCallback 接收，並嘗試用 JSON Parse 轉為物件，轉不成功則以原資料內容傳回。
  const result = await promise;
  return result;
};

export const customPopup = async (title, message, onOk, onCancel, okContent, cancelContent) => {
  const promise = new Promise((resolve) => {
    store.dispatch(setModal({
      title,
      content: message,
      onOk: onOk ?? closePopup,
      onCancel,
      okContent,
      cancelContent,
    }));
    store.dispatch(setResult((value) => resolve(value)));
    store.dispatch(setModalVisible(true));
  });

  // result 是由 AppJavaScriptCallback 接收，並嘗試用 JSON Parse 轉為物件，轉不成功則以原資料內容傳回。
  const result = await promise;
  return result;
};

/**
 * 在 Layout 下方彈出抽屜。
 * @param {*} title 上方的標題文字。
 * @param {*} content 要呈現的內容。
 * @param {*} goBack 當左上角 <- 返回按鈕。
 * @param {*} onClose 當右上角 X 按下時的處理方式。
 */
export const showDrawer = async (title, content, goBack, onClose) => {
  const promise = new Promise((resolve) => {
    store.dispatch(setDrawer({
      title,
      content,
      goBack,
      onClose: onClose ?? closeDrawer,
    }));
    store.dispatch(setResult((value) => resolve(value)));
    store.dispatch(setDrawerVisible(true));
  });

  // result 是由 AppJavaScriptCallback 接收，並嘗試用 JSON Parse 轉為物件，轉不成功則以原資料內容傳回。
  const result = await promise;
  return result;
};

export const showAnimationModal = async (content) => {
  store.dispatch(setAnimationModal({
    ...content,
  }));
  store.dispatch(setAnimationModalVisible(true));
};
