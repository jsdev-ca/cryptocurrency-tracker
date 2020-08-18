import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { LOCAL_STORAGE_KEY } from '../constants';
import rootReducer from './root-reducer';

const persistConfig = { key: LOCAL_STORAGE_KEY, storage };
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, undefined, applyMiddleware(thunk));
const persistor = persistStore(store);

export {
  persistor,
  store
};
