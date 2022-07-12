import { combineReducers } from 'redux';
import { reducers as loginReducer } from 'proto/Login/stores';
import { reducers as billPayReducer } from 'pages/BillPay/stores';
import { reducers as patternLockSettingReducer } from 'pages/PatternLockSetting/stores';
// import { reducers as depositOverviewReducer } from 'pages/DepositOverview/stores';
// import { reducers as depositInquiryReducer } from 'pages/DepositInquiry/stores';
// import { reducers as shakeShakeReducer } from 'proto/ShakeShake/stores';
import { reducers as transferReducer } from 'pages/D00100_NtdTransfer/stores';
import { reducers as transferStaticReducer } from 'pages/TransferStatic/stores';
import { reducers as favoriteReducer } from 'pages/Favorite/stores';
// import { reducers as passwordDrawerReducer } from 'components/PasswordDrawer/stores';
import { reducers as spinnerReducer } from 'components/Spinner/stores';
// import { reducers as taiwanDollarAccountReducer } from 'pages/TaiwanDollarAccount/stores';
// import { reducers as foreignCurrencyAccountReducer } from 'pages/ForeignCurrencyAccount/stores';
// import { reducers as tradingAccountReducer } from 'pages/TradingAccount/stores';
// import { reducers as accountDetailsReducer } from 'components/AccountDetails/stores';
import { reducers as resultDialogReducer } from 'pages/ResultDialog/stores';

import ModalReducer from './ModalReducer';

const reducer = combineReducers({
  login: loginReducer,
  billPay: billPayReducer,
  patternLockSetting: patternLockSettingReducer,
  // depositOverview: depositOverviewReducer,
  // depositInquiry: depositInquiryReducer,
  // shakeShake: shakeShakeReducer,
  transfer: transferReducer,
  transferStatic: transferStaticReducer,
  favorite: favoriteReducer,
  // passwordDrawer: passwordDrawerReducer,
  spinner: spinnerReducer,
  // taiwanDollarAccount: taiwanDollarAccountReducer,
  // foreignCurrencyAccount: foreignCurrencyAccountReducer,
  // tradingAccount: tradingAccountReducer,
  // accountDetails: accountDetailsReducer,
  resultDialog: resultDialogReducer,
  ModalReducer,
});

export default reducer;
