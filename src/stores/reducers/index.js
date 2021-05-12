import { combineReducers } from 'redux';
import { reducers as loginReducer } from 'pages/Login/stores';

const reducer = combineReducers({
  login: loginReducer,
});

export default reducer;
