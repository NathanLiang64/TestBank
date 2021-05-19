import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import localStorage from 'redux-persist/es/storage';
import reducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const storageConfig = {
  key: 'root', // 必须值
  storage: localStorage, // 缓存機制
  stateReconciler: hardSet, // 查看 'Merge Process' 部分的具体情况
  // whitelist: ['menu','order'] // reducer 裡持久化的数据,除此外均为不持久化数据
};

const myPersistReducer = persistReducer(storageConfig, reducer);

const store = createStore(myPersistReducer, composeEnhancers(
  applyMiddleware(thunk),
));

export const persistor = persistStore(store);
export default store;
