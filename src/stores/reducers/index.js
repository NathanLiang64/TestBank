import { combineReducers } from 'redux';
import { reducers as loginReducer } from 'pages/Login/stores';
import { reducers as reissueDebitCardReducer } from 'pages/ReissueDebitCard/stores';

const reducer = combineReducers({
  login: loginReducer,
  reissueDebitCard: reissueDebitCardReducer,
});

export default reducer;
