import { combineReducers } from 'redux';
// import { reducers as patternLockSettingReducer } from 'pages/PatternLockSetting/stores';

import ModalReducer from './ModalReducer';

const reducer = combineReducers({
  // patternLockSetting: patternLockSettingReducer, // NOTE 將來可能用的到，先不刪！
  ModalReducer,
});

export default reducer;
