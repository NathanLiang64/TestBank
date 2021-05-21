import { combineReducers } from 'redux';
import { reducers as headerReducer } from 'components/Header/stores';
import { reducers as loginReducer } from 'pages/Login/stores';
import { reducers as lossReissueReducer } from 'pages/LossReissue/stores';
import { reducers as billPayReducer } from 'pages/BillPay/stores';
import { reducers as patternLockSettingReducer } from 'pages/PatternLockSetting/stores';

const reducer = combineReducers({
  header: headerReducer,
  login: loginReducer,
  lossReissue: lossReissueReducer,
  billPay: billPayReducer,
  patternLockSetting: patternLockSettingReducer,
});

export default reducer;
