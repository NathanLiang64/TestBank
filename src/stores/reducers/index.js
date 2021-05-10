import { combineReducers } from 'redux';
import { reducers as loginReducer } from 'screens/Login/stores';

const reducer = combineReducers({
  login: loginReducer,
});

export default reducer;
