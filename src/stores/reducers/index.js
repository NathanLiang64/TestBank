import { combineReducers } from 'redux';
import { reducers as loginReducer } from 'proto/Login/stores';
import { reducers as billPayReducer } from 'pages/BillPay/stores';
import { reducers as patternLockSettingReducer } from 'pages/PatternLockSetting/stores';
import { reducers as transferReducer } from 'pages/D00100_NtdTransfer/stores';
import { reducers as favoriteReducer } from 'pages/S00100_Favorite/stores';
import { reducers as spinnerReducer } from 'components/Spinner/stores';
import { reducers as resultDialogReducer } from 'pages/ResultDialog/stores';

import ModalReducer from './ModalReducer';

const reducer = combineReducers({
  login: loginReducer,
  billPay: billPayReducer,
  patternLockSetting: patternLockSettingReducer,
  transfer: transferReducer,
  favorite: favoriteReducer,
  spinner: spinnerReducer,
  resultDialog: resultDialogReducer,
  ModalReducer,
});

export default reducer;
