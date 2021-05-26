/* eslint-disable no-unused-vars */
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import localStorage from 'redux-persist/es/storage';
import createTransform from 'redux-persist/es/createTransform';
import CryptoJS from 'crypto-js';
import reducer from './reducers';
import CipherUtil from '../utilities/CipherUtil';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const aesKey = CipherUtil.generateAES();

const encrypt = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    const cryptedText = CryptoJS.AES.encrypt(JSON.stringify(inboundState), aesKey);

    return cryptedText.toString();
  },
  (outboundState, key) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, aesKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  },
);

const storageConfig = {
  key: 'root', // 必须值
  storage: localStorage, // 缓存機制
  stateReconciler: hardSet, // 查看 'Merge Process' 部分的具体情况
  // whitelist: ['menu','order'] // reducer 裡持久化的数据,除此外均为不持久化数据
  transforms: [encrypt],
};

const myPersistReducer = persistReducer(storageConfig, reducer);

const store = createStore(myPersistReducer, composeEnhancers(
  applyMiddleware(thunk),
));

export const persistor = persistStore(store);
export default store;
