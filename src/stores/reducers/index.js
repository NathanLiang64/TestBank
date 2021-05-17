import { combineReducers } from 'redux';
import { reducers as loginReducer } from 'pages/Login/stores';
import { reducers as lossReissueReducer } from 'pages/LossReissue/stores';

const reducer = combineReducers({
  login: loginReducer,
  lossReissue: lossReissueReducer,
});

export default reducer;
