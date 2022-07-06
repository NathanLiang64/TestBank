import {
  SET_MODAL,
  SET_MODAL_VISIBLE,
  SET_DRAWER,
  SET_DRAWER_VISIBLE,
  SET_WAITTING_VISIBLE,
  REST_ALL,
  SET_ANIMATION_MODAL_VISIBLE,
  SET_ANIMATION_MODAL,
} from '../constant';

const initialState = {
  modal: {
    title: null,
    content: null,

    // 按鈕事件委派
    onOk: null,
    onCancel: null,
    onClose: null,

    // 按鈕內容文字
    okContent: '確認',
    cancelContent: '取消',

    // 點選視窗外部，視同關閉視窗
    backdrop: false,
  },
  showModal: false,
  drawer: {
    title: null,
    content: null,
    shouldAutoClose: false,
  },
  showDrawer: false,
  waitting: false,
  showAnimationModal: false,
  animationModal: {
    isSuccess: true,
    successTitle: '',
    successDesc: '',
    errorTitle: '',
    errorCode: '',
    errorDesc: '',
    onClose: null,
  },
};

export default function ModalReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_MODAL:
      return { ...state, modal: data };

    case SET_MODAL_VISIBLE:
      return { ...state, showModal: data };

    case SET_DRAWER:
      return { ...state, drawer: data };

    case SET_DRAWER_VISIBLE:
      return { ...state, showDrawer: data };

    case SET_WAITTING_VISIBLE:
      return { ...state, waitting: data };

    case SET_ANIMATION_MODAL_VISIBLE:
      return { ...state, showAnimationModal: data };

    case SET_ANIMATION_MODAL:
      return { ...state, animationModal: data };

    case REST_ALL:
      return initialState;

    default:
      return state;
  }
}

export function setModal(data) {
  return {
    type: SET_MODAL,
    data,
  };
}

export function setModalVisible(data) {
  return {
    type: SET_MODAL_VISIBLE,
    data,
  };
}

export function setDrawer(data) {
  return {
    type: SET_DRAWER,
    data,
  };
}

export function setDrawerVisible(data) {
  return {
    type: SET_DRAWER_VISIBLE,
    data,
  };
}

export function setWaittingVisible(data) {
  return {
    type: SET_WAITTING_VISIBLE,
    data,
  };
}

export function setAnimationModalVisible(data) {
  return {
    type: SET_ANIMATION_MODAL_VISIBLE,
    data,
  };
}

export function setAnimationModal(data) {
  return {
    type: SET_ANIMATION_MODAL,
    data,
  };
}
