const SET_MODAL = 'setModal';
const SET_MODAL_VISIBLE = 'setModalVisible';
const SET_DRAWER = 'setDrawer';
const SET_DRAWER_VISIBLE = 'setDrawerVisible';
const SET_WAITTING_VISIBLE = 'setWaittingVisible';
const SET_ANIMATION_MODAL_VISIBLE = 'setAnimationModalVisible';
const SET_ANIMATION_MODAL = 'setAnimationModal';
const SET_BUTTON_DISABLED = 'setButtonDisabled';

const initialState = {
  setResult: (value) => value,
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
  showModal: false, // 顯示 獨占 Popup視窗（會強制關閉 Drawer）
  showDialog: false, // 顯示 一般 Popup視窗（可用在 Drawer）
  drawer: {
    title: null,
    content: null,
    goBack: null,
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
    onClose: null, // Drawer 右上角 X 按下時的處理方式。
  },
  overPanel: null,
  buttonDisabled: false,
};

export default function ModalReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case 'setResult':
      return { ...state, setResult: data };

    case SET_MODAL:
      return { ...state, modal: data };

    case SET_MODAL_VISIBLE:
      return { ...state, showModal: data };

    case 'showDialog':
      return { ...state, showDialog: data };

    case SET_DRAWER:
      return { ...state, drawer: data };

    case SET_DRAWER_VISIBLE:
      return { ...state, showDrawer: data };

    case SET_WAITTING_VISIBLE:
      return { ...state, waitting: data };

    case SET_ANIMATION_MODAL_VISIBLE:
      return { ...state, showAnimationModal: data };

    case 'setOverPanel':
      return { ...state, overPanel: data };

    case SET_ANIMATION_MODAL:
      return { ...state, animationModal: data };
    case SET_BUTTON_DISABLED:
      return { ...state, buttonDisabled: data };
    default:
      return state;
  }
}

export function setResult(data) {
  return {
    type: 'setResult',
    data,
  };
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

export function setDialogVisible(data) {
  return {
    type: 'showDialog',
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

export function setOverPanel(data) {
  return {
    type: 'setOverPanel',
    data,
  };
}

export function setButtonDisabled(data) {
  return {
    type: SET_BUTTON_DISABLED,
    data,
  };
}
