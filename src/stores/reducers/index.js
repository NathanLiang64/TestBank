import { combineReducers } from 'redux';
import { reducers as headerReducer } from 'components/Header/stores';
import { reducers as loginReducer } from 'pages/Login/stores';
import { reducers as lossReissueReducer } from 'pages/LossReissue/stores';
import { reducers as billPayReducer } from 'pages/BillPay/stores';
import { reducers as patternLockSettingReducer } from 'pages/PatternLockSetting/stores';
import { reducers as depositOverviewReducer } from 'pages/DepositOverview/stores';
import { reducers as depositInquiryReducer } from 'pages/DepositInquiry/stores';
import { reducers as shakeShakeReducer } from 'pages/ShakeShake/stores';
import { reducers as transferReducer } from 'pages/Transfer/stores';
import { reducers as passwordDrawerReducer } from 'components/PasswordDrawer/stores';

const reducer = combineReducers({
  header: headerReducer,
  login: loginReducer,
  lossReissue: lossReissueReducer,
  billPay: billPayReducer,
  patternLockSetting: patternLockSettingReducer,
  depositOverview: depositOverviewReducer,
  depositInquiry: depositInquiryReducer,
  shakeShake: shakeShakeReducer,
  transfer: transferReducer,
  passwordDrawer: passwordDrawerReducer,
});

export default reducer;
