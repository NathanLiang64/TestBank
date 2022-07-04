/* eslint-disable no-unused-vars */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import sessionStorage from 'redux-persist/es/storage/session'; // sessionStorage
import createTransform from 'redux-persist/es/createTransform';
import CryptoJS from 'crypto-js';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import reducer from './reducers/index';
import CipherUtil from '../utilities/CipherUtil';

/**
 *- 創建store
 *- 將redux資料暫存在storageSession
 *- 引入thunk達到異步存取redux
 */
const modulus = CipherUtil.generateKey(256);

const encrypt = createTransform(
  (data, key) => {
    // console.log(`==> Redux(${key}) 加密...`);
    // console.log(data);
    if (data) {
      const cryptedText = CryptoJS.AES.encrypt(JSON.stringify(data), modulus);
      data = cryptedText.toString();
    }
    return data;
  },
  (data, key) => {
    // console.log(`==> Redux(${key}) 解密...`);
    // console.log(data);
    if (data) {
      const bytes = CryptoJS.AES.decrypt(data, modulus);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      data = JSON.parse(decrypted);
    }
    return data;
  },
);

const storageConfig = {
  key: 'root', // 必须值
  storage: sessionStorage, // 缓存機制
  stateReconciler: hardSet, // 查看 'Merge Process' 部分的具体情况
  // whitelist: ['menu','order'] // reducer 裡持久化的数据,除此外均为不持久化数据
  transforms: [encrypt],
};

const myPersistReducer = persistReducer(storageConfig, reducer);

const store = createStore(myPersistReducer, composeWithDevTools(
  applyMiddleware(thunk),
));

export const persistor = persistStore(store);
export default store;
