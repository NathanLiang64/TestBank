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
// 之後從後端取
const aesKey = 'B6CA16477CA1E33065A73E6F6724A811BA84BB1A539E2DC5C48608ADDE8562A586413CD631D875F9960AC0D0C0B9657F2D1E1F4CEDA2CFF8CD63B3E636297869E674EA24DD73B2B7EED745580B140513232FD4D6C0C4E2A6A7BA081FF99395FFDEAF22C8F8A5D6CEBA13A40D9E3A27ADC64566B2AA8815964780F3F60511A18448690B428E217252FB425D00B774B7B74E58AE0AFCE693AA86F6FB176949FA34F25100919158131859E9BE9A80B6239D5B9DC67F3722D7B495F85CF39E0253587A516E3A734CF6AE82E1767578B7C9AD5780B5DACB9F26365FF5640B3EDE0582FD81A70CCEA29AC0753C6DF77641134F472DC7B8EF085E7E9118CA0D2B969021';

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
