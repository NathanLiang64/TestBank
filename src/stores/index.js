import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import reducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  // 若有不需持久化的數據請加入至 blacklist
  // blacklist: ['name','age']
};
const persistedReducer = persistReducer(persistConfig, reducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(persistedReducer, composeEnhancers(
  applyMiddleware(thunk),
));

export const persistor = persistStore(store);
export default store;
