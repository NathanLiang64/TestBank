import { combineReducers } from 'redux';
import { reducers as loginReducer } from 'proto/Login/stores';
import { reducers as billPayReducer } from 'pages/BillPay/stores';
import { reducers as patternLockSettingReducer } from 'pages/PatternLockSetting/stores';
import { reducers as spinnerReducer } from 'components/Spinner/stores';
import { reducers as resultDialogReducer } from 'pages/ResultDialog/stores';

import ModalReducer from './ModalReducer';

const reducer = combineReducers({
  login: loginReducer,
  billPay: billPayReducer,
  patternLockSetting: patternLockSettingReducer,
  spinner: spinnerReducer,
  resultDialog: resultDialogReducer,
  ModalReducer,
});

export default reducer;
